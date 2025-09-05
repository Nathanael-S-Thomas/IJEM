const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true }  // Display name for dashboard
});

module.exports = mongoose.model('User', UserSchema);
