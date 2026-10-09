const express = require("express");

const {
  getJobs,
  getJobById,
  createJob,
   getMyJobs,
    updateJob,
} = require("../controllers/jobController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();



// Get all open jobs
router.get("/", authMiddleware, getJobs);
router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin", "company"),
  createJob
);
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "company"),
  updateJob
);
// Get one job
router.get(
  "/my-jobs",
  authMiddleware,
  roleMiddleware("admin", "company"),
  getMyJobs
);
router.get("/:id", authMiddleware, getJobById);

module.exports = router;