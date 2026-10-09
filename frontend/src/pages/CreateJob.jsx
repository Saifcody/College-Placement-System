import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CreateJob.css";

const CreateJob = () => {
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
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:5000/api/jobs",
        {
          ...formData,
          skillsRequired: formData.skillsRequired
            .split(",")
            .map((skill) => skill.trim())
            .filter((skill) => skill !== ""),
          status: "Open",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(response.data.message);

      setTimeout(() => {
        navigate("/company");
      }, 1000);
    } catch (error) {
      console.error("Create Job Error:", error);

      setMessage(
        error.response?.data?.message ||
          "Failed to create job."
      );
    }
  };

  return (
    <div className="create-job-page">
      <div className="create-job-container">
        <h1>Create New Job</h1>
        <p>
          Post a new placement opportunity for students.
        </p>

        {message && (
          <div className="job-message">
            {message}
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
              placeholder="e.g. TCS"
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
              placeholder="e.g. Software Developer"
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the job..."
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
                placeholder="e.g. Lucknow"
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
                placeholder="e.g. 6 LPA"
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
              placeholder="e.g. B.Tech CSE with minimum 7 CGPA"
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
              placeholder="Java, React, SQL, JavaScript"
              required
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

          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate("/company")}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="create-job-btn"
            >
              Create Job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateJob;