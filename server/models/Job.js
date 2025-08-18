// models/jobModel.js
const mongoose = require('mongoose');

const jobSchema = mongoose.Schema({
  title: { type: String, required: true },
  location: { type: String, required: true },
  timeType: { type: String, required: true },
  postedDate: { type: Date, default: Date.now },
  // UPDATED: Replaced 'description' with a structured format
  summary: { type: String, required: true },
  responsibilities: { type: [String], required: true },
  requirements: { type: [String], required: true },
});

const Job = mongoose.model('Job', jobSchema);
module.exports = Job;