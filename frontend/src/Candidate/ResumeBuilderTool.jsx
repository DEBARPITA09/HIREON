import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
/* ═══════════════════════════════════════════════════════════
   DESIGN TOKENS
═══════════════════════════════════════════════════════════ */
const C = {
  bg:        "#060d1a",
  surface:   "#0b1528",
  card:      "#0f1e35",
  cardHover: "#142540",
  border:    "#1a3350",
  teal:      "#0ea5e9",
  tealLight: "#38bdf8",
  tealGlow:  "rgba(14,165,233,0.1)",
  gold:      "#f59e0b",
  goldGlow:  "rgba(245,158,11,0.15)",
  purple:    "#8b5cf6",
  text:      "#e2e8f0",
  muted:     "#64748b",
  muted2:    "#94a3b8",
  white:     "#ffffff",
  danger:    "#ef4444",
  success:   "#10b981",
};

/* ═══════════════════════════════════════════════════════════
   GLOBAL STYLES
═══════════════════════════════════════════════════════════ */
const GlobalStyle = () => (
  <>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Syne:wght@700;800&display=swap');
      *{box-sizing:border-box;margin:0;padding:0;}
      body{font-family:'Inter',sans-serif;}
      input,textarea{font-family:'Outfit','Segoe UI',sans-serif;}
      input::placeholder,textarea::placeholder{color:#1e3050;}
      input:focus,textarea:focus{
        border-color:#4f8ef7!important;
        box-shadow:0 0 0 3px rgba(79,142,247,0.08)!important;
        outline:none;
      }
      ::-webkit-scrollbar{width:5px;}
      ::-webkit-scrollbar-track{background:#05080f;}
      ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.08);border-radius:3px;}
      @keyframes fadeUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
      @keyframes pulseRing{0%{box-shadow:0 0 0 0 rgba(79,142,247,0.4);}70%{box-shadow:0 0 0 10px rgba(79,142,247,0);}100%{box-shadow:0 0 0 0 rgba(79,142,247,0);}}
      .fade-up{animation:fadeUp 0.45s ease both;}
      .skill-chip{
        display:inline-flex;align-items:center;
        background:rgba(79,142,247,0.08);
        border:1px solid rgba(79,142,247,0.2);
        color:#93c5fd;border-radius:20px;
        padding:3px 11px;font-size:11px;font-weight:500;
        margin:2px;
      }
      .pulse-photo{animation:pulseRing 2.5s infinite;}
    `}</style>
  </>
);

/* ═══════════════════════════════════════════════════════════
   ATOMS
═══════════════════════════════════════════════════════════ */
const Tag = ({ children, color = C.teal }) => (
  <span style={{
    background:`${color}18`,color,
    border:`1px solid ${color}38`,
    borderRadius:20,padding:"3px 11px",
    fontSize:11,fontWeight:600,letterSpacing:"0.04em",whiteSpace:"nowrap",
  }}>{children}</span>
);

const ICONS = {
  "✍️": <i className="fa-solid fa-pen" style={{fontSize:11,color:"#4f8ef7"}} />,
  "📧": <i className="fa-solid fa-envelope" style={{fontSize:11,color:"#4f8ef7"}} />,
  "📞": <i className="fa-solid fa-phone" style={{fontSize:11,color:"#4f8ef7"}} />,
  "🔗": <i className="fa-brands fa-linkedin" style={{fontSize:12,color:"#0a66c2"}} />,
  "🐙": <i className="fa-brands fa-github" style={{fontSize:12,color:"#e2e8f0"}} />,
  "📝": <i className="fa-solid fa-file-lines" style={{fontSize:11,color:"#4f8ef7"}} />,
  "🎓": <i className="fa-solid fa-graduation-cap" style={{fontSize:11,color:"#f59e0b"}} />,
  "🏢": <i className="fa-solid fa-building" style={{fontSize:11,color:"#4f8ef7"}} />,
  "🪪": <i className="fa-solid fa-id-badge" style={{fontSize:11,color:"#4f8ef7"}} />,
  "📅": <i className="fa-solid fa-calendar" style={{fontSize:11,color:"#4f8ef7"}} />,
  "📋": <i className="fa-solid fa-list-check" style={{fontSize:11,color:"#4f8ef7"}} />,
  "📌": <i className="fa-solid fa-thumbtack" style={{fontSize:11,color:"#f59e0b"}} />,
  "⚙️": <i className="fa-solid fa-gear" style={{fontSize:11,color:"#4f8ef7"}} />,
};

const Label = ({ children, icon }) => (
  <label style={{
    display:"flex",alignItems:"center",gap:6,
    fontSize:11,fontWeight:600,color:"#e2e8f0",
    textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6,
  }}>
    {icon && <span style={{width:16,display:"flex",alignItems:"center",justifyContent:"center"}}>{ICONS[icon] || <span style={{fontSize:11}}>{icon}</span>}</span>}
    {children}
  </label>
);

const Input = ({ value, onChange, placeholder, type="text", style={} }) => (
  <input type={type} value={value} onChange={onChange} placeholder={placeholder}
    style={{
      width:"100%",background:"#020508",
      border:"1px solid rgba(255,255,255,0.07)",borderRadius:10,
      color:"#e2e8f0",padding:"11px 14px",fontSize:14,
      outline:"none",transition:"border-color 0.2s,box-shadow 0.2s",
      fontFamily:"'Outfit','Segoe UI',sans-serif",
      ...style,
    }}
  />
);

const Textarea = ({ value, onChange, placeholder, rows=3 }) => (
  <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows}
    style={{
      width:"100%",background:"#020508",
      border:"1px solid rgba(255,255,255,0.07)",borderRadius:10,
      color:"#e2e8f0",padding:"11px 14px",fontSize:14,
      outline:"none",resize:"vertical",transition:"border-color 0.2s",
      fontFamily:"'Outfit','Segoe UI',sans-serif",
    }}
  />
);

const Btn = ({ children, onClick, variant="primary", style={} }) => {
  const variants = {
    primary:{ background:`linear-gradient(135deg,${C.teal},#0284c7)`,color:"#fff",border:"none",boxShadow:`0 4px 16px rgba(14,165,233,0.3)` },
    ghost:  { background:"transparent",color:C.teal,border:`1px solid ${C.teal}50` },
    danger: { background:"#ef444412",color:C.danger,border:`1px solid ${C.danger}40` },
    gold:   { background:`linear-gradient(135deg,${C.gold},#d97706)`,color:"#060d1a",border:"none",boxShadow:`0 4px 18px rgba(245,158,11,0.38)` },
    subtle: { background:"#0f1e35",color:C.muted2,border:`1px solid ${C.border}` },
  };
  return (
    <button onClick={onClick} style={{
      borderRadius:10,padding:"10px 20px",fontSize:13,
      fontWeight:600,cursor:"pointer",transition:"all 0.2s",
      fontFamily:"inherit",...variants[variant],...style,
    }}>{children}</button>
  );
};

