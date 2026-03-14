import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./CompanyProfile.module.css";

const empty = {
  name: "", industry: "", size: "", founded: "", website: "",
  headquarters: "", description: "", mission: "", linkedin: "", email: "", phone: "",
};
const REQUIRED = ["name", "industry", "headquarters"];

/* ─── Logo Crop Dialog — same pan/zoom as recruiter photo, but square output ─── */
function LogoCropDialog({ rawSrc, onConfirm, onCancel }) {
  const canvasRef = useRef();
  const imgRef    = useRef(new Image());
  const S         = useRef({ x:0, y:0, scale:1, dragging:false, lastX:0, lastY:0 });
  const [scale, setScale] = useState(1);
  const SIZE = 220;

  const draw = useCallback(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const s = S.current;
    ctx.clearRect(0, 0, SIZE, SIZE);
    ctx.fillStyle = "#111"; ctx.fillRect(0, 0, SIZE, SIZE);
    const img = imgRef.current;
    if (img.naturalWidth) ctx.drawImage(img, s.x, s.y, img.naturalWidth * s.scale, img.naturalHeight * s.scale);
    // square guide lines (dashed)
    const pad = 18;
    ctx.strokeStyle = "rgba(255,255,255,0.25)"; ctx.lineWidth = 1;
    ctx.setLineDash([4, 3]);
    ctx.strokeRect(pad, pad, SIZE - pad*2, SIZE - pad*2);
    ctx.setLineDash([]);
    // corner marks
    const c = pad, len = 12;
    ctx.strokeStyle = "rgba(255,255,255,0.6)"; ctx.lineWidth = 2;
    [[c,c,1,0],[c,c,0,1],[SIZE-c,c,-1,0],[SIZE-c,c,0,1],
     [c,SIZE-c,1,0],[c,SIZE-c,0,-1],[SIZE-c,SIZE-c,-1,0],[SIZE-c,SIZE-c,0,-1]
    ].forEach(([x,y,dx,dy]) => {
      ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x+dx*len, y+dy*len); ctx.stroke();
    });
  }, []);

  useEffect(() => {
    const img = imgRef.current;
    img.onload = () => {
      const s = S.current;
      const a = img.naturalWidth / img.naturalHeight;
      const init = a >= 1 ? SIZE / img.naturalHeight : SIZE / img.naturalWidth;
      s.scale = init;
      s.x = (SIZE - img.naturalWidth  * init) / 2;
      s.y = (SIZE - img.naturalHeight * init) / 2;
      setScale(init); draw();
    };
    img.src = rawSrc;
  }, [rawSrc, draw]);

  const onMD = (e) => { S.current.dragging=true; S.current.lastX=e.clientX; S.current.lastY=e.clientY; };
  const onMM = (e) => {
    if (!S.current.dragging) return;
    S.current.x += e.clientX - S.current.lastX;
    S.current.y += e.clientY - S.current.lastY;
    S.current.lastX = e.clientX; S.current.lastY = e.clientY; draw();
  };
  const onMU = () => { S.current.dragging = false; };
  const onTD = (e) => { const t=e.touches[0]; S.current.dragging=true; S.current.lastX=t.clientX; S.current.lastY=t.clientY; };
  const onTM = (e) => {
    if (!S.current.dragging) return;
    const t = e.touches[0];
    S.current.x += t.clientX - S.current.lastX;
    S.current.y += t.clientY - S.current.lastY;
    S.current.lastX = t.clientX; S.current.lastY = t.clientY; draw();
  };

  const zoom = (newScale) => {
    const s = S.current;
    newScale = Math.max(0.2, Math.min(6, newScale));
    s.x = SIZE/2 - (SIZE/2 - s.x) * (newScale / s.scale);
    s.y = SIZE/2 - (SIZE/2 - s.y) * (newScale / s.scale);
    s.scale = newScale; setScale(newScale); draw();
  };
  const onWheel = (e) => { e.preventDefault(); zoom(S.current.scale * (e.deltaY < 0 ? 1.07 : 0.93)); };
  const pan = (dx, dy) => { S.current.x += dx; S.current.y += dy; draw(); };

  const handleConfirm = () => {
    const pad = 18, cropSize = SIZE - pad*2;
    const out = document.createElement("canvas"); out.width = 160; out.height = 160;
    const ctx = out.getContext("2d");
    const r = 160 / cropSize; const s = S.current;
    ctx.drawImage(
      imgRef.current,
      (s.x - pad) * r, (s.y - pad) * r,
      imgRef.current.naturalWidth * s.scale * r,
      imgRef.current.naturalHeight * s.scale * r
    );
    onConfirm(out.toDataURL("image/png", 0.9));
  };

  return (
    <div className={styles.cropOverlay}>
      <div className={styles.cropBox}>
        <p className={styles.cropTitle}>Adjust company logo</p>
        <p className={styles.cropHint}>Drag to pan · Scroll or slider to zoom · Fit within the square</p>
        <canvas ref={canvasRef} width={SIZE} height={SIZE} className={styles.cropCanvas}
          onMouseDown={onMD} onMouseMove={onMM} onMouseUp={onMU} onMouseLeave={onMU}
          onTouchStart={onTD} onTouchMove={onTM} onTouchEnd={onMU} onWheel={onWheel}
        />
        <div className={styles.cropSliderRow}>
          <button className={styles.cropZoomBtn} onClick={() => zoom(S.current.scale * 0.9)}>−</button>
          <input type="range" min="0.2" max="6" step="0.01"
            value={scale} onChange={e => zoom(parseFloat(e.target.value))}
            className={styles.cropSlider} />
          <button className={styles.cropZoomBtn} onClick={() => zoom(S.current.scale * 1.1)}>+</button>
        </div>
        <div className={styles.cropArrowGrid}>
          <div/><button className={styles.cropArrowBtn} onClick={() => pan(0, 14)}>↓</button><div/>
          <button className={styles.cropArrowBtn} onClick={() => pan(14, 0)}>←</button>
          <div className={styles.cropArrowCenter}/>
          <button className={styles.cropArrowBtn} onClick={() => pan(-14, 0)}>→</button>
          <div/><button className={styles.cropArrowBtn} onClick={() => pan(0, -14)}>↑</button><div/>
        </div>
        <div className={styles.cropActions}>
          <button className={styles.cropCancel} onClick={onCancel}>Cancel</button>
          <button className={styles.cropConfirm} onClick={handleConfirm}>Use Logo</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Component ─── */
export const CompanyProfile = ({ onClose }) => {
  const [company, setCompany] = useState(empty);
  const [errors, setErrors]   = useState({});
  const [saved, setSaved]     = useState(false);
  const [logoURL, setLogoURL] = useState(null);
  const [rawSrc, setRawSrc]   = useState(null);
  const fileInputRef = useRef();

  useEffect(() => {
    const auth  = JSON.parse(localStorage.getItem("recruiter")) || {};
    const email = auth.email || "";
    const key   = email ? `recruiterCompany_${email}` : "recruiterCompany_default";
    const stored = JSON.parse(localStorage.getItem(key)) || {};
    setCompany(prev => ({ ...prev, ...stored }));
    const logoKey = email ? `companyLogo_${email}` : "companyLogo_default";
    const savedLogo = localStorage.getItem(logoKey);
    if (savedLogo) setLogoURL(savedLogo);
  }, []);

  const handleFileSelect = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setRawSrc(ev.target.result);
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleCropConfirm = (dataUrl) => {
    setLogoURL(dataUrl); setRawSrc(null);
    const auth  = JSON.parse(localStorage.getItem("recruiter")) || {};
    const email = auth.email || "";
    const logoKey = email ? `companyLogo_${email}` : "companyLogo_default";
    localStorage.setItem(logoKey, dataUrl);
  };

  const handleChange = (e) => {
    setCompany({ ...company, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: false }));
  };

  const validate = () => {
    const errs = {};
    REQUIRED.forEach(f => { if (!company[f]?.trim()) errs[f] = true; });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const auth  = JSON.parse(localStorage.getItem("recruiter")) || {};
    const email = auth.email || "";
    const key   = email ? `recruiterCompany_${email}` : "recruiterCompany_default";
    localStorage.setItem(key, JSON.stringify(company));
    localStorage.setItem("recruiter", JSON.stringify({ ...auth, company: company.name }));
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 900);
  };

  const req = (field) => REQUIRED.includes(field);
  const companyInitial = (company.name || "C").charAt(0).toUpperCase();

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>

        {rawSrc && <LogoCropDialog rawSrc={rawSrc} onConfirm={handleCropConfirm} onCancel={() => setRawSrc(null)} />}

        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Company Profile</h2>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        {/* Logo strip */}
        <div className={styles.profileTop}>
          <div className={styles.profileAvatarWrap} onClick={() => fileInputRef.current?.click()}>
            {logoURL
              ? <img src={logoURL} className={styles.profileAvatarImg} alt="logo" />
              : <div className={styles.profileAvatarLg}>{companyInitial}</div>
            }
            <div className={styles.profileAvatarOverlay}>
              <span style={{fontSize:"10px",color:"#fff",fontWeight:600,letterSpacing:"0.06em"}}>CHANGE</span>
            </div>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleFileSelect} />
          <div>
            <p className={styles.profileName}>{company.name || "Company Name"}</p>
            <p className={styles.profileSub}>{company.industry || "Industry"}{company.headquarters ? ` · ${company.headquarters}` : ""}</p>
            <p className={styles.profilePhotoHint}>Click logo → pan &amp; zoom to crop</p>
          </div>
        </div>

        <p className={styles.requiredNote}><span className={styles.star}>*</span> Required fields must be filled to post a job.</p>

        <form onSubmit={handleSave} className={styles.form}>
          <p className={styles.formSection}>Identity</p>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Company Name {req("name") && <span className={styles.star}>*</span>}</label>
              <input className={`${styles.input} ${errors.name ? styles.inputError : ""}`} type="text" name="name" value={company.name} onChange={handleChange} placeholder="e.g. Acme Technologies" />
              {errors.name && <span className={styles.errorMsg}>Required</span>}
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Industry {req("industry") && <span className={styles.star}>*</span>}</label>
              <input className={`${styles.input} ${errors.industry ? styles.inputError : ""}`} type="text" name="industry" value={company.industry} onChange={handleChange} placeholder="e.g. Software / FinTech" />
              {errors.industry && <span className={styles.errorMsg}>Required</span>}
            </div>
          </div>
          <div className={styles.formRow3}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Company Size</label>
              <select className={styles.input} name="size" value={company.size} onChange={handleChange}>
                <option value="">Select</option>
                <option>1–10</option><option>11–50</option><option>51–200</option>
                <option>201–500</option><option>500–1000</option><option>1000+</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Founded Year</label>
              <input className={styles.input} type="text" name="founded" value={company.founded} onChange={handleChange} placeholder="e.g. 2015" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Headquarters {req("headquarters") && <span className={styles.star}>*</span>}</label>
              <input className={`${styles.input} ${errors.headquarters ? styles.inputError : ""}`} type="text" name="headquarters" value={company.headquarters} onChange={handleChange} placeholder="e.g. Mumbai, India" />
              {errors.headquarters && <span className={styles.errorMsg}>Required</span>}
            </div>
          </div>

          <p className={styles.formSection}>About</p>
          <div className={styles.formGroup}>
            <label className={styles.label}>Company Description</label>
            <textarea className={styles.textarea} name="description" value={company.description} onChange={handleChange} placeholder="What does your company do?" rows={3} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Mission Statement</label>
            <textarea className={styles.textarea} name="mission" value={company.mission} onChange={handleChange} placeholder="Your company's mission and values..." rows={2} />
          </div>

          <p className={styles.formSection}>Contact & Links</p>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Website</label>
              <input className={styles.input} type="url" name="website" value={company.website} onChange={handleChange} placeholder="https://yourcompany.com" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>LinkedIn Page</label>
              <input className={styles.input} type="url" name="linkedin" value={company.linkedin} onChange={handleChange} placeholder="https://linkedin.com/company/..." />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Contact Email</label>
              <input className={styles.input} type="email" name="email" value={company.email} onChange={handleChange} placeholder="hr@company.com" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Contact Phone</label>
              <input className={styles.input} type="text" name="phone" value={company.phone} onChange={handleChange} placeholder="+91 XXXXX XXXXX" />
            </div>
          </div>

          <div className={styles.formActions}>
            <button type="button" className={styles.btnCancel} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.btnSubmit}>
              {saved ? "✓ Saved!" : "Save Company Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};