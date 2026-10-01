const Application = require("../models/Application");

const applyForJob = async (req, res) => {
  try {
    const { jobId } = req.body;

    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: "Job ID is required",
      });
    }

    const existingApplication = await Application.findOne({
      student: req.user.id,
      job: jobId,
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job",
      });
    }

    const application = await Application.create({
      student: req.user.id,
      job: jobId,
    });

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    console.error("Apply For Job Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to submit application",
    });
  }
};
const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      student: req.user.id,
    })
      .populate("job")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      applications,
    });
  } catch (error) {
    console.error("Get My Applications Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch applications",
    });
  }
};

module.exports = {
  applyForJob,
  getMyApplications,
};;