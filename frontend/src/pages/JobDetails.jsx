import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Jobs.css";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
const [hasApplied, setHasApplied] = useState(false);


  useEffect(() => {
    const fetchJob = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `http://localhost:5000/api/jobs/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setJob(response.data.job);
        const applicationResponse = await axios.get(
  "http://localhost:5000/api/applications/my",
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

const alreadyApplied = applicationResponse.data.applications.some(
  (application) => application.job?._id === id
);

setHasApplied(alreadyApplied);
      } catch (error) {
        console.error("Fetch Job Error:", error);
        setMessage("Failed to load job details.");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);
  const handleApply = async () => {
  try {
    const token = localStorage.getItem("token");

    await axios.post(
      "http://localhost:5000/api/applications",
      {
        jobId: id,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("Application submitted successfully!");
  } catch (error) {
    console.error("Apply Error:", error);

    const message =
      error.response?.data?.message ||
      "Failed to submit application.";

    alert(message);
  }
};

  if (loading) {
    return <div className="loading-message">Loading job details...</div>;
  }

  if (!job) {
    return (
      <div className="jobs-page">
        <p className="error-message">{message}</p>

        <button
          className="view-details-btn"
          onClick={() => navigate("/jobs")}
        >
          Back to Jobs
        </button>
      </div>
    );
  }

  return (
    <div className="jobs-page">

      <button
        className="view-details-btn"
        onClick={() => navigate("/jobs")}
        style={{ width: "auto", marginBottom: "20px" }}
      >
        ← Back to Jobs
      </button>

      <div className="job-card">

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
          <strong>📅 Application Deadline:</strong>{" "}
          {new Date(job.applicationDeadline).toLocaleDateString()}
        </p>

        <h3>Description</h3>

        <p className="job-description">
          {job.description}
        </p>

        <h3>Required Skills</h3>

        <div className="job-skills">
          {job.skillsRequired.map((skill, index) => (
            <span className="skill-tag" key={index}>
              {skill}
            </span>
          ))}
        </div>

<button
  className="view-details-btn"
  onClick={handleApply}
  disabled={hasApplied}
>
  {hasApplied ? "Already Applied ✓" : "Apply Now"}
</button>

      </div>

    </div>
  );
};

export default JobDetails;