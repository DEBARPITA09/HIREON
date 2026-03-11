import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./01e_Help.module.css";

/* ══════════════════════════════════════════════
   KNOWLEDGE BASE — 25 topics, no API needed
══════════════════════════════════════════════ */
const KB = [
  { tags:["create account","sign up","signup","register","how to join","new account","get started","how do i start","joining"],
    answer:"Creating a HIREON account is simple:\n• Click Candidate or Recruiter in the top navigation\n• Choose Sign Up and fill in your name, email and password\n• Your account is ready instantly — no verification wait\n\nWould you like to know what you can do after signing up?" },
  { tags:["free","cost","price","pricing","paid","subscription","charge","how much","money"],
    answer:"HIREON is completely free for both candidates and recruiters.\n\nAll core features — resume analysis, ATS scoring, job matching and the recruiter dashboard — are available at no cost during our launch phase." },
  { tags:["ats score","ats","applicant tracking","what is ats","ats mean","ats stands","ats work"],
    answer:"ATS stands for Applicant Tracking System — software companies use to automatically filter resumes before a human ever reads them.\n\nYour HIREON ATS score tells you how likely your resume is to pass these filters:\n• Score above 80 → strong, good to apply\n• Score 60–80 → decent, small improvements recommended\n• Score below 60 → needs work before applying" },
  { tags:["improve ats","increase ats","better ats","low ats","ats low","boost ats","fix ats","ats tips","raise ats"],
    answer:"To improve your ATS score:\n• Add keywords directly from the job description you're targeting\n• Use a clean single-column layout — avoid tables, graphics and columns\n• Spell out acronyms (write 'JavaScript' not 'JS')\n• Add a strong Skills section with relevant tools and technologies\n• Use standard headings: Experience, Education, Skills, Summary\n\nSmall targeted changes can push your score from 60 to 85+ quickly." },
  { tags:["resume analysis","ai analysis","ai resume","analyse resume","analyze resume","resume scan","how does analysis","resume check"],
    answer:"HIREON's AI resume analysis works in 3 steps:\n• Upload your PDF or DOCX resume to your Candidate dashboard\n• Our AI parses your content — skills, experience, formatting, keyword density\n• You receive a detailed ATS score plus specific, actionable improvement suggestions\n\nThe entire process takes under 30 seconds." },
  { tags:["upload resume","how to upload","resume upload","add resume","update resume","change resume","submit resume"],
    answer:"To upload or update your resume:\n• Log in to your Candidate dashboard\n• Go to the Resume section\n• Click Upload Resume and select your PDF or DOCX file\n• Your ATS score is generated automatically within seconds\n\nYou can update your resume as many times as you like — each upload generates a fresh analysis." },
  { tags:["resume format","file format","pdf","docx","word","what format","file type","supported format","which format"],
    answer:"HIREON supports PDF and DOCX (Word) resume formats.\n\nWe recommend PDF — it preserves your formatting consistently across all systems and is the preferred format by most recruiters and ATS software." },
  { tags:["job recommendation","job match","recommended jobs","find jobs","job suggestion","matching jobs","job matching","how jobs work","see jobs"],
    answer:"HIREON's job matching works automatically:\n• Our algorithm compares your profile, skills and career preferences against all active listings\n• The most relevant roles appear in your Recommended Jobs section\n• Each job shows a match percentage so you know where you stand\n\nKeep your profile and skills section updated for the best matches." },
  { tags:["apply job","how to apply","apply for job","submit application","apply multiple","multiple jobs","applying"],
    answer:"To apply for a job on HIREON:\n• Browse Recommended Jobs or use the search\n• Click any job to view the full details\n• Click Apply Now — your profile and resume are submitted instantly\n\nYou can apply to as many jobs as you want. Every application is tracked separately in your dashboard." },
  { tags:["track application","application status","my applications","where is my application","check application","status update","application tracking"],
    answer:"To track your applications:\n• Go to My Applications in your Candidate dashboard\n• Each application shows its real-time status:\n— Submitted → Shortlisted → Interview Scheduled → Offer / Rejected\n\nYou'll receive a notification whenever your status changes." },
  { tags:["post job","recruiter post","add job","create job","job listing","job post","how to post","listing job"],
    answer:"To post a job as a recruiter:\n• Log in to your Recruiter dashboard\n• Click Post a Job\n• Fill in the role title, description, requirements and salary range\n• Your listing goes live immediately and is matched to relevant candidates\n\nYou can edit, pause or remove your listing at any time." },
  { tags:["recruiter","recruiter dashboard","view candidates","view resumes","recruiter feature","hiring pipeline","manage candidates","recruiter tool"],
    answer:"The HIREON Recruiter dashboard gives you:\n• Post and manage unlimited job listings\n• View all applicants for each role with ATS scores visible\n• Access full candidate resumes without any email exchange\n• Track your full hiring pipeline from Applied to Hired\n• Receive AI-matched candidate recommendations for your open roles" },
  { tags:["reset password","forgot password","change password","password reset","cant login","can't login","login issue","password help"],
    answer:"To reset your password:\n• Go to the HIREON login page\n• Click Forgot Password\n• Enter your registered email address\n• A reset link will arrive within a few minutes\n\nCheck your spam or junk folder if you don't see it. Still stuck? Email support@hireon.com and we'll sort it out." },
  { tags:["update profile","edit profile","change profile","profile update","personal details","edit account","my profile"],
    answer:"To update your profile:\n• Log in and click your profile icon in the top right\n• Select Edit Profile\n• Update your name, location, skills, experience or job preferences\n• Save — changes apply immediately and improve your job matching" },
  { tags:["delete account","remove account","close account","deactivate","account delete","remove my account"],
    answer:"To delete your HIREON account:\n• Go to Settings in your dashboard\n• Scroll to the bottom and click Delete Account\n• Confirm the action\n\nImportant: this is permanent. All your data — profile, resume and applications — will be immediately and irreversibly removed." },
  { tags:["data safe","data security","privacy","secure","personal data","information safe","data protection","my data","is it safe"],
    answer:"Your data is fully protected on HIREON:\n• All data is encrypted in transit (TLS) and at rest (AES-256)\n• We never sell your personal data to third parties\n• Only authorised HIREON staff can access user data\n• You can download or delete all your data at any time\n\nSee our Privacy Policy in the footer for full details." },
  { tags:["recruiter contact","can recruiter contact","direct message","message recruiter","recruiter message","contact candidate","recruiter reach"],
    answer:"Yes — once you apply for a role, the recruiter can message you directly through the HIREON platform.\n\nYou'll receive a notification when they reach out. Your personal contact details are never shared publicly — all communication stays within the platform." },
  { tags:["interview tips","interview","prepare interview","interview preparation","interview advice","interview help"],
    answer:"For interview success with roles found through HIREON:\n• Research the company thoroughly before your interview\n• Review the job description and prepare examples for each requirement\n• Use the STAR method (Situation, Task, Action, Result) for behavioral questions\n• Prepare 2–3 thoughtful questions to ask the interviewer\n• Follow up with a thank-you email within 24 hours" },
  { tags:["resume tips","good resume","write resume","resume advice","what makes good resume","resume help","resume writing","strong resume"],
    answer:"For a strong resume on HIREON:\n• Keep it to 1 page (2 pages max for 10+ years experience)\n• Use a clean single-column layout for best ATS performance\n• Start each bullet with a strong action verb: Led, Built, Increased, Designed\n• Include measurable results — numbers stand out (e.g. 'Increased sales by 32%')\n• Upload to HIREON to check your ATS score before applying anywhere" },
  { tags:["notification","email notification","alert","notify","get notified","alerts"],
    answer:"HIREON notifies you for:\n• Application status changes (shortlisted, interview invite, offer, rejection)\n• New job matches based on your profile\n• Messages from recruiters\n• Resume analysis completion\n\nManage notification preferences in your account Settings." },
  { tags:["how long","time to hire","how many days","when hired","hiring time","days to get hired","average time"],
    answer:"The average time from application to hire on HIREON is around 14 days, though this varies by company and role.\n\nTo move faster:\n• Keep your ATS score above 80\n• Apply within 48 hours of a job being posted\n• Make sure your profile is 100% complete\n• Respond quickly to recruiter messages" },
  { tags:["hireon","what is hireon","about hireon","tell me about","explain hireon","what does hireon do","what hireon"],
    answer:"HIREON is an AI-powered hiring platform built for India that connects job seekers with recruiters.\n\nFor candidates: upload your resume, get an ATS score, receive personalised job matches and track all applications in one place.\n\nFor recruiters: post jobs, find AI-matched candidates and manage your full hiring pipeline.\n\nEverything is free. Built in Bhubaneswar, Odisha." },
  { tags:["contact support","talk to human","human support","real person","email support","support team","reach support","need help","contact us"],
    answer:"To reach the HIREON support team:\n• Email: support@hireon.com\n• Hours: Monday to Friday, 9am–6pm IST\n• We respond to all queries within 24 hours\n\nFor faster help, mention whether you are a Candidate or Recruiter and describe your issue clearly." },
  { tags:["candidate","candidate portal","candidate dashboard","what can candidate do","candidate features"],
    answer:"As a HIREON Candidate you can:\n• Upload your resume and get an instant AI-powered ATS score\n• Receive personalised job recommendations matched to your skills\n• Apply to jobs in one click\n• Track all your applications and their real-time status\n• Receive direct messages from recruiters\n• Update your profile and resume any time\n\nEverything is free — sign up to get started." },
  { tags:["salary","salary range","pay","compensation","how much pay","job salary","expected salary"],
    answer:"HIREON displays the salary range for each job listing set by the recruiter.\n\nYou can see the compensation details on the full job page before applying. If no salary is shown, it means the recruiter has chosen to keep it confidential — you can ask during the interview process." },
];

