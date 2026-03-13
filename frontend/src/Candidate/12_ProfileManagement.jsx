import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./12_ProfileManagement.module.css";

<<<<<<< HEAD
/* ── Particle Network Background ── */
function useParticles(ref) {
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W, H, raf;
    const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    resize(); window.addEventListener("resize", resize);
    const N = 90;
    const pts = Array.from({length:N}, () => ({
      x:Math.random(), y:Math.random(),
      vx:(Math.random()-.5)*.00018, vy:(Math.random()-.5)*.00018,
      r:.6+Math.random()*1.4, a:.1+Math.random()*.32, ph:Math.random()*Math.PI*2,
    }));
    let t = 0;
    function draw() {
      ctx.clearRect(0,0,W,H);
      pts.forEach(p => {
        p.x+=p.vx; p.y+=p.vy;
        if(p.x<0)p.x=1; if(p.x>1)p.x=0; if(p.y<0)p.y=1; if(p.y>1)p.y=0;
        const pulse=.82+.18*Math.sin(t*.016+p.ph);
        ctx.beginPath(); ctx.arc(p.x*W,p.y*H,p.r*pulse,0,Math.PI*2);
        ctx.fillStyle=`rgba(255,255,255,${p.a*pulse})`; ctx.fill();
      });
      for(let i=0;i<N;i++) for(let j=i+1;j<N;j++){
        const dx=pts[i].x-pts[j].x, dy=pts[i].y-pts[j].y, d=Math.sqrt(dx*dx+dy*dy);
        if(d<.08){ctx.beginPath();ctx.moveTo(pts[i].x*W,pts[i].y*H);ctx.lineTo(pts[j].x*W,pts[j].y*H);
          ctx.strokeStyle=`rgba(255,255,255,${.05*(1-d/.08)})`;ctx.lineWidth=.4;ctx.stroke();}
      }
      t++; raf=requestAnimationFrame(draw);
    }
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize",resize); };
  }, []);
}

