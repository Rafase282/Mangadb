'use strict';

/* Helper Function for Saving
 * Saves object information to the database
 * and returns the apropiated results.
 */
exports.objSave = function save(object, res, msg) {
  object.save(function (err) {
    if (err) {
      resMsg(res, 400, false, err, null);
    } else {
      resMsg(res, 200, true, msg, object);
    }
  });
};

/* Helper Function for Returning Information
 * Returns result code and standard information
 * containing messages and data.
 */
exports.resMsg = function resMsg(res, sCode, succ, msg, data) {
  res.status(sCode).json({
    success: succ,
    message: msg,
    data: data
  });
};

/* Helper Function for Imetizing Arrays
 * Returns a proper array from a string
 * for alternate names and categories.
 */
exports.objItemize = function itemize(arr) {
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