/* ── Section card ── */
const Section = ({ title, icon, children, accent=C.teal }) => (
  <div style={{
    background:"#03060c",
    border:"1px solid rgba(255,255,255,0.06)",
    borderRadius:16,padding:24,marginBottom:18,
    position:"relative",overflow:"hidden",
  }}>
    <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,${accent},transparent)`}} />
    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:18,paddingBottom:12,borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
      <h3 style={{color:"#e2e8f0",fontSize:12,fontWeight:800,textTransform:"uppercase",letterSpacing:"0.18em",fontFamily:"'Syne',Georgia,serif"}}>{title}</h3>
    </div>
    {children}
  </div>
);

/* ── Sub-card ── */
const SubCard = ({ children }) => (
  <div style={{
    background:"#020508",borderRadius:12,padding:16,marginBottom:14,
    border:"1px solid rgba(255,255,255,0.05)",position:"relative",
  }}>
    <div style={{position:"absolute",top:12,left:-1,width:3,height:26,background:"linear-gradient(180deg,#4f8ef7,transparent)",borderRadius:"0 2px 2px 0"}} />
    {children}
  </div>
);

/* ═══════════════════════════════════════════════════════════
   DEFAULT STATE
═══════════════════════════════════════════════════════════ */
const emptyEdu  = () => ({ id:Date.now()+Math.random(), institution:"", degree:"", year:"", score:"" });
const emptyExp  = () => ({ id:Date.now()+Math.random(), company:"", role:"", duration:"", points:"" });
const emptyProj = () => ({ id:Date.now()+Math.random(), name:"", tech:"", points:"" });

const defaultSkills = { languages:"", frameworks:"", devtools:"", libraries:"", others:"" };

const defaultData = {
  photo:null, name:"", email:"", phone:"", linkedin:"", github:"", summary:"",
  skills:{ ...defaultSkills },
  educations: [emptyEdu()],
  experiences:[emptyExp()],
  projects:   [emptyProj()],
};

/* ═══════════════════════════════════════════════════════════
   SKILL CATEGORIES (pre-set 5)
═══════════════════════════════════════════════════════════ */
const SKILL_CATS = [
  { key:"languages",  label:"Languages",          icon:"⌨️", placeholder:"e.g. Java, Python, C, JavaScript, SQL" },
  { key:"frameworks", label:"Frameworks & Tools", icon:"🔧", placeholder:"e.g. Spring Boot, Hibernate, Flask, React" },
  { key:"devtools",   label:"Developer Tools",    icon:"🛠️", placeholder:"e.g. Git, VS Code, IntelliJ, Docker, Postman" },
  { key:"libraries",  label:"Libraries",          icon:"📦", placeholder:"e.g. pandas, NumPy, Matplotlib, PyTorch" },
  { key:"others",     label:"Others",             icon:"✨", placeholder:"e.g. REST APIs, Agile, Linux, AWS, Problem Solving" },
];

function SkillsSection({ skills, setSkills }) {
  return (
    <Section title="Technical Skills" icon="💡" accent={C.purple}>
      <p style={{color:C.muted,fontSize:12,marginBottom:16,lineHeight:1.6}}>
        Fill each category with comma-separated skills. Leave blank to hide that category.
      </p>
      {SKILL_CATS.map((cat,idx) => (
        <div key={cat.key} style={{marginBottom:16}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
            <div style={{
              width:24,height:24,borderRadius:6,background:`rgba(139,92,246,0.15)`,
              border:`1px solid rgba(139,92,246,0.3)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13
            }}>{cat.icon}</div>
            <label style={{fontSize:12,fontWeight:700,color:C.muted2,textTransform:"uppercase",letterSpacing:"0.08em"}}>
              {idx+1}. {cat.label}
            </label>
          </div>
          <Input
            value={skills[cat.key]}
            onChange={e => setSkills({...skills,[cat.key]:e.target.value})}
            placeholder={cat.placeholder}
          />
          {skills[cat.key] && (
            <div style={{marginTop:6}}>
              {skills[cat.key].split(",").map(s=>s.trim()).filter(Boolean).map((s,i)=>(
                <span key={i} className="skill-chip">{s}</span>
              ))}
            </div>
          )}
        </div>
      ))}
    </Section>
  );
}

