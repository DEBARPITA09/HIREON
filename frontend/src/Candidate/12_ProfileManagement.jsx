import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth, db } from "../config/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import styles from "./12_ProfileManagement.module.css";

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
];

const SKILL_SUGGESTIONS = ["React", "Node.js", "Python", "Java", "SQL", "AWS", "Docker", "TypeScript", "MongoDB", "GraphQL", "Machine Learning", "Data Analysis"];

export const ProfileManagement = () => {
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

  const STORAGE_KEY = "hireon_candidate_profile";

  const defaultForm = {
    name: "", title: "", email: "", phone: "", location: "", bio: "",
    github: "", linkedin: "", portfolio: "", twitter: "",
    skills: [],
    experience: [{ id:1, role:"", company:"", duration:"", desc:"" }],
    education:  [{ id:1, degree:"", institution:"", year:"", grade:"" }],
    jobType: "", salary: "", notice: "", remote: "",
    currentPassword: "", newPassword: "", confirmPassword: "",
    resumeUrl: "",
  };

  const [form, setForm] = useState(defaultForm);

  /* ── On mount: listen to auth, then load profile from Firestore ── */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        try {
          const snap = await getDoc(doc(db, "candidates", user.uid));
          if (snap.exists()) {
            const data = snap.data();
            setForm(f => ({
              ...f,
              name:        data.name        || user.displayName || "",
              email:       data.email       || user.email       || "",
              title:       data.title       || "",
              phone:       data.phone       || "",
              location:    data.location    || "",
              bio:         data.bio         || "",
              github:      data.github      || "",
              linkedin:    data.linkedin    || "",
              portfolio:   data.portfolio   || "",
              twitter:     data.twitter     || "",
              skills:      data.skills      || [],
              experience:  data.experience  || [{ id:1, role:"", company:"", duration:"", desc:"" }],
              education:   data.education   || [{ id:1, degree:"", institution:"", year:"", grade:"" }],
              jobType:     data.jobType     || "",
              salary:      data.salary      || "",
              notice:      data.notice      || "",
              remote:      data.remote      || "",
              resumeUrl:   data.resumeUrl   || "",
            }));
            if (data.resumeUrl) setResumeName(data.resumeUrl);
            // Load photo from localStorage (photos stored locally)
            const savedPhoto = localStorage.getItem("hireon_photo_" + user.uid);
            if (savedPhoto) setPhotoURL(savedPhoto);
          } else {
            // No Firestore doc yet — seed from Firebase Auth
            setForm(f => ({
              ...f,
              name:  user.displayName || "",
              email: user.email       || "",
            }));
          }
        } catch (err) {
          console.error("Error loading profile:", err);
        }
      } else {
        navigate("/Candidate/02_LoginCand");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const displayName = form.name || currentUser?.displayName || "You";
  const initials = displayName.split(" ").filter(Boolean).map(n=>n[0]).join("").slice(0,2).toUpperCase() || "U";

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPhotoURL(ev.target.result);
      if (currentUser) localStorage.setItem("hireon_photo_" + currentUser.uid, ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleResume = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResumeName(file.name);
      set("resumeUrl", file.name);
    }
  };

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

      {/* ══ TOPBAR ══ */}
      <header className={styles.topbar}>
        <Link to="/Candidate/06_MainCand" className={styles.topbarLogo}>
          <div className={styles.topbarLogoSq}>
            <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
              <path d="M3 2V16M15 2V16M3 9H15" stroke="#000" strokeWidth="3" strokeLinecap="round"/>
            </svg>
          </div>
          HIREON
        </Link>

        <div className={styles.topbarCenter}>
          <span className={styles.topbarCrumb} onClick={() => navigate("/Candidate/06_MainCand")}>Dashboard</span>
          <span className={styles.topbarSep}>/</span>
          <span className={styles.topbarCrumbActive}>Profile</span>
        </div>

        <div className={styles.topbarRight}>
          <button
            className={styles.topbarAction}
            onClick={() => navigate("/Candidate/services/application-tracker")}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
              <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
            Applications
          </button>
          <div className={styles.topbarDivider}/>
          <div className={styles.userChip}>
            <div className={styles.userAvatar}>{initials}</div>
            <span className={styles.userName}>{displayName}</span>
          </div>
          <button className={styles.signOutBtn} onClick={handleSignOut}>Sign out</button>
        </div>
      </header>

      {/* ══ BODY ══ */}
      <div className={styles.layout}>

        {/* ── LEFT SIDEBAR ── */}
        <aside className={styles.sidebar}>

          {/* Mini profile card in sidebar */}
          <div className={styles.sideProfile}>
            <div className={styles.sideAvatarWrap} onClick={() => fileRef.current?.click()} title="Change photo">
              {photoURL
                ? <img src={photoURL} alt="profile" className={styles.sideAvatarImg}/>
                : <DefaultAvatar size={56} initials={initials}/>
              }
              <div className={styles.sideAvatarOverlay}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>
                </svg>
              </div>
            </div>
            <div className={styles.sideProfileInfo}>
              <div className={styles.sideProfileName}>{displayName}</div>
              <div className={styles.sideProfileTitle}>{form.title || "Add your title"}</div>
            </div>
          </div>

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

          <div className={styles.sideNav}>
            {NAV_SECTIONS.map(s => (
              <button
                key={s.id}
                className={`${styles.sideLink} ${activeSection === s.id ? styles.sideLinkActive : ""}`}
                onClick={() => setActiveSection(s.id)}
              >
                <span className={styles.sideLinkIcon}>{s.icon}</span>
                {s.label}
              </button>
            ))}
          </div>
        </aside>

        {/* ── MAIN PANEL ── */}
        <main className={styles.main}>

          {/* hidden file inputs */}
          <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={handlePhoto}/>

          {/* save toast */}
          {saved && (
            <div className={styles.toast}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#81e6a0" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
              Changes saved
            </div>
          )}

          {/* ═══ OVERVIEW ═══ */}
          {activeSection === "overview" && (
            <div className={styles.section}>
              <h2 className={styles.sectionHeading}>Overview</h2>

              {/* Big profile card */}
              <div className={styles.overviewCard}>
                {/* Cover strip */}
                <div className={styles.overviewCover}/>

                <div className={styles.overviewBody}>
                  {/* Avatar — large, clickable */}
                  <div className={styles.overviewAvatarWrap} onClick={() => fileRef.current?.click()} title="Change photo">
                    {photoURL
                      ? <img src={photoURL} alt="profile" className={styles.overviewAvatarImg}/>
                      : <DefaultAvatar size={80} initials={initials}/>
                    }
                    <div className={styles.overviewAvatarOverlay}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                        <circle cx="12" cy="13" r="4"/>
                      </svg>
                      <span>Edit photo</span>
                    </div>
                  </div>

                  <div className={styles.overviewInfo}>
                    <div className={styles.overviewName}>{displayName}</div>
                    <div className={styles.overviewTitle}>{form.title || <span className={styles.placeholder}>Add a professional title</span>}</div>
                    <div className={styles.overviewMeta}>
                      {form.location && <span>📍 {form.location}</span>}
                      {form.email    && <span>✉ {form.email}</span>}
                    </div>
                  </div>

                  <div className={styles.overviewActions}>
                    <button className={styles.btnPrimary} onClick={() => setActiveSection("personal")}>Edit Profile</button>
                    {resumeName && <button className={styles.btnOutline}>View Resume</button>}
                  </div>
                </div>

                {/* Stats row */}
                <div className={styles.overviewStats}>
                  {[
                    { label: "Profile Views",     value: "—" },
                    { label: "Skills",             value: form.skills.length },
                    { label: "ATS Score",          value: "—" },
                    { label: "Applications",       value: "—" },
                    { label: "Profile Strength",   value: `${completionPct}%` },
                  ].map(s => (
                    <div key={s.label} className={styles.overviewStat}>
                      <div className={styles.overviewStatVal}>{s.value}</div>
                      <div className={styles.overviewStatLbl}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick links to incomplete sections */}
              <h3 className={styles.subHeading}>Complete your profile</h3>
              <div className={styles.quickGrid}>
                {[
                  { id:"resume",     label:"Upload Resume",    done: !!resumeName,        icon:"📄" },
                  { id:"skills",     label:"Add Skills",       done: form.skills.length>2, icon:"⚡" },
                  { id:"experience", label:"Add Experience",   done: !!form.experience[0].role, icon:"💼" },
                  { id:"education",  label:"Add Education",    done: !!form.education[0].degree, icon:"🎓" },
                  { id:"links",      label:"Add Links",        done: !!(form.github||form.linkedin), icon:"🔗" },
                  { id:"preferences",label:"Job Preferences",  done: !!form.jobType,      icon:"🎯" },
                ].map(item => (
                  <div
                    key={item.id}
                    className={`${styles.quickCard} ${item.done ? styles.quickCardDone : ""}`}
                    onClick={() => setActiveSection(item.id)}
                  >
                    <div className={styles.quickCardCheck}>
                      {item.done
                        ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#81e6a0" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                        : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                      }
                    </div>
                    <span className={styles.quickCardLabel}>{item.label}</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={styles.quickCardArrow}><polyline points="9 18 15 12 9 6"/></svg>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══ PERSONAL INFO ═══ */}
          {activeSection === "personal" && (
            <div className={styles.section}>
              <div className={styles.sectionHeaderRow}>
                <h2 className={styles.sectionHeading}>Personal Information</h2>
              </div>

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
                  </div>
                </div>
              ) : (
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
                </div>
              )}

              <div className={styles.divider}/>
              <div className={styles.subHeading2}>Suggested Skills</div>
              <div className={styles.skillsWrap}>
                {SKILL_SUGGESTIONS.filter(s => !form.skills.includes(s)).map(s => (
                  <button key={s} className={styles.skillSuggestion} onClick={() => addSkill(s)}>
                    + {s}
                  </button>
                ))}
              </div>

              <div className={styles.saveRow}>
                <button className={styles.btnPrimary} onClick={handleSave}>Save Skills</button>
              </div>
            </div>
          )}

          {/* ═══ EXPERIENCE ═══ */}
          {activeSection === "experience" && (
            <div className={styles.section}>
              <h2 className={styles.sectionHeading}>Work Experience</h2>
              <p className={styles.sectionSub}>Add your work history. This is shown to recruiters and used in AI matching.</p>

              {form.experience.map((exp, i) => (
                <div key={exp.id} className={styles.entryCard}>
                  <div className={styles.entryCardHeader}>
                    <span className={styles.entryCardNum}>#{i + 1}</span>
                    {form.experience.length > 1 && (
                      <button className={styles.entryRemove} onClick={() => set("experience", form.experience.filter(e => e.id !== exp.id))}>Remove</button>
                    )}
                  </div>
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Job Title</label>
                      <input className={styles.input} value={exp.role} onChange={e => set("experience", form.experience.map(x => x.id===exp.id ? {...x, role:e.target.value} : x))} placeholder="e.g. Frontend Developer"/>
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Company</label>
                      <input className={styles.input} value={exp.company} onChange={e => set("experience", form.experience.map(x => x.id===exp.id ? {...x, company:e.target.value} : x))} placeholder="Company name"/>
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Duration</label>
                      <input className={styles.input} value={exp.duration} onChange={e => set("experience", form.experience.map(x => x.id===exp.id ? {...x, duration:e.target.value} : x))} placeholder="e.g. Jan 2022 – Present"/>
                    </div>
                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                      <label className={styles.label}>Description</label>
                      <textarea className={styles.textarea} value={exp.desc} onChange={e => set("experience", form.experience.map(x => x.id===exp.id ? {...x, desc:e.target.value} : x))} placeholder="Describe your responsibilities and achievements..." rows={3}/>
                    </div>
                  </div>
                </div>
              ))}

              <button className={styles.btnOutline} onClick={() => set("experience", [...form.experience, { id: Date.now(), role:"", company:"", duration:"", desc:"" }])}>
                + Add Another Experience
              </button>

              <div className={styles.saveRow}>
                <button className={styles.btnPrimary} onClick={handleSave}>Save Experience</button>
              </div>
            </div>
          )}

          {/* ═══ EDUCATION ═══ */}
          {activeSection === "education" && (
            <div className={styles.section}>
              <h2 className={styles.sectionHeading}>Education</h2>
              <p className={styles.sectionSub}>Your academic background helps match you to relevant roles and graduate programmes.</p>

              {form.education.map((edu, i) => (
                <div key={edu.id} className={styles.entryCard}>
                  <div className={styles.entryCardHeader}>
                    <span className={styles.entryCardNum}>#{i + 1}</span>
                    {form.education.length > 1 && (
                      <button className={styles.entryRemove} onClick={() => set("education", form.education.filter(e => e.id !== edu.id))}>Remove</button>
                    )}
                  </div>
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Degree / Programme</label>
                      <input className={styles.input} value={edu.degree} onChange={e => set("education", form.education.map(x => x.id===edu.id ? {...x, degree:e.target.value} : x))} placeholder="e.g. B.Tech Computer Science"/>
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Institution</label>
                      <input className={styles.input} value={edu.institution} onChange={e => set("education", form.education.map(x => x.id===edu.id ? {...x, institution:e.target.value} : x))} placeholder="University / College name"/>
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Year</label>
                      <input className={styles.input} value={edu.year} onChange={e => set("education", form.education.map(x => x.id===edu.id ? {...x, year:e.target.value} : x))} placeholder="e.g. 2020 – 2024"/>
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Grade / CGPA</label>
                      <input className={styles.input} value={edu.grade} onChange={e => set("education", form.education.map(x => x.id===edu.id ? {...x, grade:e.target.value} : x))} placeholder="e.g. 8.5 CGPA"/>
                    </div>
                  </div>
                </div>
              ))}

              <button className={styles.btnOutline} onClick={() => set("education", [...form.education, { id: Date.now(), degree:"", institution:"", year:"", grade:"" }])}>
                + Add Another Education
              </button>

              <div className={styles.saveRow}>
                <button className={styles.btnPrimary} onClick={handleSave}>Save Education</button>
              </div>
            </div>
          )}

          {/* ═══ LINKS ═══ */}
          {activeSection === "links" && (
            <div className={styles.section}>
              <h2 className={styles.sectionHeading}>Links & Socials</h2>
              <p className={styles.sectionSub}>Add your professional links. These are shown to recruiters viewing your profile.</p>

              <div className={styles.formGrid}>
                {[
                  { key:"linkedin",  label:"LinkedIn URL",  placeholder:"linkedin.com/in/yourname" },
                  { key:"github",    label:"GitHub URL",    placeholder:"github.com/yourusername" },
                  { key:"portfolio", label:"Portfolio / Website", placeholder:"yourportfolio.com" },
                  { key:"twitter",   label:"Twitter / X",  placeholder:"twitter.com/yourhandle" },
                ].map(f => (
                  <div key={f.key} className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label className={styles.label}>{f.label}</label>
                    <input className={styles.input} value={form[f.key]} onChange={e => set(f.key, e.target.value)} placeholder={f.placeholder}/>
                  </div>
                ))}
              </div>

              <div className={styles.saveRow}>
                <button className={styles.btnPrimary} onClick={handleSave}>Save Links</button>
              </div>
            </div>
          )}

          {/* ═══ JOB PREFERENCES ═══ */}
          {activeSection === "preferences" && (
            <div className={styles.section}>
              <h2 className={styles.sectionHeading}>Job Preferences</h2>
              <p className={styles.sectionSub}>These preferences help HIREON show you more relevant job recommendations.</p>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Job Type</label>
                  <select className={styles.select} value={form.jobType} onChange={e => set("jobType", e.target.value)}>
                    <option value="">Select job type</option>
                    <option>Full-time</option><option>Part-time</option>
                    <option>Contract</option><option>Internship</option><option>Freelance</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Work Mode Preference</label>
                  <select className={styles.select} value={form.remote} onChange={e => set("remote", e.target.value)}>
                    <option value="">Select preference</option>
                    <option>Remote</option><option>Hybrid</option><option>On-site</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Expected Salary (LPA)</label>
                  <input className={styles.input} value={form.salary} onChange={e => set("salary", e.target.value)} placeholder="e.g. 8-12 LPA"/>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Notice Period</label>
                  <select className={styles.select} value={form.notice} onChange={e => set("notice", e.target.value)}>
                    <option value="">Select notice period</option>
                    <option>Immediate</option><option>15 Days</option>
                    <option>30 Days</option><option>60 Days</option><option>90 Days</option>
                  </select>
                </div>
              </div>

              <div className={styles.saveRow}>
                <button className={styles.btnPrimary} onClick={handleSave}>Save Preferences</button>
              </div>
            </div>
          )}

          {/* ═══ SECURITY ═══ */}
          {activeSection === "security" && (
            <div className={styles.section}>
              <h2 className={styles.sectionHeading}>Account & Security</h2>
              <p className={styles.sectionSub}>Manage your account security and password.</p>

              <div className={styles.entryCard}>
                <div className={styles.entryCardHeader}><span className={styles.entryCardNum}>Change Password</span></div>
                <div className={styles.formGrid}>
                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label className={styles.label}>Current Password</label>
                    <input className={styles.input} type="password" value={form.currentPassword} onChange={e => set("currentPassword", e.target.value)} placeholder="Enter current password"/>
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>New Password</label>
                    <input className={styles.input} type="password" value={form.newPassword} onChange={e => set("newPassword", e.target.value)} placeholder="Min 8 characters"/>
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Confirm New Password</label>
                    <input className={styles.input} type="password" value={form.confirmPassword} onChange={e => set("confirmPassword", e.target.value)} placeholder="Repeat new password"/>
                  </div>
                </div>
              </div>

              <div className={styles.dangerZone}>
                <div className={styles.dangerTitle}>Danger Zone</div>
                <div className={styles.dangerRow}>
                  <div>
                    <div className={styles.dangerLabel}>Delete Account</div>
                    <div className={styles.dangerSub}>Permanently delete your HIREON account and all data.</div>
                  </div>
                  <button className={styles.btnDanger}>Delete Account</button>
                </div>
              </div>

              <div className={styles.saveRow}>
                <button className={styles.btnPrimary} onClick={handleSave}>Update Password</button>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};