const mongoose = require('mongoose');

const AvailableTextbookSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Add userID field
});

module.exports = mongoose.model('AvailableTextbook', AvailableTextbookSchema);