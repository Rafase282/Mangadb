'use strict';

/* Helper Function for Saving
 * Saves object information to the database
 * and returns the apropiated results.
 */
var objSave = function (object, res, msg) {
  object.save(function (err) {
    if (err) {
      resMsg(res, 400, false, err, null);
    } else {
      resMsg(res, 200, true, msg, object);
    }
  });
};
exports.objSave = objSave;

/* Helper Function for Returning Information
 * Returns result code and standard information
 * containing messages and data.
 */
var resMsg = function (res, sCode, succ, msg, data) {
  res.status(sCode).json({
    success: succ,
    message: msg,
    data: data
  });
};
exports.resMsg = resMsg;

/* Helper Function for Imetizing Arrays
 * Returns a proper array from a string
 * for alternate names and categories.
 */
var objItemize = function (arr) {
  var item;
  switch (true) {
  case arr === null || arr === undefined:
    item = [];
    break;
  case arr === ['']:
    item = arr;
    break;
  case arr.slice(0).length < 1:
    item = '';
    break;
  case arr.slice(0).length > 1:
    item = arr.slice(0);
    break;
  case arr.slice(0).length === 1:
    item = arr.slice(0)[0].split(',');
    break;
  }
  return item;
};
exports.objItemize = objItemize;

/* Function To Check Username in URL
 * Used to verify the current user.
 */
var setUser = function (username) {
  if (username === undefined) {
    var user = process.env.ADMIN.toLowerCase();
  } else {
    user = username.toLowerCase();
  }
  return user;
}

/* Function To Delete Data
 * Used to delete individual or groups of data.
 */
var delData = function (req, res, db, obj, ok, noOk, auth) {
  var user = setUser(req.params.username);
  if (req.decoded.sub === process.env.ADMIN.toLowerCase() ||
    req.decoded.sub === user) {
    db.remove(obj, function (err, data) {
      if (err) {
        resMsg(res, 400, false, err, null);
      }
      if (data.result.n === 0) {
        resMsg(res, 404, false, noOk, null);
      } else {
        resMsg(res, 200, true, ok, data);
      }
    });
  } else {
    resMsg(res, 403, false, auth, null);
  }
};
exports.delData = delData;

/* Function To Get Data
 * Used to get individual or groups of data.
 */
var getData = function (req, res, db, obj, ok, noOk, auth) {
  var user = setUser(req.params.username);
  if (req.decoded.sub === process.env.ADMIN.toLowerCase() ||
    req.decoded.sub === user) {
    db.find(obj, function (err, data) {
      if (err) {
        resMsg(res, 400, false, err, null);
      }
      if (data === null || data.length < 1) {
        resMsg(res, 404, false, noOk, null);
      } else {
        resMsg(res, 200, true, ok, data);
      }
    });
  } else {
    resMsg(res, 403, false, auth, null);
  }
};
exports.getData = getData;

var updateMangaObj = function (req, manga) {
  manga.title = req.body.title || req.params.manga_title;
  manga.author = req.body.author || manga.author;
  manga.url = req.body.url || manga.url;
  manga.userStatus = req.body.userStatus || manga.userStatus;
  manga.type = req.body.type || manga.type;
  manga.categories = req.body.categories ?
    objItemize(req.body.categories) : objItemize(manga.categories);
  manga.chapter = req.body.chapter || manga.chapter;
  manga.seriesStatus = req.body.seriesStatus || manga.seriesStatus;
  manga.plot = req.body.plot || manga.plot;
  manga.altName = req.body.altName ? objItemize(req.body.altName) :
    objItemize(manga.altName);
  manga.direction = req.body.direction || manga.direction;
  manga.userId = req.decoded.sub === req.params.user ? req.decoded.jti :
    manga.userId;
  manga.username = req.params.user || manga.username;
  manga.thumbnail = req.body.thumbnail || manga.thumbnail;
  return manga;
};
exports.updateMangaObj = updateMangaObj;

var createMangaObj = function (req, manga) {
  var userStatus = req.body.userStatus.toLowerCase();
  if (userStatus === 'reading' || userStatus === 'finished' ||
    userStatus === 'will read') {
    manga.userStatus = userStatus;
  }
  var seriesStatus = req.body.seriesStatus.toLowerCase();
  if (seriesStatus === 'ongoing' || seriesStatus === 'completed') {
    manga.seriesStatus = seriesStatus;
  }
  var direction = req.body.direction.toLowerCase();
  if (direction === 'left to right' || direction === 'right to left') {
    manga.direction = direction;
  }
  manga.title = req.body.title; // set the manga name (comes from the request)
  manga.author = req.body.author;
  manga.url = req.body.url;
  manga.type = req.body.type;
  manga.categories = req.body.categories.split(',');
  manga.chapter = req.body.chapter;
  manga.plot = req.body.plot;
  manga.altName = req.body.altName.split(',');
  manga.userId = req.decoded.sub === req.params.user ? req.decoded.jti : '';
  manga.username = req.params.user;
  manga.thumbnail = req.body.thumbnail;
  return manga;
};
exports.createMangaObj = createMangaObj;