const StudentProfile = require("../models/StudentProfile");

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

module.exports = {
  getStudentProfile,
  updateStudentProfile,
};