import React from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./06_MainCand.module.css";

/* ─────────────────────────────────────────────
   Professional illustrated avatar
   Shows a human silhouette with a tint derived
   from the user's initials — no text, no "C"
───────────────────────────────────────────── */
const ProAvatar = ({ size = 32, initials = "" }) => {
  const hue = initials ? ((initials.charCodeAt(0) || 65) * 47) % 360 : 210;
  const cx  = size / 2;
  const bg1 = `hsl(${hue},22%,18%)`;
  const bg2 = `hsl(${hue},18%,11%)`;
  const skin = "#e8b89a";
  const shirt = `hsl(${hue},32%,30%)`;
  const headR = size * 0.21;
  const headY = size * 0.34;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      <defs>
        <radialGradient id={`avbg${hue}`} cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor={bg1}/>
          <stop offset="100%" stopColor={bg2}/>
        </radialGradient>
        <clipPath id={`avcl${hue}${size}`}>
          <circle cx={cx} cy={cx} r={cx}/>
        </clipPath>
      </defs>
      <circle cx={cx} cy={cx} r={cx} fill={`url(#avbg${hue})`}/>
      <circle cx={cx} cy={cx} r={cx-0.5} stroke={`hsl(${hue},25%,28%)`} strokeWidth="1" fill="none" opacity="0.5"/>
      <g clipPath={`url(#avcl${hue}${size})`}>
        {/* shoulders */}
        <ellipse cx={cx} cy={size*0.9} rx={size*0.44} ry={size*0.26} fill={`hsl(${hue},28%,22%)`}/>
        <ellipse cx={cx} cy={size*0.84} rx={size*0.36} ry={size*0.22} fill={shirt}/>
        {/* neck */}
        <rect x={cx-size*0.055} y={headY+headR-1} width={size*0.11} height={size*0.09} rx={size*0.055} fill={skin}/>
        {/* head */}
        <ellipse cx={cx} cy={headY} rx={headR} ry={headR*1.08} fill={skin}/>
        {/* subtle hair */}
        <ellipse cx={cx} cy={headY - headR*0.65} rx={headR*0.95} ry={headR*0.55}
          fill={`hsl(${(hue+30)%360},20%,22%)`} opacity="0.8"/>
      </g>
    </svg>
  );
};

const SERVICES = [
  { id:"resume-builder",   title:"Resume Builder",      desc:"Build an ATS-optimised resume with AI assistance, tailored to your target role.",                  tag:"AI POWERED",      tagColor:"#8ab4f8", path:"/Candidate/services/resume-builder" },
  { id:"resume-analysis",  title:"Resume Analysis",     desc:"Deep AI analysis of your resume — get a detailed breakdown of strengths and gaps.",                tag:"INSTANT RESULTS", tagColor:"#81e6a0", path:"/Candidate/services/resume-analysis" },
  { id:"ats-checker",      title:"ATS Checker",         desc:"Score your resume against any job description. Beat the bots before the humans see it.",           tag:"SCORE YOUR CV",   tagColor:"#fbbf24", path:"/Candidate/services/ats-checker" },
  { id:"dsa-aptitude",     title:"DSA & Aptitude",      desc:"Practice data structures, algorithms and aptitude questions for top tech interviews.",             tag:"500+ PROBLEMS",   tagColor:"#81e6a0", path:"/Candidate/services/dsa-aptitude" },
  { id:"ai-interview",     title:"AI Mock Interview",   desc:"Simulate real interviews with AI. Get instant feedback on your answers and delivery.",             tag:"LIVE FEEDBACK",   tagColor:"#fbbf24", path:"/Candidate/services/ai-interview" },
  { id:"job-matching",     title:"Job Recommendations", desc:"AI matches you to roles that perfectly fit your profile. No more cold applying.",                   tag:"94% ACCURACY",    tagColor:"#c084fc", path:"/Candidate/services/job-matching" },
];

const STATS = [
  { value:"6",    label:"AI Tools" },
  { value:"100%", label:"Free Forever" },
  { value:"ATS",  label:"Optimised" },
];

export const CandidateMain = () => {
  const navigate = useNavigate();

  const user = null; // TODO: replace with useAuth() when Firebase is set up
  const displayName = user?.displayName || user?.email?.split("@")[0] || "";
  const initials = displayName.trim()
    ? displayName.trim().split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
    : "";

  const handleSignOut = () => navigate("/");

  return (
    <div className={styles.page}>

      <header className={styles.topbar}>
        <Link to="/" className={styles.topbarLogo}>
          <div className={styles.topbarLogoSq}>
            <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
              <path d="M3 2V16M15 2V16M3 9H15" stroke="#000" strokeWidth="3" strokeLinecap="round"/>
            </svg>
          </div>
          HIREON
        </Link>

        <div className={styles.topbarRight}>

          <button className={styles.topbarAction}
            onClick={() => navigate("/Candidate/services/application-tracker")}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
              <line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/>
              <line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
            <span>Applications</span>
          </button>

          <div className={styles.topbarDivider}/>

          {/* User chip — illustrated avatar + name, links to profile */}
          <div className={styles.userChip}
            onClick={() => navigate("/Candidate/services/profile-management")}
            title="Manage Profile">
            <div className={styles.userAvatarWrap}>
              <ProAvatar size={28} initials={initials}/>
            </div>
            {displayName && <span className={styles.userName}>{displayName}</span>}
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{opacity:0.35}}>
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </div>

          <button className={styles.signOutBtn} onClick={handleSignOut}>Sign out</button>
        </div>
      </header>

      <main className={styles.main}>

        <div className={styles.pageHeader}>
          <div className={styles.pageBadge}>
            <span className={styles.pageBadgeDot}/>
            CANDIDATE DASHBOARD
          </div>
          <h1 className={styles.pageTitle}>
            One Profile.<br/>
            <em>Endless Opportunities.</em>
          </h1>
          <p className={styles.pageSub}>
            Every tool below is powered by AI to help you craft the perfect
            resume, beat ATS filters, and land your dream role faster.
          </p>
        </div>

        <div className={styles.statsRow}>
          {STATS.map(s => (
            <div key={s.label} className={styles.statCard}>
              <div className={styles.statValue}>{s.value}</div>
              <div className={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>SERVICES</h2>
          <div className={styles.cardsGrid}>
            {SERVICES.map(s => (
              <div key={s.id} className={styles.card} onClick={() => navigate(s.path)}>
                <div className={styles.cardArrowWrap}>
                  <svg className={styles.cardArrow} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </div>
                <div className={styles.cardTitle}>{s.title}</div>
                <div className={styles.cardDesc}>{s.desc}</div>
                <span className={styles.cardTag}
                  style={{ color:s.tagColor, borderColor:`${s.tagColor}35`, background:`${s.tagColor}10` }}>
                  {s.tag}
                </span>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
};