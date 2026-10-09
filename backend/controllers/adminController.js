const Application = require("../models/Application");

const getAllApplications = async (req, res) => {
 
  try {
    console.log("Recruiter ID:", req.user.id);
  const applications = await Application.find()
  .populate({
    path: "job",
    match: { createdBy: req.user.id },
    select: "companyName jobTitle location salary createdBy",
  })
  .populate("student", "name email")
  .sort({ createdAt: -1 });
  const companyApplications = applications.filter(
  (application) => application.job !== null
);

    res.status(200).json({
      success: true,
      applications: companyApplications,
    });
  } catch (error) {
    console.error("Get All Applications Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch applications",
    });
  }
};
const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Applied",
      "Shortlisted",
      "Interview",
      "Selected",
      "Rejected",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application status",
      });
    }

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      {
        returnDocument: "after",
      }
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Application status updated successfully",
      application,
    });
  } catch (error) {
    console.error("Update Application Status Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update application status",
    });
  }
};

module.exports = {
  getAllApplications,
  updateApplicationStatus,
};