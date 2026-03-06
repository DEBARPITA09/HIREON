import {Link} from "react-router-dom";
export const RecruiterHomePage = () => {
    return (
        <div>
            <h1>hello, Recruiter.</h1>
            <Link to="/Recruiter/02_LoginRec">Login</Link>
            <br />
            <Link to="/Recruiter/03_SignupRec">Signup</Link>
        </div>
    )
}