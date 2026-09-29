import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
const StudentDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

const [jobs, setJobs] = useState([]);

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

    return (
        <div className="student-layout">

            {/* Sidebar */}
            <aside className="sidebar">

                <div className="logo">
                    <h2>PlaceMate</h2>
                    <p>College Placement System</p>
                </div>

                <nav>

                    <a className="active">
                        Dashboard
                    </a>
                    <Link to="/jobs" className="sidebar-item">
  Jobs
</Link>

                   <Link to="/profile" className="sidebar-item">
    My Profile
</Link>

                    <a>
                        Job Opportunities
                    </a>

                    <a>
                        My Applications
                    </a>

                    <a>
                        My Resume
                    </a>

                </nav>

                <button
                    className="sidebar-logout"
                    onClick={logout}
                >
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

                    <div className="student-info">

                        <div className="avatar">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>

                        <div>
                            <strong>{user?.name}</strong>
                            <span>Student</span>
                        </div>

                    </div>

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

          <div className="company-logo">
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


                    {/* Application Status */}
                    <div className="application-status">
  <p style={{ color: "#6b7280" }}>
    You haven't applied to any jobs yet.
  </p>

  <button
    className="view-btn"
    onClick={() => navigate("/jobs")}
  >
    Browse Jobs
  </button>
</div>

                </section>

            </main>

        </div>
    );
};

export default StudentDashboard;