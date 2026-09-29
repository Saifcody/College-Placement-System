const express = require("express");

const {
  getJobs,
  getJobById,
  createJob,
} = require("../controllers/jobController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// Get all open jobs
router.get("/", authMiddleware, getJobs);
router.post("/", authMiddleware, createJob);
// Get one job
router.get("/:id", authMiddleware, getJobById);

module.exports = router;