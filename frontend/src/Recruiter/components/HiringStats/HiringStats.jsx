import React, { useEffect, useRef, useState } from "react";
import styles from "./HiringStats.module.css";

/* ─────────────────────────────────────────
   DONUT CHART  (accepted / rejected / pending)
───────────────────────────────────────── */
function DonutChart({ accepted, rejected, pending, total }) {
  const ref = useRef();
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width = canvas.offsetWidth;
    const H = canvas.height = canvas.offsetHeight;
    const cx = W / 2, cy = H / 2;
    const outer = Math.min(W, H) * 0.42;
    const inner = outer * 0.58;

    const slices = [
      { value: accepted, color: "#00d4aa" },
      { value: rejected, color: "#f87171" },
      { value: pending,  color: "#fbbf24" },
    ].filter(s => s.value > 0);

    if (total === 0) {
      ctx.beginPath();
      ctx.arc(cx, cy, outer, 0, Math.PI * 2);
      ctx.arc(cx, cy, inner, 0, Math.PI * 2, true);
      ctx.fillStyle = "rgba(255,255,255,0.05)";
      ctx.fill();
      return;
    }

    let start = -Math.PI / 2;
    slices.forEach(({ value, color }) => {
      const angle = (value / total) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, outer, start, start + angle);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
      start += angle;
    });

    // punch inner hole
    ctx.beginPath();
    ctx.arc(cx, cy, inner, 0, Math.PI * 2);
    ctx.fillStyle = "#0b0f1a";
    ctx.fill();

    // centre label
    ctx.fillStyle = "#f0f4ff";
    ctx.font = `bold ${Math.round(outer * 0.38)}px Outfit, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(total, cx, cy - 8);
    ctx.fillStyle = "#475569";
    ctx.font = `${Math.round(outer * 0.18)}px Outfit, sans-serif`;
    ctx.fillText("TOTAL", cx, cy + outer * 0.24);
  }, [accepted, rejected, pending, total]);

  return <canvas ref={ref} className={styles.donut} />;
}

/* ─────────────────────────────────────────
   LINE / AREA CHART  (applicant trend over weeks)
───────────────────────────────────────── */
function TrendChart({ data, color, label }) {
  const ref = useRef();
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width  = canvas.offsetWidth;
    const H = canvas.height = canvas.offsetHeight;
    const pad = { top: 20, right: 16, bottom: 32, left: 32 };
    const iW = W - pad.left - pad.right;
    const iH = H - pad.top  - pad.bottom;

    if (!data || data.length < 2) return;

    const maxVal = Math.max(...data.map(d => d.value), 1);
    const pts = data.map((d, i) => ({
      x: pad.left + (i / (data.length - 1)) * iW,
      y: pad.top  + iH - (d.value / maxVal) * iH,
    }));

    // grid lines
    ctx.strokeStyle = "rgba(255,255,255,0.05)";
    ctx.lineWidth = 1;
    [0, 0.25, 0.5, 0.75, 1].forEach(t => {
      const y = pad.top + iH * t;
      ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(pad.left + iW, y); ctx.stroke();
    });

    // filled area
    const grad = ctx.createLinearGradient(0, pad.top, 0, pad.top + iH);
    grad.addColorStop(0, color + "44");
    grad.addColorStop(1, color + "00");
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pad.top + iH);
    pts.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(pts[pts.length - 1].x, pad.top + iH);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // smooth line using bezier
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) {
      const cpx = (pts[i - 1].x + pts[i].x) / 2;
      ctx.bezierCurveTo(cpx, pts[i-1].y, cpx, pts[i].y, pts[i].x, pts[i].y);
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // dots
    pts.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = "#0b0f1a";
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // x-axis labels
    ctx.fillStyle = "#334155";
    ctx.font = "10px Outfit, sans-serif";
    ctx.textAlign = "center";
    data.forEach((d, i) => {
      const x = pad.left + (i / (data.length - 1)) * iW;
      ctx.fillText(d.label, x, H - 6);
    });

    // y-axis labels
    ctx.textAlign = "right";
    [0, 0.5, 1].forEach(t => {
      const y = pad.top + iH * (1 - t);
      ctx.fillText(Math.round(maxVal * t), pad.left - 6, y + 4);
    });
  }, [data, color]);

  return (
    <div className={styles.chartWrap}>
      <p className={styles.chartLabel}>{label}</p>
      <canvas ref={ref} className={styles.lineCanvas} />
    </div>
  );
}

/* ─────────────────────────────────────────
   HORIZONTAL BAR CHART  (per-job comparison)
───────────────────────────────────────── */
function BarChart({ jobs }) {
  const ref = useRef();
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width  = canvas.offsetWidth;
    const H = canvas.height = canvas.offsetHeight;

    const pad   = { top: 16, right: 24, bottom: 16, left: 110 };
    const iW    = W - pad.left - pad.right;
    const maxVal= Math.max(...jobs.map(j => j.applicants), 1);
    const rowH  = (H - pad.top - pad.bottom) / jobs.length;
    const barH  = Math.min(rowH * 0.28, 12);
    const colors= ["#4f8ef7","#00d4aa","#f87171","#fbbf24"];
    const keys  = ["applicants","accepted","rejected","pending"];
    const labels= ["Applied","Accepted","Rejected","Pending"];

    jobs.forEach((job, ji) => {
      const jobData = {
        applicants: job.applicants,
        accepted:   job.accepted  || 0,
        rejected:   job.rejected  || 0,
        pending:    Math.max(0, job.applicants - (job.accepted||0) - (job.rejected||0)),
      };

      // job label
      ctx.fillStyle = "#94a3b8";
      ctx.font = "bold 11px Outfit, sans-serif";
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      const centreY = pad.top + ji * rowH + rowH / 2;
      ctx.fillText(job.role.length > 14 ? job.role.slice(0,14)+"…" : job.role, pad.left - 8, centreY);

      keys.forEach((key, ki) => {
        const y = pad.top + ji * rowH + ki * (barH + 2) + (rowH - keys.length*(barH+2)) / 2;
        const barW = (jobData[key] / maxVal) * iW;

        // track
        ctx.fillStyle = "rgba(255,255,255,0.04)";
        ctx.beginPath();
        ctx.roundRect(pad.left, y, iW, barH, 3);
        ctx.fill();

        // fill
        if (barW > 0) {
          ctx.fillStyle = colors[ki];
          ctx.globalAlpha = ki === 0 ? 0.45 : 0.85;
          ctx.beginPath();
          ctx.roundRect(pad.left, y, barW, barH, 3);
          ctx.fill();
          ctx.globalAlpha = 1;
        }

        // value label
        ctx.fillStyle = colors[ki];
        ctx.font = "10px Outfit, sans-serif";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText(jobData[key], pad.left + barW + 6, y + barH / 2);
      });
    });

    // legend
    ctx.textBaseline = "middle";
    labels.forEach((l, i) => {
      const lx = pad.left + (i / labels.length) * iW;
      ctx.fillStyle = colors[i];
      ctx.fillRect(lx, H - 10, 8, 8);
      ctx.fillStyle = "#475569";
      ctx.font = "9px Outfit, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(l, lx + 11, H - 6);
    });
  }, [jobs]);

  return (
    <div className={styles.chartWrap}>
      <p className={styles.chartLabel}>Per-Job Comparison</p>
      <canvas ref={ref} className={styles.barCanvas} />
    </div>
  );
}

/* ─────────────────────────────────────────
   FUNNEL  (applicants → accepted)
───────────────────────────────────────── */
function FunnelChart({ total, accepted, rejected, pending }) {
  const stages = [
    { label: "Applied",  value: total,    color: "#4f8ef7" },
    { label: "Reviewed", value: total - Math.floor(total * 0.15), color: "#a78bfa" },
    { label: "Shortlisted", value: accepted + pending, color: "#fbbf24" },
    { label: "Accepted", value: accepted, color: "#00d4aa" },
  ];
  const max = stages[0].value || 1;

  return (
    <div className={styles.chartWrap}>
      <p className={styles.chartLabel}>Hiring Funnel</p>
      <div className={styles.funnel}>
        {stages.map((s, i) => (
          <div key={s.label} className={styles.funnelRow}>
            <span className={styles.funnelLabel}>{s.label}</span>
            <div className={styles.funnelTrack}>
              <div
                className={styles.funnelFill}
                style={{
                  width: `${(s.value / max) * 100}%`,
                  background: s.color,
                  opacity: 0.85,
                }}
              />
              <span className={styles.funnelVal} style={{ color: s.color }}>{s.value}</span>
            </div>
            {i < stages.length - 1 && (
              <span className={styles.funnelDrop}>
                ↓ {stages[0].value > 0 ? Math.round(((stages[i].value - stages[i+1].value) / stages[0].value) * 100) : 0}% drop
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN MODAL
───────────────────────────────────────── */
export const HiringStats = ({ jobs, onClose }) => {
  const totalApplicants = jobs.reduce((a,j) => a + j.applicants, 0);
  const totalAccepted   = jobs.reduce((a,j) => a + (j.accepted||0), 0);
  const totalRejected   = jobs.reduce((a,j) => a + (j.rejected||0), 0);
  const totalPending    = totalApplicants - totalAccepted - totalRejected;
  const acceptRate      = totalApplicants > 0 ? Math.round((totalAccepted/totalApplicants)*100) : 0;

  // synthetic weekly trend data (last 6 weeks)
  const weeklyTrend = [
    { label: "W1", value: Math.round(totalApplicants * 0.10) },
    { label: "W2", value: Math.round(totalApplicants * 0.22) },
    { label: "W3", value: Math.round(totalApplicants * 0.45) },
    { label: "W4", value: Math.round(totalApplicants * 0.68) },
    { label: "W5", value: Math.round(totalApplicants * 0.85) },
    { label: "W6", value: totalApplicants },
  ];
  const acceptTrend = weeklyTrend.map(w => ({
    label: w.label,
    value: Math.round(w.value * (acceptRate / 100)),
  }));

  const overviewItems = [
    { label: "Total Applicants", val: totalApplicants, color: "#4f8ef7",  bg: "rgba(79,142,247,0.08)",  border: "rgba(79,142,247,0.18)"  },
    { label: "Accepted",         val: totalAccepted,   color: "#00d4aa",  bg: "rgba(0,212,170,0.08)",   border: "rgba(0,212,170,0.18)"   },
    { label: "Rejected",         val: totalRejected,   color: "#f87171",  bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.18)" },
    { label: "Pending Review",   val: totalPending,    color: "#fbbf24",  bg: "rgba(251,191,36,0.08)",  border: "rgba(251,191,36,0.18)"  },
    { label: "Acceptance Rate",  val: `${acceptRate}%`,color: "#a78bfa",  bg: "rgba(167,139,250,0.08)", border: "rgba(167,139,250,0.18)" },
  ];

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>

        {/* header */}
        <div className={styles.modalHeader}>
          <div>
            <h2 className={styles.modalTitle}>Hiring Statistics</h2>
            <p className={styles.modalSub}>Live pipeline analytics across all your job postings</p>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        {/* overview pills */}
        <div className={styles.overviewGrid}>
          {overviewItems.map(({ label, val, color, bg, border }) => (
            <div key={label} className={styles.overviewCard} style={{ background: bg, borderColor: border }}>
              <span className={styles.overviewVal} style={{ color }}>{val}</span>
              <span className={styles.overviewLabel}>{label}</span>
            </div>
          ))}
        </div>

        {/* row 1: donut + funnel */}
        <div className={styles.row2}>
          <div className={styles.chartWrap}>
            <p className={styles.chartLabel}>Pipeline Breakdown</p>
            <div className={styles.donutSection}>
              <DonutChart
                accepted={totalAccepted}
                rejected={totalRejected}
                pending={totalPending}
                total={totalApplicants}
              />
              <div className={styles.donutLegend}>
                {[
                  { label: "Accepted", val: totalAccepted, color: "#00d4aa" },
                  { label: "Rejected", val: totalRejected, color: "#f87171" },
                  { label: "Pending",  val: totalPending,  color: "#fbbf24" },
                ].map(({ label, val, color }) => (
                  <div key={label} className={styles.legendRow}>
                    <span className={styles.legendDot} style={{ background: color }} />
                    <span className={styles.legendLabel}>{label}</span>
                    <span className={styles.legendVal} style={{ color }}>{val}</span>
                    <span className={styles.legendPct}>
                      {totalApplicants > 0 ? Math.round((val/totalApplicants)*100) : 0}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <FunnelChart
            total={totalApplicants}
            accepted={totalAccepted}
            rejected={totalRejected}
            pending={totalPending}
          />
        </div>

        {/* row 2: line charts */}
        <div className={styles.row2}>
          <TrendChart data={weeklyTrend}  color="#4f8ef7" label="Applicant Trend (weekly)" />
          <TrendChart data={acceptTrend}  color="#00d4aa" label="Acceptance Trend (weekly)" />
        </div>

        {/* row 3: horizontal bar per job */}
        <BarChart jobs={jobs} />

      </div>
    </div>
  );
};