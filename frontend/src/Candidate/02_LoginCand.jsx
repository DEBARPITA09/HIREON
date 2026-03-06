import {useNavigate} from "react-router-dom";
import React from "react";
import {useState} from "react";
export const LoginCandidate = () => {

    const navigate = useNavigate();
    const [input, setInput] = useState({
            email: "",
            password: "",
        });

    const handleChange = (event) => {
        setInput({
            ...input,
            [event.target.name]: event.target.value
        });
    };
    const handleLogin = (e) => {
        e.preventDefault();
        const loggedUser = JSON.parse(localStorage.getItem("user")); //without JSON.parse() give us string. but we need an object now.
        //so, we use JSON.parse() to convert string to object.
        if(!loggedUser) {
            alert("No user found. Please sign up first.");
            return;
        }
        if(input.email === loggedUser.email && input.password === loggedUser.password) {
            navigate("/Candidate/04_MainCand");
        }

        else {
            alert("wrong email or password")
        }
    }
    return (
        <div>
        <form onSubmit={handleLogin}>
                

            <div className="email">
                    <input
                        name="email"
                        value={input.email}
                        onChange={handleChange}
                        type="email"
                        id="signup-email"
                        className="signup-class"
                    />
                    <label className="signup-label" htmlFor="signup-email">
                        Your e-mail
                    </label>
                </div>

                <div className="password">
                    <input
                        name="password"
                        value={input.password}
                        onChange={handleChange}
                        type="password"
                        id="signup-password"
                        className="signup-class"
                    />
                    <label className="signup-label" htmlFor="signup-password">
                        Password
                    </label>
                </div>
                <div className="submit-button">
                    <button
                    type="submit"
                    className="signup-submit signup-class"
                    id="signup-submit"
                    >Sign Up</button>
                </div>
        </form>
        </div>
    )
}