'use strict';
const mongoose = require('mongoose');
/**
 * Defines manga schema
 * {title, author, url, userStatus, type,categories, chapter, seriesStatus,
 * plot, altName, direction, userId, username, thumbnail}
 * @param {Object}
 **/
const MangaSchema = new mongoose.Schema({
  title: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
    unique: false,
    match: /[a-z]/,
  },
  author: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
    unique: false,
    match: /[a-z]/,
  },
  url: {
    type: String,
    trim: true,
    required: true,
    unique: false,
  },
  userStatus: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
    unique: false,
    match: /[a-z]/,
  },
  type: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
    unique: false,
    match: /[a-z]/,
  },
  categories: [
    {
      type: String,
      lowercase: true,
      trim: true,
      required: true,
      unique: false,
      match: /[a-z]/,
    },
  ],
  chapter: {
    type: Number,
    required: true,
    unique: false,
    min: 0,
    match: /[0-9]/,
  },
  seriesStatus: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
    unique: false,
    match: /[a-z]/,
  },
  plot: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
    unique: false,
    match: /[a-z]/,
  },
  altName: [
    {
      type: String,
      lowercase: true,
      trim: true,
      required: false,
      unique: false,
      match: /[a-z]/,
    },
  ],
  direction: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
    unique: false,
    match: /[a-z]/,
  },
  userId: {
    type: String,
    lowercase: true,
    trim: true,
    required: false,
    unique: false,
    match: /[a-z-0-9]+/,
  },
  username: {
    type: String,
    lowercase: true,
    trim: true,
    required: false,
    unique: false,
    match: /[a-z-0-9]+/,
  },
  thumbnail: {
    type: String,
    trim: true,
    required: true,
    unique: false,
  },
}).set('toObject', {
  retainKeyOrder: true,
});
module.exports = mongoose.model('Manga', MangaSchema);
