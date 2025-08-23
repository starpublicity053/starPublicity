const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false, // Do not send password in query results by default
  },
  isAdmin: {
    type: Number, // 1 for admin, 0 for not
    default: 0,
  },
  isSuperAdmin: {
    type: Number, // 1 for super admin, 0 for not
    default: 0,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
  resetPasswordOtp: String,
  resetPasswordExpires: Date,
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
