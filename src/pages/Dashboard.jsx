import "./Dashboard.css";

function Dashboard(){

  const skills=[

    "JavaScript",
    "React",
    "HTML",
    "CSS",
    "Node.js"

  ];

  return(

    <div className="dashboard">

      <h2>Your LinkedIn Skills</h2>

      <div className="skills">

        {skills.map(skill=>(

          <div className="skill">
            {skill}
          </div>

        ))}

      </div>


      <h2>Matched Jobs</h2>


      <div className="job-card">

        <h3>Amazon SDE</h3>

        <ul>

          <li>
            Apply:
            https://amazon.jobs
          </li>

          <li>
            Matching Skills:
            JavaScript, React
          </li>

          <li>
            Missing Skills:
            AWS, Docker
          </li>

        </ul>

      </div>


      <div className="job-card">

        <h3>Google Frontend Developer</h3>

        <ul>

          <li>
            Apply:
            https://careers.google.com
          </li>

          <li>
            Matching Skills:
            HTML, CSS
          </li>

          <li>
            Missing Skills:
            TypeScript
          </li>

        </ul>

      </div>


    </div>

  )

}

export default Dashboard;
