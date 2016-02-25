// Load required packages
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var User = require('../models/user');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

passport.use(new BasicStrategy(
  function(username, password, callback) {
    User.findOne({
      username: username
    }, function(err, user) {
      if (err) {
        return callback(err);
      }
      // No user found with that username
      if (!user) {
        return callback(null, false);
      }
      // Make sure the password is correct
      user.verifyPassword(password, function(err, isMatch) {
        if (err) {
          return callback(err);
        }
        // Password did not match
        if (!isMatch) {
          return callback(null, false);
        }
        // Success
        return callback(null, user);
      });
    });
  }
));

exports.isAuthenticated = passport.authenticate('basic', {
  session: false
});

exports.generateToken = function(req, res) {
  // find the user
  User.findOne({
    username: req.body.username
  }, function(err, user) {
    if (err) throw err;
    if (!user) {
      res.json({
        success: false,
        message: 'Authentication failed. User not found.'
      });
    } else if (user) {
      // check if password matches
      user.verifyPassword(req.body.password, function(err, isMatch) {
        if (err) throw err;
        if (!isMatch) {
          res.json({
            success: false,
            message: 'Authentication failed. Wrong password.'
          });
        } else {
          // Hide real password
          user.password = "You don't need to know!";
          // if user is found and password is right
          // create a token
          var token = jwt.sign(user, req.app.get('superSecret'), {
            expiresIn: 60 * 60 // expires in 1 hour "seconds X Minutes"
          });
          // return the information including token as JSON
          res.json({
            success: true,
            message: 'Enjoy your token!',
            token: token
          });
        }
      });
    }
  });
};

exports.validateToken = function(req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, req.app.get('superSecret'), function(err, decoded) {
      if (err) {
        return res.json({
          success: false,
          message: 'Failed to authenticate token.'
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
      message: 'No token provided.'
    });
  }
};