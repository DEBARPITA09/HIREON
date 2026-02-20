import "./JobMatches.css";
import Navbar from "../components/Navbar";

function JobMatches() {

  const jobs = [

    {
      role: "Software Development Engineer",
      company: "Amazon",
      match: "92%",
      link: "https://www.amazon.jobs/",
      matchedSkills: ["JavaScript", "React", "HTML", "CSS"],
      missingSkills: ["System Design", "AWS"]
    },

    {
      role: "Frontend Developer",
      company: "Google",
      match: "88%",
      link: "https://careers.google.com/",
      matchedSkills: ["React", "JavaScript", "CSS"],
      missingSkills: ["TypeScript"]
    },

    {
      role: "Web Developer",
      company: "Microsoft",
      match: "84%",
      link: "https://careers.microsoft.com/",
      matchedSkills: ["HTML", "CSS", "JavaScript"],
      missingSkills: ["Azure"]
    }

  ];

  return (

    <>
      <Navbar />

      <div className="resume-jobs-page">

        <h1 className="resume-jobs-title">
          Matched Jobs Based on Your Resume
        </h1>

        <div className="resume-jobs-container">

          {jobs.map((job, index) => (

           <div key={index} className="resume-job-card">

              <div className="resume-job-left">

                <h2>{job.role}</h2>

                <p className="resume-company">{job.company}</p>

                <p className="resume-match">
                  Match Score: {job.match}
                </p>

                <a
                  href={job.link}
                  target="_blank"
                  className="resume-apply-btn"
                >
                  Apply Now
                </a> 

              </div>


              <div className="resume-job-right">

                <div>

                  <h4>Matched Skills</h4>

                  <ul>
                    {job.matchedSkills.map((skill, i) => (
                      <li key={i}>{skill}</li>
                    ))}
                  </ul>

                </div>


                <div>

                  <h4>Skills to Improve</h4>

                  <ul>
                    {job.missingSkills.map((skill, i) => (
                      <li key={i}>{skill}</li>
                    ))}
                  </ul>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </>

  );

}

export default JobMatches;