/* ═══════════════════════════════════════════════════════════
   BUILDER FORM
═══════════════════════════════════════════════════════════ */
function BuilderForm({ data, setData, template }) {
  const photoRef = useRef();
  const set = k => e => setData({...data,[k]:e.target.value});
  const handlePhoto = e => {
    const file = e.target.files[0]; if(!file) return;
    const r = new FileReader();
    r.onload = ev => setData({...data,photo:ev.target.result});
    r.readAsDataURL(file);
  };
  const upd = (key,id,field,val) =>
    setData({...data,[key]:data[key].map(i=>i.id===id?{...i,[field]:val}:i)});
  const add    = (key,fn) => setData({...data,[key]:[...data[key],fn()]});
  const remove = (key,id) => setData({...data,[key]:data[key].filter(i=>i.id!==id)});

  return (
    <div>
      {/* Personal Info */}
      <Section title="Personal Information" icon="👤" accent={C.teal}>
        {template==="modern" && (
          <div style={{marginBottom:20,display:"flex",flexDirection:"column",alignItems:"center"}}>
            <div
              onClick={()=>photoRef.current.click()}
              className={!data.photo?"pulse-photo":""}
              style={{
                width:96,height:96,borderRadius:"50%",
                border:`2px dashed ${C.teal}`,background:"#07101e",
                cursor:"pointer",overflow:"hidden",
                display:"flex",alignItems:"center",justifyContent:"center",
              }}
            >
              {data.photo
                ? <img src={data.photo} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}} />
                : <div style={{textAlign:"center"}}>
                    <div style={{fontSize:26}}>📷</div>
                    <div style={{fontSize:10,color:C.muted,marginTop:4}}>Upload Photo</div>
                  </div>
              }
            </div>
            <input ref={photoRef} type="file" accept="image/*" onChange={handlePhoto} style={{display:"none"}} />
          </div>
        )}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <div style={{gridColumn:"1/-1"}}>
            <Label icon="✍️">Full Name *</Label>
            <Input value={data.name} onChange={set("name")} placeholder="e.g. Baibhabi Rath"
              style={{fontSize:16,fontWeight:600,padding:"12px 14px"}} />
          </div>
          <div><Label icon="📧">Email *</Label><Input value={data.email} onChange={set("email")} placeholder="you@email.com" /></div>
          <div><Label icon="📞">Phone *</Label><Input value={data.phone} onChange={set("phone")} placeholder="+91 9999999999" /></div>
          <div><Label icon="🔗">LinkedIn</Label><Input value={data.linkedin} onChange={set("linkedin")} placeholder="linkedin.com/in/yourname" /></div>
          <div><Label icon="🐙">GitHub</Label><Input value={data.github} onChange={set("github")} placeholder="github.com/yourname" /></div>
          <div style={{gridColumn:"1/-1"}}>
            <Label icon="📝">Professional Summary</Label>
            <Textarea value={data.summary} onChange={set("summary")}
              placeholder="A brief 2–3 line summary about yourself, your strengths, and career goals..." rows={3} />
          </div>
        </div>
      </Section>

      {/* Education */}
      <Section title="Education" icon="🎓" accent={C.gold}>
        {data.educations.map((edu,i)=>(
          <SubCard key={edu.id}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <span style={{color:C.tealLight,fontSize:12,fontWeight:700}}>#{i+1} Institution</span>
              {data.educations.length>1 &&
                <Btn variant="danger" onClick={()=>remove("educations",edu.id)} style={{padding:"4px 10px",fontSize:11}}>✕ Remove</Btn>}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <div style={{gridColumn:"1/-1"}}>
                <Label>Institution Name</Label>
                <Input value={edu.institution} onChange={e=>upd("educations",edu.id,"institution",e.target.value)} placeholder="e.g. Silicon University" />
              </div>
              <div>
                <Label>Degree / Course</Label>
                <Input value={edu.degree} onChange={e=>upd("educations",edu.id,"degree",e.target.value)} placeholder="B.Tech in CSE" />
              </div>
              <div>
                <Label>Year</Label>
                <Input value={edu.year} onChange={e=>upd("educations",edu.id,"year",e.target.value)} placeholder="2023 – Present" />
              </div>
              <div style={{gridColumn:"1/-1"}}>
                <Label>Score / CGPA / Percentage</Label>
                <Input value={edu.score} onChange={e=>upd("educations",edu.id,"score",e.target.value)} placeholder="8.5 CGPA or 85%" />
              </div>
            </div>
          </SubCard>
        ))}
        <Btn variant="ghost" onClick={()=>add("educations",emptyEdu)} style={{width:"100%"}}>+ Add Education</Btn>
      </Section>

      {/* Experience */}
      <Section title="Work Experience" icon="💼" accent={C.success}>
        {data.experiences.map((exp,i)=>(
          <SubCard key={exp.id}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <span style={{color:C.tealLight,fontSize:12,fontWeight:700}}>#{i+1} Experience</span>
              {data.experiences.length>1 &&
                <Btn variant="danger" onClick={()=>remove("experiences",exp.id)} style={{padding:"4px 10px",fontSize:11}}>✕ Remove</Btn>}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <div>
                <Label icon="🏢">Company Name</Label>
                <Input value={exp.company} onChange={e=>upd("experiences",exp.id,"company",e.target.value)} placeholder="e.g. Apple" />
              </div>
              <div>
                <Label icon="🪪">Role / Designation</Label>
                <Input value={exp.role} onChange={e=>upd("experiences",exp.id,"role",e.target.value)} placeholder="Software Intern" />
              </div>
              {(exp.company||exp.role) && (
                <div style={{gridColumn:"1/-1",background:"rgba(14,165,233,0.05)",borderRadius:8,padding:"8px 14px",border:`1px dashed ${C.border}`}}>
                  <span style={{color:C.muted,fontSize:11}}>Will appear as: </span>
                  <span style={{color:C.tealLight,fontWeight:700,fontSize:13}}>
                    {exp.company||"Company"} — {exp.role||"Role"}
                  </span>
                </div>
              )}
              <div style={{gridColumn:"1/-1"}}>
                <Label icon="📅">Duration</Label>
                <Input value={exp.duration} onChange={e=>upd("experiences",exp.id,"duration",e.target.value)} placeholder="June 2024 – Aug 2024" />
              </div>
              <div style={{gridColumn:"1/-1"}}>
                <Label icon="📋">Key Responsibilities / Achievements (one per line)</Label>
                <Textarea value={exp.points} onChange={e=>upd("experiences",exp.id,"points",e.target.value)}
                  placeholder={"• Built REST APIs using Spring Boot\n• Reduced query time by 30%\n• Integrated JWT authentication"} rows={4} />
              </div>
            </div>
          </SubCard>
        ))}
        <Btn variant="ghost" onClick={()=>add("experiences",emptyExp)} style={{width:"100%"}}>+ Add Experience</Btn>
      </Section>

      {/* Projects */}
      <Section title="Projects" icon="🚀" accent={C.purple}>
        {data.projects.map((proj,i)=>(
          <SubCard key={proj.id}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <span style={{color:C.tealLight,fontSize:12,fontWeight:700}}>#{i+1} Project</span>
              {data.projects.length>1 &&
                <Btn variant="danger" onClick={()=>remove("projects",proj.id)} style={{padding:"4px 10px",fontSize:11}}>✕ Remove</Btn>}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <div>
                <Label icon="📌">Project Name</Label>
                <Input value={proj.name} onChange={e=>upd("projects",proj.id,"name",e.target.value)} placeholder="e.g. HIREON" />
              </div>
              <div>
                <Label icon="⚙️">Tech Stack</Label>
                <Input value={proj.tech} onChange={e=>upd("projects",proj.id,"tech",e.target.value)} placeholder="React, Spring Boot, MySQL" />
              </div>
              <div style={{gridColumn:"1/-1"}}>
                <Label icon="📋">Description / Highlights (one per line)</Label>
                <Textarea value={proj.points} onChange={e=>upd("projects",proj.id,"points",e.target.value)}
                  placeholder={"• Built full-stack job portal with AI resume builder\n• Implemented JWT auth and role-based access"} rows={3} />
              </div>
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

/* ═══════════════════════════════════════════════════════════
   RESUME PREVIEWS
═══════════════════════════════════════════════════════════ */

/* ── MODERN ── */
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
                    <span style={{fontWeight:800,fontSize:12,color:"#0f172a"}}>
                      {exp.company&&exp.role ? `${exp.company} — ${exp.role}` : exp.company||exp.role}
                    </span>
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
                  <div style={{fontWeight:700,fontSize:12,color:"#0f172a"}}>
                    {proj.name}
                    {proj.tech && <span style={{fontWeight:400,fontSize:10,color:"#64748b"}}> | {proj.tech}</span>}
                  </div>
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

/* ── CLASSIC ── */
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
      {data.educations.some(e=>e.institution) && <>
        <SHead title="Education" />
        {data.educations.filter(e=>e.institution).map(edu=>(
          <div key={edu.id} style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
            <div>
              <strong>{edu.institution}</strong>
              {edu.degree && <em style={{color:"#444"}}> — {edu.degree}</em>}
              {edu.score && <span style={{color:"#555"}}> ({edu.score})</span>}
            </div>
            <span style={{fontSize:11,color:"#555",flexShrink:0,marginLeft:8}}>{edu.year}</span>
          </div>
        ))}
      </>}
      {data.experiences.some(e=>e.company) && <>
        <SHead title="Work Experience" />
        {data.experiences.filter(e=>e.company).map(exp=>(
          <div key={exp.id} style={{marginBottom:9}}>
            <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:4}}>
              <strong style={{fontSize:12}}>
                {exp.company&&exp.role ? `${exp.company} — ${exp.role}` : exp.company||exp.role}
              </strong>
              <span style={{fontSize:11,color:"#555"}}>{exp.duration}</span>
            </div>
            <ul style={{margin:"3px 0 0 16px",padding:0}}>{bullet(exp.points)}</ul>
          </div>
        ))}
      </>}
      {data.projects.some(p=>p.name) && <>
        <SHead title="Projects" />
        {data.projects.filter(p=>p.name).map(proj=>(
          <div key={proj.id} style={{marginBottom:9}}>
            <strong>{proj.name}</strong>
            {proj.tech && <em style={{color:"#555",fontSize:11}}> | {proj.tech}</em>}
            <ul style={{margin:"3px 0 0 16px",padding:0}}>{bullet(proj.points)}</ul>
          </div>
        ))}
      </>}
      {skillLines.length>0 && <>
        <SHead title="Technical Skills" />
        {skillLines.map(cat=>(
          <div key={cat.label} style={{fontSize:11,marginBottom:2}}><strong>{cat.label}:</strong> {cat.val}</div>
        ))}
      </>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   TEMPLATE THUMBNAILS
═══════════════════════════════════════════════════════════ */
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
        <div style={{fontSize:7,color:"#333",marginBottom:5}}>APPLE — Software Intern<br/>Jun–Aug 2024<br/>• Built REST APIs</div>
        <div style={{fontWeight:700,color:"#0ea5e9",fontSize:8,marginBottom:3}}>PROJECTS</div>
        <div style={{fontSize:7,color:"#333"}}>HIREON | React, Spring Boot<br/>• Job portal app</div>
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
          {s==="TECHNICAL SKILLS" ? "Languages: Java, Python | Frameworks: Spring Boot"
           : s==="EXPERIENCE" ? "GOOGLE — Software Intern | Jun–Aug 2024"
           : "Detail here • Dates • Score"}
        </div>
      </div>
    ))}
  </div>
);

