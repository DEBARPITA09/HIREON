 import React from "react";
 import {Link} from "react-router-dom";
 
export const Home = () => {
    return (
        <div>
            <div className="">
                <h1>Welcome to HIREON - home page</h1>
                <div>
                    {}
                    
                </div>
                <div className="Role-container">
                    <Link to="/Candidate/01_Candidate">Candidate</Link>
                    <Link to="/Recruiter/01_Recruiter">Recruiter</Link>
                </div>
            </div>
        </div>
    )
}
//we link this home page in app.jsx
// in nav bar whenever we click "home" -> this home pg opens
