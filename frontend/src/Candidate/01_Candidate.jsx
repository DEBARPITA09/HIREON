import React from "react";
import {Link} from "react-router-dom";


export const CandidateHomePage = () => {
    return <div>
        <h1>Welcome Candidate</h1>
        <Link to="/Candidate/02_LoginCand">Login</Link>
        <br />
        <Link to="/Candidate/03_SignupCand">Signup</Link>
    </div>
}