/* ── Keyword matcher ── */
function findAnswer(input) {
  const lower = input.toLowerCase().trim();
  let best = null, bestScore = 0;
  for (const entry of KB) {
    for (const tag of entry.tags) {
      if (lower.includes(tag)) {
        const score = tag.split(" ").length * tag.length;
        if (score > bestScore) { bestScore = score; best = entry; }
      }
      // partial word match
      const words = tag.split(" ").filter(w => w.length > 3);
      const hits = words.filter(w => lower.includes(w)).length;
      if (words.length > 0 && hits >= Math.ceil(words.length * 0.65)) {
        const score = hits * tag.length * 0.75;
        if (score > bestScore) { bestScore = score; best = entry; }
      }
    }
  }
  return bestScore > 0 ? best : null;
}

/* ── Conversational short-reply handler ── */
const THANKS = ["thank","thanks","thank you","thx","ty","got it","perfect","great","awesome","nice","cool","good","helpful","understood","okay got it"];
const MORE   = ["yes","yeah","sure","tell me more","more","please","go on","continue","explain more","what else","elaborate","details"];
const GREET  = ["hi","hello","hey","hii","helo","good morning","good afternoon","good evening","howdy","sup"];

function classifyShort(input) {
  const l = input.toLowerCase().trim().replace(/[!?.]/g,"");
  if (GREET.includes(l))  return "greet";
  if (THANKS.some(t => l === t || l.startsWith(t))) return "thanks";
  if (MORE.some(m => l === m))   return "more";
  return null;
}

