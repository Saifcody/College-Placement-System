import { useEffect, useState } from "react";
import axios from "axios";

const StudentProfile = () => {
  const [profile, setProfile] = useState({
    phone: "",
    dateOfBirth: "",
    gender: "",
    university: "",
    course: "B.Tech",
    branch: "Computer Science and Engineering",
    graduationYear: "",
    cgpa: "",
    tenthPercentage: "",
    twelfthPercentage: "",
    skills: [],
    preferredLocation: "",
    expectedSalary: "",
    placementStatus: "Looking for opportunities",
  });

  const [skillsInput, setSkillsInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/students/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = response.data.profile;

        setProfile({
          ...data,
          dateOfBirth: data.dateOfBirth
            ? data.dateOfBirth.substring(0, 10)
            : "",
          skills: data.skills || [],
        });

        setSkillsInput((data.skills || []).join(", "));
      } catch (error) {
        console.error("Profile Error:", error);
        setMessage("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setMessage("");

    try {
      const skills = skillsInput
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill !== "");

      const response = await axios.put(
        "http://localhost:5000/api/students/profile",
        {
          ...profile,
          skills,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
 

    setMessage("Profile saved successfully!");

      const data = response.data.profile;

      setProfile({
        ...data,
        dateOfBirth: data.dateOfBirth
          ? data.dateOfBirth.substring(0, 10)
          : "",
      });

      setSkillsInput(skills.join(", "));
      setMessage("Profile updated successfully!");
    } catch (error) {
      console.error("Update Profile Error:", error);
      setMessage("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="profile-loading">Loading profile...</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>My Profile</h1>
        <p>Manage your personal and academic information.</p>
      </div>

      {message && <div className="profile-message">{message}</div>}

      <form onSubmit={handleSubmit}>
        {/* Personal Information */}
        <div className="profile-card">
          <h2>Personal Information</h2>

          <div className="profile-grid">
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="text"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
              />
            </div>

            <div className="form-group">
              <label>Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={profile.dateOfBirth}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Gender</label>
              <select
                name="gender"
                value={profile.gender}
                onChange={handleChange}
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Academic Information */}
        <div className="profile-card">
          <h2>Academic Information</h2>

          <div className="profile-grid">
            <div className="form-group">
              <label>University</label>
              <input
                type="text"
                name="university"
                value={profile.university}
                onChange={handleChange}
                placeholder="Enter university"
              />
            </div>

            <div className="form-group">
              <label>Course</label>
              <input
                type="text"
                name="course"
                value={profile.course}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Branch</label>
              <input
                type="text"
                name="branch"
                value={profile.branch}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Graduation Year</label>
              <input
                type="number"
                name="graduationYear"
                value={profile.graduationYear || ""}
                onChange={handleChange}
                placeholder="2027"
              />
            </div>

            <div className="form-group">
              <label>CGPA</label>
              <input
                type="number"
                step="0.01"
                name="cgpa"
                value={profile.cgpa || ""}
                onChange={handleChange}
                placeholder="7.9"
              />
            </div>

            <div className="form-group">
              <label>10th Percentage</label>
              <input
                type="number"
                step="0.01"
                name="tenthPercentage"
                value={profile.tenthPercentage || ""}
                onChange={handleChange}
                placeholder="85"
              />
            </div>

            <div className="form-group">
              <label>12th Percentage</label>
              <input
                type="number"
                step="0.01"
                name="twelfthPercentage"
                value={profile.twelfthPercentage || ""}
                onChange={handleChange}
                placeholder="80"
              />
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="profile-card">
          <h2>Skills</h2>

          <div className="form-group">
            <label>Skills</label>

            <input
              type="text"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              placeholder="Java, JavaScript, React, MongoDB"
            />
          </div>
        </div>

        {/* Placement Information */}
        <div className="profile-card">
          <h2>Placement Information</h2>

          <div className="profile-grid">
            <div className="form-group">
              <label>Preferred Location</label>

              <input
                type="text"
                name="preferredLocation"
                value={profile.preferredLocation}
                onChange={handleChange}
                placeholder="Lucknow, Delhi, Bangalore..."
              />
            </div>

            <div className="form-group">
              <label>Expected Salary (LPA)</label>

              <input
                type="number"
                step="0.1"
                name="expectedSalary"
                value={profile.expectedSalary || ""}
                onChange={handleChange}
                placeholder="6"
              />
            </div>

            <div className="form-group">
              <label>Placement Status</label>

              <select
                name="placementStatus"
                value={profile.placementStatus}
                onChange={handleChange}
              >
                <option value="Looking for opportunities">
                  Looking for opportunities
                </option>

                <option value="Placed">Placed</option>

                <option value="Not looking">Not looking</option>
              </select>
            </div>
          </div>
        </div>
        {message && (
  <p style={{ color: "green", marginBottom: "15px" }}>
    {message}
  </p>
)}

        <div className="profile-actions">
          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentProfile;