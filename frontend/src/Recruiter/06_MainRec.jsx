import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./06_MainRec.module.css";

import { Navbar }                    from "./components/Navbar/Navbar";
import { ServiceCards, GridCanvas }  from "./components/ServiceCards/ServiceCards";
import { JobListings }               from "./components/JobListings/JobListings";
import { PostJob }                   from "./components/PostJob/PostJob";
import { CompanyProfile }            from "./components/CompanyProfile/CompanyProfile";
import { RecruiterProfile }          from "./components/RecruiterProfile/RecruiterProfile";
import { HiringStats }               from "./components/HiringStats/HiringStats";
import { AtsScreening }              from "./components/AtsScreening/AtsScreening";
import { ProfileWizard }             from "./components/ProfileWizard/ProfileWizard";




/* ─── Particle Network Background — same as candidate ─── */
function useParticles(ref) {
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W, H, raf;
    const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    resize(); window.addEventListener("resize", resize);
    const N = 90;
    const pts = Array.from({length:N}, () => ({
      x:Math.random(), y:Math.random(),
      vx:(Math.random()-.5)*.00018, vy:(Math.random()-.5)*.00018,
      r:.6+Math.random()*1.4, a:.1+Math.random()*.32, ph:Math.random()*Math.PI*2,
    }));
    let t = 0;
    function draw() {
      ctx.clearRect(0,0,W,H);
      pts.forEach(p => {
        p.x+=p.vx; p.y+=p.vy;
        if(p.x<0)p.x=1; if(p.x>1)p.x=0; if(p.y<0)p.y=1; if(p.y>1)p.y=0;
        const pulse=.82+.18*Math.sin(t*.016+p.ph);
        ctx.beginPath(); ctx.arc(p.x*W,p.y*H,p.r*pulse,0,Math.PI*2);
        ctx.fillStyle=`rgba(255,255,255,${p.a*pulse})`; ctx.fill();
      });
      for(let i=0;i<N;i++) for(let j=i+1;j<N;j++){
        const dx=pts[i].x-pts[j].x, dy=pts[i].y-pts[j].y, d=Math.sqrt(dx*dx+dy*dy);
        if(d<.08){ctx.beginPath();ctx.moveTo(pts[i].x*W,pts[i].y*H);ctx.lineTo(pts[j].x*W,pts[j].y*H);
          ctx.strokeStyle=`rgba(255,255,255,${.05*(1-d/.08)})`;ctx.lineWidth=.4;ctx.stroke();}
      }
      t++; raf=requestAnimationFrame(draw);
    }
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize",resize); };
  }, []);
}

