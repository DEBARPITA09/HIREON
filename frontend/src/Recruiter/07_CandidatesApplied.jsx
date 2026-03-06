import { useParams } from "react-router-dom";
import { useState } from "react";

export const CandidatesApplied = () => {
  const { jobId } = useParams();

  const [candidates, setCandidates] = useState([
    {
      id: 1,
      name: "Rahul Sharma",
      resume: "/resumes/resume2.pdf",
      status: "Pending",
    },
    {
      id: 2,
      name: "Priya Singh",
      resume: "/resumes/resume1.pdf",
      status: "Pending",
    },
  ]);

  const updateStatus = (id, newStatus) => {
    const updated = candidates.map((c) =>
      c.id === id ? { ...c, status: newStatus } : c,
    );
    setCandidates(updated);
  };

  return (
    <div>
      <h1>Candidates Applied: </h1>

      <table border="1">
        <thead>
          <tr>
            <th>Name</th>
            <th>Resume</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {candidates.map((c) => (
            <tr key={c.id}>
              <td>{c.name}</td>

              <td>
                <a href={c.resume} target="_blank">
                  View Resume
                </a>
              </td>

              <td>{c.status}</td>

              <td>
                <button onClick={() => updateStatus(c.id, "Accepted")}>
                  Accept
                </button>

                <button onClick={() => updateStatus(c.id, "Rejected")}>
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
