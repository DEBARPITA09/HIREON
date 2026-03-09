// import { useParams } from "react-router-dom";
// import { useState } from "react";

// export const CandidatesApplied = () => {
//   const { jobId } = useParams();

//   const [candidates, setCandidates] = useState([
//     {
//       id: 1,
//       name: "Rahul Sharma",
//       resume: "/resumes/resume2.pdf",
//       status: "Pending",
//     },
//     {
//       id: 2,
//       name: "Priya Singh",
//       resume: "/resumes/resume1.pdf",
//       status: "Pending",
//     },
//   ]);

//   const updateStatus = (id, newStatus) => {
//     const updated = candidates.map((c) =>
//       c.id === id ? { ...c, status: newStatus } : c,
//     );
//     setCandidates(updated);
//   };

//   return (
//     <div>
//       <h1>Candidates Applied: </h1>

//       <table border="1">
//         <thead>
//           <tr>
//             <th>Name</th>
//             <th>Resume</th>
//             <th>Status</th>
//             <th>Action</th>
//           </tr>
//         </thead>

//         <tbody>
//           {candidates.map((c) => (
//             <tr key={c.id}>
//               <td>{c.name}</td>

//               <td>
//                 <a href={c.resume} target="_blank">
//                   View Resume
//                 </a>
//               </td>

//               <td>{c.status}</td>

//               <td>
//                 <button onClick={() => updateStatus(c.id, "Accepted")}>
//                   Accept
//                 </button>

//                 <button onClick={() => updateStatus(c.id, "Rejected")}>
//                   Reject
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import styles from "./07_CandidatesApplied.module.css";

export const CandidatesApplied = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [candidates, setCandidates] = useState([
    { id: 1, name: "Rahul Sharma", resume: "/resumes/resume2.pdf", status: "Pending", role: "Frontend Dev", score: 87 },
    { id: 2, name: "Priya Singh", resume: "/resumes/resume1.pdf", status: "Pending", role: "UI/UX Designer", score: 92 },
    { id: 3, name: "Arjun Mehta", resume: "/resumes/resume3.pdf", status: "Pending", role: "Backend Dev", score: 78 },
  ]);

  const updateStatus = (id, newStatus) => {
    setCandidates(candidates.map((c) => (c.id === id ? { ...c, status: newStatus } : c)));
  };

  const getStatusStyle = (status) => {
    if (status === "Accepted") return styles.statusAccepted;
    if (status === "Rejected") return styles.statusRejected;
    return styles.statusPending;
  };

  const initials = (name) => name.split(" ").map(n => n[0]).join("").toUpperCase();

  return (
    <div className={styles.page}>
      <div className={styles.blob1}></div>
      <div className={styles.blob2}></div>

      {/* Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <span className={styles.logoHire}>HIRE</span>
          <span className={styles.logoOn}>ON</span>
        </div>
        <div className={styles.navRight}>
          <button className={styles.backBtn} onClick={() => navigate(-1)}>← Back</button>
          <div className={styles.avatar}>R</div>
          <button className={styles.signOut}>Sign out</button>
        </div>
      </nav>

      <div className={styles.container}>
        {/* Header */}
        <div className={styles.hero}>
          <div className={styles.badge}>
            <span className={styles.dot}></span>
            Job ID: {jobId}
          </div>
          <h1 className={styles.heroTitle}>
            Candidates<br />
            <span className={styles.grad}>Applied</span>
          </h1>
          <p className={styles.heroSub}>
            Review applicants, check their resumes, and make your hiring decisions below.
          </p>
          <div className={styles.statsRow}>
            <div className={styles.statBox}>
              <span className={styles.statNum}>{candidates.length}</span>
              <span className={styles.statLabel}>TOTAL</span>
            </div>
            <div className={styles.statBox}>
              <span className={styles.statNum}>{candidates.filter(c => c.status === "Accepted").length}</span>
              <span className={styles.statLabel}>ACCEPTED</span>
            </div>
            <div className={styles.statBox}>
              <span className={styles.statNum}>{candidates.filter(c => c.status === "Pending").length}</span>
              <span className={styles.statLabel}>PENDING</span>
            </div>
          </div>
        </div>

        {/* Candidates Grid */}
        <div className={styles.section}>
          <p className={styles.sectionLabel}>— APPLICANTS —</p>
          <div className={styles.grid}>
            {candidates.map((c) => (
              <div key={c.id} className={`${styles.card} ${c.status === "Accepted" ? styles.cardAccepted : c.status === "Rejected" ? styles.cardRejected : ""}`}>
                <div className={styles.cardTop}>
                  <div className={styles.candidateAvatar}>{initials(c.name)}</div>
                  <div className={styles.candidateInfo}>
                    <h3 className={styles.candidateName}>{c.name}</h3>
                    <p className={styles.candidateRole}>{c.role}</p>
                  </div>
                  <div className={`${styles.statusBadge} ${getStatusStyle(c.status)}`}>
                    {c.status}
                  </div>
                </div>

                {c.score && (
                  <div className={styles.scoreBar}>
                    <div className={styles.scoreLabel}>
                      <span>ATS Score</span>
                      <span className={styles.scoreNum}>{c.score}%</span>
                    </div>
                    <div className={styles.scoreTrack}>
                      <div className={styles.scoreFill} style={{ width: `${c.score}%` }}></div>
                    </div>
                  </div>
                )}

                <div className={styles.cardActions}>
                  <a href={c.resume} target="_blank" rel="noreferrer" className={styles.resumeBtn}>
                    📄 View Resume
                  </a>
                  <div className={styles.decisionBtns}>
                    <button
                      className={`${styles.acceptBtn} ${c.status === "Accepted" ? styles.activeAccept : ""}`}
                      onClick={() => updateStatus(c.id, "Accepted")}
                      disabled={c.status === "Accepted"}
                    >
                      ✓ Accept
                    </button>
                    <button
                      className={`${styles.rejectBtn} ${c.status === "Rejected" ? styles.activeReject : ""}`}
                      onClick={() => updateStatus(c.id, "Rejected")}
                      disabled={c.status === "Rejected"}
                    >
                      ✕ Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};