export const RecruiterMain = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  useParticles(canvasRef);
  const [modal,        setModal]        = useState(null);
  const [recruiter,    setRecruiter]    = useState({});
  const [liveAppCount, setLiveAppCount] = useState(0);
  const [showWizard, setShowWizard] = useState(false);

  /* ── helpers ── */
  const getAuth     = () => JSON.parse(localStorage.getItem("recruiter")) || {};
  const getEmail    = ()  => getAuth().email || "default";
  const jobsKey     = ()  => `hireon_jobs_${getEmail()}`;
  const promptKey   = ()  => `hireon_rec_prompted_${getEmail()}`;

  const isProfileComplete = (r) => {
    const auth = r || getAuth();
    const email = auth.email || "";
    const profile = JSON.parse(localStorage.getItem(`recruiterProfile_${email}`)) || {};
    const company = JSON.parse(localStorage.getItem(`recruiterCompany_${email}`)) || {};
    const recOk  = !!(profile.name?.trim() || auth.name?.trim())
                && !!(profile.designation?.trim())
                && !!(profile.phone?.trim());
    const compOk = !!(company.name?.trim())
                && !!(company.industry?.trim())
                && !!(company.headquarters?.trim());
    return recOk && compOk;
  };

  /* ── jobs — scoped per recruiter ── */
  const [jobs, setJobs] = useState(() => {
    const auth  = JSON.parse(localStorage.getItem("recruiter")) || {};
    const email = auth.email || "default";
    return JSON.parse(localStorage.getItem(`hireon_jobs_${email}`)) || [];
  });

  useEffect(() => {
    // Save this recruiter's jobs under their own key
    localStorage.setItem(jobsKey(), JSON.stringify(jobs));
    // Merge into global hireon_jobs so candidates can see all jobs
    const recEmail  = getEmail();
    const allJobs   = JSON.parse(localStorage.getItem("hireon_jobs")) || [];
    const otherJobs = allJobs.filter(j => j.recruiterEmail !== recEmail);
    localStorage.setItem("hireon_jobs", JSON.stringify([...otherJobs, ...jobs]));
  }, [jobs]);

  /* ── load recruiter + prompt check ── */
  useEffect(() => {
    const r = getAuth();
    setRecruiter(r);
  }, [modal]);

  /* ── live applicant count ── */
  useEffect(() => {
    const myJobIds = new Set(jobs.map(j => String(j.id)));
    const apps = JSON.parse(localStorage.getItem("hireon_applications")) || [];
    setLiveAppCount(apps.filter(a => myJobIds.has(String(a.jobId))).length);
  }, [jobs]);

  const setPrompted = () => localStorage.setItem(promptKey(), "1");



  /* ── intercept Post a Job ── */
  const handleOpenModal = (action) => {
    if (action === "postJob" && !isProfileComplete()) {
      setPrompted();
      setShowWizard(true);
      return;
    }
    setModal(action);
  };

  const handleSignOut = () => navigate("/Recruiter/02_LoginRec");

  const handleAddJob = (newJob) => {
    const auth = getAuth();
    setJobs(prev => [...prev, {
      id: Date.now(),
      applicants: 0, accepted: 0, rejected: 0,
      recruiterEmail: auth.email || "",
      recruiterName:  auth.name  || "",
      company: auth.company || newJob.company || "",
      ...newJob,
    }]);
  };

  return (
    <div className={styles.page}>
      <canvas ref={canvasRef} style={{position:"fixed",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:0}}/>

      {showWizard && (
        <ProfileWizard
          onClose={() => setShowWizard(false)}
          onReadyToPost={() => setModal("postJob")}
        />
      )}

      <Navbar
        recruiter={recruiter}
        onSignOut={handleSignOut}
        onOpenModal={setModal}
      />

      {/* MAIN */}
      <div style={{position:"relative",zIndex:1}}>
      <div className={styles.main}>
        <div className={styles.pageHeader}>
          <div className={styles.pageBadge}>
            <span className={styles.pageBadgeDot}/>
            RECRUITER DASHBOARD
          </div>
          <h1 className={styles.pageTitle}>
            Hire the <em>Best.</em><br />Build Great Teams.
          </h1>
          <p className={styles.pageSub}>
            Every tool below is powered by AI to help you find the right talent, screen smarter, and close roles faster.
          </p>
        </div>

        <div className={styles.statsRow}>
          {[
            { value: String(jobs.length),                                     label: "Active Jobs"      },
            { value: String(liveAppCount), label: "Total Applicants" },
            { value: "AI",                                                     label: "Powered"          },
          ].map(({ value, label }) => (
            <div key={label} className={styles.statCard}>
              <div className={styles.statValue}>{value}</div>
              <div className={styles.statLabel}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      <ServiceCards jobs={jobs} onOpen={handleOpenModal} />
      <JobListings  jobs={jobs} />

      {modal === "postJob"          && <PostJob          onClose={() => setModal(null)} onAdd={handleAddJob} />}
      {modal === "companyProfile"   && <CompanyProfile   onClose={() => setModal(null)} />}
      {modal === "recruiterProfile" && <RecruiterProfile onClose={() => setModal(null)} />}
      {modal === "hiringStats"      && <HiringStats      jobs={jobs} onClose={() => setModal(null)} />}
      {modal === "ats"              && <AtsScreening     jobs={jobs} onClose={() => setModal(null)} />}
    </div>
    </div>
  );
};