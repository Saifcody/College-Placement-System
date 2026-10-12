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
    const {
      companyName,
      jobTitle,
      description,
      location,
      salary,
      eligibility,
      skillsRequired,
      applicationDeadline,
      status,
    } = req.body;

    const job = await Job.create({
      companyName,
      jobTitle,
      description,
      location,
      salary,
      eligibility,
      skillsRequired,
      applicationDeadline,
      status,
      createdBy: req.user.id,
    });

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
const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({
      createdBy: req.user.id,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      jobs,
    });
  } catch (error) {
    console.error("Get My Jobs Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch your jobs",
    });
  }
};
const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Only the company that created the job can update it
    if (!job.createdBy || job.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own jobs",
      });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Job updated successfully",
      job: updatedJob,
    });
  } catch (error) {
    console.error("Update Job Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update job",
    });
  }
};
module.exports = {
  getJobs,
  getJobById,
  createJob,
  getMyJobs,
  updateJob,
};
