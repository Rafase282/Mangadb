// Load required packages
var User = require('../models/user');
var dbHelper = require('./dbHelper');

/* Creates A New User
 * It first checks for a real email address
 * then it generates the user object to be saved.
 */
exports.postUsers = function (req, res) {
  // Make sure that it has a valid email adress.
  var quickemailverification = require('quickemailverification')
    .client(process.env.EV_KEY).quickemailverification();

  var email = req.body.email;

  quickemailverification.verify(email, function (err, response) {
    if (err) {
      dbHelper.resMsg(res, 400, false, err, null);
    } else {
      // Print response object
      if (response.body.result === 'valid') {
        // It is a valid e-mail.
        var user = new User({
          username: req.body.username,
          password: req.body.password,
          email: email,
          firstname: req.body.firstname,
          lastname: req.body.lastname
        });
        var msg = 'New manga reader ' + req.body.username + ' has been added.';
        dbHelper.objSave(user, res, msg);
      } else {
        var msg = 'Invalid E-Mail.';
        dbHelper.resMsg(res, 400, false, msg, null);
      }
    }
  });
};

/* Finds All Users
 * Returns a list of all users when found.
 * Accessed at GET /api/users
 */
exports.getUsers = function (req, res) {
  var ok = 'The list of users has been succesfully generated.';
  var noOk = 'No users has been created yet.';
  var auth = 'You are not an admin.';
  var obj = {};

  dbHelper.getData(req, res, User, obj, ok, noOk, auth);
};

/* Finds User By Username
 * Returns the user information with a hashd password.
 * Accessed at GET /api/users/:username
 */
exports.getUser = function (req, res) {
  var ok = req.params.username + ' found!';
  var noOk = req.params.username + ' not found.';
  var auth = 'You are not ' + req.params.username.toLowerCase() +
    ' or an admin!';
  var obj = {
    username: req.params.username.toLowerCase()
  };

  dbHelper.getData(req, res, User, obj, ok, noOk, auth);
};

/* Deletes User By Username
 * Returns the message along with database output.
 * Accessed at DELETE /api/users/:username
 */
exports.delUser = function (req, res) {
  var noOk = 'Could not find ' + req.params.username;
  var ok = 'Successfully deleted ' + req.params.username;
  var auth = 'You are not ' + req.params.username.toLowerCase() +
    ' or an admin!';
  var obj = {
    username: req.params.username.toLowerCase()
  };

  dbHelper.delData(req, res, User, obj, ok, noOk, auth);
};

/* Deletes All Users Except The Admin
 * Returns the message along with database output.
 * Accessed at DELETE /api/users
 */
exports.delUsers = function (req, res) {
  var noOk = 'There are no users to delete besides the admin account.';
  var ok = 'Successfully deleted all users but the admin.';
  var auth = 'You are not an admin!';
  var obj = {
    username: {
      $ne: process.env.ADMIN.toLowerCase()
    }
  };

  dbHelper.delData(req, res, User, obj, ok, noOk, auth);
};

/* Updates User By Username
 * Returns the message along with database output.
 * Accessed at PUT /api/users/:username
 */
exports.putUser = function (req, res) {
  // use our user model to find the user we want
  if (req.decoded.sub === process.env.ADMIN ||
    req.decoded.sub === req.params.username.toLowerCase()) {
    User.findOne({
      username: req.params.username.toLowerCase()
    }, function (err, user) {
      if (err) {
        dbHelper.resMsg(res, 400, false, err, null);
      } else {
        user.username = req.params.username || user.username;
        user.password = req.body.password || user.password;
        user.email = req.body.email || user.email;
        user.firstname = req.body.firstname || user.firstname;
        user.lastname = req.body.lastname || user.lastname;
        // update the user
        var msg = req.params.username + ' information has been updated.';
        dbHelper.objSave(user, res, msg);
      }
    });
  } else {
    var msg = 'You are not ' + req.params.username.toLowerCase() +
      ' or an admin!';
    dbHelper.resMsg(res, 403, false, msg, null);
  }
};
