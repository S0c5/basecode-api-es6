
// Load required packages
const mongoose = require('mongoose');

// Define our token schema
const TokenSchema = new mongoose.Schema({
  token: { type: String, required: true },
  userId: { type: String, required: true },
  clientId: { type: String, required: true },
  expires: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Export the Mongoose model
module.exports = mongoose.model('Token', TokenSchema);
