import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const RecruiterMain = () => {

  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);

  const [jobs, setJobs] = useState([
    {
      id: 1,
      company: "Microsoft",
      role: "Project Manager",
      applicants: 2
    },
    {
      id: 2,
      company: "Amazon",
      role: "SDE Role",
      applicants: 3
    }
  ]);

  const [jobData, setJobData] = useState({
    company: "",
    role: "",
    description: "",
    salary: "",
    deadline: ""
  });

  const handleChange = (e) => {
    setJobData({
      ...jobData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {

    e.preventDefault();

    const newJob = {
      id: jobs.length + 1,
      company: jobData.company,
      role: jobData.role,
      applicants: 0
    };

    setJobs([...jobs, newJob]);

    setJobData({
      company: "",
      role: "",
      description: "",
      salary: "",
      deadline: ""
    });

    setShowForm(false);
  };

  return (

    <div>

      <h1>Recruiter Dashboard</h1>

      <button onClick={() => setShowForm(true)}>
        Create Job Role
      </button>

      {/* Popup Form */}

      {showForm && (

        <div className="dialog">

          <h2>Create Job Role</h2>

          <form onSubmit={handleSubmit}>

            <label>Company Name</label>
            <br/>
            <input
              type="text"
              name="company"
              value={jobData.company}
              onChange={handleChange}
              required
            />

            <br/><br/>

            <label>Job Role</label>
            <br/>
            <input
              type="text"
              name="role"
              value={jobData.role}
              onChange={handleChange}
              required
            />

            <br/><br/>

            <label>Job Description</label>
            <br/>
            <textarea
              name="description"
              value={jobData.description}
              onChange={handleChange}
            />

            <br/><br/>

            <label>Salary</label>
            <br/>
            <input
              type="text"
              name="salary"
              value={jobData.salary}
              onChange={handleChange}
            />

            <br/><br/>

            <label>Application Deadline</label>
            <br/>
            <input
              type="date"
              name="deadline"
              value={jobData.deadline}
              onChange={handleChange}
            />

            <br/><br/>

            <button type="submit">
              Create Job
            </button>

            <button
              type="button"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>

          </form>

        </div>

      )}

      <h2>Your Created Job Roles</h2>

      <table border="1">

        <thead>

          <tr>
            <th>Company</th>
            <th>Job Role</th>
            <th>Candidates Applied</th>
            <th>View Applications</th>
          </tr>

        </thead>

        <tbody>

          {jobs.map((job) => (

            <tr key={job.id}>

              <td>{job.company}</td>

              <td>{job.role}</td>

              <td>{job.applicants}</td>

              <td>

                <button
                  onClick={() => navigate(`/job/${job.id}`)}
                >
                  Click
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

};