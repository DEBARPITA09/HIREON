import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { HireonJobsTab } from "./HireonJobsTab";

const ADZUNA_APP_ID  = import.meta.env.VITE_ADZUNA_APP_ID;
const ADZUNA_API_KEY = import.meta.env.VITE_ADZUNA_API_KEY;

/* ═══════════════════════════════════
   DESIGN TOKENS
═══════════════════════════════════ */
const T = {
  bg:      "#080808",
  surface: "rgba(255,255,255,0.03)",
  card:    "rgba(255,255,255,0.05)",
  border:  "rgba(255,255,255,0.07)",
  border2: "rgba(255,255,255,0.13)",
  white:   "#ffffff",
  muted:   "rgba(255,255,255,0.38)",
  muted2:  "rgba(255,255,255,0.62)",
  green:   "#81e6a0",
  blue:    "#c8c8c8",
  yellow:  "#fbbf24",
  accent:  "#c8c8c8",
  red:     "#f87171",
  purple:  "#c084fc",
  india:   "#c8c8c8",
};

/* ═══════════════════════════════════
   GLOBAL STYLE
═══════════════════════════════════ */
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=DM+Sans:wght@300;400;500;600;700&display=swap');
    *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
    body { font-family:'DM Sans',sans-serif; background:#080808; }
    input { font-family:'DM Sans',sans-serif; }
    input::placeholder { color:rgba(255,255,255,0.2); }
    input:focus { outline:none; }
    ::-webkit-scrollbar { width:4px; }
    ::-webkit-scrollbar-track { background:transparent; }
    ::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.1); border-radius:2px; }
    @keyframes fadeUp  { from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);} }
    @keyframes cardIn  { from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:translateY(0);} }
    @keyframes pulse   { 0%,100%{transform:scale(1);opacity:1;}50%{transform:scale(1.6);opacity:0.4;} }
    @keyframes shimmer { 0%{margin-left:-60%;}100%{margin-left:110%;} }
    .jm-fade   { animation:fadeUp 0.42s ease both; }
    .jm-cardIn { animation:cardIn 0.45s cubic-bezier(0.16,1,0.3,1) both; }
  `}</style>
);

/* ═══════════════════════════════════
   PARTICLE BACKGROUND
═══════════════════════════════════ */
function useParticles(ref) {
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W, H, raf;
    const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    resize(); window.addEventListener("resize", resize);
    const N = 90;
    const pts = Array.from({ length: N }, () => ({
      x: Math.random(), y: Math.random(),
      vx: (Math.random() - .5) * .00018, vy: (Math.random() - .5) * .00018,
      r: .6 + Math.random() * 1.4, a: .1 + Math.random() * .32, ph: Math.random() * Math.PI * 2,
    }));
    let t = 0;
    function draw() {
      ctx.clearRect(0, 0, W, H);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = 1; if (p.x > 1) p.x = 0;
        if (p.y < 0) p.y = 1; if (p.y > 1) p.y = 0;
        const pulse = .82 + .18 * Math.sin(t * .016 + p.ph);
        ctx.beginPath(); ctx.arc(p.x * W, p.y * H, p.r * pulse, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.a * pulse})`; ctx.fill();
      });
      for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < .08) {
          ctx.beginPath(); ctx.moveTo(pts[i].x * W, pts[i].y * H); ctx.lineTo(pts[j].x * W, pts[j].y * H);
          ctx.strokeStyle = `rgba(255,255,255,${.05 * (1 - d / .08)})`; ctx.lineWidth = .4; ctx.stroke();
        }
      }
      t++; raf = requestAnimationFrame(draw);
    }
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
}

