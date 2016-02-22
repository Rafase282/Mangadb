'use strict';

exports.objSave = function save(object, res, msg, errMsg) {
  // save the object and check for errors
  object.save(function(err) {
    if (err) {
      res.status(409).json({
        error: errMsg
      });
      console.log(errMsg);
    } else {
      console.log(msg);
      res.json({
        message: msg
      });
    }
  });
};

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