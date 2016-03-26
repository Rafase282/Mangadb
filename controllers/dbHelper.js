'use strict';

exports.objSave = function save(object, res, msg) {
  // save the object and check for errors
  object.save(function (err) {
    if (err) {
      res.status(409).json({
        success: false,
        message: err,
        data: null
      });
    } else {
      res.status(200).json({
        success: true,
        message: msg,
        data: object
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