'use strict';
// Load required packages
var geoip = require('geoip-lite');
var Manga = require('../models/manga');
var dbHelper = require('./dbHelper');

// NOT NEEDED BUT DISPLAY CONNECTION INFORMATION
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
// Get the manga with that title (accessed at GET https://mangadb-r282.herokuapp.com/api/mangas/:user/:manga_title)
exports.getManga = function(req, res) {
  if (req.decoded.sub === process.env.ADMIN || req.decoded.sub === req.params.user.toLowerCase()) {
    Manga.findOne({
      title: req.params.manga_title.toLowerCase(),
      username: req.params.user.toLowerCase()
    }, function(err, manga) {
      var noOK = req.params.manga_title + ' not found!';
      var ok = req.params.manga_title + ' found!';
      if (err) {
        res.status(400).json({
          error: err
        });
        console.log(err);
      } else {
        var out = manga == null ? {
          msg: noOK,
          info: {
            message: noOK
          }
        } : {
          msg: ok,
          info: manga
        };
        console.log(out.msg);
        res.json(out.info);
      }
    });
  } else {
    res.json({
      error: 'You are not ' + req.params.user.toLowerCase() + ' or an admin!'
    });
  }
};

// UPDATE MANGA BY TITLE
// Update the manga with this title (accessed at PUT https://mangadb-r282.herokuapp.com/api/mangas/:user/:manga_title)
exports.putManga = function(req, res) {
  // use our manga model to find the manga we want
  if (req.decoded.sub === process.env.ADMIN || req.decoded.sub === req.params.user.toLowerCase()) {
    Manga.findOne({
      title: req.params.manga_title.toLowerCase(),
      username: req.params.user.toLowerCase()
    }, function(err, manga) {
      if (err) {
        res.status(400).json({
          error: err
        });
        console.log(err);
      } else {
        manga.title = req.body.title || req.params.manga_title;
        manga.author = req.body.author || manga.author;
        manga.url = req.body.url || manga.url;
        manga.userStatus = req.body.userStatus || manga.userStatus;
        manga.type = req.body.type || manga.type;
        manga.categories = req.body.categories ? dbHelper.objItemize(req.body.categories) : dbHelper.objItemize(manga.categories);
        manga.chapter = req.body.chapter || manga.chapter;
        manga.seriesStatus = req.body.seriesStatus || manga.seriesStatus;
        manga.plot = req.body.plot || manga.plot;
        manga.altName = req.body.altName ? dbHelper.objItemize(req.body.altName) : dbHelper.objItemize(manga.altName);
        manga.direction = req.body.direction || manga.direction;
        manga.userId = req.decoded.sub === req.params.user ? req.decoded.jti : manga.userId;
        manga.username = req.params.user || manga.username;
        manga.thumbnail = req.body.thumbnail || manga.thumbnail;
        // update the manga
        var msg = req.params.manga_title + ' manga updated.';
        dbHelper.objSave(manga, res, msg);
      }
    });
  } else {
    res.json({
      error: 'You are not ' + req.params.user.toLowerCase() + ' or an admin!'
    });
  }
};

// DELETE MANGA BY TITLE
// Delete the manga with this title (accessed at DELETE https://mangadb-r282.herokuapp.com/api/mangas/:user/:manga_title)
exports.delManga = function(req, res) {
  if (req.decoded.sub === process.env.ADMIN || req.decoded.sub === req.params.user.toLowerCase()) {
    Manga.remove({
      title: req.params.manga_title.toLowerCase(),
      username: req.params.user.toLowerCase()
    }, function(err, manga) {
      var ok = 'Successfully deleted ' + req.params.manga_title;
      var noOK = req.params.manga_title + ' not found!';
      if (err) {
        res.status(400).json({
          error: err
        });
        console.log(err);
      } else {
        var msg = manga == null ? noOK : ok;
        console.log(msg);
        res.json({
          message: msg
        });
      }
    });
  } else {
    res.json({
      error: 'You are not ' + req.params.user.toLowerCase() + ' or an admin!'
    });
  }
};

// CREATE NEW MANGA
// Create a manga (accessed at POST https://mangadb-r282.herokuapp.com/api/mangas/:user)
exports.postManga = function(req, res) {
  if (req.decoded.sub === process.env.ADMIN || req.decoded.sub === req.params.user.toLowerCase()) {
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
    manga.userId = req.decoded.sub === req.params.user ? req.decoded.jti : '';
    manga.username = req.params.user;
    manga.thumbnail = req.body.thumbnail;
    // Call function to save manga
    var msg = req.body.title + ' manga created.';
    dbHelper.objSave(manga, res, msg);
  } else {
    res.json({
      error: 'You are not ' + req.params.user.toLowerCase() + ' or an admin!'
    });
  }
};

// FIND ALL MANGAS BY USER.
// Get all the mangas (accessed at GET https://mangadb-r282.herokuapp.com/api/mangas/:user)
exports.getMangas = function(req, res) {
  if (req.decoded.sub === process.env.ADMIN || req.decoded.sub === req.params.user.toLowerCase()) {
    var userName = req.decoded.sub === process.env.ADMIN ? req.params.user.toLowerCase() : req.decoded.sub;
    Manga.find({
      username: userName
    }, function(err, mangas) {
      var ok = 'Manga List Generated.';
      var noOK = req.params.user + ' has not added any mangas yet.';
      if (err) {
        res.status(400).json({
          error: err
        });
        console.log(err);
      } else {
        var out = mangas == null || mangas.length < 1 ? {
          msg: noOK,
          info: {
            message: noOK
          }
        } : {
          msg: ok,
          info: mangas
        };
        console.log(out.msg);
        res.json(out.info);
      }
    });
  } else {
    res.json({
      error: 'You are not ' + req.params.user.toLowerCase() + ' or an admin!'
    });
  }
};

// FIND ALL MANGAS via admin.
// Get all the mangas (accessed at GET https://mangadb-r282.herokuapp.com/api/mangas)
exports.getAllMangas = function(req, res) {
  if (req.decoded.sub === process.env.ADMIN) {
    Manga.find({}, function(err, mangas) {
      var ok = 'Manga List Generated';
      var noOK = 'No Mangas has been added yet.';
      if (err) {
        res.status(400).json({
          error: err
        });
        console.log(err);
      } else {
        var out = mangas == null || mangas < 1 ? {
          msg: noOK,
          info: {
            message: noOK
          }
        } : {
          msg: ok,
          info: mangas
        };
        console.log(out.msg);
        res.json(out.info);
      }
    });
  } else {
    res.json({
      error: 'You are not an admin!'
    });
  }
};

// DELETE ALL MANGAS VIA ADMIN
// Delete all mangas (accessed at DELETE https://mangadb-r282.herokuapp.com/api/mangas/)
exports.delMangas = function(req, res) {
  if (req.decoded.sub === process.env.ADMIN) {
    Manga.remove({}, function(err, manga) {
      var ok = 'Successfully deleted all mangas.';
      var noOK = 'No mangas were found!';
      if (err) {
        res.status(400).json({
          error: err
        });
        console.log(err);
      } else {
        var msg = manga == null ? noOK : ok;
        console.log(msg);
        res.json({
          message: msg
        });
      }
    });
  } else {
    res.json({
      error: 'You are not an admin!'
    });
  }
};
