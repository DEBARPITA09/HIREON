import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const CandidateMain = () => {
    const [resume, setResume] = useState(null);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        setResume(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!resume) {
            alert("Please upload your resume first");
            return;
        }

        // Navigate to Resume Analysis page
        navigate("/resume-analysis", { state: { resume } });
    };

    return (
        <div>
            <h1>Upload your Resume to get your job recommendations based on your skills...</h1>

            <form onSubmit={handleSubmit}>
                <label htmlFor="resume-upload">Upload your Resume</label> <br/>

                <input
                    type="file"
                    id="resume-upload"
                    onChange={handleFileChange}
                />

                <br/><br/>
                <button type="submit">Analyze Resume</button>
            </form>
        </div>
    );
};