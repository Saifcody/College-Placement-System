const express = require("express");

const {
  getAllApplications,
  updateApplicationStatus,
   viewApplicantResume,
} = require("../controllers/adminController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// Get all student applications
router.get(
  "/applications",
  authMiddleware,
  roleMiddleware("admin", "company"),
  getAllApplications
);
router.put(
  "/applications/:id/status",
  authMiddleware,
  roleMiddleware("admin", "company"),
  updateApplicationStatus
);
// View resume of an applicant for the recruiter's own job
router.get(
  "/applications/:id/resume",
  authMiddleware,
  roleMiddleware("admin", "company"),
  viewApplicantResume
);

module.exports = router;