/* ── Suggestion engine ── */
const ALL_SUGGESTIONS = [
  "How do I create a HIREON account?",
  "What is an ATS score?",
  "How does AI resume analysis work?",
  "Is HIREON free to use?",
  "How do I improve my ATS score?",
  "How do job recommendations work?",
  "How do I track my application status?",
  "How do I post a job as a recruiter?",
  "How do I reset my password?",
  "What resume format should I use?",
  "How do I upload my resume?",
  "Is my data safe on HIREON?",
  "Can I apply to multiple jobs?",
  "How do I update my profile?",
  "How long does hiring take?",
  "What can candidates do on HIREON?",
  "How do recruiters contact candidates?",
  "What interview tips do you have?",
  "How do I contact support?",
  "What is HIREON?",
];

function getSuggestions(input) {
  if (!input || input.trim().length < 2) return ALL_SUGGESTIONS.slice(0, 4);
  const lower = input.toLowerCase();
  const words = lower.split(" ").filter(w => w.length > 2);
  const scored = ALL_SUGGESTIONS.map(s => {
    const sl = s.toLowerCase();
    let score = 0;
    words.forEach(w => { if (sl.includes(w)) score += w.length; });
    if (sl.includes(lower)) score += 10;
    return { s, score };
  }).filter(x => x.score > 0).sort((a,b) => b.score - a.score);
  return scored.length > 0 ? scored.slice(0,4).map(x=>x.s) : ALL_SUGGESTIONS.slice(0,4);
}

