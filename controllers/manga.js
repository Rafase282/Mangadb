'use strict';
// Load required packages
const Manga = require('../models/manga');
const dbHelper = require('./dbHelper');

//Gloabls
const auth = 'You do not have the right permission for this action.';
const noOk = 'No mangas were found!';
/**
  * Get Welcome Message From Root
  * Displays a welcome message when visiting the root of the API.
  * Accessed at GET /api/v#
  * @param {Object} req
  * @param {Object} res
  * @param {Null}
**/
exports.getWelcome = (req, res) => {
  const msg = `Welcome, check the API usage at ${process.env.APP_URL}, ` +
    `there is nothing to do here.`;
  dbHelper.resMsg(res, 200, true, msg, null);
};
/**
  * Creates New Manga
  * Returns the manga information.
  * Accessed at POST /api/v#/mangas/:username
  * @param {Object} req
  * @param {Object} res
  * @param {Null}
**/
exports.postManga = (req, res) => {
  const username = req.params.username.toLowerCase();
  if (req.decoded.sub === process.env.ADMIN ||
    req.decoded.sub === username) {
    let manga = new Manga(); // create a new instance of the Manga model
    manga = dbHelper.updateMangaObj(req, manga);
    const msg = `${req.body.title} manga created.`;
    // dbHelper.objSave(manga, res, msg);

    return dbHelper.objSave(manga, (results) => {
      const success = results.status === 200;
      const msg = results.err ? result.err : msg;
      const data = results.err ? null : user;

      res.status(results.status).json({
        success,
        msg,
        data
      });
    });
  } else {
    dbHelper.resMsg(res, 403, false, auth, null);
  }
};
/**
  * Finds Manga By Title
  * Returns the manga information.
  * Accessed at GET /api/v#/mangas/:username/:id
  * @param {Object} req
  * @param {Object} res
  * @param {Null}
**/
exports.getManga = (req, res) => {
  const username = req.params.username.toLowerCase();
  const ok = `${req.params.id} found!`;
  const noOk = `${req.params.id} not found!`;
  const obj = {_id: req.params.id, username};
  dbHelper.getData(req, res, Manga, obj, ok, noOk, auth);
};
/**
  * Finds Manga By Title
  * Returns the manga information.
  * Accessed at GET /api/v#/mangas/:username/title/:manga_title
  * @param {Object} req
  * @param {Object} res
  * @param {Null}
**/
exports.getMangasbyTitle = (req, res) => {
  const username = req.params.username.toLowerCase();
  const ok = `${req.params.manga_title} found!`;
  const noOk = `${req.params.manga_title} not found!`;
  const obj = {title: req.params.manga_title.toLowerCase(), username};
  dbHelper.getData(req, res, Manga, obj, ok, noOk, auth);
};
/**
  * Updates Manga By Title
  * Returns the manga information.
  * Accessed at PUT /api/v#/mangas/:username/:id
  * @param {Object} req
  * @param {Object} res
  * @param {Null}
**/
exports.putManga = (req, res) => {
  const username = req.params.username.toLowerCase();
  if (req.decoded.sub === process.env.ADMIN ||
    req.decoded.sub === username) {
    Manga.findOne({
      _id: req.params.id,
      username
    }, (err, manga) => {
      if (err) {
        dbHelper.resMsg(res, 400, false, err, null);
      } else {
        manga = dbHelper.updateMangaObj(req, manga);
        const msg = `${manga.title} manga updated.`;
        dbHelper.objSave(manga, res, msg);
      }
    });
  } else {
    dbHelper.resMsg(res, 403, false, auth, null);
  }
};
/**
  * Deletes Manga By Title
  * Returns the manga information.
  * Accessed at DELETE /api/v#/mangas/:username/:id
  * @param {Object} req
  * @param {Object} res
  * @param {Null}
**/
exports.delManga = (req, res) => {
  const username = req.params.username.toLowerCase();
  const noOk = `Could not find ${req.params.id}`;
  const ok = `Successfully deleted ${req.params.id}`;
  const obj = {_id: req.params.id, username};
  dbHelper.delData(req, res, Manga, obj, ok, noOk, auth);
};
/**
  * Finds All Mangas By User
  * Returns a list of all the mangas the user has.
  * Accessed at GET /api/v#/mangas/:username
  * @param {Object} req
  * @param {Object} res
  * @param {Null}
**/
exports.getMangas = (req, res) => {
  let username = req.params.username.toLowerCase();
  const ok = 'Manga List Generated.';
  const noOk = `${username} has not added any mangas yet.`;
  username = req.decoded.sub === process.env.ADMIN ? username : req.decoded.sub;
  const obj = {username};
  dbHelper.getData(req, res, Manga, obj, ok, noOk, auth);
};
/**
  * Finds All Mangas By All Users Via Admin
  * Returns a list of all the mangas for all users.
  * Accessed at GET /api/v#/mangas
  * @param {Object} req
  * @param {Object} res
  * @param {Null}
**/
exports.getAllMangas = (req, res) => {
  const ok = 'Manga List Generated.';
  dbHelper.getData(req, res, Manga, {}, ok, noOk, auth);
};
/**
  * Deletes All Mangas For All Users Via Admin
  * Returns the manga information.
  * Accessed at DELETE /api/v#/mangas/
  * @param {Object} req
  * @param {Object} res
  * @param {Null}
**/
exports.delMangas = (req, res) => {
  const ok = 'Successfully deleted all mangas.';
  const obj = {username: {$ne: process.env.ADMIN.toLowerCase()}};
  dbHelper.delData(req, res, Manga, obj, ok, noOk, auth);
};
/**
  * Deletes All Mangas For User
  * Returns the manga information.
  * Accessed at DELETE /api/v#/mangas/:username
  * @param {Object} req
  * @param {Object} res
  * @param {Null}
**/
exports.delUserMangas = (req, res) => {
  const username = req.params.username.toLowerCase();
  const ok = 'Successfully deleted all user mangas.';
  const obj = {username};
  dbHelper.delData(req, res, Manga, obj, ok, noOk, auth);
};
