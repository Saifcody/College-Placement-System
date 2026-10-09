
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./CompanyApplications.css";

const CompanyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

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

      setApplications(response.data.applications || []);
    } catch (error) {
      console.error("Fetch Applications Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const filteredApplications = applications.filter((application) => {
    const search = searchTerm.trim().toLowerCase();

    const searchableFields = [
      application.student?.name,
      application.student?.email,
      application.job?.jobTitle,
      application.job?.companyName,
    ];

    const matchesSearch = searchableFields.some((value) =>
      value?.toLowerCase().includes(search)
    );

    const matchesStatus =
      statusFilter === "All" || application.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const updateStatus = async (applicationId, status) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/admin/applications/${applicationId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchApplications();
    } catch (error) {
      console.error("Update Status Error:", error);
      alert("Failed to update application status.");
    }
  };

  const viewApplicantResume = async (applicationId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `http://localhost:5000/api/admin/applications/${applicationId}/resume`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );

      const pdfBlob = new Blob([response.data], {
        type: "application/pdf",
      });

      const url = window.URL.createObjectURL(pdfBlob);
      const newWindow = window.open(url, "_blank");

      if (!newWindow) {
        window.URL.revokeObjectURL(url);
        alert("Please allow pop-ups to view the resume.");
        return;
      }

      setTimeout(() => window.URL.revokeObjectURL(url), 60000);
    } catch (error) {
      console.error("View Applicant Resume Error:", error);

      if (error.response?.status === 404) {
        alert("Resume or application not found.");
      } else if (error.response?.status === 403) {
        alert("You are not authorized to view this resume.");
      } else {
        alert("Failed to open the student's resume.");
      }
    }
  };

  if (loading) {
    return (
      <div className="company-applications-page">
        Loading applications...
      </div>
    );
  }

  return (
    <div className="company-applications-page">
      <div className="company-applications-header">
        <div>
          <h1>Applications</h1>
          <p>Manage students who applied to your jobs.</p>
        </div>

        <Link to="/company" className="back-dashboard-btn">
          Back to Dashboard
        </Link>
      </div>



<div className="applications-toolbar">
  <input
    type="text"
    placeholder="Search by student, email, or job title..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="applications-search"
  />

  <div className="applications-filter-wrapper">
    <span className="filter-icon">☷</span>

    <select
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
      className="applications-filter"
      aria-label="Filter applications by status"
    >
      <option value="All">All Statuses</option>
      <option value="Applied">Applied</option>
      <option value="Shortlisted">Shortlisted</option>
      <option value="Interview">Interview Scheduled</option>
      <option value="Selected">Selected</option>
      <option value="Rejected">Rejected</option>
    </select>
  </div>
</div>

      <p className="applications-count">
        Showing {filteredApplications.length} of {applications.length} applications
      </p>

      {applications.length === 0 ? (
        <div className="empty-applications">
          <h2>No applications yet</h2>
          <p>Students who apply to your jobs will appear here.</p>
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="empty-applications">
          <h2>No matching applications</h2>
          <p>Try changing your search or status filter.</p>
        </div>
      ) : (
        <div className="applications-list">
          {filteredApplications.map((application) => (
            <div
              className="company-application-card"
              key={application._id}
            >
              <div className="student-info">
                <div className="student-avatar">
                  {application.student?.name?.charAt(0).toUpperCase()}
                </div>

                <div>
                  <h2>{application.student?.name}</h2>
                  <p>{application.student?.email}</p>
                </div>
              </div>

              <div className="application-job">
                
<span
  className={`application-status-badge status-badge-${application.status
    ?.toLowerCase()
    .replace(/\s+/g, "-")}`}
>
  {application.status === "Interview"
    ? "Interview Scheduled"
    : application.status}
</span>

                <h3>{application.job?.jobTitle}</h3>
                <p>{application.job?.companyName}</p>
                <span>📍 {application.job?.location}</span>
              </div>

              <div className="applicant-resume-action">
                <button
                  type="button"
                  className="view-resume-btn"
                  onClick={() => viewApplicantResume(application._id)}
                >
                  View Resume
                </button>
              </div>

              
<div className="application-status">
  <label htmlFor={`status-${application._id}`}>
    Application Status
  </label>

  <select
    id={`status-${application._id}`}
    className={`status-select status-${application.status
      ?.toLowerCase()
      .replace(/\s+/g, "-")}`}
    value={application.status}
    onChange={(e) =>
      updateStatus(application._id, e.target.value)
    }
  >
    <option value="Applied">Applied</option>
    <option value="Shortlisted">Shortlisted</option>
    <option value="Interview">Interview Scheduled</option>
    <option value="Selected">Selected</option>
    <option value="Rejected">Rejected</option>
  </select>
</div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompanyApplications;