/* ═══════════════════════════════════════════════════════════
   ANIMATED PARTICLE CANVAS BACKGROUND
═══════════════════════════════════════════════════════════ */
function ParticleCanvas() {
  const canvasRef = useRef();
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    let raf;

    const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    window.addEventListener("resize", resize);

    // Particle types: dots, rings, triangles
    const COLORS = [
      "rgba(14,165,233,",   // teal
      "rgba(139,92,246,",   // purple
      "rgba(245,158,11,",   // gold
      "rgba(56,189,248,",   // light teal
    ];

    const particles = Array.from({length: 55}, (_, i) => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 2.2 + 0.4,
      vx: (Math.random() - 0.5) * 0.38,
      vy: (Math.random() - 0.5) * 0.38,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: Math.random() * 0.5 + 0.15,
      type: i % 7 === 0 ? "ring" : i % 11 === 0 ? "tri" : "dot",
      size: Math.random() * 10 + 4,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.012,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.025 + 0.008,
    }));

    // Floating resume-themed words
    const words = [
      {text:"<code/>", x:W*0.08, y:H*0.18, vx:0.15, vy:0.08, alpha:0.07, size:13},
      {text:"skills",  x:W*0.82, y:H*0.12, vx:-0.1, vy:0.12, alpha:0.06, size:11},
      {text:"{ }",     x:W*0.72, y:H*0.75, vx:-0.12,vy:-0.09,alpha:0.07, size:14},
      {text:"resume",  x:W*0.15, y:H*0.78, vx:0.09, vy:-0.11,alpha:0.05, size:12},
      {text:"// hire", x:W*0.88, y:H*0.45, vx:-0.13,vy:0.07, alpha:0.06, size:11},
      {text:"</>",     x:W*0.42, y:H*0.88, vx:0.11, vy:-0.08,alpha:0.06, size:13},
    ];

    const drawTri = (x, y, size, rot, color, alpha) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.lineTo(size * 0.866, size * 0.5);
      ctx.lineTo(-size * 0.866, size * 0.5);
      ctx.closePath();
      ctx.strokeStyle = color + alpha + ")";
      ctx.lineWidth = 0.8;
      ctx.stroke();
      ctx.restore();
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // Connection lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(14,165,233,${0.06 * (1 - dist/130)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      particles.forEach(p => {
        p.pulse += p.pulseSpeed;
        const pulsedAlpha = p.alpha * (0.7 + 0.3 * Math.sin(p.pulse));

        if (p.type === "dot") {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = p.color + pulsedAlpha + ")";
          ctx.fill();
        } else if (p.type === "ring") {
          p.rot += p.rotSpeed;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.strokeStyle = p.color + (pulsedAlpha * 0.6) + ")";
          ctx.lineWidth = 0.7;
          ctx.stroke();
        } else if (p.type === "tri") {
          p.rot += p.rotSpeed;
          drawTri(p.x, p.y, p.size * 0.7, p.rot, p.color, pulsedAlpha * 0.55);
        }

        p.x += p.vx; p.y += p.vy;
        if (p.x < -20) p.x = W + 20;
        if (p.x > W + 20) p.x = -20;
        if (p.y < -20) p.y = H + 20;
        if (p.y > H + 20) p.y = -20;
      });

      // Floating words
      words.forEach(w => {
        ctx.font = `${w.size}px 'Courier New', monospace`;
        ctx.fillStyle = `rgba(56,189,248,${w.alpha})`;
        ctx.fillText(w.text, w.x, w.y);
        w.x += w.vx; w.y += w.vy;
        if (w.x < -80) w.x = W + 80;
        if (w.x > W + 80) w.x = -80;
        if (w.y < -20) w.y = H + 20;
        if (w.y > H + 20) w.y = -20;
      });

      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <canvas ref={canvasRef} style={{
      position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none", zIndex:0,
    }} />
  );
}

