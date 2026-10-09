
const express = require("express");

const {
  getStudentProfile,
  updateStudentProfile,
  uploadResume,
  viewResume,
} = require("../controllers/studentController");

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// Get logged-in student's profile
router.get("/profile", authMiddleware, getStudentProfile);

// Update logged-in student's profile
router.put("/profile", authMiddleware, updateStudentProfile);

// Upload logged-in student's resume
router.post(
  "/resume",
  authMiddleware,
  upload.single("resume"),
  uploadResume
);
// View logged-in student's own resume
router.get(
  "/resume",
  authMiddleware,
  viewResume
);

module.exports = router;
