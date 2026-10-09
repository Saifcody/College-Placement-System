const Application = require("../models/Application");
const StudentProfile = require("../models/StudentProfile");
const path = require("path");
const fs = require("fs");

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

    // Find the application and its associated job
    const application = await Application.findById(req.params.id)
      .populate({
        path: "job",
        select: "createdBy",
      });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // Check that the job exists
    if (!application.job) {
      return res.status(404).json({
        success: false,
        message: "Associated job not found",
      });
    }

    // Allow admins, but restrict company users to their own jobs
    if (
      req.user.role !== "admin" &&
      application.job.createdBy?.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "You cannot update applications for another company's job",
      });
    }

    // Update the status only after authorization
    application.status = status;
    await application.save();

    return res.status(200).json({
      success: true,
      message: "Application status updated successfully",
      application,
    });
  } catch (error) {
    console.error("Update Application Status Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update application status",
    });
  }
};


const viewApplicantResume = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate({
        path: "job",
        select: "createdBy",
      });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    if (
      !application.job ||
      application.job.createdBy?.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "You cannot access this applicant's resume.",
      });
    }

    const profile = await StudentProfile.findOne({
      user: application.student,
    });

    if (!profile || !profile.resume) {
      return res.status(404).json({
        success: false,
        message: "This student has not uploaded a resume.",
      });
    }

    const resumePath = path.resolve(
      __dirname,
      "../uploads/resumes",
      path.basename(profile.resume)
    );

    if (!fs.existsSync(resumePath)) {
      return res.status(404).json({
        success: false,
        message: "Resume file not found.",
      });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'inline; filename="applicant-resume.pdf"'
    );

    return res.sendFile(resumePath);
  } catch (error) {
    console.error("View Applicant Resume Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve applicant resume.",
    });
  }
};

module.exports = {
  getAllApplications,
  updateApplicationStatus,
  viewApplicantResume,
};