// Load required packages
var User = require('../models/user');
var dbHelper = require('./dbHelper');

// Create endpoint /api/users for POST
exports.postUsers = function(req, res) {
  var user = new User({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    firstname: req.body.firstname,
    lastname: req.body.lastname
  });

  var msg = 'New manga reader ' + req.body.username + ' has been added.';
  dbHelper.objSave(user, res, msg);
};

// FIND ALL USERS
// Create endpoint /api/users for GET
exports.getUsers = function(req, res) {
  if (req.decoded.sub === process.env.ADMIN) {
    User.find(function(err, users) {
      var ok = 'List of users succesfully generated.';
      var noOK = 'No users has been created yet.';
      if (err) {
        res.status(400).json({
          error: err
        });
        console.log(err);
      } else {
        var out = users == null || users.length < 1 ? {msg: noOK, info: {message: noOK}} : {msg: ok, info: users};
        console.log(out.msg);
        res.json(out.info);
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
  if (req.decoded.sub === process.env.ADMIN || req.decoded.sub === req.params.username) {
    User.findOne({
      username: req.params.username
    }, function(err, user) {
      var ok = req.params.username + ' found!';
      var noOK = req.params.username + ' not found.';
      if (err) {
        res.status(400).json({
          error: err
        });
        console.log(err);
      } else {
        var out = user == null ? {msg: noOK, info: {message: noOK}} : {msg: ok, info: user};
        console.log(out.msg);
        res.json(out.info);
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
  if (req.decoded.sub === process.env.ADMIN || req.decoded.sub === req.params.username) {
    User.remove({
      username: req.params.username
    }, function(err, user) {
      var ok = 'Successfully deleted ' + req.params.username;
      var noOK = 'Could not find ' + req.params.username;
      if (err) {
        res.status(400).json({
          error: err
        });
        console.log(err);
      } else {
        var msg = user == null ? noOK : ok;
        console.log(msg);
        res.json({message: msg});
      }
    });
  } else {
    res.json({
      error: 'You are not ' + req.params.username + ' or an admin!'
    });
  }
};

// DELETE ALL USER VIA ADMIN
// Delete all users via admin rights (accessed at DELETE https://mangadb-r282.herokuapp.com/api/users)
exports.delUsers = function(req, res) {
  if (req.decoded.sub === process.env.ADMIN) {
    User.remove({}, function(err, user) {
      var ok = 'Successfully deleted all users, remember to create admin again.';
      var noOK = 'Could not delete users.';
      if (err) {
        res.status(400).json({
          error: err
        });
        console.log(err);
      } else {
        var msg = user == null ? noOK : ok;
        console.log(msg);
        res.json({message: msg});
      }
    });
  } else {
    res.json({
      error: 'You are not an admin!'
    });
  }
};

// UPDATE USER BY USERNAME
// Update the user by username (accessed at PUT https://mangadb-r282.herokuapp.com/api/users/:username)
exports.putUser = function(req, res) {
  // use our user model to find the user we want
  if (req.decoded.sub === process.env.ADMIN || req.decoded.sub === req.params.username) {
    User.findOne({
      username: req.params.username
    }, function(err, user) {
      if (err) {
        res.status(400).json({
          error: err
        });
        console.log(err);
      } else {
        user.username = req.params.username || user.username;
        user.password = req.body.password || user.password;
        user.email = req.body.email || user.email;
        user.firstname = req.body.firstname || user.firstname;
        user.lastname = req.body.lastname || user.lastname;
        // update the user
        var msg = req.params.username + ' user updated.';
        dbHelper.objSave(user, res, msg);
      }
    });
  } else {
    res.json({
      error: 'You are not ' + req.params.username + ' or an admin!'
    });
  }
};