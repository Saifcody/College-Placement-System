import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./EditJob.css";

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    companyName: "",
    jobTitle: "",
    description: "",
    location: "",
    salary: "",
    eligibility: "",
    skillsRequired: "",
    applicationDeadline: "",
    status: "Open",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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

        const job = response.data.job;

        setFormData({
          companyName: job.companyName || "",
          jobTitle: job.jobTitle || "",
          description: job.description || "",
          location: job.location || "",
          salary: job.salary || "",
          eligibility: job.eligibility || "",
          skillsRequired: job.skillsRequired?.join(", ") || "",
          applicationDeadline: job.applicationDeadline
            ? new Date(job.applicationDeadline)
                .toISOString()
                .split("T")[0]
            : "",
          status: job.status || "Open",
        });
      } catch (error) {
        console.error("Fetch Job Error:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load job."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const token = localStorage.getItem("token");

      const updatedJob = {
        companyName: formData.companyName,
        jobTitle: formData.jobTitle,
        description: formData.description,
        location: formData.location,
        salary: formData.salary,
        eligibility: formData.eligibility,
        skillsRequired: formData.skillsRequired
          .split(",")
          .map((skill) => skill.trim())
          .filter((skill) => skill !== ""),
        applicationDeadline: formData.applicationDeadline,
        status: formData.status,
      };

      await axios.put(
        `http://localhost:5000/api/jobs/${id}`,
        updatedJob,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Job updated successfully!");

      setTimeout(() => {
        navigate("/company/my-jobs");
      }, 1000);
    } catch (error) {
      console.error("Update Job Error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to update job."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="edit-job-page">
        <p>Loading job...</p>
      </div>
    );
  }

  return (
    <div className="edit-job-page">
      <div className="edit-job-container">
        <button
          className="back-btn"
          onClick={() => navigate("/company/my-jobs")}
        >
          ← Back to My Jobs
        </button>

        <h1>Edit Job</h1>
        <p>Update the details of your job posting.</p>

        {message && (
          <div className="success-message">
            {message}
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Company Name</label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Job Title</label>
            <input
              type="text"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Salary</label>
              <input
                type="text"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Eligibility</label>
            <input
              type="text"
              name="eligibility"
              value={formData.eligibility}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Required Skills</label>
            <input
              type="text"
              name="skillsRequired"
              value={formData.skillsRequired}
              onChange={handleChange}
              placeholder="Java, React, Node.js"
            />
            <small>
              Separate skills using commas.
            </small>
          </div>

          <div className="form-group">
            <label>Application Deadline</label>
            <input
              type="date"
              name="applicationDeadline"
              value={formData.applicationDeadline}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Status</label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() =>
                navigate("/company/my-jobs")
              }
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-job-btn"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditJob;