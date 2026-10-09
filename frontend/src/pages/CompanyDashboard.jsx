import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./CompanyDashboard.css";

const CompanyDashboard = () => {
  const { user, logout } = useAuth();
const [applications, setApplications] = useState([]);
useEffect(() => {
  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/admin/applications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setApplications(response.data.applications);
    } catch (error) {
      console.error("Fetch Applications Error:", error);
    }
  };

  fetchApplications();
}, []);
const totalApplications = applications.length;

const shortlistedApplications = applications.filter(
  (application) => application.status === "Shortlisted"
).length;

const interviewApplications = applications.filter(
  (application) => application.status === "Interview"
).length;
  return (
    <div className="company-dashboard">
      <aside className="company-sidebar">
        <div className="company-logo">
          Placement Portal
        </div>

       <nav>
  <Link to="/company" className="company-nav active">
    Dashboard
  </Link>

  <Link
    to="/company/my-jobs"
    className="company-nav"
  >
    My Jobs
  </Link>

  <Link
    to="/company/create-job"
    className="company-nav"
  >
    Create Job
  </Link>

  <Link
    to="/company/applications"
    className="company-nav"
  >
    Applications
  </Link>
</nav>

        <button
          className="company-logout"
          onClick={logout}
        >
          Logout
        </button>
      </aside>

      <main className="company-main">
        <div className="company-header">
          <div>
            <h1>Company Dashboard</h1>
            <p>
              Welcome back, {user?.name}
            </p>
          </div>
        </div>

        <div className="company-stats">
          <div className="company-stat-card">
            <h3>Applications</h3>
            <h2>{totalApplications}</h2>
            <p>Total applications received</p>
          </div>

          <div className="company-stat-card">
            <h3>Shortlisted</h3>
            <h2>{shortlistedApplications}</h2>
            <p>Students shortlisted</p>
          </div>

          <div className="company-stat-card">
            <h3>Interviews</h3>
            <h2>{interviewApplications}</h2>
            <p>Interviews scheduled</p>
          </div>
        </div>

        <div className="company-welcome-card">
          <h2>Manage Applications</h2>

          <p>
            View students who have applied to your jobs
            and update their application status.
          </p>

          <Link
            to="/company/applications"
            className="company-action-btn"
          >
            View Applications
          </Link>
        </div>
      </main>
    </div>
  );
};

export default CompanyDashboard;