/* ═══════════════════════════════════
   COMPANY LOGO
═══════════════════════════════════ */
const KNOWN_DOMAINS = {
  "google":"google.com","amazon":"amazon.com","microsoft":"microsoft.com",
  "meta":"meta.com","apple":"apple.com","flipkart":"flipkart.com",
  "infosys":"infosys.com","tcs":"tcs.com","wipro":"wipro.com",
  "accenture":"accenture.com","ibm":"ibm.com","oracle":"oracle.com",
  "adobe":"adobe.com","samsung":"samsung.com","intel":"intel.com",
  "cisco":"cisco.com","capgemini":"capgemini.com","cognizant":"cognizant.com",
  "hcl":"hcltech.com","hcltech":"hcltech.com",
  "tech mahindra":"techmahindra.com","techmahindra":"techmahindra.com",
  "mphasis":"mphasis.com","mindtree":"mindtree.com","swiggy":"swiggy.com",
  "zomato":"zomato.com","paytm":"paytm.com","ola":"olacabs.com",
  "razorpay":"razorpay.com","freshworks":"freshworks.com","zoho":"zoho.com",
  "byju":"byjus.com","byjus":"byjus.com","unacademy":"unacademy.com",
  "meesho":"meesho.com","phonepe":"phonepe.com","cred":"cred.club",
  "zerodha":"zerodha.com","nykaa":"nykaa.com","myntra":"myntra.com",
  "uber":"uber.com","netflix":"netflix.com","spotify":"spotify.com",
  "twitter":"twitter.com","linkedin":"linkedin.com","salesforce":"salesforce.com",
  "atlassian":"atlassian.com","slack":"slack.com","shopify":"shopify.com",
  "stripe":"stripe.com","airbnb":"airbnb.com",
  "goldman sachs":"goldmansachs.com","goldman":"goldmansachs.com",
  "jp morgan":"jpmorgan.com","jpmorgan":"jpmorgan.com",
  "deloitte":"deloitte.com","pwc":"pwc.com","kpmg":"kpmg.com",
};

const getDomain = name => {
  if (!name) return null;
  const lower = name.toLowerCase().trim();
  for (const [key, domain] of Object.entries(KNOWN_DOMAINS))
    if (lower.includes(key)) return domain;
  const cleaned = lower
    .replace(/\s+(private|pvt|ltd|limited|inc|llc|llp|technologies|tech|solutions|services|group|india|infotech|software|systems|global|consulting|corporation|corp|co)\.?\s*$/gi, "")
    .trim().replace(/\s+/g, "");
  return cleaned.length > 1 ? `${cleaned}.com` : null;
};