/* ══ SIDEBAR TOPICS ══ */
const TOPICS = [
  { label:"Getting Started",    d:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",                                         q:"What is HIREON and how do I get started?" },
  { label:"Resume & ATS",       d:"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8", q:"How does AI resume analysis work?" },
  { label:"Job Matching",       d:"M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z", q:"How do job recommendations work on HIREON?" },
  { label:"Applications",       d:"M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11",           q:"How do I track my job applications?" },
  { label:"Recruiter Tools",    d:"M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75", q:"What recruiter features does HIREON have?" },
  { label:"Account & Security", d:"M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",     q:"Is my account and data safe on HIREON?" },
];

/* ══ COMPONENTS ══ */
const HIcon = ({ size=14 }) => (
  <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
    <path d="M3 2V16M15 2V16M3 9H15" stroke="#000" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const Message = ({ msg }) => {
  const isBot = msg.from === "bot";
  return (
    <div className={`${styles.msg} ${isBot ? styles.msgBot : styles.msgUser}`}>
      {isBot && <div className={styles.botAvatar}><HIcon size={13}/></div>}
      <div className={`${styles.bubble} ${isBot ? styles.bubbleBot : styles.bubbleUser}`}>
        {msg.text.split("\n").map((line, i) => {
          if (line.startsWith("• ") || line.startsWith("— ")) {
            return (
              <div key={i} className={styles.bulletLine}>
                <span className={styles.bullet}/>
                <span>{line.replace(/^[•—] /,"")}</span>
              </div>
            );
          }
          return line.trim() ? <p key={i}>{line}</p> : null;
        })}
        {msg.link && (
          <Link to={msg.link.to} className={styles.bubbleLink}>
            {msg.link.label}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="11" height="11"><polyline points="9 18 15 12 9 6"/></svg>
          </Link>
        )}
      </div>
    </div>
  );
};

const TypingIndicator = () => (
  <div className={`${styles.msg} ${styles.msgBot}`}>
    <div className={styles.botAvatar}><HIcon size={13}/></div>
    <div className={`${styles.bubble} ${styles.bubbleBot} ${styles.typingBubble}`}>
      <span/><span/><span/>
    </div>
  </div>
);

/* ══ MAIN PAGE ══ */
export const Help = () => {
  const [messages, setMessages] = useState([{
    from:"bot",
    text:"Hi! I'm the HIREON support assistant.\n\nAsk me anything about the platform — ATS scores, resume analysis, job matching, recruiter tools or your account. Pick a topic on the left or type your question below.",
  }]);
  const [input,      setInput]      = useState("");
  const [typing,     setTyping]     = useState(false);
  const [suggestions,setSuggestions]= useState(ALL_SUGGESTIONS.slice(0,4));
  const [showSugg,   setShowSugg]   = useState(true);
  const [activeTopic,setActiveTopic]= useState(null);
  const [lastKB,     setLastKB]     = useState(null); // track last KB entry for "more" replies
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior:"smooth" });
  }, [messages, typing]);

  const addBotMsg = (text, link) => {
    setMessages(prev => [...prev, { from:"bot", text, ...(link ? {link} : {}) }]);
  };

  const send = async (text) => {
    const msg = (text || input).trim();
    if (!msg || typing) return;

    setInput("");
    setShowSugg(false);
    setActiveTopic(null);
    setMessages(prev => [...prev, { from:"user", text:msg }]);
    setTyping(true);

    // Natural typing delay
    await new Promise(r => setTimeout(r, 500 + Math.random() * 300));
    setTyping(false);

    // ── Classify message ──
    const shortType = classifyShort(msg);

    if (shortType === "greet") {
      addBotMsg("Hello! 👋 Great to have you here.\n\nI can help you with anything related to HIREON — resume analysis, ATS scores, job applications, recruiter tools or account help. What would you like to know?");
    }
    else if (shortType === "thanks") {
      addBotMsg("You're welcome! Happy to help.\n\nIs there anything else you'd like to know about HIREON?");
    }
    else if (shortType === "more" && lastKB) {
      // User wants more info — give the full KB answer again with a follow-up
      addBotMsg(lastKB.answer + "\n\nFeel free to ask if you'd like me to explain any part in more detail.");
    }
    else if (shortType === "more") {
      addBotMsg("Sure! What topic would you like more information on?\n\nYou can ask about:\n• Resume analysis and ATS scoring\n• Job matching and applications\n• Recruiter tools\n• Account and security\n• Or pick a topic from the sidebar");
    }
    else {
      // ── Full KB lookup ──
      const match = findAnswer(msg);
      if (match) {
        setLastKB(match);
        addBotMsg(match.answer);
      } else {
        // Not in KB — friendly fallback, never an error
        setLastKB(null);
        addBotMsg(
          "I don't have a specific answer for that in my knowledge base right now.\n\nHere are topics I can help with:\n• Resume analysis and ATS score improvement\n• Job search and application tracking\n• Account setup and security\n• Recruiter dashboard and tools\n\nOr reach our support team directly for personal help.",
          { to:"/contact", label:"Contact Support" }
        );
      }
    }

    setSuggestions(ALL_SUGGESTIONS.slice(0,4));
    setShowSugg(true);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <div className={styles.page}>

      {/* HERO */}
      <div className={styles.hero}>
        <div className={styles.heroBadge}><span className={styles.dot}/> Help Center</div>
        <h1 className={styles.heroTitle}>How Can We <em className={styles.italic}>Help You?</em></h1>
        <p className={styles.heroSub}>Ask our assistant anything about HIREON. Pick a topic on the left or type your question — always accurate, always on topic.</p>
      </div>

      <div className={styles.layout}>

        {/* SIDEBAR */}
        <div className={styles.sidebar}>
          <div className={styles.sideHead}>Browse Topics</div>
          {TOPICS.map((t,i) => (
            <button key={i}
              className={`${styles.topicBtn} ${activeTopic===i ? styles.topicActive:""}`}
              onClick={() => { setActiveTopic(i); send(t.q); }}
            >
              <div className={styles.topicIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d={t.d}/>
                </svg>
              </div>
              <span>{t.label}</span>
              <svg className={styles.topicArrow} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          ))}
          <div className={styles.sideNote}>
            <div className={styles.sideNoteTitle}>Human support</div>
            <div className={styles.sideNoteEmail}>support@hireon.com</div>
            <div className={styles.sideNoteHours}>Mon–Fri · 9am–6pm IST</div>
          </div>
        </div>

        {/* CHAT */}
        <div className={styles.chatWrap}>

          {/* Header */}
          <div className={styles.chatHead}>
            <div className={styles.chatHeadLeft}>
              <div className={styles.chatHeadAvatar}><HIcon size={16}/></div>
              <div>
                <div className={styles.chatHeadName}>HIREON Assistant</div>
                <div className={styles.chatHeadStatus}>
                  <span className={styles.statusDot}/>
                  <span>Online · HIREON topics only</span>
                </div>
              </div>
            </div>
            <div className={styles.chatHeadBadge}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="12" height="12"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              Safe &amp; Private
            </div>
          </div>

          {/* Messages */}
          <div className={styles.chatMessages}>
            {messages.map((m,i) => <Message key={i} msg={m}/>)}
            {typing && <TypingIndicator/>}
            <div ref={bottomRef}/>
          </div>

          {/* Suggestions */}
          {showSugg && !typing && (
            <div className={styles.suggWrap}>
              <div className={styles.suggLabel}>
                {input.trim().length > 1 ? "Matching questions:" : "Suggested questions:"}
              </div>
              <div className={styles.suggList}>
                {suggestions.map((s,i) => (
                  <button key={i} className={styles.suggBtn} onClick={() => send(s)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="10" height="10">
                      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className={styles.chatInput}>
            <div className={styles.chatInputWrap}>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => { setInput(e.target.value); setSuggestions(getSuggestions(e.target.value)); setShowSugg(true); }}
                onKeyDown={handleKey}
                onFocus={() => setShowSugg(true)}
                placeholder="Ask anything about HIREON..."
                className={styles.chatInputField}
                disabled={typing}
              />
              <button className={styles.sendBtn} onClick={() => send()} disabled={!input.trim() || typing}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </div>
            <div className={styles.chatInputHint}>Press Enter to send · Questions are private</div>
          </div>

        </div>
      </div>
    </div>
  );
};