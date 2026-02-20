import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./ResumeAnalysis.css";

function ResumeAnalysis() {

  const navigate = useNavigate();

  const [resume, setResume] = useState(null);

  const handleUpload = (e) => {

    const file = e.target.files[0];

    if (file) {

      setResume(file.name);

      localStorage.setItem("resumeName", file.name);

    }

  };

  const savedResume = localStorage.getItem("resumeName");


  return (

    <>
      <Navbar />

      <div className="resume-page">

        <h1 className="resume-title">
          Resume Analysis Dashboard
        </h1>


        {/* Upload Resume Card */}

        <div className="resume-card">

          <h2>Upload Resume</h2>

          <input
            type="file"
            onChange={handleUpload}
            className="resume-input"
          />

          {resume && (
            <p className="success-text">
              Uploaded: {resume}
            </p>
          )}

        </div>



        {/* View Resume Card */}

        <div className="resume-card">

          <h2>Your Uploaded Resume</h2>

          {savedResume ? (

            <>
              <p className="resume-name">
                {savedResume}
              </p>

              <button
                className="resume-btn"
                onClick={() => navigate("/resume-view")}
              >
                View Resume
              </button>

            </>

          ) : (

            <p>No resume uploaded yet.</p>

          )}

        </div>



        {/* Skills Extracted */}

        <div className="resume-card">

          <h2>Skills Extracted from Resume</h2>

          <div className="skills-container">

            <span className="skill">HTML</span>

            <span className="skill">CSS</span>

            <span className="skill">JavaScript</span>

            <span className="skill">React</span>

            <span className="skill">Node.js</span>

          </div>

        </div>



        {/* Recommended Jobs */}

        <div className="resume-card">

          <h2>Recommended Jobs</h2>

          <button
            className="resume-btn"
            onClick={() => navigate("/jobs")}
          >
            View Job Matches
          </button>

        </div>



        {/* Resume Improvement */}

        <div className="resume-card">

          <h2>Improvements Suggested</h2>

          <ul className="improve-list">

            <li>Add TypeScript skill</li>

            <li>Add System Design knowledge</li>

            <li>Add one cloud skill (AWS / Azure)</li>

            <li>Add more real-world projects</li>

          </ul>

        </div>



        {/* Resume Score */}

        <div className="resume-card">

          <h2>Resume Analysis Report</h2>

          <p className="score">
            Resume Strength Score: 82 / 100
          </p>

          <p>
            Your resume is strong but adding cloud and backend projects
            will significantly improve job match.
          </p>

        </div>


      </div>

    </>

  );

}

export default ResumeAnalysis;
