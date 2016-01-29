// /models/user.js

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var UserSchema = new mongoose.Schema({
  username: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    trim: true,
    required: true,
    unique: false,
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
    unique: true,
  }
}).set('toObject', { retainKeyOrder: true });

module.exports = mongoose.model('User', UserSchema);