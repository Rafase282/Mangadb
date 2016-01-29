'use strict';
// Load required packages
var geoip = require('geoip-lite');
var Manga = require('../models/manga');
var dbHelper = require('./dbHelper');

exports.logConnection = function(req, res, next) {
  // do logging
  var ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  var info = {
    'ip-address': ip,
    'language': req.headers["accept-language"].split(',')[0],
    'software': req.headers['user-agent'].split(') ')[0].split(' (')[1]
  };
  var geo = geoip.lookup(ip);
  console.log('Someone has connected to the api from ' + geo.city + ', ' + geo.region + ', ' + geo.country + ' using a ' + info.software + ' machine with ' + info.language + ' language. I\'m watching you ' + info['ip-address'] + ' you better behave!');
  next(); // make sure we go to the next routes and don't stop here
};

// test route to make sure everything is working (accessed at GET https://mangadb-r282.herokuapp.com/api)
exports.getWelcome = function(req, res) {
  res.json({
    message: 'Welcome, check the API usage at https://mangadb-r282.herokuapp.com, there is nothing to do here.'
  });
};

// Serve index.jade
exports.getIndex = function(req, res) {
  res.render('index');
};

// FIND MANGA BY TITLE
// Get the manga with that title (accessed at GET https://mangadb-r282.herokuapp.com/api/mangas/:manga_title)
exports.getManga = function(req, res) {
  Manga.findOne({
    title: req.params.manga_title
  }, 'userId', function(err, manga) {
    var ok = req.params.manga_title + ' found!';
    var notOk = req.params.manga_title + ' not found.';
    if (err) {
      res.status(404).json({
        error: notOk
      });
      console.log(notOk);
    } else {
      console.log(ok);
      res.json(manga);
    }
  });
};

// UPDATE MANGA BY TITLE
// Update the manga with this title (accessed at PUT https://mangadb-r282.herokuapp.com/api/mangas/:manga_title)
exports.putManga = function(req, res) {
  // use our manga model to find the manga we want
  Manga.findOne({
    title: req.params.manga_title
  }, 'userId', function(err, manga) {
    if (err) {
      var notOk = req.params.manga_title + ' not found.';
      res.status(404).json({
        error: notOk
      });
      console.log(notOk);
    } else {
      console.log(req.params);
      manga.title = req.params.manga_title;
      manga.author = req.body.author || manga.author;
      manga.url = req.body.url || manga.url;
      manga.userStatus = req.body.userStatus || manga.userStatus;
      manga.type = req.body.type || manga.type;
      manga.categories = req.body.categories ? req.body.categories.split(',') : dbHelper.objItemize(manga.categories);
      manga.chapter = req.body.chapter || manga.chapter;
      manga.seriesStatus = req.body.seriesStatus || manga.seriesStatus;
      manga.plot = req.body.plot || manga.plot;
      manga.altName = req.body.altName ? req.body.altName.split(',') : dbHelper.objItemize(manga.altName);
      manga.direction = req.body.direction || manga.direction;
      manga.userId = req.user._id || manga.userId;
      // update the manga
      var msg = req.params.manga_title + ' manga updated.';
      var errMsg = 'All fields are required for creating new manga, the title is required for updating though.';
      dbHelper.objSave(manga, res, msg, errMsg);
    }
  });
};

// DELETE MANGA BY TITLE
// Delete the manga with this title (accessed at DELETE https://mangadb-r282.herokuapp.com/api/mangas/:manga_title)
exports.delManga = function(req, res) {
  Manga.remove({
    title: req.params.manga_title
  }, 'userId', function(err, manga) {
    var ok = 'Successfully deleted ' + req.params.manga_title;
    var notOk = 'Could not find manga ' + req.params.manga_title;
    if (err) {
      res.status(404).json({
        error: notOk
      });
      console.log(notOk);
    } else {
      console.log(ok);
      res.json({
        message: ok
      });
    }
  });
};

// CREATE NEW MANGA
// Create a manga (accessed at POST https://mangadb-r282.herokuapp.com/api/mangas)
exports.postMangas = function(req, res) {
  var manga = new Manga(); // create a new instance of the Manga model
  manga.title = req.body.title; // set the manga name (comes from the request)
  manga.author = req.body.author;
  manga.url = req.body.url;
  manga.userStatus = req.body.userStatus;
  manga.type = req.body.type;
  manga.categories = req.body.categories.split(',');
  manga.chapter = req.body.chapter;
  manga.seriesStatus = req.body.seriesStatus;
  manga.plot = req.body.plot;
  manga.altName = req.body.altName.split(',');
  manga.direction = req.body.direction;
  manga.userId = req.user._id;

  // Call function to save manga
  var msg = req.body.title + ' manga created.';
  var errMsg = 'A manga already exist with duplicated name or url.';
  dbHelper.objSave(manga, res, msg, errMsg);
};

// FIND ALL MANGAS.
// Get all the mangas (accessed at GET https://mangadb-r282.herokuapp.com/api/mangas)
exports.getMangas = function(req, res) {
  Manga.find({
    userId: req.user._id
  }, function(err, mangas) {
    var ok = 'Manga List Generated';
    var notOk = 'No mangas found';
    if (err) {
      res.status(404).json({
        error: notOk
      });
      console.log(notOk);
    } else {
      console.log(ok);
      res.json(mangas);
    }
  });
};