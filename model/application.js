const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema(
  {
    candidateId: {
      type: String,
      required: true,
    },
    jobId: {
      type: String,
      required: true,
    }
  },
  { collection: "applications" }
);

const model = mongoose.model("ApplicationSchema", ApplicationSchema);

module.exports = model;
