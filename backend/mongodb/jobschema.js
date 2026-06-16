const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  email:{
    type:String,
    required:true
  },

  company: {
    type: String,
    required: true,
  },

  location: {
    type: String,
    required: true,
  },

  type: {
    type: String,
    enum: ["Remote", "Hybrid", "Onsite"],
    required: true,
  },

  disability: {
    type: String,
    enum: ["Visual", "Hearing", "Mobility", "Multiple"],
    required: true,
  },

  description: {
    type: String,
  },

  salary: {
    type: String,
  },

  lastDate: {
    type: Date,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Automatically delete document when lastDate is reached
JobSchema.index(
  { lastDate: 1 },
  { expireAfterSeconds: 0 }
);

module.exports = mongoose.model("Job", JobSchema);