import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Jobs.css";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "http://localhost:5000/api/jobs",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setJobs(response.data.jobs);
      } catch (error) {
        console.error("Fetch Jobs Error:", error);
        setMessage("Failed to load jobs.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

if (loading) {
  return (
    <div className="loading-message">
      Loading jobs...
    </div>
  );
}

  return (
  <div className="jobs-page">

    <div className="jobs-header">
      <h1>Available Jobs</h1>
      <p>Explore placement opportunities available for you.</p>
    </div>

    {message && (
      <p className="error-message">
        {message}
      </p>
    )}

    {jobs.length === 0 ? (
      <p>No jobs available at the moment.</p>
    ) : (
      <div className="jobs-list">

        {jobs.map((job) => (
          <div className="job-card" key={job._id}>

            <h2>{job.jobTitle}</h2>

            <p className="job-company">
              {job.companyName}
            </p>

            <p className="job-info">
              <strong>📍 Location:</strong> {job.location}
            </p>

            <p className="job-info">
              <strong>💰 Salary:</strong> {job.salary}
            </p>

            <p className="job-info">
              <strong>🎓 Eligibility:</strong> {job.eligibility}
            </p>

            <p className="job-info">
              <strong>📅 Deadline:</strong>{" "}
              {new Date(job.applicationDeadline).toLocaleDateString()}
            </p>

            <div className="job-skills">
              {job.skillsRequired.map((skill, index) => (
                <span className="skill-tag" key={index}>
                  {skill}
                </span>
              ))}
            </div>

            <p className="job-description">
              {job.description}
            </p>

              <button
  className="view-details-btn"
  onClick={() => navigate(`/jobs/${job._id}`)}
>
  View Details
</button>

          </div>
        ))}

      </div>
    )}

  </div>
);
};

export default Jobs;