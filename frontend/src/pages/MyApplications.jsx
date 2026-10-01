import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./MyApplications.css";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "http://localhost:5000/api/applications/my",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setApplications(response.data.applications);
      } catch (error) {
        console.error("Fetch Applications Error:", error);
        setMessage("Failed to load applications.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) {
    return (
      <div className="applications-page">
        <p>Loading applications...</p>
      </div>
    );
  }

  return (
    <div className="applications-page">
      <div className="applications-header">
        <h1>My Applications</h1>
        <p>Track the jobs you have applied for.</p>
      </div>

      {message && (
        <p className="application-error">
          {message}
        </p>
      )}

      {applications.length === 0 ? (
        <div className="empty-applications">
          <h2>No Applications Yet</h2>
          <p>
            You haven't applied to any jobs yet.
          </p>

          <button
            onClick={() => navigate("/jobs")}
          >
            Browse Jobs
          </button>
        </div>
      ) : (
        <div className="applications-list">
          {applications.map((application) => (
            <div
              className="application-card"
              key={application._id}
            >
              <div className="application-info">
                <h2>
                  {application.job?.jobTitle}
                </h2>

                <p className="application-company">
                  {application.job?.companyName}
                </p>

                <p>
                  📍 {application.job?.location}
                </p>

                <p>
                  💰 {application.job?.salary}
                </p>

                <p>
                  📅 Applied on:{" "}
                  {new Date(
                    application.createdAt
                  ).toLocaleDateString()}
                </p>
              </div>

              <div className="application-status">
                <span
                  className={`status-badge ${application.status.toLowerCase()}`}
                >
                  {application.status}
                </span>

                <button
                  onClick={() =>
                    navigate(
                      `/jobs/${application.job?._id}`
                    )
                  }
                >
                  View Job
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplications;