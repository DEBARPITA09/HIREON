import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export const ResumeAnalysis = () => {

  const location = useLocation();
  const resume = location.state?.resume;

  const [analysisData, setAnalysisData] = useState(null);

  useEffect(() => {

    // Simulated backend response (for demo)
    const mockResponse = {
      skills: [
        "HTML",
        "CSS",
        "JavaScript",
        "Python",
        "Machine Learning",
        "Deep Learning",
        "DBMS",
        "Data Science"
      ],
      ats_score: 78,
      feedback: [
        "Add more detailed descriptions of your projects.",
        "Include measurable achievements (e.g., improved performance by 30%).",
        "Highlight internships or practical work experience."
      ],
      job_recommendations: [
        {
          title: "Amazon SDE Intern",
          desc: "Looking for candidates with strong HTML, CSS, and JavaScript knowledge."
        },
        {
          title: "Google Frontend Developer",
          desc: "Experience with React and modern JavaScript frameworks required."
        },
        {
          title: "Microsoft Data Analyst",
          desc: "Python and Data Science knowledge preferred."
        }
      ]
    };

    setAnalysisData(mockResponse);

  }, []);

  if (!analysisData) {
    return <h2>Analyzing your resume...</h2>;
  }

  return (
    <div className="resume-analysis">

      <h1>Your Resume Analysis Report</h1>

      {resume && (
        <p>
          Uploaded Resume: <b>{resume.name}</b>
        </p>
      )}

      {/* ATS SCORE */}

      <h2>ATS Score</h2>
      <p><strong>{analysisData.ats_score}/100</strong></p>

      {/* SKILLS */}

      <h2>Extracted Skills</h2>

      <div className="skills">
        {analysisData.skills.map((skill, index) => (
          <span key={index} className="skill-tag">
            {skill}
          </span>
        ))}
      </div>

      {/* FEEDBACK */}

      <h2>Resume Feedback</h2>

      <ul>
        {analysisData.feedback.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

      {/* JOB RECOMMENDATIONS */}

      <h2>Recommended Jobs</h2>

      <div className="jobs">
        {analysisData.job_recommendations.map((job, index) => (
          <div key={index} className="job-card">

            <h3>{job.title}</h3>
            <p>{job.desc}</p>

            <button>Apply Now</button>

          </div>
        ))}
      </div>

    </div>
  );
};