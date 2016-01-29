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
  var expression = arr.slice(0);
  var item;
  switch (true) {
    case expression.length < 1:
      item = '';
      break;
    case expression.length > 1:
      item = expression;
      break;
    case expression.length === 1:
      item = expression[0].split(',');
      break;
  }
  return item;
};