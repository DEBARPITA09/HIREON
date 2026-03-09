import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ServiceCards.module.css";

const services = [
  { title: "Post a Job",        desc: "Create a detailed job listing with role, location, salary, work mode and deadlines to attract the right candidates.",  tag: "Quick Post",  color: "blue", action: "postJob"         },
  { title: "View Applicants",   desc: "Browse all candidates who applied to your roles. Review resumes and update application statuses in one place.",         tag: "AI Powered",  color: "teal", action: "viewApplicants"  },
  { title: "ATS Screening",     desc: "Automatically rank applicants by ATS compatibility scores so you spend time only on the most relevant profiles.",        tag: "Smart Score", color: "blue", action: "ats"             },
  { title: "Company Profile",   desc: "Showcase your company's mission, culture, industry, size and contact info so candidates know who they're applying to.", tag: "My Company",  color: "teal", action: "companyProfile"  },
  { title: "Recruiter Profile", desc: "Add your professional details, qualifications, experience and contact info so candidates can learn more about you.",    tag: "My Profile",  color: "blue", action: "recruiterProfile" },
  { title: "Hiring Statistics", desc: "Visualise your pipeline — applicant trends, acceptance curves, per-job breakdowns, and funnel analytics in one view.", tag: "Analytics",   color: "teal", action: "hiringStats"      },
];

export function GridCanvas() {
  const ref = useRef();
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W, H, raf;
    const resize = () => { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);
    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const size = 60;
      ctx.strokeStyle = "rgba(255,255,255,0.028)"; ctx.lineWidth = 1;
      for (let x = 0; x < W; x += size) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
      for (let y = 0; y < H; y += size) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
      const cx = W/2, cy = 220, r = 280 + Math.sin(t)*30;
      const grd = ctx.createRadialGradient(cx,cy,0,cx,cy,r);
      grd.addColorStop(0,"rgba(0,212,170,0.05)"); grd.addColorStop(1,"transparent");
      ctx.fillStyle = grd; ctx.fillRect(0,0,W,H);
      t += 0.012; raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} className={styles.gridCanvas} />;
}

export const ServiceCards = ({ jobs, onOpen }) => {
  const navigate = useNavigate();
  const handleClick = (action) => {
    if (action === "viewApplicants") navigate(`/job/${jobs[0]?.id || 1}`);
    else onOpen(action);
  };

  return (
    <>
      <div className={styles.sectionLabel}><span>— Services —</span></div>
      <div className={styles.grid}>
        {services.map((s, i) => (
          <div
            key={s.title}
            className={`${styles.card} ${s.color === "teal" ? styles.cardTeal : styles.cardBlue}`}
            onClick={() => handleClick(s.action)}
            style={{ animationDelay: `${i * 0.07}s` }}
          >
            <div className={styles.cardTop}>
              <span className={`${styles.tag} ${s.color === "teal" ? styles.tagTeal : styles.tagBlue}`}>{s.tag}</span>
            </div>
            <h3 className={styles.cardTitle}>{s.title}</h3>
            <p className={styles.cardDesc}>{s.desc}</p>
            <div className={styles.cardAction}>
              <span>Get Started</span>
              <span className={styles.arrow}>→</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};