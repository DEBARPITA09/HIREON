import { useNavigate } from "react-router-dom";
import "./Landing.css";

function Landing() {

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  return (

    <div className="landing-container">

      {/* LEFT SECTION */}
      <div className="landing-left">

        <h1 className="landing-title">
          HIREON
        </h1>

        <h2 className="landing-subtitle">
          Your Skill to Job Matcher
        </h2>

        <p className="landing-description">

          Hireon is an intelligent career analysis platform that evaluates your LinkedIn profile and resume to identify your skills, match them with industry job requirements, and recommend the most suitable job roles.

          It helps you understand your professional strengths, missing skills, and career readiness. Hireon also provides resume analysis, improvement suggestions, and job matching insights to help you achieve your career goals faster and more efficiently.

        </p>


        {/* BUTTONS ALWAYS VISIBLE */}
        <div className="landing-buttons">

          <button
            className="signup-btn"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </button>

          <button
            className="login-btn"
            onClick={() => navigate("/login")}
          >
            Login
          </button>

        </div>

      </div>


      {/* RIGHT IMAGE */}
      <div className="landing-right">

        <img
          src="/hireon-hero.png"
          alt="Hireon"
          className="landing-image"
        />

      </div>

    </div>

  );

}

export default Landing;
