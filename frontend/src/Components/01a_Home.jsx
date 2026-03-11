import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./01a_Home.module.css";

export const Home = () => {
  const [scene, setScene] = useState(0);
  const timerRef = useRef(null);
  const total = 3;

  useEffect(() => {
    timerRef.current = setInterval(() => setScene(s => (s + 1) % total), 4000);
    return () => clearInterval(timerRef.current);
  }, []);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>

        {/* ── LEFT ── */}
        <div className={styles.heroLeft}>
          <div className={styles.pill}>3,20,000+ Candidates Placed</div>

          <h1 className={styles.heroH}>
            ONE STOP<br />
            <span className={styles.ac}>Hiring Platform</span><br />
            For Top Talent
          </h1>

          <p className={styles.heroP}>
            Connect with world-class companies using AI-powered matching, smart screening,
            and real-time job alerts — designed to get you hired faster.
          </p>

          <div className={styles.portalRow}>
            <Link to="/Candidate/01_Candidate" className={styles.portalCandidate}>
              <div>
                <div className={styles.portalLabel}>I'm a Candidate</div>
                <div className={styles.portalSub}>Find your dream job</div>
              </div>
              <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
            </Link>
            <Link to="/Recruiter/01_Recruiter" className={styles.portalRecruiter}>
              <div>
                <div className={styles.portalLabel}>I'm a Recruiter</div>
                <div className={styles.portalSub}>Post and hire talent</div>
              </div>
              <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
            </Link>
          </div>

          <div className={styles.bullets}>
            {[
              { t: "AI-powered matching", s: "designed for faster, smarter hiring." },
              { t: "Resume analysis & ATS scoring", s: "to maximise shortlisting chances." },
              { t: "Real-time application tracking", s: "from apply to offer." },
            ].map((b, i) => (
              <div key={i} className={styles.bl}>
                <div className={styles.blDot}></div>
                <span><strong>{b.t}</strong> {b.s}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT — 3D PERSPECTIVE SCENE ── */}
        <div
          className={styles.heroRight}
          onMouseEnter={() => clearInterval(timerRef.current)}
          onMouseLeave={() => {
            timerRef.current = setInterval(() => setScene(s => (s + 1) % total), 4000);
          }}
        >
          {/* 3D perspective wrapper */}
          <div className={styles.perspective}>

            {/* SCENE 0 — Job Dashboard */}
            <div className={`${styles.scene} ${scene === 0 ? styles.sceneOn : ""}`}>
              {/* Back card */}
              <div className={`${styles.card} ${styles.cardBack}`}>
                <div className={styles.chrome}>
                  <div className={styles.dots}>
                    <span style={{background:'#ff5f56'}}></span>
                    <span style={{background:'#ffbd2e'}}></span>
                    <span style={{background:'#27c93f'}}></span>
                  </div>
                  <div className={styles.urlBar}></div>
                  <span className={styles.urlTxt}>hireon.app</span>
                </div>
                <div className={styles.cardBody}>
                  <div style={{display:'flex',gap:8,marginBottom:10}}>
                    <div style={{height:24,flex:1,background:'rgba(255,255,255,.05)',borderRadius:6}}></div>
                    <div style={{height:24,width:72,background:'rgba(245,166,35,.09)',borderRadius:6}}></div>
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8}}>
                    {['rgba(245,166,35,.07)','rgba(79,142,247,.07)','rgba(0,230,118,.05)'].map((c,i)=>(
                      <div key={i} style={{height:48,background:c,borderRadius:8,border:`1px solid ${c.replace('.07','.18').replace('.05','.13')}`}}></div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mid card */}
              <div className={`${styles.card} ${styles.cardMid}`}>
                <div className={styles.chrome}>
                  <div className={styles.dots}>
                    <span style={{background:'#ff5f56'}}></span>
                    <span style={{background:'#ffbd2e'}}></span>
                    <span style={{background:'#27c93f'}}></span>
                  </div>
                  <div className={styles.urlBar}></div>
                  <span className={styles.urlTxt}>hireon.app/jobs</span>
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.slbl}>Recommended Roles</div>
                  {[
                    {av:'G',bg:'#4285f4',t:'Frontend Engineer',c:'Google · Bangalore',p:'94%',pc:'#f5a623'},
                    {av:'A',bg:'#ff9900',t:'SDE II – Platform',c:'Amazon · Remote',p:'88%',pc:'#4f8ef7'},
                    {av:'R',bg:'#635bff',t:'Full Stack Dev',c:'Razorpay · Hyderabad',p:'81%',pc:'#00e676'},
                  ].map(j=>(
                    <div key={j.t} className={styles.jr}>
                      <div className={styles.jav} style={{background:j.bg}}>{j.av}</div>
                      <div style={{flex:1}}>
                        <div className={styles.jt}>{j.t}</div>
                        <div className={styles.jc}>{j.c}</div>
                      </div>
                      <span className={styles.jb} style={{color:j.pc,border:`1px solid ${j.pc}44`,background:`${j.pc}18`}}>{j.p}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Front card */}
              <div className={`${styles.card} ${styles.cardFront}`}>
                <div className={styles.chrome}>
                  <div className={styles.dots}>
                    <span style={{background:'#ff5f56'}}></span>
                    <span style={{background:'#ffbd2e'}}></span>
                    <span style={{background:'#27c93f'}}></span>
                  </div>
                  <div className={styles.urlBar}></div>
                  <span className={styles.urlTxt}>hireon.app/dashboard</span>
                </div>
                <div className={styles.cardBody}>
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14}}>
                    <div>
                      <div className={styles.welcomeText}>Welcome back, Arjun</div>
                      <div className={styles.welcomeSub}>3 new interview invites today</div>
                    </div>
                    <div className={styles.activeBadge}>Active</div>
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8,marginBottom:14}}>
                    {[{v:'12',l:'Applied',c:'#f5a623'},{v:'5',l:'Interviews',c:'#4f8ef7'},{v:'2',l:'Offers',c:'#00e676'}].map(s=>(
                      <div key={s.l} style={{borderRadius:9,padding:'8px 10px',background:`${s.c}11`,border:`1px solid ${s.c}22`}}>
                        <div style={{fontFamily:'Syne,sans-serif',fontSize:'1.1rem',fontWeight:900,color:s.c,lineHeight:1}}>{s.v}</div>
                        <div style={{fontSize:'0.52rem',color:'rgba(255,255,255,.3)',textTransform:'uppercase',letterSpacing:'.07em',marginTop:3}}>{s.l}</div>
                      </div>
                    ))}
                  </div>
                  <div className={styles.slbl}>ATS Score</div>
                  <div style={{display:'flex',alignItems:'center',gap:14}}>
                    <div style={{position:'relative',width:72,height:72,flexShrink:0}}>
                      <svg width="72" height="72" viewBox="0 0 72 72" style={{transform:'rotate(-90deg)'}}>
                        <circle cx="36" cy="36" r="28" fill="none" stroke="rgba(255,255,255,.07)" strokeWidth="6"/>
                        <circle cx="36" cy="36" r="28" fill="none" stroke="#f5a623" strokeWidth="6" strokeLinecap="round"
                          strokeDasharray={`${2*Math.PI*28*0.82} ${2*Math.PI*28}`}/>
                      </svg>
                      <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                        <div style={{fontFamily:'Syne,sans-serif',fontSize:'1rem',fontWeight:900,color:'#fff',lineHeight:1}}>82</div>
                        <div style={{fontSize:'.42rem',color:'rgba(255,255,255,.3)',textTransform:'uppercase',marginTop:2}}>Score</div>
                      </div>
                    </div>
                    <div style={{flex:1}}>
                      {[{n:'Keywords',v:88,c:'#f5a623'},{n:'Formatting',v:76,c:'#4f8ef7'},{n:'Experience',v:82,c:'#00e676'}].map(s=>(
                        <div key={s.n} style={{marginBottom:7}}>
                          <div style={{display:'flex',justifyContent:'space-between',marginBottom:3}}>
                            <span style={{fontSize:'.63rem',color:'rgba(255,255,255,.45)'}}>{s.n}</span>
                            <span style={{fontSize:'.6rem',fontWeight:700,color:s.c}}>{s.v}%</span>
                          </div>
                          <div style={{height:3,background:'rgba(255,255,255,.07)',borderRadius:2,overflow:'hidden'}}>
                            <div style={{height:'100%',width:`${s.v}%`,background:s.c,borderRadius:2}}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating chip */}
              <div className={`${styles.chip} ${styles.chipTop}`}>
                <div className={styles.chipDot}></div>
                <div>
                  <div className={styles.chipTitle}>94% Match Found</div>
                  <div className={styles.chipSub}>Google · Frontend Engineer</div>
                </div>
              </div>
            </div>

            {/* SCENE 1 — Resume Analysis */}
            <div className={`${styles.scene} ${scene === 1 ? styles.sceneOn : ""}`}>
              <div className={`${styles.card} ${styles.cardBack}`}>
                <div className={styles.chrome}>
                  <div className={styles.dots}><span style={{background:'#ff5f56'}}></span><span style={{background:'#ffbd2e'}}></span><span style={{background:'#27c93f'}}></span></div>
                  <div className={styles.urlBar}></div>
                  <span className={styles.urlTxt}>hireon.app/resume</span>
                </div>
                <div className={styles.cardBody} style={{opacity:.5}}>
                  <div style={{height:12,background:'rgba(255,255,255,.07)',borderRadius:4,marginBottom:8}}></div>
                  <div style={{height:8,width:'70%',background:'rgba(255,255,255,.04)',borderRadius:4}}></div>
                </div>
              </div>

              <div className={`${styles.card} ${styles.cardMid}`}>
                <div className={styles.chrome}>
                  <div className={styles.dots}><span style={{background:'#ff5f56'}}></span><span style={{background:'#ffbd2e'}}></span><span style={{background:'#27c93f'}}></span></div>
                  <div className={styles.urlBar}></div>
                  <span className={styles.urlTxt}>hireon.app/analysis</span>
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.slbl}>Resume Breakdown</div>
                  {[{n:'Skills Match',v:88,c:'#f5a623'},{n:'ATS Compatibility',v:76,c:'#4f8ef7'},{n:'Work Experience',v:92,c:'#00e676'},{n:'Education',v:85,c:'#a78bfa'}].map(s=>(
                    <div key={s.n} style={{marginBottom:8}}>
                      <div style={{display:'flex',justifyContent:'space-between',marginBottom:3}}>
                        <span style={{fontSize:'.63rem',color:'rgba(255,255,255,.45)'}}>{s.n}</span>
                        <span style={{fontSize:'.6rem',fontWeight:700,color:s.c}}>{s.v}%</span>
                      </div>
                      <div style={{height:3,background:'rgba(255,255,255,.07)',borderRadius:2,overflow:'hidden'}}>
                        <div style={{height:'100%',width:`${s.v}%`,background:s.c,borderRadius:2}}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`${styles.card} ${styles.cardFront}`}>
                <div className={styles.chrome}>
                  <div className={styles.dots}><span style={{background:'#ff5f56'}}></span><span style={{background:'#ffbd2e'}}></span><span style={{background:'#27c93f'}}></span></div>
                  <div className={styles.urlBar}></div>
                  <span className={styles.urlTxt}>hireon.app/analysis</span>
                </div>
                <div className={styles.cardBody}>
                  <div style={{display:'flex',alignItems:'center',gap:14,marginBottom:14}}>
                    <div style={{position:'relative',width:64,height:64,flexShrink:0}}>
                      <svg width="64" height="64" viewBox="0 0 64 64" style={{transform:'rotate(-90deg)'}}>
                        <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,.07)" strokeWidth="6"/>
                        <circle cx="32" cy="32" r="26" fill="none" stroke="#f5a623" strokeWidth="6" strokeLinecap="round"
                          strokeDasharray={`${2*Math.PI*26*0.87} ${2*Math.PI*26}`}/>
                      </svg>
                      <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                        <div style={{fontFamily:'Syne,sans-serif',fontSize:'.95rem',fontWeight:900,color:'#fff',lineHeight:1}}>87</div>
                        <div style={{fontSize:'.38rem',color:'rgba(255,255,255,.3)',textTransform:'uppercase',marginTop:2}}>Score</div>
                      </div>
                    </div>
                    <div>
                      <div style={{fontFamily:'Syne,sans-serif',fontSize:'.82rem',fontWeight:800,color:'#fff'}}>Great Resume</div>
                      <div style={{fontSize:'.6rem',color:'rgba(255,255,255,.32)',marginTop:3}}>3 improvements found</div>
                    </div>
                  </div>
                  <div className={styles.slbl}>AI Suggestions</div>
                  {['Add more quantified achievements','Include relevant keywords for SDE roles','Improve summary section clarity'].map((s,i)=>(
                    <div key={i} style={{display:'flex',gap:8,alignItems:'flex-start',marginBottom:6,padding:'7px 9px',background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.06)',borderRadius:7}}>
                      <div style={{width:4,height:4,borderRadius:'50%',background:'#f5a623',flexShrink:0,marginTop:4}}></div>
                      <span style={{fontSize:'.63rem',color:'rgba(255,255,255,.5)',lineHeight:1.5}}>{s}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`${styles.chip} ${styles.chipTop}`}>
                <div className={styles.chipDot}></div>
                <div>
                  <div className={styles.chipTitle}>AI Analysis Complete</div>
                  <div className={styles.chipSub}>Score: 87 / 100</div>
                </div>
              </div>
            </div>

            {/* SCENE 2 — Hired */}
            <div className={`${styles.scene} ${scene === 2 ? styles.sceneOn : ""}`}>
              <div className={`${styles.card} ${styles.cardBack}`}>
                <div className={styles.chrome}>
                  <div className={styles.dots}><span style={{background:'#ff5f56'}}></span><span style={{background:'#ffbd2e'}}></span><span style={{background:'#27c93f'}}></span></div>
                  <div className={styles.urlBar}></div>
                  <span className={styles.urlTxt}>hireon.app/success</span>
                </div>
                <div className={styles.cardBody} style={{opacity:.4,display:'flex',flexDirection:'column',alignItems:'center',gap:8}}>
                  <div style={{width:36,height:36,borderRadius:'50%',background:'rgba(0,230,118,.1)',border:'1px solid rgba(0,230,118,.18)'}}></div>
                  <div style={{height:9,width:110,background:'rgba(255,255,255,.06)',borderRadius:4}}></div>
                </div>
              </div>

              <div className={`${styles.card} ${styles.cardMid}`}>
                <div className={styles.chrome}>
                  <div className={styles.dots}><span style={{background:'#ff5f56'}}></span><span style={{background:'#ffbd2e'}}></span><span style={{background:'#27c93f'}}></span></div>
                  <div className={styles.urlBar}></div>
                  <span className={styles.urlTxt}>hireon.app/success</span>
                </div>
                <div className={styles.cardBody}>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:8}}>
                    {[{v:'52 LPA',l:'CTC Offered',c:'#f5a623'},{v:'Google',l:'Company',c:'#00e676'},{v:'SWE II',l:'Role',c:'#fff'},{v:'Bangalore',l:'Location',c:'#4f8ef7'}].map(s=>(
                      <div key={s.l} style={{background:`${s.c}0f`,border:`1px solid ${s.c}22`,borderRadius:9,padding:'8px 10px'}}>
                        <div style={{fontFamily:'Syne,sans-serif',fontSize:'.9rem',fontWeight:900,color:s.c}}>{s.v}</div>
                        <div style={{fontSize:'.52rem',color:'rgba(255,255,255,.28)',textTransform:'uppercase',letterSpacing:'.07em',marginTop:3}}>{s.l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className={`${styles.card} ${styles.cardFront}`}>
                <div className={styles.chrome}>
                  <div className={styles.dots}><span style={{background:'#ff5f56'}}></span><span style={{background:'#ffbd2e'}}></span><span style={{background:'#27c93f'}}></span></div>
                  <div className={styles.urlBar}></div>
                  <span className={styles.urlTxt}>hireon.app/success</span>
                </div>
                <div className={styles.cardBody}>
                  <div style={{background:'linear-gradient(135deg,rgba(0,230,118,.08),rgba(0,200,83,.04))',border:'1px solid rgba(0,230,118,.14)',borderRadius:10,padding:14,textAlign:'center',marginBottom:14}}>
                    <div style={{width:40,height:40,borderRadius:'50%',background:'rgba(0,230,118,.15)',border:'2px solid rgba(0,230,118,.28)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 8px'}}>
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#00e676" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <div style={{fontFamily:'Syne,sans-serif',fontSize:'.82rem',fontWeight:800,color:'#fff'}}>Congratulations, Arjun!</div>
                    <div style={{fontSize:'.58rem',color:'rgba(255,255,255,.36)',marginTop:3}}>Hired via HIREON in 14 days</div>
                  </div>
                  <div className={styles.slbl}>Journey Timeline</div>
                  {[
                    {t:'Profile Created',d:'Jan 10',c:'#00e676'},
                    {t:'AI Matched — Google SWE II 94%',d:'Jan 12',c:'#00e676'},
                    {t:'3 Interview Rounds Cleared',d:'Jan 14–22',c:'#00e676'},
                    {t:'Offer Letter — 52 LPA',d:'Jan 24',c:'#f5a623'},
                  ].map((item,i)=>(
                    <div key={i} style={{display:'flex',gap:8,paddingBottom:i<3?8:0,position:'relative'}}>
                      {i<3&&<div style={{position:'absolute',left:6,top:14,width:1,height:'calc(100% - 4px)',background:'rgba(255,255,255,.07)'}}></div>}
                      <div style={{width:13,height:13,borderRadius:'50%',flexShrink:0,background:`${item.c}22`,border:`1.5px solid ${item.c}66`,display:'flex',alignItems:'center',justifyContent:'center'}}>
                        <svg width="6" height="6" viewBox="0 0 12 12" fill="none" stroke={item.c} strokeWidth="3" strokeLinecap="round"><polyline points="2 6 5 9 10 3"/></svg>
                      </div>
                      <div>
                        <div style={{fontSize:'.65rem',fontWeight:600,color:item.c}}>{item.t}</div>
                        <div style={{fontSize:'.55rem',color:'rgba(255,255,255,.28)',marginTop:1}}>{item.d}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`${styles.chip} ${styles.chipTop}`}>
                <div className={styles.chipDot} style={{background:'#00e676',boxShadow:'0 0 8px #00e676'}}></div>
                <div>
                  <div className={styles.chipTitle}>Arjun Rawat — Hired</div>
                  <div className={styles.chipSub}>Joined Google · 14 days via HIREON</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};