/* ── Professional illustrated avatar ── */
const DefaultAvatar = ({ size = 80, initials = "C" }) => {
  const s = size;
  const cx = s / 2;
  // pick a subtle tint from initials char code
  const hue = ((initials.charCodeAt(0) || 65) * 47) % 360;
  const bg1 = `hsl(${hue},18%,14%)`;
  const bg2 = `hsl(${hue},22%,10%)`;
  const skinLight = "#f5c9a0";
  const skinShade  = "#e8a87c";
  const shirtCol   = `hsl(${hue},30%,28%)`;
  const shirtShade = `hsl(${hue},28%,20%)`;
  const headR  = s * 0.175;
  const headCY = s * 0.335;
  const shoulderY = s * 0.62;
  const neckH  = s * 0.07;
  const neckW  = s * 0.09;

  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id={`bg_${initials}`} cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor={bg1}/>
          <stop offset="100%" stopColor={bg2}/>
        </radialGradient>
        <radialGradient id={`face_${initials}`} cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor={skinLight}/>
          <stop offset="100%" stopColor={skinShade}/>
        </radialGradient>
        <clipPath id={`circle_${initials}`}>
          <circle cx={cx} cy={cx} r={cx}/>
        </clipPath>
      </defs>

      {/* Background */}
      <circle cx={cx} cy={cx} r={cx} fill={`url(#bg_${initials})`}/>

      {/* Subtle ring */}
      <circle cx={cx} cy={cx} r={cx - 1} stroke={`hsl(${hue},30%,30%)`} strokeWidth="1" fill="none" opacity="0.5"/>

      <g clipPath={`url(#circle_${initials})`}>
        {/* Shirt / shoulders — solid shape rising from bottom */}
        <ellipse cx={cx} cy={s * 0.85} rx={s * 0.46} ry={s * 0.28} fill={shirtShade}/>
        <ellipse cx={cx} cy={s * 0.80} rx={s * 0.40} ry={s * 0.24} fill={shirtCol}/>

        {/* Collar notch */}
        <path
          d={`M${cx - s*0.07} ${shoulderY} L${cx} ${shoulderY + s*0.06} L${cx + s*0.07} ${shoulderY} Z`}
          fill={shirtShade}
        />

        {/* Neck */}
        <rect
          x={cx - neckW/2} y={headCY + headR - 2}
          width={neckW} height={neckH + 2}
          rx={neckW/2}
          fill={`url(#face_${initials})`}
        />

        {/* Head */}
        <ellipse
          cx={cx} cy={headCY}
          rx={headR * 0.92} ry={headR}
          fill={`url(#face_${initials})`}
        />

        {/* Eyes */}
        <ellipse cx={cx - headR*0.35} cy={headCY - headR*0.05} rx={headR*0.1} ry={headR*0.12} fill="#3a2a1a"/>
        <ellipse cx={cx + headR*0.35} cy={headCY - headR*0.05} rx={headR*0.1} ry={headR*0.12} fill="#3a2a1a"/>
        {/* Eye shine */}
        <circle cx={cx - headR*0.31} cy={headCY - headR*0.09} r={headR*0.04} fill="rgba(255,255,255,0.6)"/>
        <circle cx={cx + headR*0.39} cy={headCY - headR*0.09} r={headR*0.04} fill="rgba(255,255,255,0.6)"/>

        {/* Eyebrows */}
        <path d={`M${cx - headR*0.48} ${headCY - headR*0.22} Q${cx - headR*0.35} ${headCY - headR*0.3} ${cx - headR*0.22} ${headCY - headR*0.22}`} stroke="#5a3e2a" strokeWidth={s*0.012} strokeLinecap="round" fill="none"/>
        <path d={`M${cx + headR*0.22} ${headCY - headR*0.22} Q${cx + headR*0.35} ${headCY - headR*0.3} ${cx + headR*0.48} ${headCY - headR*0.22}`} stroke="#5a3e2a" strokeWidth={s*0.012} strokeLinecap="round" fill="none"/>

        {/* Nose */}
        <path d={`M${cx} ${headCY + headR*0.05} Q${cx + headR*0.14} ${headCY + headR*0.22} ${cx + headR*0.08} ${headCY + headR*0.28} Q${cx} ${headCY + headR*0.3} ${cx - headR*0.08} ${headCY + headR*0.28}`} stroke={skinShade} strokeWidth={s*0.01} strokeLinecap="round" fill="none"/>

        {/* Mouth — subtle smile */}
        <path d={`M${cx - headR*0.25} ${headCY + headR*0.42} Q${cx} ${headCY + headR*0.54} ${cx + headR*0.25} ${headCY + headR*0.42}`} stroke="#c47a5a" strokeWidth={s*0.015} strokeLinecap="round" fill="none"/>

        {/* Hair — simple cap shape */}
        <ellipse cx={cx} cy={headCY - headR*0.55} rx={headR*0.95} ry={headR*0.6} fill="#2a1f14"/>
        <rect x={cx - headR*0.95} y={headCY - headR*0.7} width={headR*1.9} height={headR*0.3} rx={headR*0.15} fill="#2a1f14"/>
      </g>
    </svg>
  );
};

