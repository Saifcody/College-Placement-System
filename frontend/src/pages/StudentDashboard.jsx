import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
const StudentDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

const [jobs, setJobs] = useState([]);
const [applications, setApplications] = useState([]);

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
      console.error("Dashboard Jobs Error:", error);
    }
  };

  fetchJobs();
}, []);

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

      setApplications(response.data.applications || []);
    } catch (error) {
      console.error("Dashboard Applications Error:", error);
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

const handleViewResume = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      "http://localhost:5000/api/students/resume",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      }
    );

    const url = window.URL.createObjectURL(response.data);
    const newWindow = window.open(url, "_blank");

    if (!newWindow) {
      window.URL.revokeObjectURL(url);
      alert("Please allow pop-ups to view your resume.");
      return;
    }

    newWindow.opener = null;
    window.setTimeout(() => window.URL.revokeObjectURL(url), 60000);
  } catch (error) {
    console.error("View Resume Error:", error);

    if (error.response?.status === 404) {
      alert("No resume uploaded yet. Please upload it from My Profile.");
    } else {
      alert("Unable to open resume. Please check your uploaded resume.");
    }
  }
};



    return (
        <div className="student-layout">

       <aside className="sidebar">
  <div className="logo">
    <h2>PlaceMate</h2>
    <p>College Placement System</p>
  </div>

  <nav>
    <Link to="/student-dashboard" className="sidebar-item active">
      Dashboard
    </Link>

    <Link to="/jobs" className="sidebar-item">
      Jobs
    </Link>

    <Link to="/applications" className="sidebar-item">
      My Applications
    </Link>

    <Link to="/profile" className="sidebar-item">
      My Profile
    </Link>

    <button
      type="button"
      className="sidebar-item"
      onClick={handleViewResume}
    >
      My Resume
    </button>
  </nav>

  <button className="sidebar-logout" onClick={logout}>
    Logout
  </button>
</aside>


            {/* Main Content */}
            <main className="dashboard-main">

                {/* Top Bar */}
                <header className="dashboard-header">

                    <div>
                        <h1>Dashboard</h1>
                        <p>
                            Welcome back to your placement portal.
                        </p>
                    </div>

             
<Link to="/profile" className="student-info student-profile-link">
  <div className="avatar">
    {user?.name?.charAt(0).toUpperCase()}
  </div>

  <div>
    <strong>{user?.name}</strong>
    <span>Student</span>
  </div>
</Link>


                  

                </header>


                {/* Welcome Section */}
                <section className="welcome-card">

                    <div>
                        <h2>
                            Welcome back, {user?.name} 👋
                        </h2>

                        <p>
                            Explore new opportunities and manage
                            your placement applications.
                        </p>
                    </div>

                    <div className="welcome-icon">
                        🎓
                    </div>

                </section>


                {/* Statistics */}
                <section className="stats-grid">

                    <div className="stat-card">

                        <div className="stat-icon">
                            💼
                        </div>

                        <div>
                            <p>Available Jobs</p>
                            <h2>{jobs.length}</h2>
                        </div>

                    </div>


                    <div className="stat-card">

                        <div className="stat-icon">
                            📄
                        </div>

                        <div>
                            <p>Applications</p>
                            <h2>8</h2>
                        </div>

                    </div>


                    <div className="stat-card">

                        <div className="stat-icon">
                            ⭐
                        </div>

                        <div>
                            <p>Shortlisted</p>
                            <h2>2</h2>
                        </div>

                    </div>


                    <div className="stat-card">

                        <div className="stat-icon">
                            🎯
                        </div>

                        <div>
                            <p>Interviews</p>
                            <h2>1</h2>
                        </div>

                    </div>

                </section>


                {/* Main Dashboard Grid */}
                <section className="dashboard-grid">


                    {/* Recent Jobs */}
                    {/* Recent Jobs */}
<div className="dashboard-card">

  <div className="card-header">
    <div>
      <h2>Recent Job Opportunities</h2>
      <p>
        Latest placement opportunities
      </p>
    </div>

    <button
      className="view-btn"
      onClick={() => navigate("/jobs")}
    >
      View All
    </button>
  </div>

  <div className="job-list">

    {jobs.length === 0 ? (
      <p>No jobs available at the moment.</p>
    ) : (
      jobs.slice(0, 3).map((job) => (
        <div className="job-item" key={job._id}>

          <div className="job-company-logo">
            {job.companyName?.charAt(0).toUpperCase()}
          </div>

          <div className="job-details">

            <h3>
              {job.jobTitle}
            </h3>

            <p>
              {job.companyName}
            </p>

            <span>
              📍 {job.location}
            </span>

          </div>

          <div className="job-package">

            <strong>
              {job.salary}
            </strong>

            <button
              onClick={() => navigate(`/jobs/${job._id}`)}
            >
              View
            </button>

          </div>

        </div>
      ))
    )}

  </div>

</div>


 
{/* Recent Application Status */}
<div className="application-status dashboard-card">
  <div className="card-header">
    <div>
      <h2>My Application Status</h2>
      <p>Track your latest applications</p>
    </div>

    <button
      className="view-btn"
      onClick={() => navigate("/applications")}
    >
      View All
    </button>
  </div>

  {applications.length === 0 ? (
    <div className="application-empty-state">
      <p>You haven't applied to any jobs yet.</p>
      <button
        className="view-btn"
        onClick={() => navigate("/jobs")}
      >
        Browse Jobs
      </button>
    </div>
  ) : (
    <div className="recent-application-list">
      {[...applications]
        .slice(0, 5)
        .map((application) => (
          <div
            className="recent-application-item"
            key={application._id}
          >
            <div className="recent-application-details">
              <h3>
                {application.job?.jobTitle || "Job Application"}
              </h3>
              <p>
                {application.job?.companyName || "Company"}
              </p>
            </div>

            <span
              className={`application-status-badge status-badge-${application.status
                ?.toLowerCase()
                .replace(/\s+/g, "-")}`}
            >
              {application.status === "Interview"
                ? "Interview Scheduled"
                : application.status || "Applied"}
            </span>
          </div>
        ))}
    </div>
  )}
</div>


                </section>

            </main>

        </div>
    );
};

export default StudentDashboard;