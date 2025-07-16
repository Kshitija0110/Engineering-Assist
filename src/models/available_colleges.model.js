const mongoose = require('mongoose');

const AvailableCollegeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('AvailableCollege', AvailableCollegeSchema);