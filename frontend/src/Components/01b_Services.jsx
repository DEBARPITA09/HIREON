// import React from "react";
// export const Services = () => {
//     return (
//         <div>
//             <div>
//                 <h1>HIREON provides the following services...</h1>
//                 {/*Add the needed details here*/}
//             </div>
//         </div>
//     )
// }
import React from "react";

export const Services = () => {
    return (
        <div style={{
            padding: "40px 80px",
            fontFamily: "Arial, sans-serif"
        }}>

            {/* Header */}
            <h1 style={{ marginBottom: "10px" }}>
                Our Services
            </h1>

            <p style={{
                fontSize: "18px",
                color: "#555",
                marginBottom: "40px"
            }}>
                HIREON provides comprehensive recruitment solutions
                designed to streamline job searching and hiring processes
                for both candidates and recruiters.
            </p>

            {/* Candidate Services */}
            <div style={{ marginBottom: "50px" }}>
                <h2 style={{ marginBottom: "20px" }}>
                    Services for Candidates
                </h2>

                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "20px"
                }}>
                    <ServiceCard 
                        title="Profile Management"
                        description="Create and manage your professional profile efficiently."
                    />
                    <ServiceCard 
                        title="Job Search & Filtering"
                        description="Search and filter job opportunities based on your preferences."
                    />
                    <ServiceCard 
                        title="Easy Application Submission"
                        description="Apply to jobs seamlessly with a structured workflow."
                    />
                    <ServiceCard 
                        title="Application Tracking"
                        description="Track the status of your job applications in real-time."
                    />
                </div>
            </div>

            {/* Recruiter Services */}
            <div style={{ marginBottom: "50px" }}>
                <h2 style={{ marginBottom: "20px" }}>
                    Services for Recruiters
                </h2>

                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "20px"
                }}>
                    <ServiceCard 
                        title="Post Job Openings"
                        description="Create and publish job listings easily."
                    />
                    <ServiceCard 
                        title="Manage Applications"
                        description="Review and organize candidate applications efficiently."
                    />
                    <ServiceCard 
                        title="Shortlist Candidates"
                        description="Filter and shortlist the most suitable applicants."
                    />
                    <ServiceCard 
                        title="Recruitment Dashboard"
                        description="Track hiring progress through an organized dashboard."
                    />
                </div>
            </div>

        </div>
    );
};


/* Reusable Card Component */
const ServiceCard = ({ title, description }) => {
    return (
        <div style={{
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 3px 10px rgba(0,0,0,0.1)"
        }}>
            <h3 style={{ marginBottom: "10px" }}>{title}</h3>
            <p>{description}</p>
        </div>
    );
};