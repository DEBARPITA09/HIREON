import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

function Navbar() {

  const location = useLocation();

  return (

    <div className="navbar">

      <div className="nav-left">
        HIREON
      </div>

      <div className="nav-right">

        <Link
          to="/linkedin-analysis"
          className={location.pathname === "/linkedin-analysis" ? "nav-btn active" : "nav-btn"}
        >
          LinkedIn Analysis
        </Link>
        
        <Link
          to="/resume-analysis"
          className={location.pathname === "/resume-analysis" ? "nav-btn active" : "nav-btn"}
        >
          Resume Analysis
        </Link>

      </div>

    </div>

  );

}

export default Navbar;