/* ═══════════════════════════════════════════════════════════
   LANDING
═══════════════════════════════════════════════════════════ */
function Landing({ onStart }) {
  const navigate = useNavigate();
  return (
    <div style={{minHeight:"100vh",background:"#05080f",display:"flex",flexDirection:"column",fontFamily:"'Outfit','Segoe UI',sans-serif",position:"relative",overflow:"hidden"}}>

      {/* Grid background */}
      <canvas ref={(() => {
        const ref = {current:null};
        return el => {
          if (!el || ref.current) return;
          ref.current = el;
          const ctx = el.getContext("2d");
          el.width = el.offsetWidth; el.height = el.offsetHeight;
          let W = el.width, H = el.height, t = 0, raf;
          const draw = () => {
            ctx.clearRect(0,0,W,H);
            ctx.strokeStyle="rgba(255,255,255,0.028)"; ctx.lineWidth=1;
            for(let x=0;x<W;x+=60){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
            for(let y=0;y<H;y+=60){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
            const cx=W/2,cy=H/2,r=300+Math.sin(t)*30;
            const g=ctx.createRadialGradient(cx,cy,0,cx,cy,r);
            g.addColorStop(0,"rgba(79,142,247,0.055)"); g.addColorStop(1,"transparent");
            ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
            t+=0.012; raf=requestAnimationFrame(draw);
          };
          draw();
        };
      })()} style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none"}} />

      {/* Top bar */}
      <div style={{display:"flex",alignItems:"center",gap:16,padding:"16px 48px",background:"rgba(5,8,15,0.85)",borderBottom:"1px solid rgba(255,255,255,0.055)",position:"sticky",top:0,zIndex:100,backdropFilter:"blur(18px)"}}>
        <button onClick={()=>navigate("/Candidate/06_MainCand")} style={{background:"transparent",color:"#64748b",border:"1px solid rgba(255,255,255,0.08)",padding:"7px 16px",borderRadius:8,fontFamily:"inherit",fontSize:13,fontWeight:600,cursor:"pointer",transition:"all 0.2s"}}
          onMouseEnter={e=>{e.currentTarget.style.color="#4f8ef7";e.currentTarget.style.borderColor="rgba(79,142,247,0.3)";}}
          onMouseLeave={e=>{e.currentTarget.style.color="#64748b";e.currentTarget.style.borderColor="rgba(255,255,255,0.08)";}}>
          ← Back to Dashboard
        </button>
        <div style={{fontWeight:800,fontSize:18,letterSpacing:"-0.4px"}}>
          <span style={{color:"#f0f4ff"}}>HIRE</span><span style={{color:"#4f8ef7"}}>ON</span>
        </div>
        <div style={{background:"rgba(79,142,247,0.07)",border:"1px solid rgba(79,142,247,0.18)",borderRadius:20,padding:"4px 14px",color:"#4f8ef7",fontSize:11,fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase"}}>
          Resume Builder
        </div>
      </div>

      {/* Hero */}
      <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"64px 24px",textAlign:"center",position:"relative",zIndex:1}}>

        <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(79,142,247,0.07)",color:"#4f8ef7",border:"1px solid rgba(79,142,247,0.18)",padding:"5px 16px",borderRadius:20,fontSize:11,fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:28}}>
          <span style={{width:6,height:6,borderRadius:"50%",background:"#00d4aa",boxShadow:"0 0 8px #00d4aa",display:"inline-block",animation:"pulse 2s infinite"}} />
          AI Powered · Free Forever
        </div>

        <h1 style={{fontSize:"clamp(34px,5vw,64px)",fontWeight:800,lineHeight:1.06,letterSpacing:"-2px",margin:"0 0 16px",color:"#f0f4ff",fontFamily:"'Syne',Georgia,serif"}}>
          Build Your Resume.<br />
          <span style={{fontStyle:"italic",fontWeight:300,color:"rgba(240,244,255,0.4)",fontFamily:"Georgia,'Times New Roman',serif",letterSpacing:"-1px"}}>Land Your Dream Job.</span>
        </h1>

        <p style={{fontSize:15,color:"#334155",maxWidth:420,lineHeight:1.8,margin:"0 0 44px"}}>
          Create a standout, recruiter-ready resume in minutes. Choose from modern or classic templates and get hired at top companies.
        </p>

        {/* Stats row */}
        <div style={{display:"flex",background:"rgba(255,255,255,0.025)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:14,overflow:"hidden",marginBottom:48}}>
          {[{val:"100%",label:"Free Forever"},{val:"ATS",label:"Optimised"},{val:"PDF",label:"Download"}].map(({val,label},i,arr)=>(
            <div key={label} style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"16px 36px",gap:4,borderRight:i<arr.length-1?"1px solid rgba(255,255,255,0.06)":"none"}}>
              <span style={{fontSize:20,fontWeight:800,color:"#f0f4ff",letterSpacing:"-0.5px"}}>{val}</span>
              <span style={{fontSize:11,fontWeight:500,color:"#475569",letterSpacing:"0.04em",textTransform:"uppercase"}}>{label}</span>
            </div>
          ))}
        </div>

        <button onClick={onStart}
          style={{background:"#f0f4ff",color:"#05080f",border:"none",borderRadius:12,padding:"15px 48px",fontSize:14,fontWeight:800,cursor:"pointer",fontFamily:"'Syne',Georgia,serif",letterSpacing:"0.14em",textTransform:"uppercase",transition:"all 0.2s"}}
          onMouseEnter={e=>{e.currentTarget.style.background="#ffffff";e.currentTarget.style.boxShadow="0 8px 32px rgba(240,244,255,0.15)";}}
          onMouseLeave={e=>{e.currentTarget.style.background="#f0f4ff";e.currentTarget.style.boxShadow="none";}}>
          BUILD MY RESUME →
        </button>

      </div>
      <style>{`@keyframes pulse{0%,100%{transform:scale(1);opacity:1;}50%{transform:scale(1.6);opacity:0.4;}}`}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   TEMPLATE CHOOSER
═══════════════════════════════════════════════════════════ */
function TemplateChooser({ selected, onSelect, onBack, onContinue }) {
  const navigate = useNavigate();
  const templates = [
    { id:"modern", label:"Modern Photo Resume", sub:"2-column layout with profile photo", badge:"✦ Recommended", badgeColor:"#00d4aa", tags:["📸 Photo","2-Column","Colorful","Modern"], desc:"Best for product companies, startups, and dev roles. Visually distinctive and recruiter-memorable.", Preview:Tmpl1 },
    { id:"classic", label:"Classic ATS Resume", sub:"Single column, universally accepted", badge:"✓ ATS-Safe", badgeColor:"#4f8ef7", tags:["No Photo","1-Column","Clean","University-Safe"], desc:"Best for campus placements, MNC applications, and ATS-scanned portals. Clean and professional.", Preview:Tmpl2 },
  ];

  return (
    <div style={{minHeight:"100vh",background:"#05080f",fontFamily:"'Outfit','Segoe UI',sans-serif",position:"relative",overflow:"hidden"}}>

      {/* Grid bg */}
      <canvas ref={(() => {
        const r={current:null};
        return el=>{
          if(!el||r.current)return; r.current=el;
          const ctx=el.getContext("2d");
          el.width=el.offsetWidth; el.height=el.offsetHeight;
          let W=el.width,H=el.height,t=0,raf;
          const draw=()=>{
            ctx.clearRect(0,0,W,H);
            ctx.strokeStyle="rgba(255,255,255,0.028)";ctx.lineWidth=1;
            for(let x=0;x<W;x+=60){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
            for(let y=0;y<H;y+=60){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
            const cx=W/2,cy=300,rr=320+Math.sin(t)*30;
            const g=ctx.createRadialGradient(cx,cy,0,cx,cy,rr);
            g.addColorStop(0,"rgba(79,142,247,0.05)");g.addColorStop(1,"transparent");
            ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
            t+=0.012;raf=requestAnimationFrame(draw);
          };
          draw();
        };
      })()} style={{position:"fixed",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:0}}/>

      {/* Top bar */}
      <div style={{display:"flex",alignItems:"center",gap:16,padding:"16px 48px",background:"rgba(5,8,15,0.85)",borderBottom:"1px solid rgba(255,255,255,0.055)",position:"sticky",top:0,zIndex:100,backdropFilter:"blur(18px)"}}>
        <button onClick={()=>navigate("/Candidate/06_MainCand")}
          style={{background:"transparent",color:"#64748b",border:"1px solid rgba(255,255,255,0.08)",padding:"7px 16px",borderRadius:8,fontFamily:"inherit",fontSize:13,fontWeight:600,cursor:"pointer",transition:"all 0.2s"}}
          onMouseEnter={e=>{e.currentTarget.style.color="#4f8ef7";e.currentTarget.style.borderColor="rgba(79,142,247,0.3)";}}
          onMouseLeave={e=>{e.currentTarget.style.color="#64748b";e.currentTarget.style.borderColor="rgba(255,255,255,0.08)";}}>
          ← Dashboard
        </button>
        <button onClick={onBack}
          style={{background:"transparent",color:"#64748b",border:"1px solid rgba(255,255,255,0.08)",padding:"7px 16px",borderRadius:8,fontFamily:"inherit",fontSize:13,fontWeight:600,cursor:"pointer",transition:"all 0.2s"}}
          onMouseEnter={e=>{e.currentTarget.style.color="#4f8ef7";e.currentTarget.style.borderColor="rgba(79,142,247,0.3)";}}
          onMouseLeave={e=>{e.currentTarget.style.color="#64748b";e.currentTarget.style.borderColor="rgba(255,255,255,0.08)";}}>
          ← Back
        </button>
        <div style={{fontWeight:800,fontSize:18,letterSpacing:"-0.4px"}}>
          <span style={{color:"#f0f4ff"}}>HIRE</span><span style={{color:"#4f8ef7"}}>ON</span>
        </div>
        <div style={{background:"rgba(79,142,247,0.07)",border:"1px solid rgba(79,142,247,0.18)",borderRadius:20,padding:"4px 14px",color:"#4f8ef7",fontSize:11,fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase"}}>
          Resume Builder
        </div>
      </div>

      <div style={{maxWidth:1000,margin:"0 auto",padding:"52px 40px",position:"relative",zIndex:1}}>

        {/* Heading */}
        <div style={{textAlign:"center",marginBottom:48}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(79,142,247,0.07)",color:"#4f8ef7",border:"1px solid rgba(79,142,247,0.18)",padding:"5px 16px",borderRadius:20,fontSize:11,fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:20}}>
            <span style={{width:6,height:6,borderRadius:"50%",background:"#00d4aa",boxShadow:"0 0 8px #00d4aa",display:"inline-block"}}/>
            Step 1 of 2
          </div>
          <h2 style={{color:"#f0f4ff",fontSize:"clamp(28px,4vw,48px)",fontWeight:800,letterSpacing:"-1.5px",lineHeight:1.08,fontFamily:"'Syne',Georgia,serif",margin:"0 0 12px"}}>
            Choose Your Template.
          </h2>
          <p style={{color:"#334155",fontSize:14,lineHeight:1.75}}>Pick the style that best fits your industry and target company.</p>
        </div>

        {/* Cards */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(340px,1fr))",gap:1,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.05)",borderRadius:20,overflow:"hidden",marginBottom:40}}>
          {templates.map(t=>(
            <div key={t.id}
  onClick={()=>onSelect(t.id)}
  onMouseEnter={e=>{ if(selected!==t.id) e.currentTarget.style.background="rgba(255,255,255,0.022)"; }}
  onMouseLeave={e=>{ if(selected!==t.id) e.currentTarget.style.background="#05080f"; }}
  style={{background:selected===t.id?"rgba(255,255,255,0.03)":"#05080f",cursor:"pointer",transition:"background 0.25s",position:"relative",overflow:"hidden"}}>
              {selected===t.id && <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,${t.badgeColor},transparent)`}}/>}

              {/* Preview */}
              <div style={{background:"#0a0f1e",padding:"24px 20px",borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
                <t.Preview/>
              </div>

              {/* Info */}
              <div style={{padding:"24px 24px 28px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10,gap:8}}>
                  <div>
                    <div style={{color:"#e2e8f0",fontWeight:800,fontSize:15,letterSpacing:"0.06em",textTransform:"uppercase",fontFamily:"'Syne',Georgia,serif",marginBottom:4}}>{t.label}</div>
                    <div style={{color:"#334155",fontSize:12}}>{t.sub}</div>
                  </div>
                  <span style={{background:`${t.badgeColor}12`,color:t.badgeColor,border:`1px solid ${t.badgeColor}30`,borderRadius:20,padding:"3px 11px",fontSize:10,fontWeight:700,whiteSpace:"nowrap",letterSpacing:"0.04em"}}>{t.badge}</span>
                </div>
                <p style={{color:"#334155",fontSize:13,lineHeight:1.7,marginBottom:16}}>{t.desc}</p>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {t.tags.map(tag=>(
                    <span key={tag} style={{background:"rgba(255,255,255,0.025)",border:"1px solid rgba(255,255,255,0.07)",color:"#475569",borderRadius:20,padding:"3px 10px",fontSize:11}}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        {selected && (
          <div style={{textAlign:"center"}}>
            <button onClick={onContinue}
              style={{background:"#f0f4ff",color:"#05080f",border:"none",borderRadius:12,padding:"15px 48px",fontSize:14,fontWeight:800,cursor:"pointer",fontFamily:"'Syne',Georgia,serif",letterSpacing:"0.14em",textTransform:"uppercase",transition:"all 0.2s"}}
              onMouseEnter={e=>{e.currentTarget.style.background="#ffffff";e.currentTarget.style.boxShadow="0 8px 32px rgba(240,244,255,0.15)";}}
              onMouseLeave={e=>{e.currentTarget.style.background="#f0f4ff";e.currentTarget.style.boxShadow="none";}}>
              CONTINUE WITH {selected==="modern"?"MODERN PHOTO":"CLASSIC ATS"} →
            </button>
          </div>
        )}
      </div>
      <style>{`@keyframes pulse{0%,100%{transform:scale(1);opacity:1;}50%{transform:scale(1.6);opacity:0.4;}}`}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════════════════════ */
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
      <style>body{margin:0;padding:0;font-family:inherit;}@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact;}}</style>
      </head><body>${el.outerHTML}</body></html>`);
    win.document.close();
    setTimeout(()=>win.print(),300);
  };

  if(screen==="landing") return <><GlobalStyle/><Landing onStart={()=>setScreen("choose")}/></>;
  if(screen==="choose")  return <><GlobalStyle/><TemplateChooser selected={template} onSelect={setTemplate} onBack={()=>setScreen("landing")} onContinue={()=>setScreen("build")}/></>;

  return (
    <>
      <GlobalStyle/>
      <div style={{minHeight:"100vh",background:"#05080f",fontFamily:"'Outfit','Segoe UI',sans-serif"}}>
        {/* Top bar */}
        <div style={{background:"rgba(5,8,15,0.9)",backdropFilter:"blur(18px)",borderBottom:"1px solid rgba(255,255,255,0.055)",padding:"14px 32px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:200}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <button onClick={()=>setScreen("choose")}
              style={{background:"transparent",color:"#64748b",border:"1px solid rgba(255,255,255,0.08)",padding:"7px 16px",borderRadius:8,fontFamily:"inherit",fontSize:13,fontWeight:600,cursor:"pointer",transition:"all 0.2s"}}
              onMouseEnter={e=>{e.currentTarget.style.color="#4f8ef7";e.currentTarget.style.borderColor="rgba(79,142,247,0.3)";}}
              onMouseLeave={e=>{e.currentTarget.style.color="#64748b";e.currentTarget.style.borderColor="rgba(255,255,255,0.08)";}}>
              ← Templates
            </button>
            <div style={{width:1,height:20,background:"rgba(255,255,255,0.07)"}}/>
            <span style={{color:"#f0f4ff",fontWeight:800,fontSize:15,fontFamily:"'Syne',Georgia,serif",letterSpacing:"0.06em",textTransform:"uppercase"}}>
              {template==="modern" ? "Modern Photo Resume" : "Classic ATS Resume"}
            </span>
            <span style={{background:"rgba(79,142,247,0.07)",color:"#4f8ef7",border:"1px solid rgba(79,142,247,0.18)",borderRadius:20,padding:"3px 12px",fontSize:10,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase"}}>
              {template==="modern" ? "Modern" : "Classic"}
            </span>
          </div>
          <div style={{display:"flex",gap:10}}>
            <button onClick={()=>setTab(tab==="form"?"preview":"form")}
              style={{background:"transparent",color:"#64748b",border:"1px solid rgba(255,255,255,0.08)",padding:"8px 18px",borderRadius:8,fontFamily:"inherit",fontSize:13,fontWeight:600,cursor:"pointer",transition:"all 0.2s"}}
              onMouseEnter={e=>{e.currentTarget.style.color="#4f8ef7";e.currentTarget.style.borderColor="rgba(79,142,247,0.3)";}}
              onMouseLeave={e=>{e.currentTarget.style.color="#64748b";e.currentTarget.style.borderColor="rgba(255,255,255,0.08)";}}>
              {tab==="form" ? "👁 Preview" : "✏️ Edit"}
            </button>
            <button onClick={handlePrint}
              style={{background:"#f0f4ff",color:"#05080f",border:"none",borderRadius:8,padding:"8px 20px",fontFamily:"'Syne',Georgia,serif",fontSize:13,fontWeight:800,cursor:"pointer",letterSpacing:"0.08em",textTransform:"uppercase",transition:"all 0.2s"}}
              onMouseEnter={e=>{e.currentTarget.style.background="#ffffff";e.currentTarget.style.boxShadow="0 4px 20px rgba(240,244,255,0.15)";}}
              onMouseLeave={e=>{e.currentTarget.style.background="#f0f4ff";e.currentTarget.style.boxShadow="none";}}>
              ⬇ Download PDF
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{maxWidth:tab==="preview"?760:1320,margin:"0 auto",padding:"28px 16px",display:tab==="form"?"grid":"block",gridTemplateColumns:tab==="form"?"minmax(380px,1fr) minmax(380px,1fr)":undefined,gap:28,alignItems:"start"}}>
          {tab==="form" && (
            <div>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:18}}>
                <div style={{width:3,height:20,background:`linear-gradient(180deg,${C.teal},${C.purple})`,borderRadius:2}} />
                <span style={{color:C.muted2,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em"}}>Fill Your Details</span>
              </div>
              <BuilderForm data={data} setData={setData} template={template} />
            </div>
          )}
          <div style={tab==="form"?{position:"sticky",top:68}:{}}>
            {tab==="form" && (
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:18}}>
                <div style={{width:3,height:20,background:`linear-gradient(180deg,${C.gold},#d97706)`,borderRadius:2}} />
                <span style={{color:C.muted2,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em"}}>Live Preview</span>
                <span style={{fontSize:10,color:C.muted,background:C.card,border:`1px solid ${C.border}`,borderRadius:20,padding:"2px 10px"}}>Updates as you type</span>
              </div>
            )}
            <div style={{background:"#fff",borderRadius:16,overflow:"hidden",boxShadow:"0 12px 48px rgba(0,0,0,0.5),0 0 0 1px rgba(14,165,233,0.08)"}}>
              {template==="modern" ? <ModernPreview data={data} /> : <ClassicPreview data={data} />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
