// Load required packages
var User = require('../models/user');
var dbHelper = require('./dbHelper');

// Create endpoint /api/users for POST
exports.postUsers = function(req, res) {
  var user = new User({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    name: req.body.name,
    lastname: req.body.lastname
  });

  var msg = 'New manga reader ' + req.body.username + ' has been added.';
  var errMsg = 'Error creating user ' + req.body.username;
  dbHelper.objSave(user, res, msg, errMsg);
};

// FIND ALL USERS
// Create endpoint /api/users for GET
exports.getUsers = function(req, res) {
  if (req.user.username === 'rafase282') {
    User.find(function(err, users) {
      var ok = 'List of users succesfully generated';
      var notOk = 'No users found';
      if (err) {
        res.status(404).json({
          error: notOk
        });
        console.log(notOk);
      } else {
        console.log(ok);
        res.json(users);
      }
    });
  } else {
    res.json({
      error: "You are not an admin!"
    });
  }
};

// FIND USER BY USERNAME
// Get the user (accessed at GET https://mangadb-r282.herokuapp.com/api/users/:username)
exports.getUser = function(req, res) {
  if (req.user.username === 'rafase282' || req.user.username === req.params.username) {
    User.findOne({
      username: req.params.username
    }, function(err, user) {
      var ok = req.params.username + ' found!';
      var notOk = req.params.username + ' not found.';
      if (err) {
        res.status(404).json({
          error: notOk
        });
        console.log(notOk);
      } else {
        console.log(ok);
        res.json(user);
      }
    });
  } else {
    res.json({
      error: 'You are not ' + req.params.username + ' or an admin!'
    });
  }
};

// DELETE USER BY USERNAME
// Delete the user with this title (accessed at DELETE https://mangadb-r282.herokuapp.com/api/users/:username)
exports.delUser = function(req, res) {
  if (req.user.username === 'rafase282' || req.user.username === req.params.username) {
    User.remove({
      username: req.params.username
    }, function(err, user) {
      var ok = 'Successfully deleted ' + req.params.username;
      var notOk = 'Could not find ' + req.params.username;
      if (err) {
        res.status(404).json({
          error: notOk
        });
        console.log(notOk);
      } else {
        console.log(ok);
        res.json({
          message: ok
        });
      }
    });
  } else {
    res.json({
      error: 'You are not ' + req.params.username + ' or an admin!'
    });
  }
};

// UPDATE USER BY USERNAME
// Update the user by username (accessed at PUT https://mangadb-r282.herokuapp.com/api/users/:username)
exports.putUser = function(req, res) {
  // use our user model to find the user we want
  if (req.user.username === 'rafase282' || req.user.username === req.params.username) {
    User.findOne({
      username: req.params.username
    }, function(err, user) {
      if (err) {
        var notOk = req.params.username + ' not found.';
        res.status(404).json({
          error: notOk
        });
        console.log(notOk);
      } else {
        user.username = req.params.username || user.username;
        user.password = req.body.password || user.password;
        user.email = req.body.email || user.email;
        user.name = req.body.name || user.name;
        user.lastname = req.body.lastname || user.lastname;
        // update the user
        var msg = req.params.username + ' user updated.';
        var errMsg = 'All fields are required for creating new user, the title is required for updating though.';
        dbHelper.objSave(user, res, msg, errMsg);
      }
    });
  } else {
    res.json({
      error: 'You are not ' + req.params.username + ' or an admin!'
    });
  }
};