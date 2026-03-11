import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./01a_Home.module.css";

const COMPANIES = ['Google','Amazon','Microsoft','Meta','Razorpay','Flipkart','Zomato','Swiggy','CRED','Meesho','Groww','Zepto','Coinbase','Stripe','Atlassian','Notion','Figma','Adobe','Spotify','Uber','Airbnb','Netflix','Paytm','PhonePe','Ola','Dunzo','Nykaa','Myntra'];

export const Home = () => {
  const [scene, setScene] = useState(0);
  const timerRef = useRef(null);
  const totalScenes = 4;

  useEffect(() => {
    timerRef.current = setInterval(() => setScene(s => (s + 1) % totalScenes), 4200);
    return () => clearInterval(timerRef.current);
  }, []);

  const pauseTimer = () => clearInterval(timerRef.current);
  const resumeTimer = () => {
    timerRef.current = setInterval(() => setScene(s => (s + 1) % totalScenes), 4200);
  };

  return (
    <div className={styles.page}>

      {/* ── HERO ── */}
      <section className={styles.hero}>

        {/* LEFT */}
        <div className={styles.heroLeft}>
          <div className={styles.pill}>
            <span className={styles.pillDot}></span>
            3,20,000+ Candidates Placed
          </div>

          <h1 className={styles.heroH}>
            ONE STOP<br />
            <span className={styles.ac}>Hiring Platform</span><br />
            For Top Talent
          </h1>

          <p className={styles.heroP}>
            Connect with world-class companies using AI-powered matching, smart screening, and real-time job alerts — designed to get you hired faster.
          </p>

          {/* PORTAL BUTTONS */}
          <div className={styles.portalRow}>
            <Link to="/Candidate/01_Candidate" className={styles.portalCandidate}>
              <span className={styles.portalIcon}>🎓</span>
              <div>
                <div className={styles.portalLabel}>I'm a Candidate</div>
                <div className={styles.portalSub}>Find your dream job →</div>
              </div>
            </Link>
            <Link to="/Recruiter/01_Recruiter" className={styles.portalRecruiter}>
              <span className={styles.portalIcon}>🏢</span>
              <div>
                <div className={styles.portalLabel}>I'm a Recruiter</div>
                <div className={styles.portalSub}>Post & hire talent →</div>
              </div>
            </Link>
          </div>

          <div className={styles.bullets}>
            <div className={styles.bl}>
              <div className={styles.blI}>
                <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <span><strong>AI-powered matching</strong> designed for faster, smarter hiring.</span>
            </div>
            <div className={styles.bl}>
              <div className={styles.blI}>
                <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <span><strong>Resume analysis & ATS scoring</strong> to maximise shortlisting chances.</span>
            </div>
            <div className={styles.bl}>
              <div className={styles.blI}>
                <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <span><strong>Real-time application tracking</strong> from apply to offer.</span>
            </div>
          </div>
        </div>

        {/* RIGHT — 3D CARD SCENE */}
        <div
          className={styles.heroRight}
          onMouseEnter={pauseTimer}
          onMouseLeave={resumeTimer}
        >
          <div className={styles.heroRightInner}>

            {/* SCENE 0 — Job Dashboard */}
            <div className={`${styles.ss} ${scene === 0 ? styles.on : ""}`}>
              <div className={`${styles.sc} ${styles.scBg}`}>
                <div className={styles.chrome}>
                  <div className={styles.dots}><span style={{background:'#ff5f56'}}></span><span style={{background:'#ffbd2e'}}></span><span style={{background:'#27c93f'}}></span></div>
                  <div className={styles.urlBar}></div>
                  <span className={styles.urlText}>hireon.app</span>
                </div>
                <div className={styles.cb}>
                  <div style={{display:'flex',gap:'.5rem',marginBottom:'.55rem'}}>
                    <div style={{height:'26px',flex:1,background:'rgba(255,255,255,.05)',borderRadius:'6px'}}></div>
                    <div style={{height:'26px',width:'76px',background:'rgba(245,166,35,.09)',borderRadius:'6px'}}></div>
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'.45rem'}}>
                    <div style={{height:'50px',background:'rgba(245,166,35,.07)',borderRadius:'8px',border:'1px solid rgba(245,166,35,.12)'}}></div>
                    <div style={{height:'50px',background:'rgba(79,142,247,.07)',borderRadius:'8px',border:'1px solid rgba(79,142,247,.12)'}}></div>
                    <div style={{height:'50px',background:'rgba(0,230,118,.05)',borderRadius:'8px',border:'1px solid rgba(0,230,118,.1)'}}></div>
                  </div>
                </div>
              </div>

              <div className={`${styles.sc} ${styles.scMid}`}>
                <div className={styles.chrome}>
                  <div className={styles.dots}><span style={{background:'#ff5f56'}}></span><span style={{background:'#ffbd2e'}}></span><span style={{background:'#27c93f'}}></span></div>
                  <div className={styles.urlBar}></div>
                  <span className={styles.urlText}>hireon.app/jobs</span>
                </div>
                <div className={styles.cb}>
                  <div className={styles.slbl}>Recommended Roles</div>
                  <div className={styles.jr}><div className={styles.jav} style={{background:'#4285f4'}}>G</div><div><div className={styles.jt}>Frontend Engineer</div><div className={styles.jc}>Google · Bangalore</div></div><span className={styles.jb} style={{background:'rgba(245,166,35,.14)',color:'#f5a623',border:'1px solid rgba(245,166,35,.2)'}}>94%</span></div>
                  <div className={styles.jr}><div className={styles.jav} style={{background:'#ff9900'}}>A</div><div><div className={styles.jt}>SDE II – Platform</div><div className={styles.jc}>Amazon · Remote</div></div><span className={styles.jb} style={{background:'rgba(79,142,247,.13)',color:'#4f8ef7',border:'1px solid rgba(79,142,247,.2)'}}>88%</span></div>
                  <div className={styles.jr}><div className={styles.jav} style={{background:'#635bff'}}>R</div><div><div className={styles.jt}>Full Stack Dev</div><div className={styles.jc}>Razorpay · Hyderabad</div></div><span className={styles.jb} style={{background:'rgba(0,230,118,.1)',color:'#00e676',border:'1px solid rgba(0,230,118,.18)'}}>81%</span></div>
                </div>
              </div>

              <div className={`${styles.sc} ${styles.scFront}`}>
                <div className={styles.chrome}>
                  <div className={styles.dots}><span style={{background:'#ff5f56'}}></span><span style={{background:'#ffbd2e'}}></span><span style={{background:'#27c93f'}}></span></div>
                  <div className={styles.urlBar}></div>
                  <span className={styles.urlText}>hireon.app/dashboard</span>
                </div>
                <div className={styles.cb}>
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'.85rem'}}>
                    <div>
                      <div style={{fontFamily:'Syne,sans-serif',fontSize:'.92rem',fontWeight:800,color:'#fff'}}>Welcome back, Arjun 👋</div>
                      <div style={{fontSize:'.62rem',color:'rgba(255,255,255,.32)',marginTop:'.12rem'}}>3 new interview invites today</div>
                    </div>
                    <div style={{display:'flex',alignItems:'center',gap:'.35rem',padding:'.22rem .65rem',background:'rgba(0,230,118,.1)',border:'1px solid rgba(0,230,118,.2)',borderRadius:'100px'}}>
                      <div style={{width:'5px',height:'5px',background:'#00e676',borderRadius:'50%'}}></div>
                      <span style={{fontSize:'.6rem',fontWeight:700,color:'#00e676'}}>Active</span>
                    </div>
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'.5rem',marginBottom:'.85rem'}}>
                    <div style={{borderRadius:'9px',padding:'.6rem .65rem',background:'rgba(245,166,35,.07)',border:'1px solid rgba(245,166,35,.12)'}}>
                      <div style={{fontFamily:'Syne,sans-serif',fontSize:'1.25rem',fontWeight:900,color:'#f5a623',lineHeight:1}}>12</div>
                      <div style={{fontSize:'.56rem',color:'rgba(255,255,255,.3)',marginTop:'.18rem',textTransform:'uppercase',letterSpacing:'.07em'}}>Applied</div>
                    </div>
                    <div style={{borderRadius:'9px',padding:'.6rem .65rem',background:'rgba(79,142,247,.07)',border:'1px solid rgba(79,142,247,.12)'}}>
                      <div style={{fontFamily:'Syne,sans-serif',fontSize:'1.25rem',fontWeight:900,color:'#4f8ef7',lineHeight:1}}>5</div>
                      <div style={{fontSize:'.56rem',color:'rgba(255,255,255,.3)',marginTop:'.18rem',textTransform:'uppercase',letterSpacing:'.07em'}}>Interviews</div>
                    </div>
                    <div style={{borderRadius:'9px',padding:'.6rem .65rem',background:'rgba(0,230,118,.05)',border:'1px solid rgba(0,230,118,.1)'}}>
                      <div style={{fontFamily:'Syne,sans-serif',fontSize:'1.25rem',fontWeight:900,color:'#00e676',lineHeight:1}}>2</div>
                      <div style={{fontSize:'.56rem',color:'rgba(255,255,255,.3)',marginTop:'.18rem',textTransform:'uppercase',letterSpacing:'.07em'}}>Offers</div>
                    </div>
                  </div>
                  <div className={styles.slbl}>ATS Score</div>
                  <div style={{display:'flex',alignItems:'center',gap:'.85rem'}}>
                    <div style={{position:'relative',width:'88px',height:'88px',flexShrink:0}}>
                      <svg width="88" height="88" viewBox="0 0 88 88" style={{transform:'rotate(-90deg)'}}>
                        <circle cx="44" cy="44" r="36" fill="none" stroke="rgba(255,255,255,.07)" strokeWidth="7"/>
                        <circle cx="44" cy="44" r="36" fill="none" stroke="#f5a623" strokeWidth="7" strokeLinecap="round" strokeDasharray={`${2*Math.PI*36*0.82} ${2*Math.PI*36}`}/>
                      </svg>
                      <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                        <div style={{fontFamily:'Syne,sans-serif',fontSize:'1.25rem',fontWeight:900,color:'#fff',lineHeight:1}}>82</div>
                        <div style={{fontSize:'.48rem',color:'rgba(255,255,255,.33)',textTransform:'uppercase',letterSpacing:'.08em',marginTop:'2px'}}>Score</div>
                      </div>
                    </div>
                    <div style={{flex:1}}>
                      {[{n:'Keywords',v:88,c:'#f5a623'},{n:'Formatting',v:76,c:'#4f8ef7'},{n:'Experience',v:82,c:'#00e676'}].map(s=>(
                        <div key={s.n} style={{marginBottom:'.5rem'}}>
                          <div style={{display:'flex',justifyContent:'space-between',marginBottom:'.25rem'}}>
                            <span style={{fontSize:'.67rem',color:'rgba(255,255,255,.5)'}}>{s.n}</span>
                            <span style={{fontSize:'.64rem',fontWeight:700,color:s.c}}>{s.v}%</span>
                          </div>
                          <div style={{height:'4px',background:'rgba(255,255,255,.07)',borderRadius:'2px',overflow:'hidden'}}>
                            <div style={{height:'100%',width:`${s.v}%`,background:s.c,borderRadius:'2px'}}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.chip} style={{top:'12%',right:'3%',animation:'f1 4.5s ease-in-out infinite'}}>
                <span style={{fontSize:'.88rem'}}>🎯</span>
                <div><div className={styles.chv}>94% Match Found!</div><div className={styles.chs}>Google · Frontend Engineer</div></div>
              </div>
              <div className={styles.chip} style={{bottom:'24%',right:'1%',animation:'f2 5.5s ease-in-out infinite'}}>
                <div style={{width:'5px',height:'5px',background:'#f5a623',borderRadius:'50%'}}></div>
                <span style={{fontSize:'.62rem',fontWeight:700,color:'rgba(255,255,255,.6)'}}>Interview invite: Tomorrow 11AM</span>
              </div>
            </div>

            {/* SCENE 1 — Resume Analysis */}
            <div className={`${styles.ss} ${scene === 1 ? styles.on : ""}`}>
              <div className={`${styles.sc} ${styles.scBg}`}>
                <div className={styles.chrome}>
                  <div className={styles.dots}><span style={{background:'#ff5f56'}}></span><span style={{background:'#ffbd2e'}}></span><span style={{background:'#27c93f'}}></span></div>
                  <div className={styles.urlBar}></div>
                  <span className={styles.urlText}>hireon.app/resume</span>
                </div>
                <div className={styles.cb} style={{opacity:.4}}>
                  <div style={{height:'12px',background:'rgba(255,255,255,.07)',borderRadius:'4px',marginBottom:'.4rem'}}></div>
                  <div style={{height:'8px',width:'70%',background:'rgba(255,255,255,.04)',borderRadius:'4px'}}></div>
                </div>
              </div>

              <div className={`${styles.sc} ${styles.scMid}`}>
                <div className={styles.chrome}>
                  <div className={styles.dots}><span style={{background:'#ff5f56'}}></span><span style={{background:'#ffbd2e'}}></span><span style={{background:'#27c93f'}}></span></div>
                  <div className={styles.urlBar}></div>
                  <span className={styles.urlText}>hireon.app/analysis</span>
                </div>
                <div className={styles.cb}>
                  <div className={styles.slbl}>Resume Breakdown</div>
                  {[{n:'Skills Match',v:88,c:'#f5a623'},{n:'ATS Compatibility',v:76,c:'#4f8ef7'},{n:'Work Experience',v:92,c:'#00e676'},{n:'Education',v:85,c:'#a78bfa'}].map(s=>(
                    <div key={s.n} style={{marginBottom:'.5rem'}}>
                      <div style={{display:'flex',justifyContent:'space-between',marginBottom:'.25rem'}}>
                        <span style={{fontSize:'.67rem',color:'rgba(255,255,255,.5)'}}>{s.n}</span>
                        <span style={{fontSize:'.64rem',fontWeight:700,color:s.c}}>{s.v}%</span>
                      </div>
                      <div style={{height:'4px',background:'rgba(255,255,255,.07)',borderRadius:'2px',overflow:'hidden'}}>
                        <div style={{height:'100%',width:`${s.v}%`,background:s.c,borderRadius:'2px'}}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`${styles.sc} ${styles.scFront}`}>
                <div className={styles.chrome}>
                  <div className={styles.dots}><span style={{background:'#ff5f56'}}></span><span style={{background:'#ffbd2e'}}></span><span style={{background:'#27c93f'}}></span></div>
                  <div className={styles.urlBar}></div>
                  <span className={styles.urlText}>hireon.app/analysis</span>
                </div>
                <div className={styles.cb}>
                  <div style={{display:'flex',alignItems:'center',gap:'.85rem',marginBottom:'.9rem'}}>
                    <div style={{position:'relative',width:'80px',height:'80px',flexShrink:0}}>
                      <svg width="80" height="80" viewBox="0 0 80 80" style={{transform:'rotate(-90deg)'}}>
                        <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,.07)" strokeWidth="7"/>
                        <circle cx="40" cy="40" r="32" fill="none" stroke="#f5a623" strokeWidth="7" strokeLinecap="round" strokeDasharray={`${2*Math.PI*32*0.87} ${2*Math.PI*32}`}/>
                      </svg>
                      <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                        <div style={{fontFamily:'Syne,sans-serif',fontSize:'1.1rem',fontWeight:900,color:'#fff',lineHeight:1}}>87</div>
                        <div style={{fontSize:'.42rem',color:'rgba(255,255,255,.33)',textTransform:'uppercase',letterSpacing:'.08em',marginTop:'2px'}}>Overall</div>
                      </div>
                    </div>
                    <div>
                      <div style={{fontFamily:'Syne,sans-serif',fontSize:'.85rem',fontWeight:800,color:'#fff'}}>Great Resume!</div>
                      <div style={{fontSize:'.62rem',color:'rgba(255,255,255,.32)',marginTop:'.1rem'}}>3 improvements found</div>
                    </div>
                  </div>
                  <div className={styles.slbl}>AI Suggestions</div>
                  {['Add more quantified achievements','Include relevant keywords for SDE roles','Improve summary section clarity'].map((s,i)=>(
                    <div key={i} style={{display:'flex',gap:'.5rem',alignItems:'flex-start',marginBottom:'.42rem',padding:'.45rem .55rem',background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.06)',borderRadius:'7px'}}>
                      <span style={{fontSize:'.7rem',color:'#f5a623',flexShrink:0}}>✦</span>
                      <span style={{fontSize:'.65rem',color:'rgba(255,255,255,.5)',lineHeight:1.5}}>{s}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.chip} style={{top:'10%',right:'4%',animation:'f1 4s ease-in-out infinite'}}>
                <span style={{fontSize:'.88rem'}}>🧠</span>
                <div><div className={styles.chv}>AI Analysis Complete</div><div className={styles.chs}>Score: 87/100</div></div>
              </div>
            </div>

            {/* SCENE 2 — Recruiter Dashboard */}
            <div className={`${styles.ss} ${scene === 2 ? styles.on : ""}`}>
              <div className={`${styles.sc} ${styles.scBg}`}>
                <div className={styles.chrome}>
                  <div className={styles.dots}><span style={{background:'#ff5f56'}}></span><span style={{background:'#ffbd2e'}}></span><span style={{background:'#27c93f'}}></span></div>
                  <div className={styles.urlBar}></div>
                  <span className={styles.urlText}>hireon.app/recruiter</span>
                </div>
                <div className={styles.cb} style={{opacity:.4}}>
                  <div style={{height:'12px',background:'rgba(255,255,255,.07)',borderRadius:'4px',marginBottom:'.4rem'}}></div>
                  <div style={{height:'8px',width:'70%',background:'rgba(255,255,255,.04)',borderRadius:'4px'}}></div>
                </div>
              </div>

              <div className={`${styles.sc} ${styles.scMid}`}>
                <div className={styles.chrome}>
                  <div className={styles.dots}><span style={{background:'#ff5f56'}}></span><span style={{background:'#ffbd2e'}}></span><span style={{background:'#27c93f'}}></span></div>
                  <div className={styles.urlBar}></div>
                  <span className={styles.urlText}>hireon.app/recruiter/applicants</span>
                </div>
                <div className={styles.cb}>
                  <div className={styles.slbl}>Top Applicants</div>
                  {[{i:'AR',n:'Arjun Rawat',r:'SDE II',s:94,c:'#f5a623'},{i:'PM',n:'Priya Mehta',r:'Frontend Dev',s:89,c:'#00e676'},{i:'SK',n:'Siddharth K.',r:'Full Stack',s:85,c:'#4f8ef7'}].map(a=>(
                    <div key={a.i} className={styles.ap}>
                      <div className={styles.apav} style={{background:`linear-gradient(135deg,${a.c}33,${a.c}22)`,color:a.c,border:`1px solid ${a.c}44`}}>{a.i}</div>
                      <div style={{flex:1}}><div className={styles.apn}>{a.n}</div><div className={styles.aps}>{a.r}</div></div>
                      <div style={{fontFamily:'Syne,sans-serif',fontSize:'.72rem',fontWeight:900,color:a.c}}>{a.s}%</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`${styles.sc} ${styles.scFront}`}>
                <div className={styles.chrome}>
                  <div className={styles.dots}><span style={{background:'#ff5f56'}}></span><span style={{background:'#ffbd2e'}}></span><span style={{background:'#27c93f'}}></span></div>
                  <div className={styles.urlBar}></div>
                  <span className={styles.urlText}>hireon.app/recruiter/dashboard</span>
                </div>
                <div className={styles.cb}>
                  <div style={{fontFamily:'Syne,sans-serif',fontSize:'.88rem',fontWeight:800,color:'#fff',marginBottom:'.7rem'}}>Hiring Pipeline</div>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'.45rem',marginBottom:'.85rem'}}>
                    {[{v:'48',l:'Active Jobs',c:'rgba(245,166,35,.07)',bc:'rgba(245,166,35,.15)',tc:'#f5a623'},{v:'312',l:'Applicants',c:'rgba(79,142,247,.07)',bc:'rgba(79,142,247,.15)',tc:'#4f8ef7'},{v:'28',l:'Shortlisted',c:'rgba(0,230,118,.05)',bc:'rgba(0,230,118,.12)',tc:'#00e676'},{v:'6',l:'Hired',c:'rgba(167,139,250,.07)',bc:'rgba(167,139,250,.15)',tc:'#a78bfa'}].map(s=>(
                      <div key={s.l} style={{background:s.c,border:`1px solid ${s.bc}`,borderRadius:'9px',padding:'.6rem .65rem'}}>
                        <div style={{fontFamily:'Syne,sans-serif',fontSize:'1.1rem',fontWeight:900,color:s.tc,lineHeight:1}}>{s.v}</div>
                        <div style={{fontSize:'.56rem',color:'rgba(255,255,255,.3)',marginTop:'.18rem',textTransform:'uppercase',letterSpacing:'.07em'}}>{s.l}</div>
                      </div>
                    ))}
                  </div>
                  <div className={styles.slbl}>Recent Activity</div>
                  {['Priya Mehta shortlisted for SDE II','New application: 3 SDE roles','Interview scheduled: Arjun Rawat'].map((t,i)=>(
                    <div key={i} style={{display:'flex',gap:'.5rem',alignItems:'center',padding:'.42rem 0',borderBottom:'1px solid rgba(255,255,255,.04)'}}>
                      <div style={{width:'5px',height:'5px',borderRadius:'50%',background:i===0?'#f5a623':i===1?'#4f8ef7':'#00e676',flexShrink:0}}></div>
                      <span style={{fontSize:'.65rem',color:'rgba(255,255,255,.45)'}}>{t}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.chip} style={{top:'12%',right:'3%',animation:'f1 5s ease-in-out infinite'}}>
                <span style={{fontSize:'.88rem'}}>📋</span>
                <div><div className={styles.chv}>312 Applications</div><div className={styles.chs}>Across 48 active listings</div></div>
              </div>
            </div>

            {/* SCENE 3 — Hired Success */}
            <div className={`${styles.ss} ${scene === 3 ? styles.on : ""}`}>
              <div className={`${styles.sc} ${styles.scBg}`}>
                <div className={styles.chrome}>
                  <div className={styles.dots}><span style={{background:'#ff5f56'}}></span><span style={{background:'#ffbd2e'}}></span><span style={{background:'#27c93f'}}></span></div>
                  <div className={styles.urlBar}></div>
                  <span className={styles.urlText}>hireon.app/success</span>
                </div>
                <div className={styles.cb} style={{opacity:.4,display:'flex',flexDirection:'column',alignItems:'center',gap:'.48rem'}}>
                  <div style={{width:'38px',height:'38px',borderRadius:'50%',background:'rgba(0,230,118,.11)',border:'1px solid rgba(0,230,118,.18)'}}></div>
                  <div style={{height:'9px',width:'115px',background:'rgba(255,255,255,.06)',borderRadius:'4px'}}></div>
                </div>
              </div>

              <div className={`${styles.sc} ${styles.scMid}`}>
                <div className={styles.chrome}>
                  <div className={styles.dots}><span style={{background:'#ff5f56'}}></span><span style={{background:'#ffbd2e'}}></span><span style={{background:'#27c93f'}}></span></div>
                  <div className={styles.urlBar}></div>
                  <span className={styles.urlText}>hireon.app/success</span>
                </div>
                <div className={styles.cb}>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'.48rem'}}>
                    <div style={{background:'rgba(245,166,35,.07)',border:'1px solid rgba(245,166,35,.15)',borderRadius:'9px',padding:'.6rem'}}><div style={{fontFamily:'Syne,sans-serif',fontSize:'.95rem',fontWeight:900,color:'#f5a623'}}>₹52 LPA</div><div style={{fontSize:'.56rem',color:'rgba(255,255,255,.28)',marginTop:'.18rem',textTransform:'uppercase',letterSpacing:'.07em'}}>CTC Offered</div></div>
                    <div style={{background:'rgba(0,230,118,.05)',border:'1px solid rgba(0,230,118,.13)',borderRadius:'9px',padding:'.6rem'}}><div style={{fontFamily:'Syne,sans-serif',fontSize:'.95rem',fontWeight:900,color:'#00e676'}}>Google</div><div style={{fontSize:'.56rem',color:'rgba(255,255,255,.28)',marginTop:'.18rem',textTransform:'uppercase',letterSpacing:'.07em'}}>Company</div></div>
                    <div style={{background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.07)',borderRadius:'9px',padding:'.6rem'}}><div style={{fontFamily:'Syne,sans-serif',fontSize:'.95rem',fontWeight:900,color:'#fff'}}>SWE II</div><div style={{fontSize:'.56rem',color:'rgba(255,255,255,.28)',marginTop:'.18rem',textTransform:'uppercase',letterSpacing:'.07em'}}>Role</div></div>
                    <div style={{background:'rgba(79,142,247,.06)',border:'1px solid rgba(79,142,247,.13)',borderRadius:'9px',padding:'.6rem'}}><div style={{fontFamily:'Syne,sans-serif',fontSize:'.95rem',fontWeight:900,color:'#4f8ef7'}}>Bangalore</div><div style={{fontSize:'.56rem',color:'rgba(255,255,255,.28)',marginTop:'.18rem',textTransform:'uppercase',letterSpacing:'.07em'}}>Location</div></div>
                  </div>
                </div>
              </div>

              <div className={`${styles.sc} ${styles.scFront}`}>
                <div className={styles.chrome}>
                  <div className={styles.dots}><span style={{background:'#ff5f56'}}></span><span style={{background:'#ffbd2e'}}></span><span style={{background:'#27c93f'}}></span></div>
                  <div className={styles.urlBar}></div>
                  <span className={styles.urlText}>hireon.app/success</span>
                </div>
                <div className={styles.cb}>
                  <div style={{background:'linear-gradient(135deg,rgba(0,230,118,.08),rgba(0,200,83,.04))',border:'1px solid rgba(0,230,118,.14)',borderRadius:'10px',padding:'1rem',textAlign:'center',marginBottom:'.9rem'}}>
                    <div style={{width:'44px',height:'44px',borderRadius:'50%',background:'rgba(0,230,118,.15)',border:'2px solid rgba(0,230,118,.28)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto .6rem'}}>
                      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#00e676" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <div style={{fontFamily:'Syne,sans-serif',fontSize:'.88rem',fontWeight:800,color:'#fff'}}>Congratulations, Arjun! 🎉</div>
                    <div style={{fontSize:'.62rem',color:'rgba(255,255,255,.36)',marginTop:'.18rem'}}>Hired via HIREON in 14 days</div>
                  </div>
                  <div className={styles.slbl}>Journey Timeline</div>
                  {[{t:'Profile Created & Resume Uploaded',d:'Jan 10 · 2025',c:'rgba(0,230,118,.14)',tc:'#00e676'},{t:'AI Matched with Google SWE II — 94%',d:'Jan 12 · 2025',c:'rgba(0,230,118,.14)',tc:'#00e676'},{t:'3 Interview Rounds Cleared',d:'Jan 14 – Jan 22',c:'rgba(0,230,118,.14)',tc:'#00e676'},{t:'Offer Letter — ₹52 LPA 🎉',d:'Jan 24 · 2025',c:'rgba(245,166,35,.18)',tc:'#f5a623'}].map((item,i)=>(
                    <div key={i} style={{display:'flex',gap:'.55rem',paddingBottom:i<3?'.6rem':'0',position:'relative'}}>
                      {i<3&&<div style={{position:'absolute',left:'8px',top:'17px',width:'1px',height:'calc(100% - 5px)',background:'rgba(255,255,255,.07)'}}></div>}
                      <div style={{width:'17px',height:'17px',borderRadius:'50%',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',background:item.c,color:item.tc}}>
                        <svg width="8" height="8" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="2 6 5 9 10 3"/></svg>
                      </div>
                      <div><div style={{fontSize:'.71rem',fontWeight:600,color:item.tc}}>{item.t}</div><div style={{fontSize:'.59rem',color:'rgba(255,255,255,.3)',marginTop:'.1rem'}}>{item.d}</div></div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.chip} style={{top:'12%',right:'3%',animation:'f1 5s ease-in-out infinite'}}>
                <div className={styles.chav} style={{background:'linear-gradient(135deg,#f5a623,#ff8000)',color:'#0a0a0a'}}>AR</div>
                <div><div className={styles.chv}>Arjun Rawat</div><div className={styles.chs}>Joined Google · ₹52 LPA</div></div>
              </div>
              <div className={styles.chip} style={{bottom:'23%',right:'1%',animation:'f2 6s ease-in-out infinite'}}>
                <span style={{fontSize:'.88rem'}}>🚀</span>
                <div><div className={styles.chv}>14 days to hired!</div><div className={styles.chs}>Fastest via HIREON AI</div></div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div className={styles.mqbar}>
        <div className={styles.mqlab}>48,000+ companies hiring on HIREON</div>
        <div className={styles.mqOuter}>
          <div className={styles.mqt}>
            {[...COMPANIES, ...COMPANIES].map((c, i) => (
              <div key={i} className={styles.mqi}>{c}</div>
            ))}
          </div>
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <div className={styles.stepsec}>
        <div className={styles.eye}>How It Works</div>
        <h2 className={styles.seh}>From profile to placement,<br />every step simplified.</h2>
        <p className={styles.sep}>HIREON uses AI at every step — whether you're a job seeker or a company looking for the best talent.</p>
        <div className={styles.steps}>
          {[
            { n:'01', icon:<svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>, t:'Build Your Profile', p:'Upload or build your resume in minutes. Our AI parses and enhances it to surface you to the right companies.' },
            { n:'02', icon:<svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>, t:'Get AI-Matched', p:'Our engine matches beyond keywords — skills, culture, growth trajectory and salary fit, all in real-time.' },
            { n:'03', icon:<svg viewBox="0 0 24 24"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>, t:'Apply in 1-Click', p:'Your profile is your application. Apply to hundreds of curated roles instantly — no form-filling, ever.' },
            { n:'04', icon:<svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>, t:'Land the Offer', p:'Ace every interview with AI prep, track each stage live, and accept your dream offer with total confidence.' },
          ].map(s => (
            <div key={s.n} className={styles.step}>
              <div className={styles.stepBgN}>{s.n}</div>
              <div className={styles.stepIcon}>{s.icon}</div>
              <h3>{s.t}</h3>
              <p>{s.p}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
