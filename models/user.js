"use strict";
const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");
/**
 * Defines user schema
 * {username, password, email, firstname, lastname}
 * @param {Object}
 **/
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
    unique: true,
    match: /[a-z-0-9]+/,
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
  },
  firstname: {
    type: String,
    lowercase: true,
    trim: true,
    required: false,
    unique: false,
    match: /[a-z]/,
  },
  lastname: {
    type: String,
    lowercase: true,
    trim: true,
    required: false,
    unique: false,
    match: /[a-z]/,
  },
}).set("toObject", {
  retainKeyOrder: true,
});
/**
 * Encrypt password before each save.
 * @param {String}
 * @param {Function}
 * @param {Function}
 **/
UserSchema.pre("save", function(callback) {
  const user = this;

  // Break out if the password hasn't changed
  if (!user.isModified("password")) return callback();

  // Password changed so we need to hash it
  bcrypt.genSalt(5, (err, salt) => {
    if (err) return callback(err);
    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) return callback(err);
      user.password = hash;
      return callback();
    });
  });
});
/**
 * Verify the password.
 * Password is compared without losing encryption.
 * @param {Function}
 * @param {Function}
 **/
UserSchema.methods.verifyPassword = function(password, cb) {
  bcrypt.compare(password, this.password, (err, isMatch) => {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};
module.exports = mongoose.model("User", UserSchema);
