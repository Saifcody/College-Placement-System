import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./MyJobs.css";

const MyJobs = () => {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchMyJobs = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "http://localhost:5000/api/jobs/my-jobs",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setJobs(response.data.jobs);
      } catch (error) {
        console.error("Fetch My Jobs Error:", error);

        setMessage(
          error.response?.data?.message ||
            "Failed to load your jobs."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMyJobs();
  }, []);

  if (loading) {
    return (
      <div className="my-jobs-page">
        <p>Loading your jobs...</p>
      </div>
    );
  }

  return (
    <div className="my-jobs-page">
      <div className="my-jobs-header">
        <div>
          <h1>My Jobs</h1>
          <p>Manage jobs posted by your company.</p>
        </div>

        <button
          className="create-job-btn"
          onClick={() => navigate("/company/create-job")}
        >
          + Create Job
        </button>
      </div>

      {message && (
        <p className="my-jobs-error">
          {message}
        </p>
      )}

      {jobs.length === 0 ? (
        <div className="empty-jobs">
          <h2>No jobs posted yet</h2>
          <p>
            Create your first job opportunity for students.
          </p>

          <button
            onClick={() => navigate("/company/create-job")}
          >
            Create Job
          </button>
        </div>
      ) : (
        <div className="my-jobs-list">
          {jobs.map((job) => (
            <div className="my-job-card" key={job._id}>
              <div className="my-job-content">
                <h2>{job.jobTitle}</h2>

                <p className="my-job-company">
                  {job.companyName}
                </p>

                <div className="my-job-info">
                  <span>📍 {job.location}</span>
                  <span>💰 {job.salary}</span>
                  <span>
                    📅{" "}
                    {new Date(
                      job.applicationDeadline
                    ).toLocaleDateString()}
                  </span>
                </div>

                <div className="my-job-status">
                  <span
                    className={
                      job.status === "Open"
                        ? "status-open"
                        : "status-closed"
                    }
                  >
                    {job.status}
                  </span>
                </div>
              </div>

              
              <div className="my-job-actions">
  <button
    className="view-job-btn"
    onClick={() =>
      navigate(`/jobs/${job._id}`)
    }
  >
    View Job
  </button>

  <button
    className="edit-job-btn"
    onClick={() =>
      navigate(`/company/edit-job/${job._id}`)
    }
  >
    Edit
  </button>
</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyJobs;