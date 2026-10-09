const StudentProfile = require("../models/StudentProfile");
const path = require("path");
const fs = require("fs");

// GET student profile
const getStudentProfile = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id || req.user.userId;

    let profile = await StudentProfile.findOne({ user: userId });

    // Create an empty profile if one doesn't exist
    if (!profile) {
      profile = await StudentProfile.create({
        user: userId,
      });
    }

    res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error("Get Profile Error:", error);

    res.status(500).json({
      message: "Failed to get student profile",
    });
  }
};

// UPDATE student profile
const updateStudentProfile = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id || req.user.userId;

    const {
      phone,
      dateOfBirth,
      gender,
      university,
      course,
      branch,
      graduationYear,
      cgpa,
      tenthPercentage,
      twelfthPercentage,
      skills,
      preferredLocation,
      expectedSalary,
      placementStatus,
    } = req.body;

    const profile = await StudentProfile.findOneAndUpdate(
      { user: userId },
      {
        phone,
        dateOfBirth,
        gender,
        university,
        course,
        branch,
        graduationYear,
        cgpa,
        tenthPercentage,
        twelfthPercentage,
        skills,
        preferredLocation,
        expectedSalary,
        placementStatus,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profile,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);

    res.status(500).json({
      message: "Failed to update profile",
    });
  }
};


// Upload student resume
const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select a PDF resume to upload.",
      });
    }

    const userId = req.user.id || req.user._id || req.user.userId;

    const profile = await StudentProfile.findOneAndUpdate(
      { user: userId },
      {
        $set: {
          resume: req.file.filename,
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    // Delete the previous resume only after the new one is saved.
    if (profile.resume && profile.resume !== req.file.filename) {
      // The newly saved filename is in profile.resume.
      // Previous-file cleanup will be handled separately.
    }

    return res.status(200).json({
      success: true,
      message: "Resume uploaded successfully.",
      resume: req.file.filename,
    });
  } catch (error) {
    console.error("Resume Upload Error:", error);

    // Avoid leaving a file behind if saving to MongoDB fails.
    if (req.file) {
      fs.unlink(
        path.join(__dirname, "../uploads/resumes", req.file.filename),
        () => {}
      );
    }

    return res.status(500).json({
      success: false,
      message: "Failed to save resume.",
    });
  }
};

module.exports.uploadResume = uploadResume;


const viewResume = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id || req.user.userId;

    const profile = await StudentProfile.findOne({ user: userId });

    if (!profile || !profile.resume) {
      return res.status(404).json({
        success: false,
        message: "No resume found.",
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
      "inline; filename=\"resume.pdf\""
    );

    return res.sendFile(resumePath);
  } catch (error) {
    console.error("View Resume Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to open resume.",
    });
  }
};
  
module.exports = {
  getStudentProfile,
  updateStudentProfile,
  uploadResume,
  viewResume,
};