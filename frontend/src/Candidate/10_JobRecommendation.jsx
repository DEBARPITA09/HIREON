import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { HireonJobsTab } from "./HireonJobsTab";

const ADZUNA_APP_ID  = import.meta.env.VITE_ADZUNA_APP_ID;
const ADZUNA_API_KEY = import.meta.env.VITE_ADZUNA_API_KEY;

const KNOWN_DOMAINS = {
  "google": "google.com", "amazon": "amazon.com", "microsoft": "microsoft.com",
  "meta": "meta.com", "apple": "apple.com", "flipkart": "flipkart.com",
  "infosys": "infosys.com", "tcs": "tcs.com", "wipro": "wipro.com",
  "accenture": "accenture.com", "ibm": "ibm.com", "oracle": "oracle.com",
  "adobe": "adobe.com", "samsung": "samsung.com", "intel": "intel.com",
  "cisco": "cisco.com", "capgemini": "capgemini.com", "cognizant": "cognizant.com",
  "hcl": "hcltech.com", "hcltech": "hcltech.com",
  "tech mahindra": "techmahindra.com", "techmahindra": "techmahindra.com",
  "mphasis": "mphasis.com", "mindtree": "mindtree.com", "swiggy": "swiggy.com",
  "zomato": "zomato.com", "paytm": "paytm.com", "ola": "olacabs.com",
  "razorpay": "razorpay.com", "freshworks": "freshworks.com", "zoho": "zoho.com",
  "byju": "byjus.com", "byjus": "byjus.com", "unacademy": "unacademy.com",
  "meesho": "meesho.com", "phonepe": "phonepe.com", "cred": "cred.club",
  "zerodha": "zerodha.com", "nykaa": "nykaa.com", "myntra": "myntra.com",
  "uber": "uber.com", "netflix": "netflix.com", "spotify": "spotify.com",
  "twitter": "twitter.com", "linkedin": "linkedin.com", "salesforce": "salesforce.com",
  "atlassian": "atlassian.com", "slack": "slack.com", "shopify": "shopify.com",
  "stripe": "stripe.com", "airbnb": "airbnb.com",
  "goldman sachs": "goldmansachs.com", "goldman": "goldmansachs.com",
  "jp morgan": "jpmorgan.com", "jpmorgan": "jpmorgan.com",
  "deloitte": "deloitte.com", "pwc": "pwc.com", "kpmg": "kpmg.com",
};

const getDomain = (companyName) => {
  if (!companyName) return null;
  const lower = companyName.toLowerCase().trim();
  for (const [key, domain] of Object.entries(KNOWN_DOMAINS)) {
    if (lower.includes(key)) return domain;
  }
  const cleaned = lower
    .replace(/\s+(private|pvt|ltd|limited|inc|llc|llp|technologies|tech|solutions|services|group|india|infotech|software|systems|global|consulting|corporation|corp|co)\.?\s*$/gi, "")
    .trim().replace(/\s+/g, "");
  return cleaned.length > 1 ? `${cleaned}.com` : null;
};

function GridCanvas() {
  const ref = useRef();
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const ctx = el.getContext("2d");
    const resize = () => { el.width = window.innerWidth; el.height = window.innerHeight; };
    resize();
    let t = 0, raf;
    const draw = () => {
      const W = el.width, H = el.height;
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = "rgba(255,255,255,0.022)"; ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 60) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = 0; y < H; y += 60) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
      const cx = W * 0.3, cy = H * 0.4, r = 420 + Math.sin(t) * 40;
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0, "rgba(79,142,247,0.04)"); g.addColorStop(1, "transparent");
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      const cx2 = W * 0.72, cy2 = H * 0.65, r2 = 320 + Math.cos(t) * 28;
      const g2 = ctx.createRadialGradient(cx2, cy2, 0, cx2, cy2, r2);
      g2.addColorStop(0, "rgba(0,212,170,0.022)"); g2.addColorStop(1, "transparent");
      ctx.fillStyle = g2; ctx.fillRect(0, 0, W, H);
      t += 0.007; raf = requestAnimationFrame(draw);
    };
    draw();
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }} />;
}