function CompanyLogo({ company, size = 46, isIndia }) {
  const [srcIndex, setSrcIndex] = useState(0);
  const domain  = getDomain(company);
  const initial = company?.[0]?.toUpperCase() || "?";
  const sources = domain ? [
    `https://logo.clearbit.com/${domain}`,
    `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
    `https://icon.horse/icon/${domain}`,
  ] : [];
  const accent   = isIndia ? T.india : T.blue;
  const showLogo = sources.length > 0 && srcIndex < sources.length;
  return (
    <div style={{
      width: size, height: size, borderRadius: 11, flexShrink: 0,
      background: `${accent}10`, border: `1px solid ${accent}25`,
      overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      {showLogo
        ? <img src={sources[srcIndex]} alt={company} onError={() => setSrcIndex(i => i + 1)}
            style={{ width: size - 12, height: size - 12, objectFit: "contain" }} />
        : <span style={{ color: accent, fontSize: Math.round(size * .38), fontWeight: 900, fontFamily: "'Playfair Display',serif" }}>{initial}</span>
      }
    </div>
  );
}

/* ═══════════════════════════════════
   TOPBAR — shared landing + jobs
═══════════════════════════════════ */
function Topbar({ onBack, showSearch, searchInput, setSearchInput, onSearch }) {
  const navigate = useNavigate();
  return (
    <header style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "0 32px", height: 56,
      background: "rgba(8,8,8,0.92)", backdropFilter: "blur(20px)",
      borderBottom: `1px solid ${T.border}`,
      position: "sticky", top: 0, zIndex: 200, flexWrap: "wrap",
    }}>
      {/* Left */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button
          onClick={onBack || (() => navigate("/Candidate/06_MainCand"))}
          style={{ background: "transparent", border: `1px solid ${T.border}`, borderRadius: 7, padding: "6px 14px", color: T.muted, fontSize: "0.78rem", fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", transition: "all 0.2s" }}
          onMouseEnter={e => { e.currentTarget.style.color = T.white; e.currentTarget.style.borderColor = T.border2; }}
          onMouseLeave={e => { e.currentTarget.style.color = T.muted; e.currentTarget.style.borderColor = T.border; }}>
          ← Dashboard
        </button>
        <span style={{ color: T.border2, fontSize: "0.7rem" }}>/</span>
        <span style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: "0.85rem", color: T.white }}>
          Job Recommendations
        </span>
      </div>

      {/* Search bar */}
      {showSearch && (
        <>
          <div style={{ flex: 1, maxWidth: 400, marginLeft: 8 }}>
            <input
              placeholder="Search roles, skills, companies..."
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") onSearch(searchInput); }}
              style={{ width: "100%", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 9, padding: "8px 14px", color: T.white, fontSize: "0.8rem", transition: "border-color 0.2s" }}
              onFocus={e => e.currentTarget.style.borderColor = T.border2}
              onBlur={e => e.currentTarget.style.borderColor = T.border}
            />
          </div>
          <button
            onClick={() => onSearch(searchInput)}
            style={{ background: T.white, color: "#080808", border: "none", borderRadius: 8, padding: "8px 20px", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", letterSpacing: "0.06em", textTransform: "uppercase", transition: "all 0.2s", flexShrink: 0 }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 16px rgba(255,255,255,0.12)"}
            onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
            Search
          </button>
        </>
      )}

      {/* HIREON logo */}
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: "0.95rem", color: T.white, letterSpacing: "0.05em" }}>
        <div style={{ width: 24, height: 24, borderRadius: 5, background: T.white, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="12" height="12" viewBox="0 0 18 18" fill="none">
            <path d="M3 2V16M15 2V16M3 9H15" stroke="#080808" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>
        HIREON
      </div>
    </header>
  );
}

/* ═══════════════════════════════════
   JOB CARD
═══════════════════════════════════ */
function JobCard({ job, index }) {
  const [hovered, setHovered] = useState(false);
  const isIndia  = job.source === "adzuna";
  const salary   = job.salary_min && job.salary_max
    ? `₹${Math.round(job.salary_min / 100000)}L – ₹${Math.round(job.salary_max / 100000)}L`
    : job.salary || null;
  const accent = isIndia ? T.india : T.blue;

  return (
    <div
      className="jm-cardIn"
      style={{ animationDelay: `${Math.min(index, 10) * 0.055}s` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        background: hovered ? `${accent}07` : T.surface,
        border: `1px solid ${hovered ? accent + "38" : T.border}`,
        borderRadius: 14, padding: "20px 24px",
        transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
        transform: hovered ? "translateX(4px)" : "translateX(0)",
        boxShadow: hovered ? "0 8px 32px rgba(0,0,0,0.3)" : "none",
        position: "relative", overflow: "hidden",
      }}>
        {/* Left accent bar */}
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 2, background: hovered ? `linear-gradient(180deg,${accent},transparent)` : "transparent", borderRadius: "14px 0 0 14px", transition: "all 0.3s" }} />
        {/* Top shimmer */}
        <div style={{ position: "absolute", top: 0, left: 24, right: 24, height: 1, background: `linear-gradient(90deg,transparent,${accent}20,transparent)` }} />

        <div style={{ display: "flex", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
          <CompanyLogo company={job.company} size={46} isIndia={isIndia} />

          <div style={{ flex: 1, minWidth: 200 }}>
            {/* Title row */}
            <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap", marginBottom: 6 }}>
              <h3 style={{ fontFamily: "'Playfair Display',serif", color: T.white, fontSize: "0.92rem", fontWeight: 700, margin: 0, letterSpacing: "-0.01em" }}>
                {job.title}
              </h3>
              {isIndia && (
                <span style={{ background: `${T.india}10`, color: T.india, border: `1px solid ${T.india}28`, borderRadius: 5, padding: "1px 8px", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase" }}>India</span>
              )}
              {job.remote && (
                <span style={{ background: `${T.green}10`, color: T.green, border: `1px solid ${T.green}28`, borderRadius: 5, padding: "1px 8px", fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase" }}>Remote</span>
              )}
              {job.jobType && (
                <span style={{ background: T.surface, color: T.muted, border: `1px solid ${T.border}`, borderRadius: 5, padding: "1px 8px", fontSize: "0.6rem", fontWeight: 600 }}>{job.jobType}</span>
              )}
            </div>

            {/* Meta row */}
            <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", marginBottom: 8 }}>
              <span style={{ color: T.muted2, fontSize: "0.8rem", fontWeight: 600 }}>{job.company}</span>
              {job.location && (
                <span style={{ color: T.muted, fontSize: "0.75rem", display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ fontSize: "0.7rem" }}>📍</span>{job.location}
                </span>
              )}
              {salary && (
                <span style={{ fontFamily: "'Playfair Display',serif", color: T.green, fontSize: "0.78rem", fontWeight: 700 }}>{salary}</span>
              )}
              {job.date && (
                <span style={{ color: T.muted, fontSize: "0.68rem" }}>
                  {new Date(job.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </span>
              )}
            </div>

            {/* Tags */}
            {job.tags?.length > 0 && (
              <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                {job.tags.slice(0, 5).map(tag => (
                  <span key={tag} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 5, padding: "1px 8px", color: T.muted, fontSize: "0.68rem" }}>{tag}</span>
                ))}
              </div>
            )}
          </div>

          {/* Apply button */}
          <div style={{ flexShrink: 0 }}>
            <a href={job.url} target="_blank" rel="noopener noreferrer"
              style={{ background: hovered ? T.white : "rgba(255,255,255,0.9)", color: "#080808", border: "none", borderRadius: 9, padding: "10px 24px", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", letterSpacing: "0.07em", textTransform: "uppercase", textDecoration: "none", display: "block", whiteSpace: "nowrap", transition: "all 0.25s", boxShadow: hovered ? "0 4px 20px rgba(255,255,255,0.15)" : "none" }}>
              Apply Now →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════
   MAIN EXPORT
═══════════════════════════════════ */
export const JobMatching = () => {
  const navigate = useNavigate();
  const canvasRef = useRef();
  useParticles(canvasRef);

  const [screen,       setScreen]      = useState("landing");
  const [jobs,         setJobs]        = useState([]);
  const [loading,      setLoading]     = useState(false);
  const [error,        setError]       = useState("");
  const [searchInput,  setSearchInput] = useState("");
  const [activeSource, setActiveSource]= useState("all");
  const [adzunaLimitReached, setAdzunaLimitReached] = useState(false);
  const [filters,      setFilters]     = useState({ location: "", type: "all", company: "" });
  const [page,         setPage]        = useState(1);
  const JOBS_PER_PAGE = 12;

  const fetchAdzuna = async (term = "software engineer") => {
    const results = [];
    try {
      const url = `https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${ADZUNA_APP_ID}&app_key=${ADZUNA_API_KEY}&results_per_page=50&what=${encodeURIComponent(term)}&content-type=application/json`;
      const res = await fetch(url); if (!res.ok) throw new Error("Adzuna failed");
      const data = await res.json();
      (data.results || []).forEach(j => results.push({
        id: `az_${j.id}`, title: j.title,
        company: j.company?.display_name || "Unknown",
        location: j.location?.display_name || "India",
        salary_min: j.salary_min, salary_max: j.salary_max,
        date: j.created, url: j.redirect_url,
        tags: j.category?.label ? [j.category.label] : [],
        jobType: j.contract_time === "full_time" ? "Full Time" : j.contract_time === "part_time" ? "Part Time" : null,
        remote: j.title?.toLowerCase().includes("remote"),
        source: "adzuna",
      }));
    } catch (e) {
      console.warn("Adzuna:", e);
      setAdzunaLimitReached(true);
    }
    return results;
  };

  const fetchRemotive = async (term = "") => {
    const results = [];
    try {
      let url = "https://remotive.com/api/remote-jobs?limit=50";
      if (term) url += `&search=${encodeURIComponent(term)}`;
      const res = await fetch(url); if (!res.ok) throw new Error("Remotive failed");
      const data = await res.json();
      (data.jobs || []).forEach(j => results.push({
        id: `rm_${j.id}`, title: j.title, company: j.company_name,
        location: j.candidate_required_location || "Remote — Worldwide",
        salary: j.salary, date: j.publication_date, url: j.url,
        tags: j.tags || [], jobType: j.job_type || "Full Time",
        remote: true, source: "remotive",
      }));
    } catch (e) { console.warn("Remotive:", e); }
    return results;
  };

  const fetchJobs = useCallback(async (term = "") => {
    setLoading(true); setError(""); setPage(1);
    try {
      const t = term.trim() || "software engineer";
      const [india, global] = await Promise.all([fetchAdzuna(t), fetchRemotive(term)]);
      // Remove jobs the candidate has already applied to
      const cand = JSON.parse(localStorage.getItem("hireon_candidate")) || {};
      const apps = JSON.parse(localStorage.getItem("hireon_applications")) || [];
      const appliedJobTitles = new Set(
        apps.filter(a => a.candidateId === cand.email || a.candidateEmail === cand.email)
            .map(a => a.jobRole?.toLowerCase().trim())
      );
      const combined = [...india, ...global].filter(j => {
        const title = (j.role || j.title || "").toLowerCase().trim();
        return !appliedJobTitles.has(title);
      });
      if (combined.length === 0) setError("No jobs found. Try a different search term.");
      setJobs(combined);
    } catch { setError("Could not load jobs. Please check your internet connection."); }
    setLoading(false);
  }, []);

  useEffect(() => { if (screen === "jobs") fetchJobs(); }, [screen]);

  const filtered = jobs.filter(j => {
    if (activeSource === "india"  && j.source !== "adzuna")   return false;
    if (activeSource === "global" && j.source !== "remotive") return false;
    if (filters.location && !j.location?.toLowerCase().includes(filters.location.toLowerCase())) return false;
    if (filters.company  && !j.company?.toLowerCase().includes(filters.company.toLowerCase()))   return false;
    if (filters.type === "remote" && !j.remote) return false;
    if (filters.type === "onsite" &&  j.remote) return false;
    return true;
  });

  const indiaCount  = jobs.filter(j => j.source === "adzuna").length;
  const globalCount = jobs.filter(j => j.source === "remotive").length;
  const hireonCount = JSON.parse(localStorage.getItem("hireon_jobs"))?.length || 0;
  const paginated   = filtered.slice(0, page * JOBS_PER_PAGE);
  const hasActive   = filters.location || filters.company || filters.type !== "all";

  /* ── LANDING SCREEN ── */
  if (screen === "landing") return (
    <>
      <GlobalStyle />
      <div style={{ minHeight: "100vh", background: T.bg, display: "flex", flexDirection: "column", fontFamily: "'DM Sans',sans-serif", position: "relative", overflow: "hidden" }}>
        <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />
        <Topbar />

        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 24px", textAlign: "center", position: "relative", zIndex: 1 }}>

          {/* Badge */}
          <div className="jm-fade" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: T.surface, color: T.muted2, border: `1px solid ${T.border2}`, padding: "5px 16px", borderRadius: 20, fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 32 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.green, boxShadow: `0 0 8px ${T.green}`, display: "inline-block", animation: "pulse 2s infinite" }} />
            India + Global + HIREON · Live Listings
          </div>

          {/* Headline */}
          <h1 className="jm-fade" style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(2.4rem,6vw,4.4rem)", fontWeight: 900, lineHeight: 1.04, color: T.white, margin: "0 0 8px", animationDelay: "0.08s" }}>
            Find Your Dream Job.
          </h1>
          <h1 className="jm-fade" style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(2.4rem,6vw,4.4rem)", fontWeight: 900, fontStyle: "italic", lineHeight: 1.04, color: T.accent, margin: "0 0 28px", animationDelay: "0.15s" }}>
            Right Here, Right Now.
          </h1>

          {/* Description */}
          <p className="jm-fade" style={{ fontSize: "0.88rem", color: T.muted, maxWidth: 500, lineHeight: 1.85, margin: "0 0 50px", animationDelay: "0.22s" }}>
            Real listings from <span style={{ color: T.accent, fontWeight: 700 }}>India</span> via Adzuna,{" "}
            <span style={{ color: T.accent, fontWeight: 700 }}>global remote</span> opportunities,
            and <span style={{ color: T.green, fontWeight: 700 }}>HIREON recruiter jobs</span> matched to your skills.
          </p>

          {/* Stats strip */}
          <div className="jm-fade" style={{ display: "flex", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, overflow: "hidden", marginBottom: 52, animationDelay: "0.28s" }}>
            {[
              { val: "India",  label: "Adzuna Jobs",    color: T.accent },
              { val: "Global", label: "Remote Jobs",    color: T.accent },
              { val: "HIREON", label: "Matched to You", color: T.green },
            ].map(({ val, label, color }, i, arr) => (
              <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "16px 38px", gap: 4, borderRight: i < arr.length - 1 ? `1px solid ${T.border}` : "none" }}>
                <span style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.3rem", fontWeight: 900, color }}>{val}</span>
                <span style={{ fontSize: "0.62rem", fontWeight: 600, color: T.muted, letterSpacing: "0.1em", textTransform: "uppercase" }}>{label}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button
            className="jm-fade"
            onClick={() => setScreen("jobs")}
            style={{ background: T.white, color: "#080808", border: "none", borderRadius: 10, padding: "14px 52px", fontSize: "0.82rem", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", letterSpacing: "0.08em", textTransform: "uppercase", transition: "all 0.25s", animationDelay: "0.34s" }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 32px rgba(255,255,255,0.15)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}>
            Explore Jobs →
          </button>
        </div>
      </div>
    </>
  );

  /* ── JOBS PAGE ── */
  return (
    <>
      <GlobalStyle />
      <div style={{ minHeight: "100vh", background: T.bg, fontFamily: "'DM Sans',sans-serif", position: "relative" }}>
        <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }} />

        {/* Topbar with search */}
        <Topbar showSearch searchInput={searchInput} setSearchInput={setSearchInput} onSearch={fetchJobs} />

        {/* Source tabs */}
        <div style={{ display: "flex", padding: "0 32px", background: "rgba(8,8,8,0.9)", borderBottom: `1px solid ${T.border}`, backdropFilter: "blur(10px)", position: "sticky", top: 56, zIndex: 190, alignItems: "center" }}>
          {[
            { val: "all",    label: "All Jobs",     count: jobs.length,  color: T.accent },
            { val: "india",  label: "India",         count: indiaCount,   color: T.accent },
            { val: "global", label: "Global Remote", count: globalCount,  color: T.accent },
            { val: "hireon", label: "HIREON Jobs",   count: hireonCount,  color: T.green  },
          ].map(({ val, label, count, color }) => (
            <button key={val} onClick={() => { setActiveSource(val); setPage(1); }}
              style={{ background: "transparent", color: activeSource === val ? color : T.muted, border: "none", borderBottom: `2px solid ${activeSource === val ? color : "transparent"}`, padding: "13px 20px", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", letterSpacing: "0.04em", transition: "all 0.25s", display: "flex", alignItems: "center", gap: 7 }}>
              {label}
              <span style={{ background: activeSource === val ? `${color}18` : T.surface, color: activeSource === val ? color : T.muted, borderRadius: 20, padding: "1px 8px", fontSize: "0.65rem", fontWeight: 800, transition: "all 0.25s" }}>{count}</span>
            </button>
          ))}
          {activeSource !== "hireon" && (
            <span style={{ marginLeft: "auto", fontSize: "0.75rem", color: T.muted, paddingRight: 4 }}>
              <span style={{ color: T.white, fontWeight: 700 }}>{filtered.length}</span>&nbsp;results
            </span>
          )}
        </div>

        {/* Layout */}
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "26px 24px", display: "flex", gap: 22, position: "relative", zIndex: 1, alignItems: "flex-start" }}>

          {/* ── SIDEBAR ── */}
          {activeSource !== "hireon" && (
            <div style={{ width: 240, flexShrink: 0, position: "sticky", top: 112, display: "flex", flexDirection: "column", gap: 12 }}>

              {/* Filter card */}
              <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, overflow: "hidden" }}>
                <div style={{ padding: "13px 18px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: "'Playfair Display',serif", color: T.white, fontSize: "0.72rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.15em" }}>Filters</span>
                  {hasActive && (
                    <button onClick={() => setFilters({ location: "", type: "all", company: "" })}
                      style={{ background: `${T.red}10`, border: `1px solid ${T.red}28`, color: T.red, fontSize: "0.62rem", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", letterSpacing: "0.06em", padding: "2px 9px", borderRadius: 5, transition: "all 0.2s", textTransform: "uppercase" }}>
                      Clear
                    </button>
                  )}
                </div>
                <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 18 }}>

                  {/* Company */}
                  <div>
                    <label style={{ color: T.muted, fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", display: "block", marginBottom: 8 }}>Company</label>
                    <input placeholder="e.g. Google, TCS..."
                      value={filters.company}
                      onChange={e => setFilters(f => ({ ...f, company: e.target.value }))}
                      style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: `1px solid ${T.border}`, borderRadius: 8, padding: "8px 12px", color: T.white, fontSize: "0.78rem", transition: "all 0.2s" }}
                      onFocus={e => e.currentTarget.style.borderColor = T.border2}
                      onBlur={e => e.currentTarget.style.borderColor = T.border} />
                  </div>

                  {/* Location */}
                  <div>
                    <label style={{ color: T.muted, fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", display: "block", marginBottom: 8 }}>Location</label>
                    <input placeholder="e.g. Bangalore..."
                      value={filters.location}
                      onChange={e => setFilters(f => ({ ...f, location: e.target.value }))}
                      style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: `1px solid ${T.border}`, borderRadius: 8, padding: "8px 12px", color: T.white, fontSize: "0.78rem", transition: "all 0.2s" }}
                      onFocus={e => e.currentTarget.style.borderColor = T.border2}
                      onBlur={e => e.currentTarget.style.borderColor = T.border} />
                  </div>

                  <div style={{ height: 1, background: T.border }} />

                  {/* Work type */}
                  <div>
                    <label style={{ color: T.muted, fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", display: "block", marginBottom: 8 }}>Work Type</label>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {[
                        { val: "all",    label: "All Types",    dot: T.muted  },
                        { val: "remote", label: "Remote Only",  dot: T.green  },
                        { val: "onsite", label: "On-site Only", dot: T.yellow },
                      ].map(({ val, label, dot }) => {
                        const active = filters.type === val;
                        return (
                          <button key={val} onClick={() => setFilters(f => ({ ...f, type: val }))}
                            style={{ display: "flex", alignItems: "center", gap: 9, width: "100%", background: active ? `${dot}10` : T.surface, color: active ? T.white : T.muted, border: `1px solid ${active ? dot + "30" : T.border}`, borderRadius: 8, padding: "8px 12px", fontSize: "0.75rem", fontWeight: active ? 700 : 500, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", textAlign: "left", transition: "all 0.22s" }}>
                            <div style={{ width: 7, height: 7, borderRadius: "50%", background: active ? dot : T.border, flexShrink: 0, transition: "all 0.22s" }} />
                            {label}
                            {active && <span style={{ marginLeft: "auto", color: dot, fontSize: "0.75rem", fontWeight: 900 }}>✓</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div style={{ height: 1, background: T.border }} />

                  {/* Quick search */}
                  <div>
                    <label style={{ color: T.muted, fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", display: "block", marginBottom: 8 }}>Quick Search</label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                      {["React", "Python", "Java", "Node.js", "AWS", "ML", "DevOps", "Flutter", "Go", "SQL"].map(chip => (
                        <button key={chip} onClick={() => { setSearchInput(chip); fetchJobs(chip); }}
                          style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 7, padding: "4px 10px", color: T.muted, fontSize: "0.68rem", fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", transition: "all 0.2s" }}
                          onMouseEnter={e => { e.currentTarget.style.color = T.accent; e.currentTarget.style.borderColor = `${T.accent}40`; e.currentTarget.style.background = `${T.accent}0a`; }}
                          onMouseLeave={e => { e.currentTarget.style.color = T.muted; e.currentTarget.style.borderColor = T.border; e.currentTarget.style.background = T.surface; }}>
                          {chip}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Overview card */}
              <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, overflow: "hidden" }}>
                <div style={{ padding: "13px 18px", borderBottom: `1px solid ${T.border}` }}>
                  <span style={{ fontFamily: "'Playfair Display',serif", color: T.white, fontSize: "0.72rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.15em" }}>Overview</span>
                </div>
                <div style={{ padding: "14px 18px" }}>
                  {[
                    { label: "India Jobs",    val: indiaCount,      color: T.accent },
                    { label: "Global Remote", val: globalCount,     color: T.accent },
                    { label: "Showing Now",   val: filtered.length, color: T.green },
                  ].map(({ label, val, color }) => (
                    <div key={label} style={{ marginBottom: 14 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                        <span style={{ color: T.muted, fontSize: "0.72rem" }}>{label}</span>
                        <span style={{ fontFamily: "'Playfair Display',serif", color, fontSize: "0.85rem", fontWeight: 900 }}>{val}</span>
                      </div>
                      <div style={{ background: T.border, borderRadius: 99, height: 3, overflow: "hidden" }}>
                        <div style={{ width: jobs.length > 0 ? `${Math.min((val / Math.max(jobs.length, 1)) * 100, 100)}%` : "0%", height: "100%", background: `linear-gradient(90deg,${color},${color}88)`, borderRadius: 99, transition: "width 1s cubic-bezier(0.16,1,0.3,1)" }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── JOB LIST ── */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 9 }}>

            {activeSource === "hireon" && <HireonJobsTab />}

            {activeSource !== "hireon" && loading && (
              <div style={{ textAlign: "center", padding: "80px 0" }}>
                <div style={{ fontFamily: "'Playfair Display',serif", color: T.white, fontWeight: 700, fontSize: "0.9rem", letterSpacing: "0.04em", marginBottom: 6 }}>
                  Fetching live jobs...
                </div>
                <div style={{ color: T.muted, fontSize: "0.75rem", marginBottom: 18 }}>Connecting to Adzuna India &amp; Remotive</div>
                <div style={{ background: T.border, borderRadius: 99, height: 3, overflow: "hidden", maxWidth: 200, margin: "0 auto" }}>
                  <div style={{ height: "100%", width: "50%", background: `linear-gradient(90deg,${T.accent},${T.white},${T.green})`, borderRadius: 99, animation: "shimmer 1.8s ease-in-out infinite" }} />
                </div>
              </div>
            )}

            {activeSource !== "hireon" && error && !loading && (
              <div style={{ background: `${T.red}07`, border: `1px solid ${T.red}22`, borderRadius: 12, padding: "16px 20px", color: T.red, fontSize: "0.82rem" }}>
                {error}
              </div>
            )}

            {activeSource !== "hireon" && !loading && !error && paginated.map((job, i) => (
              <JobCard key={job.id} job={job} index={i} />
            ))}

            {activeSource !== "hireon" && !loading && paginated.length < filtered.length && (
              <button onClick={() => setPage(p => p + 1)}
                style={{ background: "transparent", color: T.muted2, border: `1px solid ${T.border2}`, borderRadius: 12, padding: "14px", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", letterSpacing: "0.06em", textTransform: "uppercase", transition: "all 0.25s", marginTop: 4 }}
                onMouseEnter={e => { e.currentTarget.style.color = T.white; e.currentTarget.style.borderColor = T.white; }}
                onMouseLeave={e => { e.currentTarget.style.color = T.muted2; e.currentTarget.style.borderColor = T.border2; }}>
                Load More — {filtered.length - paginated.length} remaining
              </button>
            )}

            {activeSource !== "hireon" && !loading && !error && filtered.length === 0 && (
              <div style={{ textAlign: "center", padding: "80px 0" }}>
                <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: "0.95rem", color: T.muted2, marginBottom: 8 }}>
                  No jobs match your filters
                </div>
                <div style={{ fontSize: "0.75rem", color: T.muted, marginBottom: 20 }}>Try clearing filters or a different search term</div>
                <button onClick={() => { setFilters({ location: "", type: "all", company: "" }); setActiveSource("all"); }}
                  style={{ background: "transparent", color: T.accent, border: `1px solid ${T.accent}30`, borderRadius: 9, padding: "8px 20px", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", letterSpacing: "0.07em", textTransform: "uppercase" }}>
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};