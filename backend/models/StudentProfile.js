const mongoose = require("mongoose");

const studentProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    phone: {
      type: String,
      default: "",
    },

    dateOfBirth: {
      type: Date,
      default: null,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other", ""],
      default: "",
    },

    university: {
      type: String,
      default: "",
    },

    course: {
      type: String,
      default: "B.Tech",
    },

    branch: {
      type: String,
      default: "Computer Science and Engineering",
    },

    graduationYear: {
      type: Number,
      default: null,
    },

    cgpa: {
      type: Number,
      default: null,
    },

    tenthPercentage: {
      type: Number,
      default: null,
    },

    twelfthPercentage: {
      type: Number,
      default: null,
    },

    skills: {
      type: [String],
      default: [],
    },

    resume: {
      type: String,
      default: "",
    },

    preferredLocation: {
      type: String,
      default: "",
    },

    expectedSalary: {
      type: Number,
      default: null,
    },

    placementStatus: {
      type: String,
      enum: ["Looking for opportunities", "Placed", "Not looking"],
      default: "Looking for opportunities",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("StudentProfile", studentProfileSchema);