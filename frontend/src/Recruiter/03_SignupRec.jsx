import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
export const SignupRecruiter = () => {

    const navigate = useNavigate();
    const [input, setInput] = useState({
        name: "",
        email: "",
        password: "",
    });

    const handleChange = (event) => {
        setInput({
            ...input,
            [event.target.name]: event.target.value
        });
    };
    //to store value in local storage
    const handleSubmit = (event) => {
        event.preventDefault(); //form submit hoga - page sabse pehle reload ho jata hai.(default behavaiour)

        localStorage.setItem("user", JSON.stringify(input)) //we can't directly store object in local storage. so, we store the string. to convert the object into string we use JSON.stringify(input).
        //abhi input wala object store ho gaya local storage mein.
        //jaise hi local storage mein save ho gaya- it'll navigate the user to login.
        navigate("/Recruiter/02_LoginRec"); //means go to /Candidate/02_Login.
        

    }
    return (
        <div>
            <h2>Sign-up form</h2>
            <form onSubmit={handleSubmit}>
                <div className="name">
                    <input
                        name="name"
                        value={input.name}
                        onChange={handleChange}
                        type="text"
                        id="signup-name"
                        className="signup-class"
                    />
                    <label className="signup-label" htmlFor="signup-name">
                        Your Name
                    </label>
                </div>

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