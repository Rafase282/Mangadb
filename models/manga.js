// /models/manga.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//Schema.set('toObject', { retainKeyOrder: true });

var MangaSchema = new Schema({
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
    required: false,
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
    required: false,
    unique: false,
    match: /[a-z]/
  },
  type: {
    type: String,
    lowercase: true,
    trim: true,
    required: false,
    unique: false,
    match: /[a-z]/
  },
  categories: [{
    type: String,
    lowercase: true,
    trim: true,
    required: false,
    unique: false,
    match: /[a-z]/
  }],
  chapter: {
    type: Number,
    required: false,
    unique: false,
    min: 0
  },
  seriesStatus: {
    type: String,
    lowercase: true,
    trim: true,
    required: false,
    unique: false,
    match: /[a-z]/
  },
  plot: {
    type: String,
    lowercase: true,
    trim: true,
    required: false,
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
  }]
}).set('toObject', { retainKeyOrder: true });

module.exports = mongoose.model('Manga', MangaSchema);