
// Load required packages
const mongoose = require('mongoose');

// Define our token schema
const TokenSchema = new mongoose.Schema({
  token: {
    type: String, required: true,
  },
  userId: {
    type: String, required: true,
  },
  clientId: {
    type: String, required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


module.exports = mongoose.model('refreshToken', TokenSchema);
