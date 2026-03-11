import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./01e_Help.module.css";

const faqs = [
  { q:"How do I create an account?",          a:"Click the Candidate or Recruiter button in the top navigation, then choose Sign Up and fill in your details to get started." },
  { q:"How does AI resume analysis work?",    a:"Upload your resume and our AI engine parses it, evaluates your skills and experience, checks ATS criteria, and gives you a detailed score with specific improvement suggestions." },
  { q:"What is an ATS score?",                a:"ATS stands for Applicant Tracking System — software companies use to filter resumes before a human sees them. A higher ATS score means your resume is more likely to reach a real recruiter." },
  { q:"How do job recommendations work?",     a:"Our algorithm compares your profile, resume, and skills against active job listings and surfaces the most relevant roles for you automatically." },
  { q:"How do I post a job as a recruiter?",  a:"Log in as a Recruiter, go to your dashboard and click Post a Job. Fill in the role details, requirements, and salary range — your listing goes live immediately." },
  { q:"Can I apply to multiple jobs?",        a:"Yes, you can apply to as many jobs as you like. Each application is tracked separately in your dashboard." },
  { q:"How do I track my applications?",      a:"In your Candidate dashboard, the My Applications section shows real-time status updates — from submitted to shortlisted or rejected." },
  { q:"What if my ATS score is low?",         a:"Review the suggestions in your analysis report. Common fixes: add relevant keywords, improve formatting, and make your skills section more detailed." },
  { q:"How do I reset my password?",          a:"On the login page, click Forgot Password and enter your registered email. You will be directed to reset your password from there." },
  { q:"Is HIREON free to use?",               a:"Yes — HIREON is completely free for candidates. Recruiters also have access to all core features at no cost." },
  { q:"How do I delete my account?",          a:"Go to your profile settings and select Delete Account. This action is permanent and all data will be removed." },
];

const SUGGESTIONS = ["How do I create an account?","What is an ATS score?","How does AI resume analysis work?","Is HIREON free to use?"];

function getBotReply(input) {
  const lower = input.toLowerCase();
  const match = faqs.find(f => f.q.toLowerCase().includes(lower) || lower.includes(f.q.toLowerCase().split(" ").slice(0,3).join(" ")));
  if (match) return match.a;
  if (lower.includes("ats")||lower.includes("score")) return faqs[2].a;
  if (lower.includes("resume")||lower.includes("analysis")) return faqs[1].a;
  if (lower.includes("apply")||lower.includes("application")) return faqs[5].a;
  if (lower.includes("password")||lower.includes("reset")) return faqs[8].a;
  if (lower.includes("free")||lower.includes("cost")) return faqs[9].a;
  if (lower.includes("recruiter")||lower.includes("post")||lower.includes("job")) return faqs[4].a;
  if (lower.includes("delete")||lower.includes("account")) return faqs[10].a;
  return null;
}

const HIcon = () => (
  <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
    <path d="M3 2V16M15 2V16M3 9H15" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const Help = () => {
  const [messages, setMessages] = useState([
    { from:"bot", text:"Hi! I'm the HIREON support assistant. Ask me anything about the platform, or pick a question below." }
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages, typing]);

  const send = (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput("");
    setMessages(prev => [...prev, { from:"user", text:msg }]);
    setTyping(true);
    setTimeout(() => {
      const reply = getBotReply(msg);
      setTyping(false);
      setMessages(prev => [...prev, reply
        ? { from:"bot", text:reply }
        : { from:"bot", text:"I don't have an answer for that in my knowledge base.", contact:true }
      ]);
    }, 900);
  };

  const sideLinks = [
    { icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>, l:"Candidate Guide" },
    { icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>, l:"Recruiter Guide" },
    { icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>, l:"AI Resume Analysis" },
    { icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>, l:"ATS Score Guide" },
    { icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>, l:"Account & Security" },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroBadge}><span className={styles.dot}/> Help Center</div>
        <h1 className={styles.heroTitle}>How Can We <span className={styles.italic}>Help You?</span></h1>
        <p className={styles.heroSub}>Ask our support assistant any question about HIREON. If it can't help, it will connect you directly to our team.</p>
      </div>

      <div className={styles.layout}>
        <div className={styles.sidebar}>
          <div className={styles.sideHeading}>Common Topics</div>
          {sideLinks.map((item,i)=>(
            <div key={i} className={styles.sideLink} onClick={()=>send(item.l)}>
              <div className={styles.sideLinkIcon}>{item.icon}</div>
              <span>{item.l}</span>
              <svg className={styles.arrow} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          ))}
          <div className={styles.sideNote}>
            <div className={styles.sideNoteTitle}>Still need help?</div>
            <div className={styles.sideNoteText}>support@hireon.com</div>
          </div>
        </div>

        <div className={styles.chatWrap}>
          <div className={styles.chatHeader}>
            <div className={styles.chatHeaderLeft}>
              <div className={styles.chatAvatar}><HIcon/></div>
              <div>
                <div className={styles.chatName}>HIREON Support</div>
                <div className={styles.chatStatus}><span className={styles.statusDot}/>Online</div>
              </div>
            </div>
          </div>

          <div className={styles.chatMessages}>
            {messages.map((m,i)=>(
              <div key={i} className={m.from==="user"?styles.msgUser:styles.msgBot}>
                {m.from==="bot" && <div className={styles.botAvatar}><HIcon/></div>}
                <div className={styles.msgBubble}>
                  <p>{m.text}</p>
                  {m.contact && (
                    <Link to="/contact" className={styles.contactLink}>
                      Contact our team
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                    </Link>
                  )}
                </div>
              </div>
            ))}
            {typing && (
              <div className={styles.msgBot}>
                <div className={styles.botAvatar}><HIcon/></div>
                <div className={styles.msgBubble}>
                  <div className={styles.typingDots}><span/><span/><span/></div>
                </div>
              </div>
            )}
            <div ref={bottomRef}/>
          </div>

          {messages.length <= 2 && (
            <div className={styles.suggestions}>
              {SUGGESTIONS.map((s,i)=>(
                <button key={i} className={styles.suggBtn} onClick={()=>send(s)}>{s}</button>
              ))}
            </div>
          )}

          <div className={styles.chatInput}>
            <input type="text" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}} placeholder="Ask a question..." className={styles.chatInputField}/>
            <button className={styles.sendBtn} onClick={()=>send()} disabled={!input.trim()}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};