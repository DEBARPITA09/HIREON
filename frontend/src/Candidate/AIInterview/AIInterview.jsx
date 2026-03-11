import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./AIInterview.module.css";

const PRESET_DOMAINS = [
  { label: "DSA & Algorithms",  icon: "🧮" },
  { label: "Web Development",   icon: "🌐" },
  { label: "System Design",     icon: "🏗️" },
  { label: "Database & SQL",    icon: "🗄️" },
  { label: "Machine Learning",  icon: "🤖" },
  { label: "Cloud & DevOps",    icon: "☁️" },
  { label: "Operating Systems", icon: "💻" },
  { label: "Computer Networks", icon: "🔗" },
];

const PHASE = { SETUP: "setup", LOADING: "loading", INTERVIEW: "interview", FEEDBACK: "feedback" };

// ── Groq API call ──
async function callGroq(apiKey, messages, jsonMode = false) {
  const body = {
    model: "llama-3.3-70b-versatile",
    max_tokens: 1500,
    messages,
    temperature: 0.7,
  };
  if (jsonMode) body.response_format = { type: "json_object" };

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Groq ${res.status}: ${err}`);
  }
  const data = await res.json();
  return data.choices[0].message.content;
}

// ── TTS ──
function speak(text, onEnd) {
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.rate = 0.9; utt.pitch = 1.0;
  const voices = window.speechSynthesis.getVoices();
  const v = voices.find(v => v.name.includes("Google") && v.lang === "en-US") || voices.find(v => v.lang === "en-US");
  if (v) utt.voice = v;
  if (onEnd) utt.onend = onEnd;
  window.speechSynthesis.speak(utt);
}
function stopSpeaking() { window.speechSynthesis.cancel(); }

export default function AIInterview() {
  const [phase,          setPhase]          = useState(PHASE.SETUP);
  const [selectedDomain, setSelectedDomain] = useState("");
  const [customDomain,   setCustomDomain]   = useState("");
  const [domainError,    setDomainError]    = useState("");
  const apiKey = import.meta.env.VITE_GROQ_API_KEY || "";
  const [questions,      setQuestions]      = useState([]);
  const [currentQ,       setCurrentQ]       = useState(0);
  const [answers,        setAnswers]        = useState([]);
  const [results,        setResults]        = useState([]);
  const [transcript,     setTranscript]     = useState("");
  const [interimText,    setInterimText]    = useState("");
  const [isListening,    setIsListening]    = useState(false);
  const [isSpeaking,     setIsSpeaking]     = useState(false);
  const [isThinking,     setIsThinking]     = useState(false);
  const [loadingMsg,     setLoadingMsg]     = useState("");
  const [timeLeft,       setTimeLeft]       = useState(90);
  const [timerActive,    setTimerActive]    = useState(false);
  const [feedbackData,   setFeedbackData]   = useState(null);

  const recognitionRef = useRef(null);
  const timerRef       = useRef(null);
  const answersRef     = useRef([]);
  const questionsRef   = useRef([]);

  const effectiveDomain = customDomain.trim() || selectedDomain;

  // get candidate profile from localStorage
  const candidateProfile = (() => {
    try { return JSON.parse(localStorage.getItem("hireon_candidate")) || {}; } catch { return {}; }
  })();

  // ── Timer ──
  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    } else if (timerActive && timeLeft === 0) {
      handleSubmitAnswer("(No answer given — time expired)");
    }
    return () => clearTimeout(timerRef.current);
  }, [timerActive, timeLeft]);

  // ── Generate questions via Groq ──
  const generateQuestions = async () => {
    const domain = effectiveDomain.trim();
    if (!domain) { setDomainError("Please select or enter a domain."); return; }
    if (!apiKey) { setDomainError("Interview service is not configured. Please contact admin."); return; }
    setDomainError("");
    setPhase(PHASE.LOADING);
    setLoadingMsg("Groq AI is preparing your interview questions...");

    const profileContext = candidateProfile.skills?.length
      ? `Candidate skills: ${candidateProfile.skills.join(", ")}. Domain: ${candidateProfile.domain || "Not specified"}.`
      : "No profile available.";

    try {
      const raw = await callGroq(apiKey, [
        {
          role: "system",
          content: `You are a senior technical interviewer conducting a SPOKEN voice interview. Generate exactly 5 interview questions for the domain: "${domain}".
${profileContext}
STRICT RULES:
- ALL questions must be conceptual, verbal, and answerable by speaking — NO coding questions, NO "write a function", NO "implement this", NO pseudocode
- Ask about concepts, explanations, comparisons, trade-offs, real-world use cases, and how things work
- Good examples: "Explain how a hash table works", "What is the difference between TCP and UDP?", "When would you use Redis over a SQL database?"
- Bad examples: "Write a function to...", "Implement a...", "Code a solution for..."
- Questions should progressively increase in difficulty: Easy, Easy, Medium, Medium, Hard
- If the domain seems invalid or nonsensical (like "abc", "asdf", random words), respond with: {"invalid": true, "reason": "brief explanation"}
- Return ONLY valid JSON in this exact format:
{"questions": [{"q": "question text", "difficulty": "Easy|Medium|Hard", "hint": "brief hint for evaluation"}]}`
        },
        { role: "user", content: `Generate 5 spoken verbal interview questions (NO coding) for: ${domain}` }
      ], true);

      const parsed = JSON.parse(raw);

      if (parsed.invalid) {
        setPhase(PHASE.SETUP);
        setDomainError(`⚠️ ${parsed.reason || "This doesn't seem like a valid interview domain. Please try something like 'React', 'Python', 'Networking', etc."}`);
        return;
      }

      const qs = parsed.questions || [];
      if (qs.length === 0) throw new Error("No questions returned");

      setQuestions(qs);
      questionsRef.current = qs;
      setAnswers([]);
      answersRef.current = [];
      setResults([]);
      setCurrentQ(0);
      setPhase(PHASE.INTERVIEW);

      setTimeout(() => askQuestion(qs, 0), 500);
    } catch (err) {
      console.error(err);
      setPhase(PHASE.SETUP);
      setDomainError("Failed to connect to Groq. Check your API key and try again.");
    }
  };

  // ── Ask question via TTS ──
  const askQuestion = useCallback((qs, idx) => {
    if (idx >= qs.length) return;
    setIsSpeaking(true);
    setTranscript("");
    setInterimText("");
    setTimeLeft(90);
    setTimerActive(false);

    const intro = idx === 0
      ? `Hello! Welcome to your AI interview on ${effectiveDomain}. I will ask you ${qs.length} questions. Speak your answer clearly. Let's begin. Question 1. `
      : `Question ${idx + 1}. `;

    speak(intro + qs[idx].q, () => {
      setIsSpeaking(false);
      setTimerActive(true);
      startListening();
    });
  }, [effectiveDomain]);

  // ── Speech recognition ──
  const startListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert("Use Chrome for voice recognition."); return; }
    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-US";
    rec.onstart  = () => setIsListening(true);
    rec.onend    = () => setIsListening(false);
    rec.onerror  = () => setIsListening(false);
    rec.onresult = (e) => {
      let final = "", interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript + " ";
        else interim += e.results[i][0].transcript;
      }
      if (final) setTranscript(prev => prev + final);
      setInterimText(interim);
    };
    rec.start();
    recognitionRef.current = rec;
  };

  const stopListening = () => { recognitionRef.current?.stop(); setIsListening(false); };

  // ── Submit answer + evaluate via Groq ──
  const handleSubmitAnswer = async (forcedAnswer) => {
    stopListening();
    stopSpeaking();
    setTimerActive(false);
    clearTimeout(timerRef.current);
    setIsListening(false);

    const currentTranscript = transcript;
    const currentInterim    = interimText;
    const ans = typeof forcedAnswer === "string"
      ? forcedAnswer
      : (currentTranscript + currentInterim).trim() || "(No answer provided)";

    setIsThinking(true);
    setTranscript("");
    setInterimText("");

    // Evaluate via Groq
    let evaluation = { score: 0, feedback: "Could not evaluate.", strengths: [], improvements: [] };
    try {
      const qObj = questionsRef.current[currentQ];
      const raw = await callGroq(apiKey, [
        {
          role: "system",
          content: `You are a strict but fair technical interviewer evaluating a candidate's spoken answer.
Return ONLY valid JSON:
{"score": <0-100>, "feedback": "<2-3 sentence evaluation>", "strengths": ["<point>"], "improvements": ["<point>"], "idealAnswer": "<brief ideal answer in 2-3 sentences>"}`
        },
        {
          role: "user",
          content: `Domain: ${effectiveDomain}
Question: ${qObj.q}
Hint for evaluation: ${qObj.hint || ""}
Candidate's answer: "${ans}"
Evaluate this answer.`
        }
      ], true);
      const parsed = JSON.parse(raw);
      evaluation = { ...evaluation, ...parsed };
    } catch (err) {
      console.error("Evaluation error:", err);
      evaluation = {
        score: ans.length > 30 ? 40 : 10,
        feedback: "Could not evaluate via AI. Score estimated from answer length.",
        strengths: ans.length > 50 ? ["Provided a detailed response"] : [],
        improvements: ["Ensure stable internet for AI evaluation"],
        idealAnswer: "",
      };
    }

    const newResults = [...answersRef.current.map((a, i) => ({ ...results[i], answer: a })),
      { ...evaluation, answer: ans, question: questionsRef.current[currentQ] }];

    const newAnswers = [...answersRef.current, ans];
    answersRef.current = newAnswers;
    setAnswers(newAnswers);

    setIsThinking(false);
    const next = currentQ + 1;

    if (next >= questionsRef.current.length) {
      // Generate overall feedback
      setIsThinking(true);
      setLoadingMsg("Generating your interview report...");
      try {
        const allQA = questionsRef.current.map((q, i) => `Q${i+1}: ${q.q}\nA: ${newAnswers[i] || "(no answer)"}`).join("\n\n");
        const raw = await callGroq(apiKey, [
          {
            role: "system",
            content: `You are a senior technical interviewer. Provide a comprehensive interview feedback report.
Return ONLY valid JSON:
{
  "overallSummary": "<3-4 sentence overall assessment>",
  "topStrengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "areasToImprove": ["<area 1>", "<area 2>", "<area 3>"],
  "readinessLevel": "<Not Ready | Needs Practice | Almost Ready | Interview Ready>",
  "studyTopics": ["<topic 1>", "<topic 2>", "<topic 3>"],
  "encouragement": "<1 motivating sentence>"
}`
          },
          { role: "user", content: `Domain: ${effectiveDomain}\n\nInterview Q&A:\n${allQA}\n\nGenerate comprehensive feedback.` }
        ], true);
        const fb = JSON.parse(raw);
        setFeedbackData(fb);
      } catch (err) {
        setFeedbackData({ overallSummary: "Interview complete.", topStrengths: [], areasToImprove: [], readinessLevel: "Needs Practice", studyTopics: [], encouragement: "Keep practicing!" });
      }

      // store results with evaluations
      const finalResults = questionsRef.current.map((q, i) => {
        if (i < newResults.length - 1) return newResults[i];
        return newResults[newResults.length - 1];
      });
      setResults(finalResults);
      setIsThinking(false);

      speak("Thank you for completing the interview. Your feedback report is ready.", () => {
        setPhase(PHASE.FEEDBACK);
      });
    } else {
      // store partial result
      setResults(prev => [...prev, { ...evaluation, answer: ans, question: questionsRef.current[currentQ] }]);
      setCurrentQ(next);
      speak("Got it. Next question.", () => {
        askQuestion(questionsRef.current, next);
      });
    }
  };

  // ── Score calculations ──
  const avgScore   = results.length ? Math.round(results.reduce((s, r) => s + (r.score || 0), 0) / results.length) : 0;
  const scoreColor = avgScore >= 75 ? "#00d4aa" : avgScore >= 50 ? "#fbbf24" : "#f87171";
  const circ       = 2 * Math.PI * 54;
  const fillOffset = circ - (avgScore / 100) * circ;

  // ── SETUP PHASE ──
  if (phase === PHASE.SETUP) return (
    <div className={styles.page}>
      <div className={styles.setupCard}>
        <div className={styles.setupHeader}>
          <div className={styles.setupIcon}>🎙️</div>
          <h1 className={styles.setupTitle}>AI Mock Interview</h1>
          <p className={styles.setupSub}>Real AI-powered voice interview using Groq + Llama 3</p>
        </div>

        {/* Domain selector */}
        <div className={styles.section}>
          <p className={styles.sectionLabel}>Select Domain</p>
          <div className={styles.domainGrid}>
            {PRESET_DOMAINS.map(d => (
              <button key={d.label}
                className={`${styles.domainChip} ${selectedDomain === d.label ? styles.domainChipActive : ""}`}
                onClick={() => { setSelectedDomain(d.label); setCustomDomain(""); setDomainError(""); }}>
                <span>{d.icon}</span> {d.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <p className={styles.sectionLabel}>Or type your own</p>
          <input
            className={styles.customInput}
            placeholder="e.g. React Native, Blockchain, Flutter, Python..."
            value={customDomain}
            onChange={e => { setCustomDomain(e.target.value); setSelectedDomain(""); setDomainError(""); }}
          />
        </div>

        {domainError && <p className={styles.domainError}>{domainError}</p>}

        {/* Candidate profile preview */}
        {candidateProfile.skills?.length > 0 && (
          <div className={styles.profilePreview}>
            <p className={styles.profilePreviewTitle}>📋 Your profile will be used to personalise questions</p>
            <div className={styles.profileSkills}>
              {candidateProfile.skills.slice(0, 6).map(s => <span key={s} className={styles.profileSkillChip}>{s}</span>)}
              {candidateProfile.skills.length > 6 && <span className={styles.profileSkillChip}>+{candidateProfile.skills.length - 6}</span>}
            </div>
          </div>
        )}

        <div className={styles.infoRow}>
          <div className={styles.infoItem}><span>❓</span> 5 AI Questions</div>
          <div className={styles.infoItem}><span>⏱️</span> 90 sec each</div>
          <div className={styles.infoItem}><span>🎙️</span> Voice answers</div>
          <div className={styles.infoItem}><span>🤖</span> Real AI eval</div>
        </div>

        <button className={styles.startBtn} onClick={generateQuestions}>
          Start Interview →
        </button>
      </div>
    </div>
  );

  // ── LOADING PHASE ──
  if (phase === PHASE.LOADING) return (
    <div className={styles.page}>
      <div className={styles.loadingCard}>
        <div className={styles.loadingSpinner} />
        <p className={styles.loadingText}>{loadingMsg}</p>
        <p className={styles.loadingSub}>Powered by Groq + Llama 3</p>
      </div>
    </div>
  );

  // ── INTERVIEW PHASE ──
  if (phase === PHASE.INTERVIEW) {
    const q = questions[currentQ];
    const timerPct   = (timeLeft / 90) * 100;
    const timerColor = timeLeft > 30 ? "#00d4aa" : timeLeft > 10 ? "#fbbf24" : "#f87171";

    return (
      <div className={styles.page}>
        <div className={styles.interviewCard}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${(currentQ / questions.length) * 100}%` }} />
          </div>

          <div className={styles.interviewHeader}>
            <div className={styles.headerLeft}>
              <span className={styles.domainTag}>{effectiveDomain}</span>
              {q && <span className={styles.diffTag} style={{
                background: q.difficulty === "Easy" ? "rgba(0,212,170,0.1)" : q.difficulty === "Medium" ? "rgba(251,191,36,0.1)" : "rgba(248,113,113,0.1)",
                color:      q.difficulty === "Easy" ? "#00d4aa" : q.difficulty === "Medium" ? "#fbbf24" : "#f87171",
              }}>{q.difficulty}</span>}
            </div>
            <span className={styles.qCounter}>Q {currentQ + 1} / {questions.length}</span>
          </div>

          <div className={styles.questionBox}>
            <div className={styles.qIcon}>
              {isSpeaking ? "🔊" : isListening ? "🎙️" : isThinking ? "🧠" : "💬"}
            </div>
            <p className={styles.questionText}>{q?.q}</p>
          </div>

          <div className={styles.timerRow}>
            <div className={styles.timerBarWrap}>
              <div className={styles.timerBarFill} style={{ width: `${timerPct}%`, background: timerColor }} />
            </div>
            <span className={styles.timerNum} style={{ color: timerColor }}>{timeLeft}s</span>
          </div>

          <div className={styles.statusWrap}>
            {isSpeaking  && <div className={styles.statusBadge} style={{ color: "#4f8ef7"  }}>🔊 AI Interviewer speaking...</div>}
            {isListening && <div className={styles.statusBadge} style={{ color: "#00d4aa" }}>🎙️ Listening — speak your answer</div>}
            {isThinking  && <div className={styles.statusBadge} style={{ color: "#a78bfa" }}>🧠 Groq AI evaluating your answer...</div>}
          </div>

          {(transcript || interimText) && (
            <div className={styles.transcriptBox}>
              <p className={styles.transcriptLabel}>Your answer</p>
              <p className={styles.transcriptText}>
                {transcript}<span className={styles.interimText}>{interimText}</span>
              </p>
            </div>
          )}

          <div className={styles.controls}>
            {isListening && (
              <button className={styles.submitBtn} onClick={() => handleSubmitAnswer()}>✓ Submit Answer</button>
            )}
            {!isSpeaking && !isListening && !isThinking && (
              <button className={styles.relistenBtn} onClick={startListening}>🎙️ Start Speaking</button>
            )}
            {!isThinking && (
              <button className={styles.skipBtn} onClick={() => handleSubmitAnswer("(Skipped)")}>Skip →</button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── FEEDBACK PHASE ──
  if (phase === PHASE.FEEDBACK) {
    const readinessColor =
      feedbackData?.readinessLevel === "Interview Ready" ? "#00d4aa" :
      feedbackData?.readinessLevel === "Almost Ready"   ? "#4f8ef7" :
      feedbackData?.readinessLevel === "Needs Practice" ? "#fbbf24" : "#f87171";

    return (
      <div className={styles.page}>
        <div className={styles.feedbackCard}>
          <div className={styles.feedbackHeader}>
            <h2 className={styles.feedbackTitle}>Interview Report 📊</h2>
            <p className={styles.feedbackSub}>AI-evaluated performance for <strong>{effectiveDomain}</strong></p>
          </div>

          {/* Overall score + readiness */}
          <div className={styles.scoreSection}>
            <div className={styles.scoreRingWrap}>
              <svg width="130" height="130" viewBox="0 0 130 130">
                <circle cx="65" cy="65" r="54" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                <circle cx="65" cy="65" r="54" fill="none" stroke={scoreColor} strokeWidth="10"
                  strokeDasharray={circ} strokeDashoffset={fillOffset} strokeLinecap="round"
                  transform="rotate(-90 65 65)" style={{ transition: "stroke-dashoffset 1.5s ease" }} />
              </svg>
              <div className={styles.scoreInner}>
                <span className={styles.scoreNum} style={{ color: scoreColor }}>{avgScore}</span>
                <span className={styles.scoreDen}>/100</span>
              </div>
            </div>
            <div className={styles.scoreInfo}>
              {feedbackData?.readinessLevel && (
                <span className={styles.readinessBadge} style={{ background: `${readinessColor}18`, color: readinessColor, borderColor: `${readinessColor}40` }}>
                  {feedbackData.readinessLevel}
                </span>
              )}
              <p className={styles.overallSummary}>{feedbackData?.overallSummary}</p>
              {feedbackData?.encouragement && (
                <p className={styles.encouragement}>💬 "{feedbackData.encouragement}"</p>
              )}
            </div>
          </div>

          {/* Strengths & Areas */}
          <div className={styles.insightRow}>
            {feedbackData?.topStrengths?.length > 0 && (
              <div className={styles.insightBox} style={{ borderColor: "rgba(0,212,170,0.2)" }}>
                <p className={styles.insightTitle} style={{ color: "#00d4aa" }}>✓ Strengths</p>
                {feedbackData.topStrengths.map((s, i) => <p key={i} className={styles.insightItem}>• {s}</p>)}
              </div>
            )}
            {feedbackData?.areasToImprove?.length > 0 && (
              <div className={styles.insightBox} style={{ borderColor: "rgba(248,113,113,0.2)" }}>
                <p className={styles.insightTitle} style={{ color: "#f87171" }}>↑ Areas to Improve</p>
                {feedbackData.areasToImprove.map((s, i) => <p key={i} className={styles.insightItem}>• {s}</p>)}
              </div>
            )}
          </div>

          {/* Per-question breakdown */}
          <p className={styles.breakdownTitle}>Question Breakdown</p>
          {results.map((r, i) => {
            const qColor = (r.score||0) >= 70 ? "#00d4aa" : (r.score||0) >= 45 ? "#fbbf24" : "#f87171";
            return (
              <div key={i} className={styles.breakdownRow}>
                <div className={styles.breakdownTop}>
                  <span className={styles.breakdownQ}>Q{i+1}. {r.question?.q}</span>
                  <span className={styles.breakdownScore} style={{ color: qColor }}>{r.score||0}/100</span>
                </div>
                <div className={styles.breakdownBar}>
                  <div className={styles.breakdownFill} style={{ width: `${r.score||0}%`, background: qColor }} />
                </div>
                <p className={styles.breakdownAnswer}><strong>Your answer:</strong> {(r.answer||"").slice(0,180)}{(r.answer||"").length > 180 ? "..." : ""}</p>
                {r.idealAnswer && <p className={styles.idealAnswer}><strong>Ideal:</strong> {r.idealAnswer}</p>}
                <p className={styles.breakdownFeedback}>💬 {r.feedback}</p>
              </div>
            );
          })}

          {/* Study topics */}
          {feedbackData?.studyTopics?.length > 0 && (
            <div className={styles.studyBox}>
              <p className={styles.studyTitle}>📚 Recommended Study Topics</p>
              <div className={styles.studyChips}>
                {feedbackData.studyTopics.map((t, i) => <span key={i} className={styles.studyChip}>{t}</span>)}
              </div>
            </div>
          )}

          <button className={styles.retryBtn} onClick={() => {
            setPhase(PHASE.SETUP); setResults([]); setAnswers([]);
            answersRef.current = []; setCurrentQ(0); setFeedbackData(null);
          }}>
            Try Another Interview →
          </button>
        </div>
      </div>
    );
  }

  return null;
}