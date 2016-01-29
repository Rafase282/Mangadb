// ./models/manga.js
// Load required packages
var mongoose = require('mongoose');

// Define our user schema
var MangaSchema = new mongoose.Schema({
  title: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
    unique: true,
    match: /[a-z]/
  },
  author: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
    unique: false,
    match: /[a-z]/
  },
  url: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
    unique: true,
    match: /[a-z]/
  },
  userStatus: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
    unique: false,
    match: /[a-z]/
  },
  type: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
    unique: false,
    match: /[a-z]/
  },
  categories: [{
    type: String,
    lowercase: true,
    trim: true,
    required: true,
    unique: false,
    match: /[a-z]/
  }],
  chapter: {
    type: Number,
    required: true,
    unique: false,
    min: 0
  },
  seriesStatus: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
    unique: false,
    match: /[a-z]/
  },
  plot: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
    unique: false,
    match: /[a-z]/
  },
  altName: [{
    type: String,
    lowercase: true,
    trim: true,
    required: false,
    unique: false,
    match: /[a-z]/
  }],
  direction: {
    type: String,
    lowercase: true,
    trim: true,
    required: false,
    unique: false,
    match: /[a-z]/
  }
}).set('toObject', { retainKeyOrder: true });

// Export the Mongoose model
module.exports = mongoose.model('Manga', MangaSchema);