const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
  name: String,
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  topic: { type: String, required: true }
});

module.exports = mongoose.model('Chat', ChatSchema);