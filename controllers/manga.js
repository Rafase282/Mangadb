'use strict';
// Load required packages
var geoip = require('geoip-lite');
var Manga = require('../models/manga');
var dbHelper = require('./dbHelper');

/* Middleware To Output User Location & IP
 * This is disabled by default but it logs user ip and location
 * based on IP when first connecting to the API.
 */
exports.logConnection = function (req, res, next) {
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
  console.log('Someone has connected to the api from ' + geo.city + ', ' +
    geo.region + ', ' + geo.country + ' using a ' + info.software +
    ' machine with ' + info.language + ' language. I\'m watching you ' +
    info['ip-address'] + ' you better behave!');
  next(); // make sure we go to the next routes and don't stop here
};

/* Get Welcome Message From Root
 * Displays a welcome message when visiting the root of the API.
 * Accessed at GET /api
 */
exports.getWelcome = function (req, res) {
  var msg = 'Welcome, check the API usage at ' + process.env.APP_URL +
    ', there is nothing to do here.';
  dbHelper.resMsg(res, 200, true, msg, null);
};

// Serve index.jade
exports.getIndex = function (req, res) {
  res.render('index');
};

/* Creates New Manga
 * Returns the manga information.
 * Accessed at POST /api/mangas/:user
 */
exports.postManga = function (req, res) {
  if (req.decoded.sub === process.env.ADMIN ||
    req.decoded.sub === req.params.user.toLowerCase()) {
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
    var msg = 'You are not ' + req.params.username.toLowerCase() +
      ' or an admin!';
    dbHelper.resMsg(res, 403, false, msg, null);
  }
};

/* Finds Manga By Title
 * Returns the manga information.
 * Accessed at GET /api/mangas/:user/:manga_title
 */
exports.getManga = function (req, res) {
  var ok = req.params.manga_title + ' found!';
  var noOk = req.params.manga_title + ' not found!';
  var auth = 'You are not ' + req.params.user.toLowerCase() +
    ' or an admin!';
  var obj = {
    title: req.params.manga_title.toLowerCase(),
    username: req.params.user.toLowerCase()
  };
  dbHelper.getData(req, res, Manga, obj, ok, noOk, auth);
};

/* Updates Manga By Title
 * Returns the manga information.
 * Accessed at PUT /api/mangas/:user/:manga_title
 */
exports.putManga = function (req, res) {
  // use our manga model to find the manga we want
  if (req.decoded.sub === process.env.ADMIN ||
    req.decoded.sub === req.params.user.toLowerCase()) {
    Manga.findOne({
      title: req.params.manga_title.toLowerCase(),
      username: req.params.user.toLowerCase()
    }, function (err, manga) {
      if (err) {
        dbHelper.resMsg(res, 400, false, err, null);
      } else {
        manga.title = req.body.title || req.params.manga_title;
        manga.author = req.body.author || manga.author;
        manga.url = req.body.url || manga.url;
        manga.userStatus = req.body.userStatus || manga.userStatus;
        manga.type = req.body.type || manga.type;
        manga.categories = req.body.categories ?
          dbHelper.objItemize(req.body.categories) :
          dbHelper.objItemize(manga.categories);
        manga.chapter = req.body.chapter || manga.chapter;
        manga.seriesStatus = req.body.seriesStatus || manga.seriesStatus;
        manga.plot = req.body.plot || manga.plot;
        manga.altName = req.body.altName ?
          dbHelper.objItemize(req.body.altName) :
          dbHelper.objItemize(manga.altName);
        manga.direction = req.body.direction || manga.direction;
        manga.userId = req.decoded.sub === req.params.user ? req.decoded.jti :
          manga.userId;
        manga.username = req.params.user || manga.username;
        manga.thumbnail = req.body.thumbnail || manga.thumbnail;
        // update the manga
        var msg = req.params.manga_title + ' manga updated.';
        dbHelper.objSave(manga, res, msg);
      }
    });
  } else {
    var msg = 'You are not ' + req.params.username.toLowerCase() +
      ' or an admin!';
    dbHelper.resMsg(res, 403, false, msg, null);
  }
};

/* Deletes Manga By Title
 * Returns the manga information.
 * Accessed at DELETE /api/mangas/:user/:manga_title
 */
exports.delManga = function (req, res) {
  var noOk = 'Could not find ' + req.params.manga_title;
  var ok = 'Successfully deleted ' + req.params.manga_title;
  var auth = 'You are not ' + req.params.user.toLowerCase() +
    ' or an admin!';
  var obj = {
    title: req.params.manga_title.toLowerCase(),
    username: req.params.user.toLowerCase()
  };

  dbHelper.delData(req, res, Manga, obj, ok, noOk, auth);
};

/* Finds All Mangas By User
 * Returns a list of all the mangas the user has.
 * Accessed at GET /api/mangas/:user
 */
exports.getMangas = function (req, res) {
  var ok = 'Manga List Generated.';
  var noOk = req.params.user + ' has not added any mangas yet.';
  var auth = 'You are not ' + req.params.user.toLowerCase() +
    ' or an admin!';
  var userName = req.decoded.sub === process.env.ADMIN ?
    req.params.user.toLowerCase() : req.decoded.sub;
  var obj = {
    username: userName
  };

  dbHelper.getData(req, res, Manga, obj, ok, noOk, auth);
};

/* Finds All Mangas By All Users Via Admin
 * Returns a list of all the mangas for all users.
 * Accessed at GET /api/mangas
 */
exports.getAllMangas = function (req, res) {
  var ok = 'Manga List Generated.';
  var noOk = 'No Mangas has been added yet.';
  var auth = 'You are not an admin!';
  var obj = {};

  dbHelper.getData(req, res, Manga, obj, ok, noOk, auth);
};

/* Deletes All Mangas For All Users Via Admin
 * Returns the manga information.
 * Accessed at DELETE /api/mangas/
 */
exports.delMangas = function (req, res) {
  var ok = 'Successfully deleted all mangas.';
  var noOk = 'No mangas were found!';
  var auth = 'You are not an admin!';
  var obj = {
    username: {
      $ne: process.env.ADMIN.toLowerCase()
    }
  };

  dbHelper.delData(req, res, Manga, obj, ok, noOk, auth);
};

/* Deletes All Mangas For All Users Via Admin
 * Returns the manga information.
 * Accessed at DELETE /api/mangas/:user
 */
exports.delUserMangas = function (req, res) {
  var noOk = 'No mangas were found!';
  var ok = 'Successfully deleted all user mangas.';
  var auth = 'You are not an admin!';
  var obj = {
    username: req.params.user.toLowerCase()
  };

  dbHelper.delData(req, res, Manga, obj, ok, noOk, auth);
};