import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./RecruiterProfile.module.css";

const empty = {
  name: "", email: "", phone: "", designation: "", experience: "",
  linkedin: "", bio: "", education: "", certifications: "", specializations: "",
};
const REQUIRED = ["name", "designation", "phone"];

/* ─── Photo Crop Dialog — drag to pan, slider/scroll to zoom ─── */
function PhotoCropDialog({ rawSrc, onConfirm, onCancel }) {
  const canvasRef = useRef();
  const imgRef    = useRef(new Image());
  const S         = useRef({ x:0, y:0, scale:1, dragging:false, lastX:0, lastY:0 });
  const [scale, setScale] = useState(1);
  const SIZE = 240;

  const draw = useCallback(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const s = S.current;
    ctx.clearRect(0, 0, SIZE, SIZE);
    ctx.fillStyle = "#111"; ctx.fillRect(0, 0, SIZE, SIZE);
    const img = imgRef.current;
    if (img.naturalWidth) ctx.drawImage(img, s.x, s.y, img.naturalWidth * s.scale, img.naturalHeight * s.scale);
    // circular mask
    ctx.save();
    ctx.globalCompositeOperation = "destination-in";
    ctx.beginPath(); ctx.arc(SIZE/2, SIZE/2, SIZE/2, 0, Math.PI*2); ctx.fill();
    ctx.restore();
    // ring
    ctx.strokeStyle = "rgba(255,255,255,0.18)"; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(SIZE/2, SIZE/2, SIZE/2 - 1, 0, Math.PI*2); ctx.stroke();
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
    const out = document.createElement("canvas"); out.width = 200; out.height = 200;
    const ctx = out.getContext("2d");
    ctx.beginPath(); ctx.arc(100,100,100,0,Math.PI*2); ctx.clip();
    const r = 200/SIZE; const s = S.current;
    ctx.drawImage(imgRef.current, s.x*r, s.y*r, imgRef.current.naturalWidth*s.scale*r, imgRef.current.naturalHeight*s.scale*r);
    onConfirm(out.toDataURL("image/jpeg", 0.88));
  };

  return (
    <div className={styles.cropOverlay}>
      <div className={styles.cropBox}>
        <p className={styles.cropTitle}>Adjust your photo</p>
        <p className={styles.cropHint}>Drag to pan · Scroll or use slider to zoom</p>
        <canvas ref={canvasRef} width={SIZE} height={SIZE} className={styles.cropCanvas}
          onMouseDown={onMD} onMouseMove={onMM} onMouseUp={onMU} onMouseLeave={onMU}
          onTouchStart={onTD} onTouchMove={onTM} onTouchEnd={onMU} onWheel={onWheel}
        />
        {/* Zoom slider */}
        <div className={styles.cropSliderRow}>
          <button className={styles.cropZoomBtn} onClick={() => zoom(S.current.scale * 0.9)}>−</button>
          <input type="range" min="0.2" max="6" step="0.01"
            value={scale} onChange={e => zoom(parseFloat(e.target.value))}
            className={styles.cropSlider} />
          <button className={styles.cropZoomBtn} onClick={() => zoom(S.current.scale * 1.1)}>+</button>
        </div>
        {/* Pan arrows */}
        <div className={styles.cropArrowGrid}>
          <div/>
          <button className={styles.cropArrowBtn} onClick={() => pan(0, 14)}>↓</button>
          <div/>
          <button className={styles.cropArrowBtn} onClick={() => pan(14, 0)}>←</button>
          <div className={styles.cropArrowCenter}/>
          <button className={styles.cropArrowBtn} onClick={() => pan(-14, 0)}>→</button>
          <div/>
          <button className={styles.cropArrowBtn} onClick={() => pan(0, -14)}>↑</button>
          <div/>
        </div>
        <div className={styles.cropActions}>
          <button className={styles.cropCancel} onClick={onCancel}>Cancel</button>
          <button className={styles.cropConfirm} onClick={handleConfirm}>Use Photo</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Component ─── */
export const RecruiterProfile = ({ onClose }) => {
  const [recruiter, setRecruiter] = useState(empty);
  const [errors, setErrors]       = useState({});
  const [saved, setSaved]         = useState(false);
  const [photoURL, setPhotoURL]   = useState(null);
  const [rawSrc, setRawSrc]       = useState(null);
  const fileInputRef = useRef();

  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("recruiter")) || {};
    const email = auth.email || "";
    const stored = JSON.parse(localStorage.getItem(`recruiterProfile_${email || "default"}`)) || {};
    setRecruiter({ ...empty, name: auth.name || "", email: auth.email || "", ...stored });
    const saved = localStorage.getItem(`recruiterPhoto_${email || "default"}`);
    if (saved) setPhotoURL(saved);
  }, []);

  const handleFileSelect = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setRawSrc(ev.target.result);
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleCropConfirm = (dataUrl) => {
    setPhotoURL(dataUrl); setRawSrc(null);
    const auth  = JSON.parse(localStorage.getItem("recruiter")) || {};
    const email = auth.email || "";
    localStorage.setItem(`recruiterPhoto_${email || "default"}`, dataUrl);
  };

  const initial = (recruiter.name || "R").charAt(0).toUpperCase();
  const handleChange = (e) => {
    setRecruiter({ ...recruiter, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors(p => ({ ...p, [e.target.name]: false }));
  };

  const validate = () => {
    const errs = {};
    REQUIRED.forEach(f => { if (!recruiter[f]?.trim()) errs[f] = true; });
    setErrors(errs);
    return !Object.keys(errs).length;
  };

  const handleSave = (e) => {
    e.preventDefault(); if (!validate()) return;
    const auth  = JSON.parse(localStorage.getItem("recruiter")) || {};
    const email = auth.email || "";
    localStorage.setItem(`recruiterProfile_${email || "default"}`, JSON.stringify(recruiter));
    localStorage.setItem("recruiter", JSON.stringify({ ...auth, name: recruiter.name, designation: recruiter.designation, company: recruiter.company }));
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 900);
  };

  const req = (f) => REQUIRED.includes(f);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>

        {rawSrc && <PhotoCropDialog rawSrc={rawSrc} onConfirm={handleCropConfirm} onCancel={() => setRawSrc(null)} />}

        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Recruiter Profile</h2>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div className={styles.profileTop}>
          <div className={styles.profileAvatarWrap} onClick={() => fileInputRef.current?.click()}>
            {photoURL ? <img src={photoURL} className={styles.profileAvatarImg} alt="" /> : <div className={styles.profileAvatarLg}>{initial}</div>}
            <div className={styles.profileAvatarOverlay}><span style={{fontSize:"10px",color:"#fff",fontWeight:600,letterSpacing:"0.06em"}}>CHANGE</span></div>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleFileSelect} />
          <div>
            <p className={styles.profileName}>{recruiter.name || "Your Name"}</p>
            <p className={styles.profileSub}>{recruiter.designation || "Recruiter"}{recruiter.email ? ` · ${recruiter.email}` : ""}</p>
            <p className={styles.profilePhotoHint}>Click avatar → pan &amp; zoom to crop</p>
          </div>
        </div>

        <p className={styles.requiredNote}><span className={styles.star}>*</span> Required fields must be filled to post a job.</p>

        <form onSubmit={handleSave} className={styles.form}>
          <p className={styles.formSection}>Personal Info</p>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Full Name {req("name")&&<span className={styles.star}>*</span>}</label>
              <input className={`${styles.input}${errors.name?" "+styles.inputError:""}`} type="text" name="name" value={recruiter.name} onChange={handleChange} placeholder="Your full name"/>
              {errors.name&&<span className={styles.errorMsg}>Required</span>}
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Designation {req("designation")&&<span className={styles.star}>*</span>}</label>
              <input className={`${styles.input}${errors.designation?" "+styles.inputError:""}`} type="text" name="designation" value={recruiter.designation} onChange={handleChange} placeholder="e.g. Senior HR Manager"/>
              {errors.designation&&<span className={styles.errorMsg}>Required</span>}
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Email</label>
              <input className={styles.input} type="email" name="email" value={recruiter.email} onChange={handleChange} placeholder="you@company.com"/>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Phone {req("phone")&&<span className={styles.star}>*</span>}</label>
              <input className={`${styles.input}${errors.phone?" "+styles.inputError:""}`} type="text" name="phone" value={recruiter.phone} onChange={handleChange} placeholder="+91 XXXXX XXXXX"/>
              {errors.phone&&<span className={styles.errorMsg}>Required</span>}
            </div>
          </div>
          <p className={styles.formSection}>Professional Details</p>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Experience</label>
              <input className={styles.input} type="text" name="experience" value={recruiter.experience} onChange={handleChange} placeholder="e.g. 7 years"/>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>LinkedIn</label>
              <input className={styles.input} type="url" name="linkedin" value={recruiter.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/..."/>
            </div>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Specializations</label>
            <input className={styles.input} type="text" name="specializations" value={recruiter.specializations} onChange={handleChange} placeholder="e.g. Tech Hiring, Campus Recruitment"/>
          </div>
          <p className={styles.formSection}>Qualifications</p>
          <div className={styles.formGroup}>
            <label className={styles.label}>Education</label>
            <input className={styles.input} type="text" name="education" value={recruiter.education} onChange={handleChange} placeholder="e.g. MBA – HR, Delhi University, 2018"/>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Certifications</label>
            <input className={styles.input} type="text" name="certifications" value={recruiter.certifications} onChange={handleChange} placeholder="e.g. SHRM-CP, LinkedIn Certified Recruiter"/>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Bio</label>
            <textarea className={styles.textarea} name="bio" value={recruiter.bio} onChange={handleChange} placeholder="Tell candidates about yourself..." rows={3}/>
          </div>
          <div className={styles.formActions}>
            <button type="button" className={styles.btnCancel} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.btnSubmit}>{saved?"✓ Saved!":"Save Profile"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};