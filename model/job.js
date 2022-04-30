const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    companyname: {
      type: String,
      required: true,
    },
    companyURL: {
      type: String,
    },
    salary: {
      type: String,
    },
    location: {
      type: String,
    },
    jobDetails: {
      type: String,
      required: true,
    },
  },
  { collection: "jobs" }
);

const model = mongoose.model("JobSchema", JobSchema);

module.exports = model;
