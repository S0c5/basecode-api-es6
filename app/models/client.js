
// Load required packages
import mongoose from 'mongoose';
import crypto from 'crypto';
// Define our client schema
const ClientSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  id: { type: String, required: true },
  secret: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

ClientSchema.methods = {
  generateToken() {
    return this.secret = crypto.createHmac('sha1', this.id).update(this.randomize()).digest('hex');
  },
  randomize() {
    return crypto.randomBytes(32).toString('base64');
  },
  generateId() {
    return this.id = this.randomize();
  },
};

ClientSchema.pre('validate', function (next) {
  this.generateId();
  this.generateToken();
  next();
});


module.exports = mongoose.model('Client', ClientSchema);
