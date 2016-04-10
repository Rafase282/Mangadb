'use strict';
// Load required packages
var Manga = require('../models/manga');
var dbHelper = require('./dbHelper');
var noOk = 'No mangas were found!';
var auth = 'You are not an admin!';

/* Get Welcome Message From Root
 * Displays a welcome message when visiting the root of the API.
 * Accessed at GET /api */
exports.getWelcome = function (req, res) {
  var msg = 'Welcome, check the API usage at ' + process.env.APP_URL +
    ', there is nothing to do here.';
  dbHelper.resMsg(res, 200, true, msg, null);
};

// Serve index.pug
exports.getIndex = function (req, res) {
  res.render('index');
};

/* Creates New Manga
 * Returns the manga information. Accessed at POST /api/mangas/:username */
exports.postManga = function (req, res) {
  var targetUser = req.params.username.toLowerCase();
  if (req.decoded.sub === process.env.ADMIN ||
    req.decoded.sub === targetUser) {
    var manga = new Manga(); // create a new instance of the Manga model
    manga = dbHelper.updateMangaObj(req, manga);
    var msg = req.body.title + ' manga created.';
    dbHelper.objSave(manga, res, msg);
  } else {
    msg = 'You are not ' + targetUser + ' or an admin!';
    dbHelper.resMsg(res, 403, false, msg, null);
  }
};

/* Finds Manga By Title
 * Returns the manga information.
 * Accessed at GET /api/mangas/:username/:manga_title */
exports.getManga = function (req, res) {
  var targetUser = req.params.username.toLowerCase();
  var ok = req.params.manga_title + ' found!';
  var noOk = req.params.manga_title + ' not found!';
  var auth = 'You are not ' + targetUser + ' or an admin!';
  var obj = {
    title: req.params.manga_title.toLowerCase(),
    username: targetUser
  };
  dbHelper.getData(req, res, Manga, obj, ok, noOk, auth);
};

/* Updates Manga By Title
 * Returns the manga information.
 * Accessed at PUT /api/mangas/:username/:manga_title */
exports.putManga = function (req, res) {
  var targetUser = req.params.username.toLowerCase();
  if (req.decoded.sub === process.env.ADMIN ||
    req.decoded.sub === targetUser) {
    Manga.findOne({
      title: req.params.manga_title.toLowerCase(),
      username: targetUser
    }, function (err, manga) {
      if (err) {
        dbHelper.resMsg(res, 400, false, err, null);
      } else {
        manga = dbHelper.updateMangaObj(req, manga);
        var msg = req.params.manga_title + ' manga updated.';
        dbHelper.objSave(manga, res, msg);
      }
    });
  } else {
    var msg = 'You are not ' + targetUser + ' or an admin!';
    dbHelper.resMsg(res, 403, false, msg, null);
  }
};

/* Deletes Manga By Title
 * Returns the manga information.
 * Accessed at DELETE /api/mangas/:username/:manga_title */
exports.delManga = function (req, res) {
  var targetUser = req.params.username.toLowerCase();
  var noOk = 'Could not find ' + req.params.manga_title;
  var ok = 'Successfully deleted ' + req.params.manga_title;
  var auth = 'You are not ' + targetUser + ' or an admin!';
  var obj = {
    title: req.params.manga_title.toLowerCase(),
    username: targetUser
  };
  dbHelper.delData(req, res, Manga, obj, ok, noOk, auth);
};

/* Finds All Mangas By User
 * Returns a list of all the mangas the user has.
 * Accessed at GET /api/mangas/:username */
exports.getMangas = function (req, res) {
  var targetUser = req.params.username.toLowerCase();
  var ok = 'Manga List Generated.';
  var noOk = targetUser + ' has not added any mangas yet.';
  var auth = 'You are not ' + targetUser + ' or an admin!';
  var userName = req.decoded.sub === process.env.ADMIN ?
    targetUser : req.decoded.sub;
  var obj = {
    username: userName
  };
  dbHelper.getData(req, res, Manga, obj, ok, noOk, auth);
};

/* Finds All Mangas By All Users Via Admin
 * Returns a list of all the mangas for all users. Accessed at GET /api/mangas*/
exports.getAllMangas = function (req, res) {
  var ok = 'Manga List Generated.';
  var obj = {};
  dbHelper.getData(req, res, Manga, obj, ok, noOk, auth);
};

/* Deletes All Mangas For All Users Via Admin
 * Returns the manga information. Accessed at DELETE /api/mangas/ */
exports.delMangas = function (req, res) {
  var ok = 'Successfully deleted all mangas.';
  var obj = {
    username: {
      $ne: process.env.ADMIN.toLowerCase()
    }
  };
  dbHelper.delData(req, res, Manga, obj, ok, noOk, auth);
};

/* Deletes All Mangas For All Users Via Admin
 * Returns the manga information. Accessed at DELETE /api/mangas/:username */
exports.delUserMangas = function (req, res) {
  var targetUser = req.params.username.toLowerCase();
  var ok = 'Successfully deleted all user mangas.';
  var obj = {
    username: targetUser
  };
  dbHelper.delData(req, res, Manga, obj, ok, noOk, auth);
};