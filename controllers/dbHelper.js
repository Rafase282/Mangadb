'use strict';
/* Saves object information to database and returns the apropiated results.
*/
const objSave = exports.objSave = (object, res, msg) => {
  object.save((err) => {
    if (err) {
      resMsg(res, 400, false, err.errmsg, null);
    } else {
      resMsg(res, 200, true, msg, object);
    }
  });
};

/* Returns result code and standard information containing messages and data.*/
const resMsg = exports.resMsg = (res, sCode, success, message, data) => {
  res.status(sCode).json({success, message, data});
}

/* Returns a proper array from a string for alternate names and categories. */
const objItemize = exports.objItemize = (arr) => {
  let item;
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

/* Function To Check Username in URL. Username = req.params.username
 *  When it is undefined, the admin takes responsability
 *  only if the admin actually issuee the request.
 */
const setUser = (username) => {
  let user;
  if (username === undefined) {
    user = process.env.ADMIN.toLowerCase();
  } else {
    user = username.toLowerCase();
  }
  return user;
};

/* Function To Delete Data Used to delete individual or groups of data. */
const delData = exports.delData = (req, res, db, obj, ok, noOk, auth) => {
  const user = setUser(req.params.username);
  if (req.decoded.sub === process.env.ADMIN.toLowerCase() ||
    req.decoded.sub === user) {
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

/* Function To Get Data. Used to get individual or groups of data. */
const getData = exports.getData = (req, res, db, obj, ok, noOk, auth) => {
  const user = setUser(req.params.username);
  if (req.decoded.sub === process.env.ADMIN.toLowerCase() ||
    req.decoded.sub === user) {
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

/* Function To Update Manga Object. Used to update individual mangas. */
const updateMangaObj = exports.updateMangaObj = (req, manga) => {
  manga.title = req.body.title || manga.title;
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
  manga.userId = req.decoded.sub === req.params.username ? req.decoded.jti :
    manga.userId;
  manga.username = req.params.username || manga.username;
  manga.thumbnail = req.body.thumbnail || manga.thumbnail;
  return manga;
};

/* Function To Create Manga Object. Used to create individual mangas. */
const createMangaObj = exports.createMangaObj = (req, manga) => {
  const userStatus = req.body.userStatus.toLowerCase();
  if (userStatus === 'reading' || userStatus === 'finished' ||
    userStatus === 'will read') {
    manga.userStatus = userStatus;
  }
  const seriesStatus = req.body.seriesStatus.toLowerCase();
  if (seriesStatus === 'ongoing' || seriesStatus === 'completed') {
    manga.seriesStatus = seriesStatus;
  }
  const direction = req.body.direction.toLowerCase();
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
  manga.userId = req.decoded.sub === req.params.username ? req.decoded.jti : '';
  manga.username = req.params.username;
  manga.thumbnail = req.body.thumbnail;
  return manga;
};