function Particles() {
  const ps = Array.from({ length: 16 }, (_, i) => ({
    id: i, left: `${(i * 19 + 7) % 100}%`, top: `${(i * 27 + 11) % 100}%`,
    size: (i % 3) + 1, dur: (i % 5) + 7, delay: i % 5,
    opacity: 0.06 + (i % 3) * 0.04,
  }));
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      {ps.map(p => (
        <div key={p.id} style={{ position: "absolute", left: p.left, top: p.top, width: p.size, height: p.size, borderRadius: "50%", background: p.id % 3 === 0 ? "#4f8ef7" : p.id % 3 === 1 ? "#00d4aa" : "#ffffff", opacity: p.opacity, animation: `ptFloat ${p.dur}s ${p.delay}s infinite ease-in-out` }} />
      ))}
      <style>{`@keyframes ptFloat{0%,100%{transform:translateY(0)scale(1);}50%{transform:translateY(-26px)scale(1.4);}}`}</style>
    </div>
  );
}

function CompanyLogo({ company, size = 48, isIndia }) {
  const [srcIndex, setSrcIndex] = useState(0);
  const domain = getDomain(company);
  const initial = company?.[0]?.toUpperCase() || "?";
  const sources = domain ? [
    `https://logo.clearbit.com/${domain}`,
    `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
    `https://icon.horse/icon/${domain}`,
  ] : [];
  const bgColor   = isIndia ? "rgba(255,153,0,0.07)"  : "rgba(79,142,247,0.07)";
  const bdColor   = isIndia ? "rgba(255,153,0,0.15)"  : "rgba(79,142,247,0.15)";
  const textColor = isIndia ? "#ff9900" : "#4f8ef7";
  const showLogo  = sources.length > 0 && srcIndex < sources.length;
  return (
    <div style={{ width: size, height: size, borderRadius: 13, flexShrink: 0, background: bgColor, border: `1px solid ${bdColor}`, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {showLogo ? (
        <img src={sources[srcIndex]} alt={company} onError={() => setSrcIndex(i => i + 1)}
          style={{ width: size - 12, height: size - 12, objectFit: "contain", display: "block" }} />
      ) : (
        <span style={{ color: textColor, fontSize: Math.round(size * 0.38), fontWeight: 900, fontFamily: "'Syne',Georgia,serif" }}>{initial}</span>
      )}
    </div>
  );
}

function JobCard({ job, index }) {
  const [hovered, setHovered] = useState(false);
  const isIndia = job.source === "adzuna";
  const salary  = job.salary_min && job.salary_max
    ? `₹${Math.round(job.salary_min / 100000)}L – ₹${Math.round(job.salary_max / 100000)}L`
    : job.salary || null;
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ background: hovered ? "#040912" : "#03060c", border: `1px solid ${hovered ? "rgba(79,142,247,0.22)" : "rgba(255,255,255,0.06)"}`, borderRadius: 18, padding: "22px 26px", transition: "all 0.32s cubic-bezier(0.16,1,0.3,1)", transform: hovered ? "translateX(5px)" : "translateX(0)", boxShadow: hovered ? "0 8px 32px rgba(0,0,0,0.3)" : "none", animation: `cardIn 0.5s ${Math.min(index, 10) * 0.06}s both cubic-bezier(0.16,1,0.3,1)`, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: hovered ? "linear-gradient(180deg,#4f8ef7,#00d4aa)" : "transparent", borderRadius: "3px 0 0 3px", transition: "all 0.3s ease" }} />
      <div style={{ position: "absolute", top: 0, left: 26, right: 26, height: 1, background: `linear-gradient(90deg,transparent,${isIndia ? "rgba(255,153,0,0.18)" : "rgba(79,142,247,0.14)"},transparent)` }} />
      <div style={{ display: "flex", alignItems: "flex-start", gap: 18, flexWrap: "wrap" }}>
        <CompanyLogo company={job.company} size={48} isIndia={isIndia} />
        <div style={{ flex: 1, minWidth: 220 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 7 }}>
            <h3 style={{ color: "#f0f4ff", fontSize: 15, fontWeight: 700, fontFamily: "'Syne',Georgia,serif", letterSpacing: "-0.2px", margin: 0 }}>{job.title}</h3>
            {isIndia && <span style={{ background: "rgba(255,153,0,0.09)", color: "#ff9900", border: "1px solid rgba(255,153,0,0.2)", borderRadius: 6, padding: "2px 9px", fontSize: 10, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase" }}>India</span>}
            {job.remote && <span style={{ background: "rgba(0,212,170,0.08)", color: "#00d4aa", border: "1px solid rgba(0,212,170,0.18)", borderRadius: 6, padding: "2px 9px", fontSize: 10, fontWeight: 700, textTransform: "uppercase" }}>Remote</span>}
            {job.jobType && <span style={{ background: "rgba(255,255,255,0.04)", color: "#64748b", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 6, padding: "2px 9px", fontSize: 10, fontWeight: 600 }}>{job.jobType}</span>}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", marginBottom: 10 }}>
            <span style={{ color: "#94a3b8", fontSize: 13, fontWeight: 600 }}>{job.company}</span>
            {job.location && <span style={{ color: "#475569", fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}><span style={{ color: "#ef4444", fontSize: 11 }}>📍</span>{job.location}</span>}
            {salary && <span style={{ color: "#00d4aa", fontSize: 12, fontWeight: 700, fontFamily: "'Syne',Georgia,serif" }}>{salary}</span>}
            {job.date && <span style={{ color: "#334155", fontSize: 11 }}>{new Date(job.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>}
          </div>
          {job.tags?.length > 0 && (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {job.tags.slice(0, 5).map(tag => (
                <span key={tag} style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.055)", borderRadius: 6, padding: "2px 10px", color: "#475569", fontSize: 11 }}>{tag}</span>
              ))}
            </div>
          )}
        </div>
        <div style={{ flexShrink: 0 }}>
          <a href={job.url} target="_blank" rel="noopener noreferrer"
            style={{ background: hovered ? "#ffffff" : "#f0f4ff", color: "#05080f", border: "none", borderRadius: 11, padding: "11px 26px", fontSize: 12, fontWeight: 800, cursor: "pointer", fontFamily: "'Syne',Georgia,serif", letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none", display: "block", whiteSpace: "nowrap", transition: "all 0.25s", boxShadow: hovered ? "0 4px 20px rgba(240,244,255,0.15)" : "none" }}>
            Apply Now →
          </a>
        </div>
      </div>
    </div>
  );
}

export const JobMatching = () => {
  const navigate = useNavigate();
  const [screen, setScreen]             = useState("landing");
  const [jobs, setJobs]                 = useState([]);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState("");
  const [searchInput, setSearchInput]   = useState("");
  const [activeSource, setActiveSource] = useState("all");
  const [filters, setFilters]           = useState({ location: "", type: "all", company: "" });
  const [page, setPage]                 = useState(1);
  const JOBS_PER_PAGE = 12;

  const fetchAdzuna = async (term = "software engineer") => {
    const results = [];
    try {
      const url = `https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${ADZUNA_APP_ID}&app_key=${ADZUNA_API_KEY}&results_per_page=50&what=${encodeURIComponent(term)}&content-type=application/json`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Adzuna failed");
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
    } catch (e) { console.warn("Adzuna:", e); }
    return results;
  };

  const fetchRemotive = async (term = "") => {
    const results = [];
    try {
      let url = "https://remotive.com/api/remote-jobs?limit=50";
      if (term) url += `&search=${encodeURIComponent(term)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Remotive failed");
      const data = await res.json();
      (data.jobs || []).forEach(j => results.push({
        id: `rm_${j.id}`, title: j.title, company: j.company_name,
        location: j.candidate_required_location || "Remote — Worldwide",
        salary: j.salary, date: j.publication_date,
        url: j.url, tags: j.tags || [],
        jobType: j.job_type || "Full Time",
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
      const combined = [...india, ...global];
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

  /* ── LANDING ── */
  if (screen === "landing") return (
    <div style={{ minHeight: "100vh", background: "#05080f", display: "flex", flexDirection: "column", fontFamily: "'Outfit','Segoe UI',sans-serif", position: "relative", overflow: "hidden" }}>
      <GridCanvas /><Particles />
      <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 48px", background: "rgba(5,8,15,0.85)", borderBottom: "1px solid rgba(255,255,255,0.055)", position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(18px)" }}>
        <button onClick={() => navigate("/Candidate/06_MainCand")}
          style={{ background: "transparent", color: "#64748b", border: "1px solid rgba(255,255,255,0.08)", padding: "7px 16px", borderRadius: 8, fontFamily: "inherit", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}
          onMouseEnter={e => { e.currentTarget.style.color = "#4f8ef7"; e.currentTarget.style.borderColor = "rgba(79,142,247,0.3)"; }}
          onMouseLeave={e => { e.currentTarget.style.color = "#64748b"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}>← Back</button>
        <div style={{ fontWeight: 800, fontSize: 18 }}><span style={{ color: "#f0f4ff" }}>HIRE</span><span style={{ color: "#4f8ef7" }}>ON</span></div>
        <div style={{ background: "rgba(79,142,247,0.07)", border: "1px solid rgba(79,142,247,0.18)", borderRadius: 20, padding: "4px 14px", color: "#4f8ef7", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>Job Matching</div>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "64px 24px", textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(79,142,247,0.07)", color: "#4f8ef7", border: "1px solid rgba(79,142,247,0.18)", padding: "5px 16px", borderRadius: 20, fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 28 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#00d4aa", boxShadow: "0 0 8px #00d4aa", display: "inline-block", animation: "pulse 2s infinite" }} />
          India + Global + HIREON · Live Job Listings
        </div>
        <h1 style={{ fontSize: "clamp(34px,5vw,66px)", fontWeight: 800, lineHeight: 1.06, letterSpacing: "-2px", margin: "0 0 18px", color: "#f0f4ff", fontFamily: "'Syne',Georgia,serif" }}>
          Find Your Dream Job.<br />
          <span style={{ fontStyle: "italic", fontWeight: 300, color: "rgba(240,244,255,0.35)", fontFamily: "Georgia,'Times New Roman',serif", letterSpacing: "-1px" }}>Right Here, Right Now.</span>
        </h1>
        <p style={{ fontSize: 15, color: "#475569", maxWidth: 500, lineHeight: 1.85, margin: "0 0 48px" }}>
          Real job listings from <span style={{ color: "#ff9900", fontWeight: 700 }}>India</span> via Adzuna, <span style={{ color: "#4f8ef7", fontWeight: 700 }}>global remote</span> opportunities, and <span style={{ color: "#00d4aa", fontWeight: 700 }}>HIREON recruiter jobs</span> matched to your skills.
        </p>
        <div style={{ display: "flex", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.055)", borderRadius: 14, overflow: "hidden", marginBottom: 52 }}>
          {[
            { val: "India",  label: "Adzuna Jobs",    color: "#ff9900" },
            { val: "Global", label: "Remote Jobs",    color: "#4f8ef7" },
            { val: "HIREON", label: "Matched to You", color: "#00d4aa" },
          ].map(({ val, label, color }, i, arr) => (
            <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "18px 38px", gap: 5, borderRight: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.055)" : "none" }}>
              <span style={{ fontSize: 18, fontWeight: 800, color, fontFamily: "'Syne',Georgia,serif" }}>{val}</span>
              <span style={{ fontSize: 11, color: "#334155", textTransform: "uppercase", letterSpacing: "0.07em" }}>{label}</span>
            </div>
          ))}
        </div>
        <button onClick={() => setScreen("jobs")}
          style={{ background: "#f0f4ff", color: "#05080f", border: "none", borderRadius: 12, padding: "15px 52px", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "'Syne',Georgia,serif", letterSpacing: "0.14em", textTransform: "uppercase", transition: "all 0.25s" }}
          onMouseEnter={e => { e.currentTarget.style.background = "#ffffff"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(240,244,255,0.14)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "#f0f4ff"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}>
          EXPLORE JOBS →
        </button>
      </div>
      <style>{`@keyframes pulse{0%,100%{transform:scale(1);opacity:1;}50%{transform:scale(1.6);opacity:0.4;}}`}</style>
    </div>
  );

  /* ── JOBS PAGE ── */
  return (
    <div style={{ minHeight: "100vh", background: "#05080f", fontFamily: "'Outfit','Segoe UI',sans-serif", position: "relative" }}>
      <GridCanvas />

      {/* Topbar */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 32px", background: "rgba(5,8,15,0.92)", borderBottom: "1px solid rgba(255,255,255,0.055)", position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(18px)", flexWrap: "wrap" }}>
        <button onClick={() => navigate("/Candidate/06_MainCand")}
          style={{ background: "transparent", color: "#64748b", border: "1px solid rgba(255,255,255,0.08)", padding: "7px 14px", borderRadius: 8, fontFamily: "inherit", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}
          onMouseEnter={e => { e.currentTarget.style.color = "#4f8ef7"; }}
          onMouseLeave={e => { e.currentTarget.style.color = "#64748b"; }}>← Dashboard</button>
        <div style={{ fontWeight: 800, fontSize: 17 }}><span style={{ color: "#f0f4ff" }}>HIRE</span><span style={{ color: "#4f8ef7" }}>ON</span></div>
        <div style={{ flex: 1, maxWidth: 420 }}>
          <input placeholder="Search roles, skills, companies..."
            value={searchInput} onChange={e => setSearchInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") fetchJobs(searchInput); }}
            style={{ width: "100%", background: "#020508", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "9px 16px", color: "#e2e8f0", fontFamily: "'Outfit',sans-serif", fontSize: 13, outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" }}
            onFocus={e => { e.currentTarget.style.borderColor = "rgba(79,142,247,0.4)"; }}
            onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; }} />
        </div>
        <button onClick={() => fetchJobs(searchInput)}
          style={{ background: "#f0f4ff", color: "#05080f", border: "none", borderRadius: 10, padding: "9px 22px", fontSize: 12, fontWeight: 800, cursor: "pointer", fontFamily: "'Syne',Georgia,serif", letterSpacing: "0.1em", textTransform: "uppercase", transition: "all 0.2s" }}
          onMouseEnter={e => { e.currentTarget.style.background = "#ffffff"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "#f0f4ff"; }}>Search</button>
        <div style={{ marginLeft: "auto", color: "#64748b", fontSize: 12, fontWeight: 600 }}>
          {activeSource !== "hireon" && <><span style={{ color: "#f0f4ff", fontWeight: 800 }}>{filtered.length}</span> results</>}
        </div>
      </div>

      {/* Source tabs */}
      <div style={{ display: "flex", padding: "0 32px", background: "rgba(3,6,12,0.85)", borderBottom: "1px solid rgba(255,255,255,0.045)", backdropFilter: "blur(10px)" }}>
        {[
          { val: "all",    label: "All Jobs",     count: jobs.length,  color: "#e2e8f0" },
          { val: "india",  label: "India",         count: indiaCount,   color: "#ff9900" },
          { val: "global", label: "Global Remote", count: globalCount,  color: "#4f8ef7" },
          { val: "hireon", label: "HIREON Jobs",   count: hireonCount,  color: "#00d4aa" },
        ].map(({ val, label, count, color }) => (
          <button key={val} onClick={() => { setActiveSource(val); setPage(1); }}
            style={{ background: "transparent", color: activeSource === val ? color : "#475569", border: "none", borderBottom: `2px solid ${activeSource === val ? color : "transparent"}`, padding: "13px 22px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Syne',Georgia,serif", letterSpacing: "0.04em", transition: "all 0.25s", display: "flex", alignItems: "center", gap: 8 }}>
            {label}
            <span style={{ background: activeSource === val ? `${color}18` : "rgba(255,255,255,0.05)", color: activeSource === val ? color : "#334155", borderRadius: 20, padding: "1px 9px", fontSize: 11, fontWeight: 800, transition: "all 0.25s" }}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* Layout */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 24px", display: "flex", gap: 24, position: "relative", zIndex: 1, alignItems: "flex-start" }}>

        {/* SIDEBAR — hidden on HIREON tab */}
        {activeSource !== "hireon" && (
          <div style={{ width: 248, flexShrink: 0, position: "sticky", top: 110, display: "flex", flexDirection: "column", gap: 14 }}>

            <div style={{ background: "linear-gradient(160deg,#060b14 0%,#03060c 100%)", border: "1px solid rgba(79,142,247,0.12)", borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)" }}>
              <div style={{ padding: "16px 20px 14px", background: "linear-gradient(135deg,rgba(79,142,247,0.07) 0%,rgba(0,212,170,0.03) 100%)", borderBottom: "1px solid rgba(255,255,255,0.055)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ color: "#ffffff", fontSize: 13, fontWeight: 900, fontFamily: "'Syne',Georgia,serif", letterSpacing: "0.18em", textTransform: "uppercase" }}>FILTERS</span>
                {hasActive && (
                  <button onClick={() => setFilters({ location: "", type: "all", company: "" })}
                    style={{ background: "rgba(239,68,68,0.09)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", fontSize: 10, fontWeight: 700, cursor: "pointer", fontFamily: "'Syne',Georgia,serif", letterSpacing: "0.08em", padding: "3px 11px", borderRadius: 6, transition: "all 0.2s", textTransform: "uppercase" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.16)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(239,68,68,0.09)"; }}>Clear</button>
                )}
              </div>
              <div style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: 20 }}>
                <div>
                  <label style={{ color: "#cbd5e1", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", display: "block", marginBottom: 9 }}>Company</label>
                  <input placeholder="e.g. Google, TCS, Infosys..." value={filters.company}
                    onChange={e => setFilters(f => ({ ...f, company: e.target.value }))}
                    style={{ width: "100%", background: "rgba(2,5,8,0.8)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "9px 14px", color: "#f0f4ff", fontFamily: "'Outfit',sans-serif", fontSize: 12, outline: "none", boxSizing: "border-box", transition: "all 0.25s" }}
                    onFocus={e => { e.currentTarget.style.borderColor = "rgba(79,142,247,0.5)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(79,142,247,0.08)"; }}
                    onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.boxShadow = "none"; }} />
                </div>
                <div>
                  <label style={{ color: "#cbd5e1", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", display: "block", marginBottom: 9 }}>Location</label>
                  <input placeholder="e.g. Bangalore, Mumbai..." value={filters.location}
                    onChange={e => setFilters(f => ({ ...f, location: e.target.value }))}
                    style={{ width: "100%", background: "rgba(2,5,8,0.8)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "9px 14px", color: "#f0f4ff", fontFamily: "'Outfit',sans-serif", fontSize: 12, outline: "none", boxSizing: "border-box", transition: "all 0.25s" }}
                    onFocus={e => { e.currentTarget.style.borderColor = "rgba(239,68,68,0.45)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(239,68,68,0.07)"; }}
                    onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.boxShadow = "none"; }} />
                </div>
                <div style={{ height: 1, background: "rgba(255,255,255,0.04)", margin: "-4px 0" }} />
                <div>
                  <label style={{ color: "#cbd5e1", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", display: "block", marginBottom: 10 }}>Work Type</label>
                  <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                    {[{ val: "all", label: "All Types", dot: "#64748b" }, { val: "remote", label: "Remote Only", dot: "#00d4aa" }, { val: "onsite", label: "On-site Only", dot: "#f59e0b" }].map(({ val, label, dot }) => {
                      const active = filters.type === val;
                      return (
                        <button key={val} onClick={() => setFilters(f => ({ ...f, type: val }))}
                          style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", background: active ? `${dot}10` : "rgba(255,255,255,0.02)", color: active ? "#ffffff" : "#64748b", border: `1px solid ${active ? `${dot}38` : "rgba(255,255,255,0.06)"}`, borderRadius: 10, padding: "9px 13px", fontSize: 12, fontWeight: active ? 700 : 500, cursor: "pointer", fontFamily: "'Outfit',sans-serif", textAlign: "left", transition: "all 0.22s", boxShadow: active ? `0 2px 14px ${dot}20` : "none" }}>
                          <div style={{ width: 8, height: 8, borderRadius: "50%", background: active ? dot : "rgba(255,255,255,0.12)", flexShrink: 0, transition: "all 0.22s", boxShadow: active ? `0 0 8px ${dot}` : "none" }} />
                          {label}
                          {active && <span style={{ marginLeft: "auto", color: dot, fontSize: 12, fontWeight: 900 }}>✓</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div style={{ height: 1, background: "rgba(255,255,255,0.04)", margin: "-4px 0" }} />
                <div>
                  <label style={{ color: "#cbd5e1", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", display: "block", marginBottom: 10 }}>Quick Search</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {["React", "Python", "Java", "Node.js", "AWS", "ML", "DevOps", "Flutter", "Go", "SQL"].map(chip => (
                      <button key={chip} onClick={() => { setSearchInput(chip); fetchJobs(chip); }}
                        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "5px 11px", color: "#94a3b8", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "'Outfit',sans-serif", transition: "all 0.2s" }}
                        onMouseEnter={e => { e.currentTarget.style.color = "#4f8ef7"; e.currentTarget.style.borderColor = "rgba(79,142,247,0.32)"; e.currentTarget.style.background = "rgba(79,142,247,0.07)"; e.currentTarget.style.transform = "scale(1.06)"; }}
                        onMouseLeave={e => { e.currentTarget.style.color = "#94a3b8"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.transform = "scale(1)"; }}>
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ background: "linear-gradient(160deg,#060b14 0%,#03060c 100%)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03)" }}>
              <div style={{ padding: "16px 20px 14px", borderBottom: "1px solid rgba(255,255,255,0.045)" }}>
                <span style={{ color: "#ffffff", fontSize: 13, fontWeight: 900, fontFamily: "'Syne',Georgia,serif", letterSpacing: "0.18em", textTransform: "uppercase" }}>OVERVIEW</span>
              </div>
              <div style={{ padding: "16px 20px" }}>
                {[
                  { label: "India Jobs",    val: indiaCount,      color: "#ff9900", bar: indiaCount },
                  { label: "Global Remote", val: globalCount,     color: "#4f8ef7", bar: globalCount },
                  { label: "Showing Now",   val: filtered.length, color: "#00d4aa", bar: filtered.length },
                ].map(({ label, val, color, bar }) => (
                  <div key={label} style={{ marginBottom: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
                      <span style={{ color: "#94a3b8", fontSize: 12 }}>{label}</span>
                      <span style={{ color, fontSize: 14, fontWeight: 900, fontFamily: "'Syne',Georgia,serif" }}>{val}</span>
                    </div>
                    <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 99, height: 3, overflow: "hidden" }}>
                      <div style={{ width: jobs.length > 0 ? `${Math.min((bar / Math.max(jobs.length, 1)) * 100, 100)}%` : "0%", height: "100%", background: `linear-gradient(90deg,${color},${color}88)`, borderRadius: 99, transition: "width 1s cubic-bezier(0.16,1,0.3,1)", boxShadow: `0 0 6px ${color}60` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* JOBS LIST */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>

          {/* HIREON JOBS TAB */}
          {activeSource === "hireon" && <HireonJobsTab />}

          {/* EXTERNAL JOBS TABS */}
          {activeSource !== "hireon" && loading && (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <div style={{ color: "#f0f4ff", fontWeight: 700, fontSize: 14, fontFamily: "'Syne',Georgia,serif", letterSpacing: "0.06em", marginBottom: 6 }}>Fetching live jobs...</div>
              <div style={{ color: "#475569", fontSize: 12, marginBottom: 20 }}>Connecting to Adzuna India &amp; Remotive</div>
              <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 99, height: 3, overflow: "hidden", maxWidth: 200, margin: "0 auto" }}>
                <div style={{ height: "100%", background: "linear-gradient(90deg,#ff9900,#4f8ef7,#00d4aa)", borderRadius: 99, animation: "shimmer 1.8s ease-in-out infinite" }} />
              </div>
            </div>
          )}

          {activeSource !== "hireon" && error && !loading && (
            <div style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.14)", borderRadius: 14, padding: "18px 22px", color: "#f87171", fontSize: 13 }}>{error}</div>
          )}

          {activeSource !== "hireon" && !loading && !error && paginated.map((job, i) => (
            <JobCard key={job.id} job={job} index={i} />
          ))}

          {activeSource !== "hireon" && !loading && paginated.length < filtered.length && (
            <button onClick={() => setPage(p => p + 1)}
              style={{ background: "transparent", color: "#4f8ef7", border: "1px solid rgba(79,142,247,0.2)", borderRadius: 14, padding: "14px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Syne',Georgia,serif", letterSpacing: "0.1em", textTransform: "uppercase", transition: "all 0.25s", marginTop: 4 }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(79,142,247,0.05)"; e.currentTarget.style.borderColor = "rgba(79,142,247,0.35)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(79,142,247,0.2)"; }}>
              Load More — {filtered.length - paginated.length} remaining
            </button>
          )}

          {activeSource !== "hireon" && !loading && !error && filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <div style={{ fontFamily: "'Syne',Georgia,serif", fontWeight: 800, fontSize: 15, letterSpacing: "0.04em", color: "#475569", marginBottom: 10 }}>No jobs match your filters</div>
              <div style={{ fontSize: 12, color: "#334155", marginBottom: 22 }}>Try clearing filters or a different search</div>
              <button onClick={() => { setFilters({ location: "", type: "all", company: "" }); setActiveSource("all"); }}
                style={{ background: "transparent", color: "#4f8ef7", border: "1px solid rgba(79,142,247,0.22)", borderRadius: 10, padding: "9px 22px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Syne',Georgia,serif", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes cardIn{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}
        @keyframes shimmer{0%{margin-left:-60%;}100%{margin-left:110%;}}
      `}</style>
    </div>
  );
};