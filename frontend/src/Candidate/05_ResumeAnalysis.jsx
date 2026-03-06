export const ResumeAnalysis = () => {
  return (
    <>
      <h1>Your Resume Analysis: </h1>
      <div className="extracted-skills">
        <h2>We extracted the following skills from your Resume: </h2>
        <span>HTML</span>
        <span>CSS</span>
        <span>JS</span>
        <span>Data Science</span>
        <span>AI,ML,DL</span>
        <span>Python</span>
        <span>Java</span>
        <span>DBMS</span>

        <h2>Your resume analysis report is as follows: </h2>
        <div>
          {/*you can improve with these skills etc, etc..... write anything extra extra just as a test case*/}
        </div>

        <h2>Following are your job-recommendations: </h2>
        <div className="jobs">
            <div>
                <h3>1. Amazon SDE role</h3>
                <p>job description - need hands on practice with html, css</p>
                <p></p>
            </div>
        </div>
      </div>
    </>
  );
};
