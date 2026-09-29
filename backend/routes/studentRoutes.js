const express = require("express");

const {
  getStudentProfile,
  updateStudentProfile,
} = require("../controllers/studentController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Get logged-in student's profile
router.get("/profile", authMiddleware, getStudentProfile);

// Update logged-in student's profile
router.put("/profile", authMiddleware, updateStudentProfile);

module.exports = router;