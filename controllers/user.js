'use strict';
// Load required packages
const User = require('../models/user');
const dbHelper = require('./dbHelper');
const sendMail = require('../utils/mailModule').sendMailNewUser;
require('dotenv').config({silent: true});
const checkEmail = require('quickemailverification')
  .client(process.env.EV_KEY).quickemailverification();

//Gloabls
const auth = 'You do not have the right permission for this action.';
/**
  * Creates a new user.
  * First validates the email via external package.
  * Then generates user object to be saved.
  * @param {Object} req
  * @param {Object} res
  * @param {Null}
**/
exports.postUsers = (req, res) => {
  // Make sure that it has a valid email adress.
  const email = req.body.email;
  checkEmail.verify(email, (err, response) => {
    if (err) {
      const msg = 'Daily e-mail verification limit reached.';
      dbHelper.resMsg(res, err.code, false, msg, null);
    } else {
      // Print response object
      if (response.body.result === 'valid') {
        // It is a valid e-mail.
        const user = new User({
          username: req.body.username,
          password: req.body.password,
          email,
          firstname: req.body.firstname,
          lastname: req.body.lastname
        });
        const msg = `New manga reader ${req.body.username} has been added.`;

        // sendMail(username, email, (err, msg) => {
        //   if(err) throw new Error(msg);
        //
        //   else dbHelper.objSave(user, res, msg);
        // });
        const emailCallback = (err, msg) => {
          if(err) throw new Error(msg);

          // else, do something.... Check this part out

        }


        dbHelper.objSave(user, (results) => {
          const success = results.status === 200;
          const msg = results.err ? result.err : msg;
          const data = results.err ? null : user;

          res.status(results.status).json({
            success,
            msg,
            data
          });

          sendMail(userName, email, emailCallback);

        });

        // dbHelper.objSave(user, res, msg);


      } else {
        const msg = 'Invalid E-Mail.';
        dbHelper.resMsg(res, 400, false, msg, null);
      }
    }
  });
};
/**
  * Finds All Users
  * Returns a list of all users when found.
  * Accessed at GET /api/v#/users
  * @param {Object} req
  * @param {Object} res
  * @param {Null}
**/
exports.getUsers = (req, res) => {
  const ok = 'The list of users has been succesfully generated.';
  const noOk = 'No users has been created yet.';
  dbHelper.getData(req, res, User, {}, ok, noOk, auth);
};
/**
  * Finds User By Username
  * Returns the user information with a hashd password.
  * Accessed at GET /api/users/:username
  * @param {Object} req
  * @param {Object} res
  * @param {Null}
**/
exports.getUser = (req, res) => {
  const username = req.params.username.toLowerCase();
  const ok = `${username} found!`;
  const noOk = `${username}  not found.`;
  const obj = {username};
  dbHelper.getData(req, res, User, obj, ok, noOk, auth);
};
/**
  * Deletes User By Username
  * Returns the message along with database output.
  * Accessed at DELETE /api/v#/users/:username
  * @param {Object} req
  * @param {Object} res
  * @param {Null}
**/
exports.delUser = (req, res) => {
  const username = req.params.username.toLowerCase();
  const noOk = `Could not find ${username}`;
  const ok = `Successfully deleted ${username}`;
  const obj = {username};
  dbHelper.delData(req, res, User, obj, ok, noOk, auth);
};
/**
  * Deletes All Users Except The Admin
  * Returns the message along with database output.
  * Accessed at DELETE /api/v#/users
  * @param {Object} req
  * @param {Object} res
  * @param {Null}
**/
exports.delUsers = (req, res) => {
 const noOk = 'There are no users to delete besides the admin account.';
 const ok = 'Successfully deleted all users but the admin.';
 const obj = {username: {$ne: process.env.ADMIN.toLowerCase()}};
 dbHelper.delData(req, res, User, obj, ok, noOk, auth);
};
/**
  * Updates User By Username
  * Returns the message along with database output.
  * Accessed at PUT /api/v#/users/:username
  * @param {Object} req
  * @param {Object} res
  * @param {Null}
**/
exports.putUser = (req, res) => {
  // use our user model to find the user we want
  const username = req.params.username.toLowerCase();
  if (req.decoded.sub === process.env.ADMIN ||
    req.decoded.sub === username) {
    User.findOne({
      username
    }, (err, user) => {
      if (err) {
        dbHelper.resMsg(res, 400, false, err, null);
      } else {
        user.username = username || user.username;
        user.password = req.body.password || user.password;
        user.email = req.body.email || user.email;
        user.firstname = req.body.firstname || user.firstname;
        user.lastname = req.body.lastname || user.lastname;
        const msg = `${username} information has been updated.`;
        // dbHelper.objSave(user, res, msg);

        dbHelper.objSave(user, (results) => {
          const success = results.status === 200;
          const msg = results.err ? result.err : msg;
          const data = results.err ? null : user;

          res.status(results.status).json({
            success,
            msg,
            data
          });
        });
      }
    });
  } else {
    dbHelper.resMsg(res, 403, false, auth, null);
  }
};
