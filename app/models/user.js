
import Q from 'q';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';
import update from 'mongoose-patch-update';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
    private: true,
  },
  role: {
    type: String,
    default: 'customer',
    emum: ['admin', 'customer'],
  },
  status: {
    type: String,
    default: 'active',
    enum: ['active', 'disabled'],
  },
  createdAt: {
    type: Date,
    required: false,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    required: false,
    default: Date.now,
  },
});

// Execute before each user.save() call
UserSchema.pre('save', function preSaveUser(callback) {
  const user = this;

  // Break out if the password hasn't changed
  if (!user.isModified('password')) {
    return callback();
  }

  // Password changed so we need to hash it
  return bcrypt.genSalt(5, (err, salt) => {
    if (err) {
      return callback(err);
    }

    return bcrypt.hash(user.password, salt, null, (err2, hash) => {
      if (err2) {
        return callback(err2);
      }
      user.password = hash;
      return callback();
    });
  });
});


UserSchema.methods = {
  async verifyPassword(password) {
    const res = await Q.nbind(bcrypt.compare, bcrypt)(password, this.password);
    return res;
  },
};

UserSchema.statics.create = function createUser(data) {
  return new this(data).save();
};

UserSchema.statics.update = function updateUser(query, data) {
  return this.patchUpdate(query, data);
};

UserSchema.statics.delete = function deleteUser(query) {
  return this.patchUpdate(query, { status: 'disabled' });
};

UserSchema.plugin(update);
UserSchema.plugin(require('mongoose-private-paths'));
UserSchema.plugin(require('mongoose-patch-update'));

module.exports = mongoose.model('user', UserSchema);
