import "./Home.css";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-container">

      <div className="hero-left">

        <h1 className="hero-title">
          Welcome to HIREON
        </h1>

        <p className="hero-description">
          HIREON is an intelligent LinkedIn profile analyzer and resume analyzer
          designed to help job seekers maximize their career potential.
          Our platform evaluates your resume, identifies strengths and weaknesses,
          suggests improvements, and matches you with the most relevant job opportunities.

          By analyzing your skills, experience, and profile data, HIREON provides
          personalized job recommendations, highlights missing skills, and guides you
          to become industry-ready. This ensures you stay competitive and increase
          your chances of landing your dream job faster and more efficiently.
        </p>

        <div className="hero-buttons">

          <Link to="/login">
            <button className="primary-btn">Login</button>
          </Link>

          <Link to="/signup">
            <button className="secondary-btn">Signup</button>
          </Link>

        </div>

      </div>

      <div className="hero-right">
        <img src="/hireon-hero.png" alt="hireon team" />
      </div>

    </div>
  );
}

export default Home;
