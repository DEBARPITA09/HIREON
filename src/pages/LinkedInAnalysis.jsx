// import { useNavigate } from "react-router-dom";
// import "./LinkedInAnalysis.css";

// function LinkedInAnalysis() {

//   const navigate = useNavigate();

//   const skills = [
//     "HTML",
//     "CSS",
//     "JavaScript",
//     "React",
//     "Node.js",
//     "Git"
//   ];

//   const jobs = [
//     {
//       role: "Amazon Software Development Engineer",
//       link: "https://amazon.jobs",
//       match: ["JavaScript", "React", "HTML", "CSS"],
//       missing: ["AWS", "System Design"]
//     },
//     {
//       role: "Google Frontend Developer",
//       link: "https://careers.google.com",
//       match: ["JavaScript", "React", "CSS"],
//       missing: ["TypeScript", "Performance Optimization"]
//     },
//     {
//       role: "Microsoft Software Engineer",
//       link: "https://careers.microsoft.com",
//       match: ["JavaScript", "Node.js"],
//       missing: ["Azure", "Microservices"]
//     }
//   ];

//   return (

//     <div className="analysis-container">

//       <h1 className="page-title">
//         LinkedIn Profile Analysis
//       </h1>


//       {/* Skills Section */}
//       <div className="section-card">

//         <h2>Your Skills</h2>

//         <div className="skills-box">

//           {skills.map((skill, index) => (
//             <span key={index} className="skill">
//               {skill}
//             </span>
//           ))}

//         </div>

//       </div>


//       {/* Job Matches */}
//       <h2 className="job-title">
//         Matched Jobs
//       </h2>

//       <div className="job-container">

//         {jobs.map((job, index) => (

//           <div key={index} className="job-card">

//             <h3>{job.role}</h3>

//             <p>
//               Apply Link:
//               <a href={job.link} target="_blank">
//                 Apply Here
//               </a>
//             </p>

//             <p>
//               Matching Skills:
//               {job.match.join(", ")}
//             </p>

//             <p>
//               Additional Skills Required:
//               {job.missing.join(", ")}
//             </p>

//           </div>

//         ))}

//       </div>


//       <button
//         className="next-button"
//         onClick={() => navigate("/resume-analysis")}
//       >
//         Go to Resume Analysis
//       </button>


//     </div>

//   );

// }

// export default LinkedInAnalysis;

import { useNavigate } from "react-router-dom";
import "./LinkedInAnalysis.css";

function LinkedInAnalysis() {

  const navigate = useNavigate();

  const skills = [
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "Node.js",
    "Git"
  ];

  const jobs = [
    {
      role: "Amazon Software Development Engineer",
      link: "https://amazon.jobs",
      match: ["JavaScript", "React", "HTML", "CSS"],
      missing: ["AWS", "System Design"]
    },
    {
      role: "Google Frontend Developer",
      link: "https://careers.google.com",
      match: ["JavaScript", "React", "CSS"],
      missing: ["TypeScript", "Performance Optimization"]
    },
    {
      role: "Microsoft Software Engineer",
      link: "https://careers.microsoft.com",
      match: ["JavaScript", "Node.js"],
      missing: ["Azure", "Microservices"]
    }
  ];

  return (

    <div className="analysis-container">

      <h1 className="page-title">
        LinkedIn Profile Analysis
      </h1>

      {/* Skills Section */}
      <div className="section-card">

        <h2>Your Skills</h2>

        <div className="skills-box">
          {skills.map((skill, index) => (
            <span key={index} className="skill">
              {skill}
            </span>
          ))}
        </div>

      </div>

      {/* Job Matches */}
      <h2 className="job-title">
        Matched Jobs
      </h2>

      <div className="job-container">

        {jobs.map((job, index) => (

          <div key={index} className="job-card">

            <p>
              <span className="label">Job Role:</span> {job.role}
            </p>

            <p>
              <span className="label">Apply Link:</span>
              <a
                href={job.link}
                target="_blank"
                rel="noreferrer"
                className="apply-btn"
              >
                Apply Now
              </a>
            </p>

            <p>
              <span className="label">Matched Skills:</span>
              {job.match.join(", ")}
            </p>

            <p>
              <span className="label">Additional Skills Required:</span>
              {job.missing.join(", ")}
            </p>

          </div>

        ))}

      </div>

      <button
        className="next-button"
        onClick={() => navigate("/resume-analysis")}
      >
        Go to Resume Analysis
      </button>

    </div>

  );

}

export default LinkedInAnalysis;

