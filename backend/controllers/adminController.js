const Application = require("../models/Application");

const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("student", "name email")
      .populate("job", "companyName jobTitle location salary")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      applications,
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