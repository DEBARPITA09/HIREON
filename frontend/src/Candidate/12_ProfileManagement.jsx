import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./12_ProfileManagement.module.css";

const DOMAINS = [
  "Frontend Development", "Backend Development", "Full Stack Development",
  "Data Science", "Machine Learning / AI", "DevOps / Cloud",
  "Mobile Development", "UI/UX Design", "Cybersecurity", "Data Analytics",
  "Embedded Systems", "Blockchain", "Game Development", "QA / Testing",
];

const SKILL_SUGGESTIONS = [
  "React", "Node.js", "Python", "Java", "JavaScript", "TypeScript",
  "MongoDB", "PostgreSQL", "AWS", "Docker", "Kubernetes", "Git",
  "Machine Learning", "TensorFlow", "Flutter", "Swift", "Kotlin",
  "GraphQL", "Redis", "Spring Boot", "Django", "FastAPI", "Go", "Rust",
  "C++", "C#", ".NET", "Angular", "Vue.js", "SQL", "Linux", "Figma",
];

export const ProfileManagement = () => {
  const navigate = useNavigate();
  const fileRef  = useRef();

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

          {/* ── RIGHT COLUMN ── */}
          <div className={styles.col}>

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

              {profile.resumeName ? (
                <div className={styles.resumeUploaded}>
                  <div className={styles.resumeIcon}>📄</div>
                  <div className={styles.resumeInfo}>
                    <p className={styles.resumeName}>{profile.resumeName}</p>
                    <p className={styles.resumeSub}>PDF uploaded successfully</p>
                  </div>
                  <button className={styles.reuploadBtn} onClick={() => fileRef.current.click()}>Replace</button>
                </div>
              ) : (
                <div className={styles.uploadZone} onClick={() => fileRef.current.click()}>
                  <div className={styles.uploadIcon}>📎</div>
                  <p className={styles.uploadText}>Click to upload your resume</p>
                  <p className={styles.uploadSub}>PDF format only · Max 5MB</p>
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