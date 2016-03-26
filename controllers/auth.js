// Load required packages
var User = require('../models/user');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

// GENERATE TOKEN FOR THE USER.
exports.generateToken = function (req, res) {
  // find the user
  User.findOne({
    username: req.body.username
  }, function (err, user) {
    if (err) {
      res.status(400).json({
        success: false,
        message: err,
        data: null
      });
    }
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'Authentication failed. User not found.',
        data: null
      });
    } else if (user) {
      // check if password matches
      user.verifyPassword(req.body.password, function (err, isMatch) {
        if (err) {
          res.status(400).json({
            success: false,
            message: err,
            data: null
          });
        }
        if (!isMatch) {
          res.status(404).json({
            success: false,
            message: 'Authentication failed. Wrong password.',
            data: null
          });
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
          res.status(200).json({
            success: true,
            message: 'Log in succesfull, enjoy your session for the next ' + expTime / 60 + ' minutes!',
            data: token
          });
        }
      });
    }
  });
};

// VALIDATE TOKEN FOR AUTHENTICATION
exports.validateToken = function (req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.headers['x-access-token'];

  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, req.app.get('superSecret'), function (err, decoded) {
      if (err) {
        return res.status(400).json({
          success: false,
          message: 'Failed to authenticate token.',
          data: null
        });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });
  } else {
    // if there is no token
    // return an error
    return res.status(403).send({
      success: false,
      message: 'No token provided.',
      data: null
    });
  }
};