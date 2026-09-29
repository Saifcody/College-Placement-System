const Job = require("../models/Job");

// Get all open jobs
const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ status: "Open" }).sort({
      applicationDeadline: 1,
    });

    res.status(200).json({
      success: true,
      jobs,
    });
  } catch (error) {
    console.error("Get Jobs Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch jobs",
    });
  }
};

// Get a single job
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    console.error("Get Job Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch job",
    });
  }
};
const createJob = async (req, res) => {
  try {
    const job = await Job.create(req.body);

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      job,
    });
  } catch (error) {
    console.error("Create Job Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create job",
    });
  }
};
module.exports = {
  getJobs,
  getJobById,
  createJob,
};
