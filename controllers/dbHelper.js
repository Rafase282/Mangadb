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

/* Function To Delete Data
 * Used to delete individual or groups of data.
 */
var delData = function (req, res, db, obj, ok, noOk, auth) {
  if (req.decoded.sub === process.env.ADMIN.toLowerCase() ||
    req.decoded.sub === req.params.user.toLowerCase()) {
    db.remove(obj, function (err, data) {
      if (err) {
        resMsg(res, 400, false, err, null);
      }
      if (data.result.n === 0) {
        resMsg(res, 404, false, noOK, null);
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
  if (req.decoded.sub === process.env.ADMIN.toLowerCase() ||
    req.decoded.sub === req.params.user.toLowerCase()) {
    db.find(obj, function (err, data) {
      if (err) {
        resMsg(res, 400, false, err, null);
      }
      if (data === null || data.length < 1) {
        resMsg(res, 404, false, noOk, null);
      } else {
        var msg = 'Manga List Generated.';
        resMsg(res, 200, true, ok, data);
      }
    });
  } else {
    var msg = 'You are not an admin!';
    resMsg(res, 403, false, auth, null);
  }
};
exports.getData = getData;