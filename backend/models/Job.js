const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    createdBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: false,
},

    jobTitle: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    salary: {
      type: String,
      required: true,
    },

    eligibility: {
      type: String,
      required: true,
    },

    skillsRequired: {
      type: [String],
      default: [],
    },

    applicationDeadline: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["Open", "Closed"],
      default: "Open",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Job", jobSchema);