const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  jobId: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model(
  'Application',
  applicationSchema
);