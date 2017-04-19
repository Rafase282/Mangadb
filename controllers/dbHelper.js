'use strict';


const objSave = exports.objSave = (object, callback) => {
  object.save((err) => {
    callback({
      status : err ? 400 : 200,
      err : err ? err.errmsg : ''
    });
  });
};

// /**
//   * Saves data in the database.
//   * It takes an object to be saved, the response object fromt he route and
//   * a message to be returned.
//   * @param {Object} object
//   * @param {Object} res
//   * @param {String} msg
//   * @return {String} res
// **/
// const objSave = exports.objSave = (object, res, msg, callback = null) => {
//   object.save((err) => {
//     if (err) {
//       resMsg(res, 400, false, err.errmsg, null);
//       if(callback) return callback(err);
//     } else {
//       resMsg(res, 200, true, msg, object);
//       if(callback) return callback('success');
//     }
//   });
// };
// /**
//   * Returns result code and standard information containing messages and data.
//   * @param {Object} res
//   * @param {Number} sCode
//   * @param {Boolean} success
//   * @param {String} message
//   * @param {Object} data
//   * @return null
// **/
// const resMsg = exports.resMsg = (res, sCode, success, message, data) => {
//   res.status(sCode).json({success, message, data});
// }
/**
  * Ensures that arrays are proper arrays of 1 or more items instead of a list
  * as one item.
  * @param {Array || String} input
  * @return {Array || String} list
**/
const objItemize = exports.objItemize = (input) => {
  let list;
  switch (true) {
  case input === null || input === undefined:
    list = [];
    break;
  case input === ['']:
    list = input;
    break;
  case input.slice(0).length < 1:
    list = '';
    break;
  case input.slice(0).length > 1:
    list = input.slice(0);
    break;
  case input.slice(0).length === 1:
    list = input.slice(0)[0].split(',');
    break;
  }
  return list;
};
 /**
  * Function To Check Username in URL. Username = req.params.username.
  * When it is undefined, the admin takes responsability
  * only if the admin actually issuee the request.
  * @param {String} username
  * @return {String} user
 **/
const setUser = (username) => {
  let user;
  if (username === undefined) {
    user = process.env.ADMIN.toLowerCase();
  } else {
    user = lowerCase(username);
  }
  return user;
};
/**
  * Deletes data from the database.
  * It can be used for individual user/manga or group data deletion.
  * @param {Object} req
  * @param {Object} res
  * @param {Object} db
  * @param {Object} obj
  * @param {String} ok
  * @param {String} noOk
  * @param {String} auth
  * @return null
**/
const delData = exports.delData = (req, res, db, obj, ok, noOk, auth) => {
  const user = setUser(req.params.username);
  if (checkUser(req.decoded.sub, user)) {
    db.remove(obj, (err, data) => {
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
/**
  * Retrieves data from the database.
  * It can be used for individual user/manga or group data retrieval.
  * @param {Object} req
  * @param {Object} res
  * @param {Object} db
  * @param {Object} obj
  * @param {String} ok
  * @param {String} noOk
  * @param {String} auth
  * @return null
**/
const getData = exports.getData = (req, res, db, obj, ok, noOk, auth) => {
  const user = setUser(req.params.username);
  if (checkUser(req.decoded.sub, user)) {
    db.find(obj, (err, data) => {
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
/**
  * Function to ensure the string can be turned to lowercase.
  * It checks to make sure the input is not undefined.
  * @param {String} str
  * @return {String} str
**/
const lowerCase = exports.lowerCase = (str) => typeof str === 'undefined'
  ? str
  : str.toLowerCase();
/**
  * Function to update a Manga object.
  * Used for individual manga update.
  * @param {Object} req
  * @param {Object} manga
  * @param {Object} manga
**/
const updateMangaObj = exports.updateMangaObj = (req, manga) => {
  const userStatus = lowerCase(req.body.userStatus);
  if (userStatus === 'reading' || userStatus === 'finished' ||
    userStatus === 'will read') {
    manga.userStatus = userStatus || manga.userStatus;
  }
  const seriesStatus = lowerCase(req.body.seriesStatus);
  if (seriesStatus === 'ongoing' || seriesStatus === 'completed') {
    manga.seriesStatus = seriesStatus || manga.seriesStatus;
  }
  const direction = lowerCase(req.body.direction);
  if (direction === 'left to right' || direction === 'right to left') {
    manga.direction = direction || manga.direction;
  }

  manga.title = req.body.title || manga.title;
  manga.author = req.body.author || manga.author;
  manga.url = req.body.url || manga.url;
  manga.type = req.body.type || manga.type;
  manga.categories = req.body.categories ?
    objItemize(req.body.categories) : objItemize(manga.categories);
  manga.chapter = req.body.chapter || manga.chapter;
  manga.plot = req.body.plot || manga.plot;
  manga.altName = req.body.altName ? objItemize(req.body.altName) :
    objItemize(manga.altName);
  manga.userId = req.decoded.sub === req.params.username ? req.decoded.jti :
    manga.userId;
  manga.username = req.params.username || manga.username;
  manga.thumbnail = req.body.thumbnail || manga.thumbnail;
  return manga;
};
/**
  * Function to check for username
  * It checks that the user issuing the request is either an admin
  * or the same user the changes are for.
  * @param {String} username
  * @param {String} user
  * @param {Boolean}
**/
const checkUser = exports.checkUser = (username, user) => {
  return username === process.env.ADMIN.toLowerCase() || username === user
}