/* ── Sidebar nav items ── */
const NAV_SECTIONS = [
  { id: "overview",     label: "Overview",          icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg> },
  { id: "personal",     label: "Personal Info",     icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
  { id: "resume",       label: "Resume",            icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> },
  { id: "skills",       label: "Skills",            icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg> },
  { id: "experience",   label: "Experience",        icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg> },
  { id: "education",    label: "Education",         icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg> },
  { id: "links",        label: "Links & Socials",   icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg> },
  { id: "preferences",  label: "Job Preferences",  icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M5.34 18.66l-1.41 1.41M20 12h2M2 12h2M19.07 19.07l-1.41-1.41M5.34 5.34l-1.41-1.41M12 20v2M12 2v2"/></svg> },
  { id: "security",     label: "Account & Security",icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> },
=======
const DOMAINS = [
  "Frontend Development", "Backend Development", "Full Stack Development",
  "Data Science", "Machine Learning / AI", "DevOps / Cloud",
  "Mobile Development", "UI/UX Design", "Cybersecurity", "Data Analytics",
  "Embedded Systems", "Blockchain", "Game Development", "QA / Testing",
>>>>>>> 1f87c92154bd71eb2cb711721042f5cdbd53c042
];

const SKILL_SUGGESTIONS = [
  "React", "Node.js", "Python", "Java", "JavaScript", "TypeScript",
  "MongoDB", "PostgreSQL", "AWS", "Docker", "Kubernetes", "Git",
  "Machine Learning", "TensorFlow", "Flutter", "Swift", "Kotlin",
  "GraphQL", "Redis", "Spring Boot", "Django", "FastAPI", "Go", "Rust",
  "C++", "C#", ".NET", "Angular", "Vue.js", "SQL", "Linux", "Figma",
];

export const ProfileManagement = () => {
<<<<<<< HEAD
  const navigate  = useNavigate();
  const fileRef   = useRef(null);
  const canvasRef = useRef(null);
  useParticles(canvasRef);
  const [activeSection, setActiveSection] = useState("overview");
  const [photoURL,      setPhotoURL]      = useState(null);
  const [saved,         setSaved]         = useState(false);
  const [skillInput,    setSkillInput]    = useState("");
  const [resumeName,    setResumeName]    = useState(null);
  const [currentUser,   setCurrentUser]   = useState(null);
  const [loading,       setLoading]       = useState(true);
=======
  const navigate = useNavigate();
  const fileRef  = useRef();
>>>>>>> 1f87c92154bd71eb2cb711721042f5cdbd53c042

  const authUser = JSON.parse(localStorage.getItem("user")) || {};

  const [profile, setProfile] = useState({
    name:        authUser.name  || "",
    email:       authUser.email || "",
    phone:       "",
    domain:      "",
    skills:      [],
    bio:         "",
    linkedin:    "",
    github:      "",
    college:     "",
    degree:      "",
    year:        "",
    resumeName:  "",
    resumeText:  "",   // extracted text for ATS
    resumeB64:   "",   // base64 for display/download
  });

  const [skillInput, setSkillInput]   = useState("");
  const [saved, setSaved]             = useState(false);
  const [parsing, setParsing]         = useState(false);
  const [resumeError, setResumeError] = useState("");

  // load existing profile
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("hireon_candidate")) || {};
    if (Object.keys(stored).length) setProfile(p => ({ ...p, ...stored }));
  }, []);

  const set = (field, val) => setProfile(p => ({ ...p, [field]: val }));

  /* add skill */
  const addSkill = (s) => {
    const skill = s.trim();
    if (!skill || profile.skills.includes(skill)) return;
    set("skills", [...profile.skills, skill]);
    setSkillInput("");
  };

  const removeSkill = (s) => set("skills", profile.skills.filter(x => x !== s));

  /* PDF upload — extract text via FileReader + simple text parse */
  const handleResume = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== "application/pdf") { setResumeError("Please upload a PDF file."); return; }
    setResumeError("");
    setParsing(true);

    const reader = new FileReader();
    reader.onload = async (ev) => {
      const b64 = ev.target.result.split(",")[1];
      // store base64 + name
      set("resumeB64",  b64);
      set("resumeName", file.name);
      // extract text via PDF.js CDN (simple approach)
      try {
        const pdfjsLib = await import("https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js");
        // fallback: just store b64, text extraction done during ATS call
        set("resumeText", "[PDF uploaded — text extracted during ATS screening]");
      } catch {
        set("resumeText", "[PDF uploaded — text extracted during ATS screening]");
      }
      setParsing(false);
    };
    reader.readAsDataURL(file);
  };

  const save = () => {
    // merge auth fields before saving
    const toSave = { ...profile, name: authUser.name || profile.name, email: authUser.email || profile.email };
    localStorage.setItem("hireon_candidate", JSON.stringify(toSave));
    // also update auth user name if changed
    localStorage.setItem("user", JSON.stringify({ ...authUser, name: toSave.name, email: toSave.email }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

<<<<<<< HEAD
  const addSkill = (s) => {
    const trimmed = s.trim();
    if (trimmed && !form.skills.includes(trimmed)) set("skills", [...form.skills, trimmed]);
    setSkillInput("");
  };
  const removeSkill = (s) => set("skills", form.skills.filter(x => x !== s));

  /* ── Save to Firestore ── */
  const handleSave = async () => {
    if (!currentUser) return;
    try {
      const toSave = {
        name:       form.name,
        email:      form.email,
        title:      form.title,
        phone:      form.phone,
        location:   form.location,
        bio:        form.bio,
        github:     form.github,
        linkedin:   form.linkedin,
        portfolio:  form.portfolio,
        twitter:    form.twitter,
        skills:     form.skills,
        experience: form.experience,
        education:  form.education,
        jobType:    form.jobType,
        salary:     form.salary,
        notice:     form.notice,
        remote:     form.remote,
        resumeUrl:  form.resumeUrl || resumeName || "",
      };
      await setDoc(doc(db, "candidates", currentUser.uid), toSave, { merge: true });
      setSaved(true);
      setTimeout(() => setSaved(false), 2200);
    } catch (err) {
      console.error("Save failed:", err);
      alert("Save failed. Please check your connection.");
    }
  };

  const handleSignOut = async () => {
    try { await signOut(auth); } catch(e) {}
    navigate("/");
  };

  if (loading) return (
    <div style={{ minHeight:"100vh", background:"#080808", display:"flex", alignItems:"center", justifyContent:"center", color:"rgba(255,255,255,0.4)", fontFamily:"DM Sans, sans-serif", position:"relative" }}>
      <canvas ref={canvasRef} style={{position:"fixed",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:0}}/>
      <span style={{position:"relative",zIndex:1}}>Loading profile...</span>
    </div>
  );

  /* ── Profile completion % ── */
  const completionFields = [form.name, form.title, form.email, form.phone, form.location, form.bio, form.github || form.linkedin, form.skills.length > 0, form.experience[0]?.role, form.education[0]?.degree, resumeName];
  const completionPct = Math.round((completionFields.filter(Boolean).length / completionFields.length) * 100);

  return (
    <div className={styles.page}>
      <canvas ref={canvasRef} style={{position:"fixed",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:0}}/>
=======
  const initials = (name) => name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className={styles.page}>
      {/* NAVBAR */}
      <nav className={styles.topBar}>
        <div className={styles.topLogo}>
          <span className={styles.logoHire}>HIRE</span>
          <span className={styles.logoOn}>ON</span>
        </div>
        <div className={styles.topRight}>
          <button className={styles.backBtn} onClick={() => navigate("/Candidate/06_MainCand")}>← Back</button>
          <div className={styles.avatar}>{initials(profile.name || "C")}</div>
        </div>
      </nav>
>>>>>>> 1f87c92154bd71eb2cb711721042f5cdbd53c042

      <div className={styles.container}>
        {/* HERO */}
        <div className={styles.hero}>
          <div className={styles.heroBadge}><span className={styles.dot} />My Profile</div>
          <h1 className={styles.heroTitle}>Profile <span className={styles.heroItalic}>Management</span></h1>
          <p className={styles.heroSub}>Build your professional profile so recruiters can discover you and our AI can match you with the right jobs.</p>
        </div>

        <div className={styles.formGrid}>

          {/* ── LEFT COLUMN ── */}
          <div className={styles.col}>

            {/* Personal Info */}
            <div className={styles.card}>
              <p className={styles.cardTitle}>Personal Info</p>
              <div className={styles.row2}>
                <div className={styles.field}>
                  <label className={styles.label}>Full Name</label>
                  <input className={styles.input} value={profile.name} onChange={e => set("name", e.target.value)} placeholder="Your full name" />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Email</label>
                  <input className={styles.input} value={profile.email} onChange={e => set("email", e.target.value)} placeholder="you@email.com" />
                </div>
              </div>
              <div className={styles.row2}>
                <div className={styles.field}>
                  <label className={styles.label}>Phone</label>
                  <input className={styles.input} value={profile.phone} onChange={e => set("phone", e.target.value)} placeholder="+91 XXXXX XXXXX" />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>LinkedIn</label>
                  <input className={styles.input} value={profile.linkedin} onChange={e => set("linkedin", e.target.value)} placeholder="linkedin.com/in/..." />
                </div>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>GitHub</label>
                <input className={styles.input} value={profile.github} onChange={e => set("github", e.target.value)} placeholder="github.com/username" />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Bio</label>
                <textarea className={styles.textarea} value={profile.bio} onChange={e => set("bio", e.target.value)} placeholder="Tell recruiters about yourself in 2-3 lines..." rows={3} />
              </div>
            </div>

            {/* Education */}
            <div className={styles.card}>
              <p className={styles.cardTitle}>Education</p>
              <div className={styles.field}>
                <label className={styles.label}>College / University</label>
                <input className={styles.input} value={profile.college} onChange={e => set("college", e.target.value)} placeholder="e.g. IIT Delhi, KIIT University" />
              </div>
              <div className={styles.row2}>
                <div className={styles.field}>
                  <label className={styles.label}>Degree</label>
                  <input className={styles.input} value={profile.degree} onChange={e => set("degree", e.target.value)} placeholder="e.g. B.Tech CSE" />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Graduation Year</label>
                  <input className={styles.input} value={profile.year} onChange={e => set("year", e.target.value)} placeholder="e.g. 2025" />
                </div>
              </div>
            </div>

          </div>

<<<<<<< HEAD
          {/* Completion bar */}
          <div className={styles.sideCompletion}>
            <div className={styles.sideCompletionHeader}>
              <span>Profile strength</span>
              <span className={styles.sideCompletionPct}>{completionPct}%</span>
            </div>
            <div className={styles.progressTrack}>
              <div className={styles.progressFill} style={{ width: `${completionPct}%`,
                background: completionPct < 40 ? "#fbbf24" : completionPct < 70 ? "#c8c8c8" : "#81e6a0" }}/>
            </div>
          </div>
=======
          {/* ── RIGHT COLUMN ── */}
          <div className={styles.col}>
>>>>>>> 1f87c92154bd71eb2cb711721042f5cdbd53c042

            {/* Domain + Skills */}
            <div className={styles.card}>
              <p className={styles.cardTitle}>Domain & Skills</p>
              <div className={styles.field}>
                <label className={styles.label}>Primary Domain</label>
                <select className={styles.input} value={profile.domain} onChange={e => set("domain", e.target.value)}>
                  <option value="">Select your domain</option>
                  {DOMAINS.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Skills</label>
                <div className={styles.skillInputRow}>
                  <input
                    className={styles.input}
                    value={skillInput}
                    onChange={e => setSkillInput(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addSkill(skillInput); } }}
                    placeholder="Type skill and press Enter..."
                  />
                  <button className={styles.addBtn} onClick={() => addSkill(skillInput)}>Add</button>
                </div>

                {/* suggestions */}
                <div className={styles.suggestions}>
                  {SKILL_SUGGESTIONS.filter(s => !profile.skills.includes(s) && (!skillInput || s.toLowerCase().includes(skillInput.toLowerCase()))).slice(0, 10).map(s => (
                    <button key={s} className={styles.suggestionChip} onClick={() => addSkill(s)}>{s}</button>
                  ))}
                </div>

                {/* added skills */}
                {profile.skills.length > 0 && (
                  <div className={styles.skillTags}>
                    {profile.skills.map(s => (
                      <span key={s} className={styles.skillTag}>
                        {s}
                        <button className={styles.removeSkill} onClick={() => removeSkill(s)}>×</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Resume Upload */}
            <div className={styles.card}>
              <p className={styles.cardTitle}>Resume</p>

<<<<<<< HEAD
              {/* Photo upload */}
              <div className={styles.photoRow}>
                <div className={styles.photoPreview} onClick={() => fileRef.current?.click()}>
                  {photoURL
                    ? <img src={photoURL} alt="profile" className={styles.photoImg}/>
                    : <DefaultAvatar size={72} initials={initials}/>
                  }
                  <div className={styles.photoOverlay}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                      <circle cx="12" cy="13" r="4"/>
                    </svg>
                  </div>
                </div>
                <div className={styles.photoInfo}>
                  <div className={styles.photoTitle}>Profile Photo</div>
                  <div className={styles.photoSub}>JPG, PNG or GIF · Max 5MB · Square recommended</div>
                  <div className={styles.photoButtons}>
                    <button className={styles.btnSmOutline} onClick={() => fileRef.current?.click()}>Upload photo</button>
                    {photoURL && <button className={styles.btnSmDanger} onClick={() => setPhotoURL(null)}>Remove</button>}
                  </div>
                </div>
              </div>

              <div className={styles.divider}/>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Full Name</label>
                  <input className={styles.input} value={form.name} onChange={e => set("name", e.target.value)} placeholder="Your full name"/>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Professional Title</label>
                  <input className={styles.input} value={form.title} onChange={e => set("title", e.target.value)} placeholder="e.g. Frontend Engineer"/>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Email Address</label>
                  <input className={styles.input} value={form.email} onChange={e => set("email", e.target.value)} placeholder="your@email.com" type="email"/>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Phone Number</label>
                  <input className={styles.input} value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="+91 00000 00000"/>
                </div>
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label className={styles.label}>Location</label>
                  <input className={styles.input} value={form.location} onChange={e => set("location", e.target.value)} placeholder="City, State, Country"/>
                </div>
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label className={styles.label}>Professional Bio</label>
                  <textarea className={styles.textarea} value={form.bio} onChange={e => set("bio", e.target.value)} placeholder="Write a short bio about yourself, your skills, and career goals..." rows={4}/>
                </div>
              </div>

              <div className={styles.saveRow}>
                <button className={styles.btnPrimary} onClick={handleSave}>Save Changes</button>
              </div>
            </div>
          )}

          {/* ═══ RESUME ═══ */}
          {activeSection === "resume" && (
            <div className={styles.section}>
              <h2 className={styles.sectionHeading}>Resume</h2>
              <p className={styles.sectionSub}>Upload your resume. Recruiters and AI tools on HIREON will use this to match you to roles.</p>

              <input type="file" id="resumeInput" accept=".pdf,.doc,.docx" style={{display:"none"}} onChange={handleResume}/>

              {resumeName ? (
                <div className={styles.resumeCard}>
                  <div className={styles.resumeCardIcon}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c8c8c8" strokeWidth="1.6" strokeLinecap="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                    </svg>
                  </div>
                  <div className={styles.resumeCardInfo}>
                    <div className={styles.resumeCardName}>{resumeName}</div>
                    <div className={styles.resumeCardMeta}>Uploaded just now</div>
                  </div>
                  <div className={styles.resumeCardActions}>
                    <button className={styles.btnSmOutline} onClick={() => document.getElementById("resumeInput").click()}>Replace</button>
                    <button className={styles.btnSmDanger} onClick={() => setResumeName(null)}>Remove</button>
=======
              {profile.resumeName ? (
                <div className={styles.resumeUploaded}>
                  <div className={styles.resumeIcon}>📄</div>
                  <div className={styles.resumeInfo}>
                    <p className={styles.resumeName}>{profile.resumeName}</p>
                    <p className={styles.resumeSub}>PDF uploaded successfully</p>
>>>>>>> 1f87c92154bd71eb2cb711721042f5cdbd53c042
                  </div>
                  <button className={styles.reuploadBtn} onClick={() => fileRef.current.click()}>Replace</button>
                </div>
              ) : (
<<<<<<< HEAD
                <label htmlFor="resumeInput" className={styles.uploadBox}>
                  <div className={styles.uploadIcon}>
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="17 8 12 3 7 8"/>
                      <line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                  </div>
                  <div className={styles.uploadTitle}>Drop your resume here</div>
                  <div className={styles.uploadSub}>PDF, DOC, DOCX · Max 10MB</div>
                  <div className={styles.uploadBtn}>Browse file</div>
                </label>
              )}

              <div className={styles.infoBox}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c8c8c8" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                <span>A strong resume increases your ATS score. Go to <button className={styles.linkBtn} onClick={() => navigate("/Candidate/services/ats-checker")}>ATS Checker</button> to analyse it.</span>
              </div>
            </div>
          )}

          {/* ═══ SKILLS ═══ */}
          {activeSection === "skills" && (
            <div className={styles.section}>
              <h2 className={styles.sectionHeading}>Skills</h2>
              <p className={styles.sectionSub}>Add your technical and professional skills. These help match you to the right roles.</p>

              <div className={styles.skillInputRow}>
                <input
                  className={styles.input}
                  value={skillInput}
                  onChange={e => setSkillInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && addSkill(skillInput)}
                  placeholder="Type a skill and press Enter"
                  style={{flex:1}}
                />
                <button className={styles.btnPrimary} onClick={() => addSkill(skillInput)}>Add</button>
              </div>

              {form.skills.length > 0 && (
                <div className={styles.skillsWrap}>
                  {form.skills.map(s => (
                    <div key={s} className={styles.skillTag}>
                      {s}
                      <button className={styles.skillRemove} onClick={() => removeSkill(s)}>×</button>
                    </div>
                  ))}
=======
                <div className={styles.uploadZone} onClick={() => fileRef.current.click()}>
                  <div className={styles.uploadIcon}>📎</div>
                  <p className={styles.uploadText}>Click to upload your resume</p>
                  <p className={styles.uploadSub}>PDF format only · Max 5MB</p>
>>>>>>> 1f87c92154bd71eb2cb711721042f5cdbd53c042
                </div>
              )}

              <input ref={fileRef} type="file" accept=".pdf" style={{ display: "none" }} onChange={handleResume} />
              {parsing     && <p className={styles.parsingText}>Processing resume...</p>}
              {resumeError && <p className={styles.errorText}>{resumeError}</p>}
              <p className={styles.resumeNote}>
                Your resume is used for ATS screening and shared with recruiters when you apply to a job.
              </p>
            </div>

          </div>
        </div>

        {/* SAVE BUTTON */}
        <div className={styles.saveRow}>
          <button className={`${styles.saveBtn} ${saved ? styles.saveBtnSaved : ""}`} onClick={save}>
            {saved ? "✓ Profile Saved!" : "Save Profile"}
          </button>
        </div>

      </div>
    </div>
  );
};