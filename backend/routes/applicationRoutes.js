const express = require("express");

const {
  applyForJob,
  getMyApplications,
} = require("../controllers/applicationController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Apply for a job
router.post("/", authMiddleware, applyForJob);
router.get("/my", authMiddleware, getMyApplications);
module.exports = router;