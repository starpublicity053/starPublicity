const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Not hashed for hardcoded users
  role: { type: String, enum: ['admin', 'superAdmin'], required: true }

  
});

// Check if the 'User' model has already been defined.
// If it has, use the existing model; otherwise, compile and use the new one.
module.exports = mongoose.models.User || mongoose.model('User', userSchema);