// Load required packages
var User = require('../models/user');
var dbHelper = require('./dbHelper');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

/* Generates JWT For User
 * Returns result code and standard information
 * containing messages and jwt.
 */
exports.generateToken = function (req, res) {
  // find the user
  User.findOne({
    username: req.body.username.toLowerCase()
  }, function (err, user) {
    if (err) {
      dbHelper.resMsg(res, 400, false, err, null);
    }
    if (!user) {
      var msg = 'Authentication failed. User not found.';
      dbHelper.resMsg(res, 404, false, msg, null);
    } else if (user) {
      // check if password matches
      user.verifyPassword(req.body.password, function (err, isMatch) {
        if (err) {
          dbHelper.resMsg(res, 400, false, err, null);
        }
        if (!isMatch) {
          var msg = 'Authentication failed. Wrong password.';
          dbHelper.resMsg(res, 404, false, msg, null);
        } else {
          var expTime = 60 * 60; // expires in 1 hour "seconds X Minutes"
          // Create object for teh token
          var info = {
            sub: user.username,
            jti: user._id
          };
          // if user is found and password is right
          // create a token
          var token = jwt.sign(info, req.app.get('superSecret'), {
            expiresIn: expTime,
            issuer: 'MangaDB by Rafase282'
          });
          // return the information including token as JSON
          var msg = 'Log in succesfull, ' + req.body.username +
            'enjoy your session for the next ' + expTime / 60 + ' minutes!';
          dbHelper.resMsg(res, 200, true, msg, token);
        }
      });
    }
  });
};

/* Validates JWT For Authentication
 * Returns result code and standard information
 * containing error messages when it fails.
 * or it sets the decoded jwt and continues to the next operation.
 */
exports.validateToken = function (req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.headers['x-access-token'];

  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, req.app.get('superSecret'), function (err, decoded) {
      if (err) {
        var msg = 'Failed to authenticate token.';
        dbHelper.resMsg(res, 404, false, msg, null);
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });
  } else {
    // if there is no token
    // return an error
    var msg = 'No token provided.';
    dbHelper.resMsg(res, 403, false, msg, null);
  }
};