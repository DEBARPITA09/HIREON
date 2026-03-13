import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/* ═══════════════════════════════════
   HIREON DESIGN TOKENS
═══════════════════════════════════ */
const T = {
  bg:       "#080808",
  surface:  "rgba(255,255,255,0.03)",
  border:   "rgba(255,255,255,0.07)",
  border2:  "rgba(255,255,255,0.12)",
  white:    "#ffffff",
  muted:    "rgba(255,255,255,0.4)",
  muted2:   "rgba(255,255,255,0.6)",
  green:    "#81e6a0",
  blue:     "#8ab4f8",
  yellow:   "#fbbf24",
  accent:   "#c8c8c8",
  danger:   "#f87171",
};

/* ═══════════════════════════════════
   GLOBAL FONTS + RESETS
═══════════════════════════════════ */
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=DM+Sans:wght@300;400;500;600;700&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'DM Sans', sans-serif; background: #080808; }
    input, textarea { font-family: 'DM Sans', sans-serif; }
    input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.18); }
    input:focus, textarea:focus { outline: none; border-color: rgba(255,255,255,0.3) !important; }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
    @keyframes fadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
    @keyframes pulseGlow { 0%,100%{box-shadow:0 0 0 0 rgba(129,230,160,0.3);} 70%{box-shadow:0 0 0 8px rgba(129,230,160,0);} }
    @keyframes shimmer { 0%{background-position:-200% center;} 100%{background-position:200% center;} }
    .hireon-fade { animation: fadeUp 0.4s ease both; }
  `}</style>
);

/* ═══════════════════════════════════
   PARTICLE BACKGROUND (HIREON style)
═══════════════════════════════════ */
function useParticles(ref) {
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W, H, raf;
    const resize = () => { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; };
    resize(); window.addEventListener("resize", resize);
    const N = 100;
    const pts = Array.from({ length: N }, () => ({
      x: Math.random(), y: Math.random(),
      vx: (Math.random()-0.5)*0.00018, vy: (Math.random()-0.5)*0.00018,
      r: 0.6 + Math.random()*1.4, a: 0.1 + Math.random()*0.35, ph: Math.random()*Math.PI*2,
    }));
    let t = 0;
    function draw() {
      ctx.clearRect(0,0,W,H);
      pts.forEach(p => {
        p.x+=p.vx; p.y+=p.vy;
        if(p.x<0)p.x=1; if(p.x>1)p.x=0; if(p.y<0)p.y=1; if(p.y>1)p.y=0;
        const pulse = 0.82+0.18*Math.sin(t*0.016+p.ph);
        ctx.beginPath(); ctx.arc(p.x*W,p.y*H,p.r*pulse,0,Math.PI*2);
        ctx.fillStyle=`rgba(255,255,255,${p.a*pulse})`; ctx.fill();
      });
      for(let i=0;i<N;i++) for(let j=i+1;j<N;j++) {
        const dx=pts[i].x-pts[j].x, dy=pts[i].y-pts[j].y, d=Math.sqrt(dx*dx+dy*dy);
        if(d<0.08){ ctx.beginPath(); ctx.moveTo(pts[i].x*W,pts[i].y*H); ctx.lineTo(pts[j].x*W,pts[j].y*H);
          ctx.strokeStyle=`rgba(255,255,255,${0.05*(1-d/0.08)})`; ctx.lineWidth=0.4; ctx.stroke(); }
      }
      t++; raf=requestAnimationFrame(draw);
    }
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize",resize); };
  }, []);
}

/* ═══════════════════════════════════
   ATOMS
═══════════════════════════════════ */
const Label = ({ children }) => (
  <label style={{ display:"block", fontSize:"0.6rem", fontWeight:700, color:T.muted,
    textTransform:"uppercase", letterSpacing:"0.12em", marginBottom:6 }}>
    {children}
  </label>
);

const Input = ({ value, onChange, placeholder, type="text", style={} }) => (
  <input type={type} value={value} onChange={onChange} placeholder={placeholder}
    style={{ width:"100%", background:"rgba(255,255,255,0.04)", border:`1px solid ${T.border}`,
      borderRadius:8, color:T.white, padding:"10px 13px", fontSize:"0.83rem",
      transition:"border-color 0.2s", ...style }} />
);

const Textarea = ({ value, onChange, placeholder, rows=3 }) => (
  <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows}
    style={{ width:"100%", background:"rgba(255,255,255,0.04)", border:`1px solid ${T.border}`,
      borderRadius:8, color:T.white, padding:"10px 13px", fontSize:"0.83rem",
      resize:"vertical", transition:"border-color 0.2s", lineHeight:1.6 }} />
);

const Btn = ({ children, onClick, variant="primary", style={} }) => {
  const vars = {
    primary: { background:T.white, color:"#080808", border:"none" },
    outline:  { background:"transparent", color:T.white, border:`1px solid ${T.border2}` },
    danger:   { background:"rgba(248,113,113,0.08)", color:T.danger, border:`1px solid rgba(248,113,113,0.25)` },
    ghost:    { background:"rgba(255,255,255,0.04)", color:T.muted2, border:`1px solid ${T.border}` },
  };
  return (
    <button onClick={onClick}
      style={{ borderRadius:8, padding:"9px 18px", fontSize:"0.8rem", fontWeight:600,
        cursor:"pointer", fontFamily:"'DM Sans',sans-serif", transition:"all 0.2s",
        ...vars[variant], ...style }}>
      {children}
    </button>
  );
};

/* Section card */
const Section = ({ title, accent=T.green, children }) => (
  <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:12,
    padding:"20px", marginBottom:14, position:"relative", overflow:"hidden" }}>
    <div style={{ position:"absolute", top:0, left:0, right:0, height:2,
      background:`linear-gradient(90deg,${accent},transparent)` }} />
    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16,
      paddingBottom:12, borderBottom:`1px solid ${T.border}` }}>
      <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:"0.75rem", fontWeight:900,
        textTransform:"uppercase", letterSpacing:"0.15em", color:T.white }}>{title}</h3>
    </div>
    {children}
  </div>
);

/* Sub-entry card */
const SubCard = ({ children }) => (
  <div style={{ background:"rgba(255,255,255,0.02)", borderRadius:8, padding:14, marginBottom:12,
    border:`1px solid ${T.border}`, position:"relative" }}>
    <div style={{ position:"absolute", top:10, left:-1, width:2, height:22,
      background:`linear-gradient(180deg,${T.blue},transparent)`, borderRadius:"0 2px 2px 0" }} />
    {children}
  </div>
);

/* ═══════════════════════════════════
   DEFAULT STATE
═══════════════════════════════════ */
const emptyEdu  = () => ({ id:Date.now()+Math.random(), institution:"", degree:"", year:"", score:"" });
const emptyExp  = () => ({ id:Date.now()+Math.random(), company:"", role:"", duration:"", points:"" });
const emptyProj = () => ({ id:Date.now()+Math.random(), name:"", tech:"", points:"" });
const defaultSkills = { languages:"", frameworks:"", devtools:"", libraries:"", others:"" };
const defaultData = {
  photo:null, name:"", email:"", phone:"", linkedin:"", github:"", summary:"",
  skills:{...defaultSkills}, educations:[emptyEdu()], experiences:[emptyExp()], projects:[emptyProj()],
};

const SKILL_CATS = [
  { key:"languages",  label:"Languages",          placeholder:"Java, Python, C, JavaScript, SQL" },
  { key:"frameworks", label:"Frameworks & Tools", placeholder:"Spring Boot, React, Flask, Node.js" },
  { key:"devtools",   label:"Developer Tools",    placeholder:"Git, VS Code, Docker, Postman" },
  { key:"libraries",  label:"Libraries",          placeholder:"pandas, NumPy, PyTorch, Matplotlib" },
  { key:"others",     label:"Others",             placeholder:"REST APIs, Agile, Linux, AWS" },
];

/* ═══════════════════════════════════
   SKILLS SECTION
═══════════════════════════════════ */
function SkillsSection({ skills, setSkills }) {
  return (
    <Section title="Technical Skills" accent={T.yellow}>
      <p style={{ color:T.muted, fontSize:"0.75rem", marginBottom:16, lineHeight:1.7 }}>
        Enter comma-separated skills per category. Leave blank to hide from resume.
      </p>
      {SKILL_CATS.map((cat, idx) => (
        <div key={cat.key} style={{ marginBottom:14 }}>
          <Label>{idx+1}. {cat.label}</Label>
          <Input value={skills[cat.key]} onChange={e => setSkills({...skills,[cat.key]:e.target.value})}
            placeholder={cat.placeholder} />
          {skills[cat.key] && (
            <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginTop:6 }}>
              {skills[cat.key].split(",").map(s=>s.trim()).filter(Boolean).map((s,i) => (
                <span key={i} style={{ background:`${T.yellow}12`, border:`1px solid ${T.yellow}30`,
                  color:T.yellow, borderRadius:20, padding:"2px 10px", fontSize:"0.68rem", fontWeight:500 }}>{s}</span>
              ))}
            </div>
          )}
        </div>
      ))}
    </Section>
  );
}

/* ═══════════════════════════════════
   BUILDER FORM
═══════════════════════════════════ */
function BuilderForm({ data, setData, template }) {
  const photoRef = useRef();
  const set = k => e => setData({...data,[k]:e.target.value});
  const handlePhoto = e => {
    const file = e.target.files[0]; if(!file) return;
    const r = new FileReader();
    r.onload = ev => setData({...data, photo:ev.target.result});
    r.readAsDataURL(file);
  };
  const upd = (key,id,field,val) =>
    setData({...data,[key]:data[key].map(i=>i.id===id?{...i,[field]:val}:i)});
  const add    = (key,fn) => setData({...data,[key]:[...data[key],fn()]});
  const remove = (key,id) => setData({...data,[key]:data[key].filter(i=>i.id!==id)});

  return (
    <div>
      {/* Personal Info */}
      <Section title="Personal Information" accent={T.blue}>
        {template==="modern" && (
          <div style={{ marginBottom:18, display:"flex", flexDirection:"column", alignItems:"center" }}>
            <div onClick={() => photoRef.current.click()}
              style={{ width:84, height:84, borderRadius:"50%", border:`2px dashed ${T.border2}`,
                background:"rgba(255,255,255,0.03)", cursor:"pointer", overflow:"hidden",
                display:"flex", alignItems:"center", justifyContent:"center",
                animation: !data.photo ? "pulseGlow 2.5s infinite" : "none" }}>
              {data.photo
                ? <img src={data.photo} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}} />
                : <div style={{textAlign:"center"}}>
                    <div style={{fontSize:"1.4rem"}}>📷</div>
                    <div style={{fontSize:"0.6rem",color:T.muted,marginTop:3}}>Upload Photo</div>
                  </div>
              }
            </div>
            <input ref={photoRef} type="file" accept="image/*" onChange={handlePhoto} style={{display:"none"}} />
          </div>
        )}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <div style={{gridColumn:"1/-1"}}>
            <Label>Full Name *</Label>
            <Input value={data.name} onChange={set("name")} placeholder="e.g. Manoranjan Mahapatra"
              style={{fontSize:"0.95rem",fontWeight:600}} />
          </div>
          <div><Label>Email *</Label><Input value={data.email} onChange={set("email")} placeholder="you@email.com" /></div>
          <div><Label>Phone *</Label><Input value={data.phone} onChange={set("phone")} placeholder="+91 9999999999" /></div>
          <div><Label>LinkedIn</Label><Input value={data.linkedin} onChange={set("linkedin")} placeholder="linkedin.com/in/yourname" /></div>
          <div><Label>GitHub</Label><Input value={data.github} onChange={set("github")} placeholder="github.com/yourname" /></div>
          <div style={{gridColumn:"1/-1"}}>
            <Label>Professional Summary</Label>
            <Textarea value={data.summary} onChange={set("summary")}
              placeholder="A brief 2–3 line summary about yourself, your strengths, and career goals..." rows={3} />
          </div>
        </div>
      </Section>

      {/* Education */}
      <Section title="Education" accent={T.yellow}>
        {data.educations.map((edu,i) => (
          <SubCard key={edu.id}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <span style={{color:T.muted,fontSize:"0.72rem",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.08em"}}>#{i+1} Institution</span>
              {data.educations.length>1 &&
                <Btn variant="danger" onClick={()=>remove("educations",edu.id)} style={{padding:"3px 9px",fontSize:"0.7rem"}}>Remove</Btn>}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <div style={{gridColumn:"1/-1"}}><Label>Institution Name</Label>
                <Input value={edu.institution} onChange={e=>upd("educations",edu.id,"institution",e.target.value)} placeholder="e.g. Silicon University" /></div>
              <div><Label>Degree / Course</Label>
                <Input value={edu.degree} onChange={e=>upd("educations",edu.id,"degree",e.target.value)} placeholder="B.Tech in CSE" /></div>
              <div><Label>Year</Label>
                <Input value={edu.year} onChange={e=>upd("educations",edu.id,"year",e.target.value)} placeholder="2023 – Present" /></div>
              <div style={{gridColumn:"1/-1"}}><Label>Score / CGPA / Percentage</Label>
                <Input value={edu.score} onChange={e=>upd("educations",edu.id,"score",e.target.value)} placeholder="8.5 CGPA or 85%" /></div>
            </div>
          </SubCard>
        ))}
        <Btn variant="ghost" onClick={()=>add("educations",emptyEdu)} style={{width:"100%"}}>+ Add Education</Btn>
      </Section>

      {/* Experience */}
      <Section title="Work Experience" accent={T.green}>
        {data.experiences.map((exp,i) => (
          <SubCard key={exp.id}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <span style={{color:T.muted,fontSize:"0.72rem",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.08em"}}>#{i+1} Experience</span>
              {data.experiences.length>1 &&
                <Btn variant="danger" onClick={()=>remove("experiences",exp.id)} style={{padding:"3px 9px",fontSize:"0.7rem"}}>Remove</Btn>}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <div><Label>Company Name</Label>
                <Input value={exp.company} onChange={e=>upd("experiences",exp.id,"company",e.target.value)} placeholder="e.g. Apple" /></div>
              <div><Label>Role / Designation</Label>
                <Input value={exp.role} onChange={e=>upd("experiences",exp.id,"role",e.target.value)} placeholder="Software Intern" /></div>
              {(exp.company||exp.role) && (
                <div style={{gridColumn:"1/-1",background:"rgba(138,180,248,0.05)",borderRadius:7,
                  padding:"7px 12px",border:`1px dashed ${T.border2}`}}>
                  <span style={{color:T.muted,fontSize:"0.72rem"}}>Will appear as: </span>
                  <span style={{color:T.blue,fontWeight:700,fontSize:"0.82rem"}}>
                    {exp.company||"Company"} — {exp.role||"Role"}
                  </span>
                </div>
              )}
              <div style={{gridColumn:"1/-1"}}><Label>Duration</Label>
                <Input value={exp.duration} onChange={e=>upd("experiences",exp.id,"duration",e.target.value)} placeholder="June 2024 – Aug 2024" /></div>
              <div style={{gridColumn:"1/-1"}}><Label>Key Responsibilities / Achievements (one per line)</Label>
                <Textarea value={exp.points} onChange={e=>upd("experiences",exp.id,"points",e.target.value)}
                  placeholder={"• Built REST APIs using Spring Boot\n• Reduced query time by 30%\n• Integrated JWT authentication"} rows={4} /></div>
            </div>
          </SubCard>
        ))}
        <Btn variant="ghost" onClick={()=>add("experiences",emptyExp)} style={{width:"100%"}}>+ Add Experience</Btn>
      </Section>

      {/* Projects */}
      <Section title="Projects" accent={T.accent}>
        {data.projects.map((proj,i) => (
          <SubCard key={proj.id}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <span style={{color:T.muted,fontSize:"0.72rem",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.08em"}}>#{i+1} Project</span>
              {data.projects.length>1 &&
                <Btn variant="danger" onClick={()=>remove("projects",proj.id)} style={{padding:"3px 9px",fontSize:"0.7rem"}}>Remove</Btn>}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <div><Label>Project Name</Label>
                <Input value={proj.name} onChange={e=>upd("projects",proj.id,"name",e.target.value)} placeholder="e.g. HIREON" /></div>
              <div><Label>Tech Stack</Label>
                <Input value={proj.tech} onChange={e=>upd("projects",proj.id,"tech",e.target.value)} placeholder="React, Spring Boot, MySQL" /></div>
              <div style={{gridColumn:"1/-1"}}><Label>Description / Highlights (one per line)</Label>
                <Textarea value={proj.points} onChange={e=>upd("projects",proj.id,"points",e.target.value)}
                  placeholder={"• Built full-stack job portal with AI resume builder\n• Implemented JWT auth and role-based access"} rows={3} /></div>
            </div>
          </SubCard>
        ))}
        <Btn variant="ghost" onClick={()=>add("projects",emptyProj)} style={{width:"100%"}}>+ Add Project</Btn>
      </Section>

      {/* Skills */}
      <SkillsSection skills={data.skills} setSkills={s=>setData({...data,skills:s})} />
    </div>
  );
}

/* ═══════════════════════════════════
   RESUME PREVIEWS (unchanged — print output)
═══════════════════════════════════ */
function ModernPreview({ data }) {
  const bullet = text => text.split("\n").filter(l=>l.trim()).map((l,i)=>(
    <div key={i} style={{fontSize:11,color:"#334155",marginBottom:2,display:"flex",gap:5}}>
      <span style={{color:"#0ea5e9",flexShrink:0,marginTop:1}}>▸</span>
      <span>{l.replace(/^[•▸\-]\s*/,"")}</span>
    </div>
  ));
  const S = data.skills;
  const skillCats = [
    {label:"Languages",val:S.languages},{label:"Frameworks & Tools",val:S.frameworks},
    {label:"Dev Tools",val:S.devtools},{label:"Libraries",val:S.libraries},{label:"Others",val:S.others},
  ].filter(c=>c.val.trim());
  return (
    <div id="resume-preview" style={{fontFamily:"'Segoe UI',Arial,sans-serif",background:"#fff",color:"#1e293b",padding:28,maxWidth:680,margin:"0 auto",fontSize:12,lineHeight:1.55}}>
      <div style={{display:"flex",gap:16,borderBottom:"2.5px solid #0ea5e9",paddingBottom:14,marginBottom:16}}>
        {data.photo && <img src={data.photo} alt="" style={{width:76,height:76,borderRadius:"50%",objectFit:"cover",border:"2.5px solid #0ea5e9",flexShrink:0}} />}
        <div style={{flex:1}}>
          <h1 style={{margin:0,fontSize:22,fontWeight:800,color:"#0a0f1e",letterSpacing:"-0.5px"}}>{data.name||"Your Name"}</h1>
          <div style={{color:"#0ea5e9",fontSize:11,marginTop:4,display:"flex",flexWrap:"wrap",gap:"3px 10px"}}>
            {[data.email,data.phone,data.linkedin,data.github].filter(Boolean).map((v,i)=><span key={i}>{v}</span>)}
          </div>
          {data.summary && <p style={{fontSize:11,color:"#475569",margin:"6px 0 0",lineHeight:1.55}}>{data.summary}</p>}
        </div>
      </div>
      <div style={{display:"flex",gap:18}}>
        <div style={{width:"34%",flexShrink:0}}>
          {skillCats.length>0 && (
            <div style={{marginBottom:16}}>
              <div style={{fontWeight:800,color:"#0ea5e9",fontSize:9.5,textTransform:"uppercase",letterSpacing:"0.12em",borderBottom:"1px solid #bae6fd",paddingBottom:3,marginBottom:8}}>Skills</div>
              {skillCats.map(cat=>(
                <div key={cat.label} style={{marginBottom:7}}>
                  <div style={{fontSize:9.5,fontWeight:700,color:"#334155",marginBottom:3}}>{cat.label}</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:2}}>
                    {cat.val.split(",").map(s=>s.trim()).filter(Boolean).map((s,i)=>(
                      <span key={i} style={{background:"#e0f2fe",color:"#0284c7",borderRadius:3,padding:"1px 6px",fontSize:9,fontWeight:500}}>{s}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          {data.educations.some(e=>e.institution) && (
            <div>
              <div style={{fontWeight:800,color:"#0ea5e9",fontSize:9.5,textTransform:"uppercase",letterSpacing:"0.12em",borderBottom:"1px solid #bae6fd",paddingBottom:3,marginBottom:8}}>Education</div>
              {data.educations.filter(e=>e.institution).map(edu=>(
                <div key={edu.id} style={{marginBottom:10}}>
                  <div style={{fontWeight:700,fontSize:11,color:"#0f172a"}}>{edu.institution}</div>
                  {edu.degree && <div style={{fontSize:10,color:"#475569",fontStyle:"italic"}}>{edu.degree}</div>}
                  <div style={{fontSize:10,color:"#64748b"}}>{edu.year}</div>
                  {edu.score && <div style={{fontSize:10,color:"#0284c7",fontWeight:600}}>{edu.score}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={{flex:1}}>
          {data.experiences.some(e=>e.company) && (
            <div style={{marginBottom:14}}>
              <div style={{fontWeight:800,color:"#0ea5e9",fontSize:9.5,textTransform:"uppercase",letterSpacing:"0.12em",borderBottom:"1px solid #bae6fd",paddingBottom:3,marginBottom:8}}>Experience</div>
              {data.experiences.filter(e=>e.company).map(exp=>(
                <div key={exp.id} style={{marginBottom:11}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",flexWrap:"wrap",gap:4}}>
                    <span style={{fontWeight:800,fontSize:12,color:"#0f172a"}}>{exp.company&&exp.role?`${exp.company} — ${exp.role}`:exp.company||exp.role}</span>
                    <span style={{fontSize:10,color:"#64748b",flexShrink:0}}>{exp.duration}</span>
                  </div>
                  <div style={{marginTop:4}}>{bullet(exp.points)}</div>
                </div>
              ))}
            </div>
          )}
          {data.projects.some(p=>p.name) && (
            <div>
              <div style={{fontWeight:800,color:"#0ea5e9",fontSize:9.5,textTransform:"uppercase",letterSpacing:"0.12em",borderBottom:"1px solid #bae6fd",paddingBottom:3,marginBottom:8}}>Projects</div>
              {data.projects.filter(p=>p.name).map(proj=>(
                <div key={proj.id} style={{marginBottom:10}}>
                  <div style={{fontWeight:700,fontSize:12,color:"#0f172a"}}>{proj.name}{proj.tech&&<span style={{fontWeight:400,fontSize:10,color:"#64748b"}}> | {proj.tech}</span>}</div>
                  <div style={{marginTop:3}}>{bullet(proj.points)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ClassicPreview({ data }) {
  const bullet = text => text.split("\n").filter(l=>l.trim()).map((l,i)=>(
    <li key={i} style={{fontSize:11,color:"#222",marginBottom:2}}>{l.replace(/^[•▸\-]\s*/,"")}</li>
  ));
  const S = data.skills;
  const skillLines = [
    {label:"Languages",val:S.languages},{label:"Frameworks & Tools",val:S.frameworks},
    {label:"Developer Tools",val:S.devtools},{label:"Libraries",val:S.libraries},{label:"Others",val:S.others},
  ].filter(c=>c.val.trim());
  const SHead = ({title}) => (
    <div style={{fontWeight:800,fontSize:11,textTransform:"uppercase",letterSpacing:"0.1em",borderBottom:"1.5px solid #111",marginBottom:5,paddingBottom:2,marginTop:13,color:"#0a0f1e"}}>{title}</div>
  );
  return (
    <div id="resume-preview" style={{fontFamily:"'Times New Roman',Times,serif",background:"#fff",color:"#111",padding:32,maxWidth:680,margin:"0 auto",fontSize:12,lineHeight:1.65}}>
      <div style={{textAlign:"center",marginBottom:10}}>
        <h1 style={{margin:"0 0 4px",fontSize:21,fontWeight:800,letterSpacing:"1.5px",textTransform:"uppercase"}}>{data.name||"YOUR NAME"}</h1>
        <div style={{fontSize:11,color:"#444"}}>{[data.email,data.phone,data.linkedin,data.github].filter(Boolean).join("  •  ")}</div>
      </div>
      <div style={{borderTop:"2px solid #111",borderBottom:"0.5px solid #999",height:4,marginBottom:4}} />
      {data.summary && <><SHead title="Summary" /><p style={{fontSize:11,margin:"0 0 4px"}}>{data.summary}</p></>}
      {data.educations.some(e=>e.institution) && <><SHead title="Education" />
        {data.educations.filter(e=>e.institution).map(edu=>(
          <div key={edu.id} style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
            <div><strong>{edu.institution}</strong>{edu.degree&&<em style={{color:"#444"}}> — {edu.degree}</em>}{edu.score&&<span style={{color:"#555"}}> ({edu.score})</span>}</div>
            <span style={{fontSize:11,color:"#555",flexShrink:0,marginLeft:8}}>{edu.year}</span>
          </div>
        ))}</>}
      {data.experiences.some(e=>e.company) && <><SHead title="Work Experience" />
        {data.experiences.filter(e=>e.company).map(exp=>(
          <div key={exp.id} style={{marginBottom:9}}>
            <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:4}}>
              <strong style={{fontSize:12}}>{exp.company&&exp.role?`${exp.company} — ${exp.role}`:exp.company||exp.role}</strong>
              <span style={{fontSize:11,color:"#555"}}>{exp.duration}</span>
            </div>
            <ul style={{margin:"3px 0 0 16px",padding:0}}>{bullet(exp.points)}</ul>
          </div>
        ))}</>}
      {data.projects.some(p=>p.name) && <><SHead title="Projects" />
        {data.projects.filter(p=>p.name).map(proj=>(
          <div key={proj.id} style={{marginBottom:9}}>
            <strong>{proj.name}</strong>{proj.tech&&<em style={{color:"#555",fontSize:11}}> | {proj.tech}</em>}
            <ul style={{margin:"3px 0 0 16px",padding:0}}>{bullet(proj.points)}</ul>
          </div>
        ))}</>}
      {skillLines.length>0 && <><SHead title="Technical Skills" />
        {skillLines.map(cat=>(
          <div key={cat.label} style={{fontSize:11,marginBottom:2}}><strong>{cat.label}:</strong> {cat.val}</div>
        ))}</>}
    </div>
  );
}

/* ═══════════════════════════════════
   TEMPLATE THUMBNAILS
═══════════════════════════════════ */
const Tmpl1 = () => (
  <div style={{padding:10,fontSize:8.5,fontFamily:"serif",color:"#111",lineHeight:1.45,background:"#fff"}}>
    <div style={{display:"flex",gap:10,borderBottom:"2px solid #0ea5e9",paddingBottom:8,marginBottom:8}}>
      <div style={{width:44,height:44,borderRadius:"50%",background:"linear-gradient(135deg,#0ea5e9,#8b5cf6)",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:16}}>👤</div>
      <div>
        <div style={{fontWeight:700,fontSize:13,color:"#0a0f1e"}}>Your Name</div>
        <div style={{color:"#0ea5e9",fontSize:9}}>email • phone • linkedin</div>
        <div style={{fontSize:8,color:"#666",marginTop:3}}>Professional summary...</div>
      </div>
    </div>
    <div style={{display:"flex",gap:8}}>
      <div style={{width:"36%",background:"#f0f9ff",padding:5,borderRadius:4}}>
        <div style={{fontWeight:700,color:"#0ea5e9",fontSize:8,marginBottom:3}}>SKILLS</div>
        <div style={{fontSize:7,color:"#333"}}>Java • Python • Spring Boot</div>
        <div style={{fontWeight:700,color:"#0ea5e9",fontSize:8,marginTop:6,marginBottom:3}}>EDUCATION</div>
        <div style={{fontSize:7,color:"#333"}}>B.Tech CS — 2027</div>
      </div>
      <div style={{flex:1}}>
        <div style={{fontWeight:700,color:"#0ea5e9",fontSize:8,marginBottom:3}}>EXPERIENCE</div>
        <div style={{fontSize:7,color:"#333",marginBottom:5}}>APPLE — Software Intern<br/>Jun–Aug 2024</div>
        <div style={{fontWeight:700,color:"#0ea5e9",fontSize:8,marginBottom:3}}>PROJECTS</div>
        <div style={{fontSize:7,color:"#333"}}>HIREON | React, Spring Boot</div>
      </div>
    </div>
  </div>
);
const Tmpl2 = () => (
  <div style={{padding:12,fontSize:8.5,fontFamily:"'Times New Roman',serif",color:"#111",lineHeight:1.55,background:"#fff"}}>
    <div style={{textAlign:"center",marginBottom:8}}>
      <div style={{fontWeight:700,fontSize:13,letterSpacing:1}}>YOUR NAME</div>
      <div style={{fontSize:8.5,color:"#555"}}>email • phone • linkedin • github</div>
      <div style={{borderTop:"2px solid #111",borderBottom:"0.5px solid #111",height:4,marginTop:5}} />
    </div>
    {["EDUCATION","EXPERIENCE","PROJECTS","TECHNICAL SKILLS"].map(s=>(
      <div key={s} style={{marginBottom:7}}>
        <div style={{fontWeight:700,fontSize:9,borderBottom:"1.5px solid #333",marginBottom:2,paddingBottom:1}}>{s}</div>
        <div style={{fontSize:7.5,color:"#444"}}>
          {s==="TECHNICAL SKILLS"?"Languages: Java, Python | Frameworks: Spring Boot"
           :s==="EXPERIENCE"?"GOOGLE — Software Intern | Jun–Aug 2024"
           :"Detail here • Dates • Score"}
        </div>
      </div>
    ))}
  </div>
);

/* ═══════════════════════════════════
   TOPBAR (shared)
═══════════════════════════════════ */
function Topbar({ right, breadcrumb }) {
  const navigate = useNavigate();
  return (
    <header style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
      padding:"0 32px", height:56, background:"rgba(8,8,8,0.92)",
      backdropFilter:"blur(20px)", borderBottom:`1px solid ${T.border}`,
      position:"sticky", top:0, zIndex:200 }}>
      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
        <button onClick={() => navigate("/Candidate/06_MainCand")}
          style={{ background:"transparent", border:`1px solid ${T.border}`, borderRadius:7,
            padding:"6px 14px", color:T.muted, fontSize:"0.78rem", fontWeight:600,
            cursor:"pointer", fontFamily:"'DM Sans',sans-serif", transition:"all 0.2s" }}
          onMouseEnter={e=>{e.currentTarget.style.color=T.white;e.currentTarget.style.borderColor=T.border2;}}
          onMouseLeave={e=>{e.currentTarget.style.color=T.muted;e.currentTarget.style.borderColor=T.border;}}>
          ← Dashboard
        </button>
        <span style={{ color:T.border2, fontSize:"0.7rem" }}>/</span>
        <span style={{ fontFamily:"'Playfair Display',serif", fontWeight:700,
          fontSize:"0.85rem", color:T.white }}>{breadcrumb}</span>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        {right}
        <div style={{ display:"flex", alignItems:"center", gap:6,
          fontFamily:"'Playfair Display',serif", fontWeight:900,
          fontSize:"0.95rem", color:T.white, letterSpacing:"0.05em" }}>
          <div style={{ width:24, height:24, borderRadius:5, background:T.white,
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <svg width="12" height="12" viewBox="0 0 18 18" fill="none">
              <path d="M3 2V16M15 2V16M3 9H15" stroke="#080808" strokeWidth="3" strokeLinecap="round"/>
            </svg>
          </div>
          HIREON
        </div>
      </div>
    </header>
  );
}

/* ═══════════════════════════════════
   LANDING SCREEN
═══════════════════════════════════ */
function Landing({ onStart }) {
  const canvasRef = useRef();
  useParticles(canvasRef);
  return (
    <div style={{ minHeight:"100vh", background:T.bg, display:"flex", flexDirection:"column",
      fontFamily:"'DM Sans',sans-serif", position:"relative", overflow:"hidden" }}>
      <canvas ref={canvasRef} style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none" }} />

      <Topbar breadcrumb="Resume Builder" />

      {/* Hero */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center",
        justifyContent:"center", padding:"80px 24px", textAlign:"center", position:"relative", zIndex:1 }}>

        {/* Badge */}
        <div className="hireon-fade" style={{ display:"inline-flex", alignItems:"center", gap:8,
          background:"rgba(129,230,160,0.06)", color:T.green,
          border:`1px solid rgba(129,230,160,0.2)`, padding:"5px 16px",
          borderRadius:20, fontSize:"0.68rem", fontWeight:600, letterSpacing:"0.1em",
          textTransform:"uppercase", marginBottom:32 }}>
          <span style={{ width:6, height:6, borderRadius:"50%", background:T.green,
            boxShadow:`0 0 8px ${T.green}`, display:"inline-block",
            animation:"pulseGlow 2s infinite" }} />
          AI Powered · Free Forever
        </div>

        <h1 className="hireon-fade" style={{ fontFamily:"'Playfair Display',serif",
          fontSize:"clamp(2.4rem,6vw,4.2rem)", fontWeight:900, lineHeight:1.05,
          color:T.white, margin:"0 0 12px", animationDelay:"0.08s" }}>
          Build Your Resume.
        </h1>
        <h1 className="hireon-fade" style={{ fontFamily:"'Playfair Display',serif",
          fontSize:"clamp(2.4rem,6vw,4.2rem)", fontWeight:900, lineHeight:1.05,
          fontStyle:"italic", color:T.accent, margin:"0 0 28px", animationDelay:"0.16s" }}>
          Land Your Dream Job.
        </h1>

        <p className="hireon-fade" style={{ fontSize:"0.88rem", color:T.muted, maxWidth:400,
          lineHeight:1.85, margin:"0 0 52px", animationDelay:"0.24s" }}>
          Create a standout, recruiter-ready resume in minutes. Choose from modern or
          classic templates and get hired at top companies.
        </p>

        {/* Stats */}
        <div className="hireon-fade" style={{ display:"flex", background:T.surface,
          border:`1px solid ${T.border}`, borderRadius:12, overflow:"hidden",
          marginBottom:52, animationDelay:"0.3s" }}>
          {[{val:"100%",label:"Free Forever"},{val:"ATS",label:"Optimised"},{val:"PDF",label:"Download"}].map(({val,label},i,arr)=>(
            <div key={label} style={{ display:"flex", flexDirection:"column", alignItems:"center",
              padding:"16px 36px", gap:4,
              borderRight: i<arr.length-1 ? `1px solid ${T.border}` : "none" }}>
              <span style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.3rem",
                fontWeight:900, color:T.white }}>{val}</span>
              <span style={{ fontSize:"0.62rem", fontWeight:600, color:T.muted,
                letterSpacing:"0.1em", textTransform:"uppercase" }}>{label}</span>
            </div>
          ))}
        </div>

        <button className="hireon-fade" onClick={onStart}
          style={{ background:T.white, color:"#080808", border:"none", borderRadius:10,
            padding:"14px 52px", fontSize:"0.82rem", fontWeight:700, cursor:"pointer",
            fontFamily:"'DM Sans',sans-serif", letterSpacing:"0.08em",
            textTransform:"uppercase", transition:"all 0.2s", animationDelay:"0.36s" }}
          onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 8px 32px rgba(255,255,255,0.15)";e.currentTarget.style.transform="translateY(-1px)";}}
          onMouseLeave={e=>{e.currentTarget.style.boxShadow="none";e.currentTarget.style.transform="none";}}>
          Build My Resume →
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════
   TEMPLATE CHOOSER
═══════════════════════════════════ */
function TemplateChooser({ selected, onSelect, onBack, onContinue }) {
  const canvasRef = useRef();
  useParticles(canvasRef);
  const templates = [
    { id:"modern",  label:"Modern Photo Resume",  sub:"2-column layout with profile photo",
      badge:"✦ Recommended", badgeColor:T.green,
      tags:["Photo","2-Column","Colorful","Modern"],
      desc:"Best for product companies, startups, and dev roles. Visually distinctive and recruiter-memorable.",
      Preview:Tmpl1 },
    { id:"classic", label:"Classic ATS Resume",   sub:"Single column, universally accepted",
      badge:"✓ ATS-Safe", badgeColor:T.blue,
      tags:["No Photo","1-Column","Clean","University-Safe"],
      desc:"Best for campus placements, MNC applications, and ATS-scanned portals. Clean and professional.",
      Preview:Tmpl2 },
  ];
  return (
    <div style={{ minHeight:"100vh", background:T.bg, fontFamily:"'DM Sans',sans-serif",
      position:"relative", overflow:"hidden" }}>
      <canvas ref={canvasRef} style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none" }} />

      <Topbar breadcrumb="Choose Template"
        right={
          <button onClick={onBack}
            style={{ background:"transparent", border:`1px solid ${T.border}`, borderRadius:7,
              padding:"6px 14px", color:T.muted, fontSize:"0.78rem", fontWeight:600,
              cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>
            ← Back
          </button>
        }
      />

      <div style={{ maxWidth:900, margin:"0 auto", padding:"52px 32px", position:"relative", zIndex:1 }}>

        {/* Heading */}
        <div style={{ textAlign:"center", marginBottom:52 }} className="hireon-fade">
          <div style={{ display:"inline-flex", alignItems:"center", gap:8,
            background:`${T.blue}10`, color:T.blue, border:`1px solid ${T.blue}30`,
            padding:"4px 14px", borderRadius:20, fontSize:"0.65rem", fontWeight:600,
            letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:18 }}>
            <span style={{ width:5, height:5, borderRadius:"50%", background:T.green,
              boxShadow:`0 0 6px ${T.green}`, display:"inline-block" }} />
            Step 1 of 2
          </div>
          <h2 style={{ fontFamily:"'Playfair Display',serif",
            fontSize:"clamp(1.8rem,4vw,3rem)", fontWeight:900, color:T.white,
            margin:"0 0 10px", lineHeight:1.1 }}>
            Choose Your Template.
          </h2>
          <p style={{ color:T.muted, fontSize:"0.83rem", lineHeight:1.8 }}>
            Pick the style that best fits your industry and target company.
          </p>
        </div>

        {/* Template cards */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:1,
          background:T.border, border:`1px solid ${T.border}`, borderRadius:16,
          overflow:"hidden", marginBottom:40 }}>
          {templates.map(t => (
            <div key={t.id} onClick={() => onSelect(t.id)}
              style={{ background: selected===t.id ? "rgba(255,255,255,0.04)" : T.bg,
                cursor:"pointer", transition:"background 0.2s", position:"relative",
                outline: selected===t.id ? `2px solid ${t.badgeColor}40` : "none" }}
              onMouseEnter={e => { if(selected!==t.id) e.currentTarget.style.background="rgba(255,255,255,0.02)"; }}
              onMouseLeave={e => { if(selected!==t.id) e.currentTarget.style.background=T.bg; }}>
              {selected===t.id && <div style={{ position:"absolute", top:0, left:0, right:0, height:2,
                background:`linear-gradient(90deg,${t.badgeColor},transparent)` }} />}
              {/* Preview */}
              <div style={{ background:"rgba(255,255,255,0.02)", padding:"24px 20px",
                borderBottom:`1px solid ${T.border}` }}>
                <t.Preview />
              </div>
              {/* Info */}
              <div style={{ padding:"22px 24px 26px" }}>
                <div style={{ display:"flex", justifyContent:"space-between",
                  alignItems:"flex-start", marginBottom:8, gap:8 }}>
                  <div>
                    <div style={{ fontFamily:"'Playfair Display',serif", color:T.white,
                      fontWeight:900, fontSize:"0.95rem", letterSpacing:"0.03em",
                      marginBottom:3 }}>{t.label}</div>
                    <div style={{ color:T.muted, fontSize:"0.72rem" }}>{t.sub}</div>
                  </div>
                  <span style={{ background:`${t.badgeColor}10`, color:t.badgeColor,
                    border:`1px solid ${t.badgeColor}25`, borderRadius:20, padding:"3px 10px",
                    fontSize:"0.65rem", fontWeight:700, whiteSpace:"nowrap" }}>{t.badge}</span>
                </div>
                <p style={{ color:T.muted, fontSize:"0.78rem", lineHeight:1.75, marginBottom:14 }}>{t.desc}</p>
                <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                  {t.tags.map(tag => (
                    <span key={tag} style={{ background:T.surface, border:`1px solid ${T.border}`,
                      color:T.muted2, borderRadius:20, padding:"2px 10px",
                      fontSize:"0.65rem" }}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        {selected && (
          <div style={{ textAlign:"center" }} className="hireon-fade">
            <button onClick={onContinue}
              style={{ background:T.white, color:"#080808", border:"none", borderRadius:10,
                padding:"14px 52px", fontSize:"0.82rem", fontWeight:700, cursor:"pointer",
                fontFamily:"'DM Sans',sans-serif", letterSpacing:"0.08em",
                textTransform:"uppercase", transition:"all 0.2s" }}
              onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 8px 32px rgba(255,255,255,0.15)";e.currentTarget.style.transform="translateY(-1px)";}}
              onMouseLeave={e=>{e.currentTarget.style.boxShadow="none";e.currentTarget.style.transform="none";}}>
              Continue with {selected==="modern" ? "Modern Photo" : "Classic ATS"} →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════
   MAIN APP
═══════════════════════════════════ */
export default function ResumeBuilder() {
  const [screen,   setScreen]   = useState("landing");
  const [template, setTemplate] = useState(null);
  const [data,     setData]     = useState(defaultData);
  const [tab,      setTab]      = useState("form");

  const handlePrint = () => {
    const el = document.getElementById("resume-preview");
    if(!el) return;
    const win = window.open("","_blank");
    win.document.write(`<html><head><title>${data.name||"Resume"}</title>
      <style>body{margin:0;padding:0;font-family:inherit;}
      @media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact;}}</style>
      </head><body>${el.outerHTML}</body></html>`);
    win.document.close();
    setTimeout(() => win.print(), 300);
  };

  if(screen==="landing") return <><GlobalStyle/><Landing onStart={()=>setScreen("choose")}/></>;
  if(screen==="choose")  return <><GlobalStyle/><TemplateChooser selected={template} onSelect={setTemplate} onBack={()=>setScreen("landing")} onContinue={()=>setScreen("build")}/></>;

  return (
    <>
      <GlobalStyle/>
      <div style={{ minHeight:"100vh", background:T.bg, fontFamily:"'DM Sans',sans-serif" }}>

        <Topbar breadcrumb={template==="modern" ? "Modern Photo Resume" : "Classic ATS Resume"}
          right={
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={() => setTab(tab==="form"?"preview":"form")}
                style={{ background:"transparent", border:`1px solid ${T.border}`, borderRadius:7,
                  padding:"7px 16px", color:T.muted, fontSize:"0.78rem", fontWeight:600,
                  cursor:"pointer", fontFamily:"'DM Sans',sans-serif", transition:"all 0.2s" }}
                onMouseEnter={e=>{e.currentTarget.style.color=T.white;e.currentTarget.style.borderColor=T.border2;}}
                onMouseLeave={e=>{e.currentTarget.style.color=T.muted;e.currentTarget.style.borderColor=T.border;}}>
                {tab==="form" ? "Preview" : "Edit"}
              </button>
              <button onClick={handlePrint}
                style={{ background:T.white, color:"#080808", border:"none", borderRadius:7,
                  padding:"7px 18px", fontSize:"0.78rem", fontWeight:700,
                  cursor:"pointer", fontFamily:"'DM Sans',sans-serif", letterSpacing:"0.04em",
                  textTransform:"uppercase", transition:"all 0.2s" }}
                onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 4px 20px rgba(255,255,255,0.15)";}}
                onMouseLeave={e=>{e.currentTarget.style.boxShadow="none";}}>
                Download PDF
              </button>
            </div>
          }
        />

        {/* Body */}
        <div style={{ maxWidth: tab==="preview" ? 760 : 1280, margin:"0 auto",
          padding:"28px 24px",
          display: tab==="form" ? "grid" : "block",
          gridTemplateColumns: tab==="form" ? "minmax(360px,1fr) minmax(360px,1fr)" : undefined,
          gap:24, alignItems:"start" }}>

          {tab==="form" && (
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16 }}>
                <div style={{ width:2, height:18, background:`linear-gradient(180deg,${T.blue},transparent)`, borderRadius:1 }} />
                <span style={{ fontSize:"0.65rem", fontWeight:700, color:T.muted,
                  textTransform:"uppercase", letterSpacing:"0.12em" }}>Fill Your Details</span>
              </div>
              <BuilderForm data={data} setData={setData} template={template} />
            </div>
          )}

          <div style={tab==="form" ? {position:"sticky",top:64} : {}}>
            {tab==="form" && (
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16 }}>
                <div style={{ width:2, height:18, background:`linear-gradient(180deg,${T.green},transparent)`, borderRadius:1 }} />
                <span style={{ fontSize:"0.65rem", fontWeight:700, color:T.muted,
                  textTransform:"uppercase", letterSpacing:"0.12em" }}>Live Preview</span>
                <span style={{ fontSize:"0.6rem", color:T.muted, background:T.surface,
                  border:`1px solid ${T.border}`, borderRadius:20, padding:"2px 9px" }}>
                  Updates as you type
                </span>
              </div>
            )}
            <div style={{ background:"#fff", borderRadius:12, overflow:"hidden",
              boxShadow:"0 16px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)" }}>
              {template==="modern" ? <ModernPreview data={data} /> : <ClassicPreview data={data} />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}