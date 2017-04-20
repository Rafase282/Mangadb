'use strict';
const User = require('../models/user');
const dbHelper = require('./dbHelper');
const jwt = require('jsonwebtoken');
/**
  * Generates JWT For User
  * Returns result code and standard information
  * Accessed at POST /api/v#/auth
  * @param {Object} req
  * @param {Object} res
  * @param {Null}
**/
exports.generateToken = (req, res) => {
  // find the user
  const username = req.body.username.toLowerCase();
  User.findOne({
    username
  }, (err, user) => {
    if (err) {
      dbHelper.resMsg(res, 400, false, err, null);
    }
    if (!user) {
      const msg = `Authentication failed. ${username} not found.`;
      dbHelper.resMsg(res, 404, false, msg, null);
    } else if (user) {
      // check if password matches
      user.verifyPassword(req.body.password, (err, isMatch) => {
        if (err) {
          dbHelper.resMsg(res, 400, false, err, null);
        }
        if (!isMatch) {
          const msg = 'Authentication failed. Wrong password.';
          dbHelper.resMsg(res, 404, false, msg, null);
        } else {
          const expTime = 60 * 60; // expires in 1 hour "seconds X Minutes"
          // Create object for the token
          const info = {
            sub: user.username,
            jti: user._id,
            email: user.email
          };
          // if user is found and password is right
          // create a token
          const token = jwt.sign(info, req.app.get('superSecret'), {
            expiresIn: expTime,
            issuer: 'MangaDB by Rafase282'
          });
          // return the information including token as JSON
          const msg = `Log in successfull, ${req.body.username} ` +
          `enjoy your session for the next ${expTime / 60} minutes!`;
          dbHelper.resMsg(res, 200, true, msg, token);
        }
      });
    }
  });
};
/**
  * Validates JWT For Authentication
  * Returns result code and standard information
  * containing error messages when it fails.
  * or it sets the decoded JWT and continues to the next operation.
  * @param {Object} req
  * @param {Object} res
  * @param {Function} next
  * @param {Null}
**/
exports.validateToken = (req, res, next) => {
  // check header or url parameters or post parameters for token
  const token = req.headers['x-access-token'];

  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, req.app.get('superSecret'), (err, decoded) => {
      if (err) {
        const msg = 'Failed to authenticate token.';
        dbHelper.resMsg(res, 404, false, msg, null);
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        return next();
      }
    });
  } else {
    // if there is no token, return an error
    const msg = 'No token provided.';
    dbHelper.resMsg(res, 403, false, msg, null);
  }
};
