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
 * Returns a list of all usrs when found.
 * returns standard result object acordingly.
 */
exports.getUsers = function (req, res) {
  if (req.decoded.sub === process.env.ADMIN) {
    User.find(function (err, users) {
      if (err) {
        dbHelper.resMsg(res, 400, false, err, null);
      }
      if (users === null || users.length < 1) {
        var msg = 'No users has been created yet.';
        dbHelper.resMsg(res, 404, false, msg, null);
      } else {
        var msg = 'The list of users has been succesfully generated.';
        dbHelper.resMsg(res, 200, true, msg, users);
      }
    });
  } else {
    var msg = 'You are not an admin.';
    dbHelper.resMsg(res, 403, false, msg, null);
  }
};

// FIND USER BY USERNAME
// Get the user (accessed at GET https://mangadb-r282.herokuapp.com/api/users/:username)
exports.getUser = function (req, res) {
  if (req.decoded.sub === process.env.ADMIN ||
    req.decoded.sub === req.params.username) {
    User.findOne({
      username: req.params.username
    }, function (err, user) {
      if (err) {
        dbHelper.resMsg(res, 400, false, err, null);
      }
      if (users === null || users.length < 1) {
        var msg = req.params.username + ' not found.';
        dbHelper.resMsg(res, 404, false, msg, null);
      } else {
        var msg = req.params.username + ' found!';
        dbHelper.resMsg(res, 200, true, msg, user);
      }
    });
  } else {
    var msg = 'You are not ' + req.params.username + ' or an admin!';
    dbHelper.resMsg(res, 403, false, msg, null);
  }
};

// DELETE USER BY USERNAME
// Delete the user with this title (accessed at DELETE https://mangadb-r282.herokuapp.com/api/users/:username)
exports.delUser = function (req, res) {
  if (req.decoded.sub === process.env.ADMIN ||
    req.decoded.sub === req.params.username) {
    User.remove({
      username: req.params.username
    }, function (err, user) {
      if (err) {
        dbHelper.resMsg(res, 400, false, err, null);
      }
      if (user.result.n === 0) {
        var msg = 'Could not find ' + req.params.username;
        dbHelper.resMsg(res, 404, false, msg, null);
      } else {
        var msg = 'Successfully deleted ' + req.params.username;
        dbHelper.resMsg(res, 200, true, msg, user);
      }
    });
  } else {
    var msg = 'You are not ' + req.params.username + ' or an admin!';
    dbHelper.resMsg(res, 403, false, msg, null);
  }
};

// DELETE ALL USER VIA ADMIN
// Delete all users via admin rights 
// (accessed at DELETE https://mangadb-r282.herokuapp.com/api/users)
exports.delUsers = function (req, res) {
  if (req.decoded.sub === process.env.ADMIN) {
    User.remove({
      username: {
        $ne: process.env.ADMIN
      }
    }, function (err, user) {
      if (err) {
        dbHelper.resMsg(res, 400, false, err, null);
      }
      if (user.result.n === 0) {
        var msg = 'There are no users to delete besides the admin account.';
        dbHelper.resMsg(res, 404, false, msg, null);
      } else {
        var msg = 'Successfully deleted all users but the admin.';
        dbHelper.resMsg(res, 200, true, msg, user);
      }
    });
  } else {
    var msg = 'You are not ' + req.params.username + ' or an admin!';
    dbHelper.resMsg(res, 403, false, msg, null);
  }
};

// UPDATE USER BY USERNAME
// Update the user by username (accessed at PUT https://mangadb-r282.herokuapp.com/api/users/:username)
exports.putUser = function (req, res) {
  // use our user model to find the user we want
  if (req.decoded.sub === process.env.ADMIN ||
    req.decoded.sub === req.params.username) {
    User.findOne({
      username: req.params.username
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
    var msg = 'You are not ' + req.params.username + ' or an admin!';
    dbHelper.resMsg(res, 403, false, msg, null);
  }
};
