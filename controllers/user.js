// Load required packages
var User = require('../models/user');
var dbHelper = require('./dbHelper');

// Create new user
exports.postUsers = function (req, res) {
  // Make sure that it has a valid email adress.
  var quickemailverification = require('quickemailverification')
    .client(process.env.EV_KEY).quickemailverification();
  var email = req.body.email;
  quickemailverification.verify(email, function (err, response) {
    if (err) {
      res.json({
        success: false,
        message: err,
        data: null
      });
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
        res.json({
          success: false,
          message: 'Invalid E-Mail.',
          data: null
        });
      }
    }
  });
};

// FIND ALL USERS
// Create endpoint /api/users for GET
exports.getUsers = function (req, res) {
  if (req.decoded.sub === process.env.ADMIN) {
    User.find(function (err, users) {
      if (err) {
        res.status(400).json({
          success: false,
          message: err,
          data: null
        });
      }
      if (users === null || users.length < 1) {
        res.status(404).json({
          success: false,
          message: 'No users has been created yet.',
          data: null
        })
      } else {
        res.json({
          success: true,
          message: 'The list of users has been succesfully generated.',
          data: users
        })
      }
    });
  } else {
    res.json({
      success: false,
      message: 'You are not an admin.',
      data: null
    });
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
        res.status(400).json({
          success: false,
          message: err,
          data: null
        });
      }
      if (users === null || users.length < 1) {
        res.status(404).json({
          success: false,
          message: req.params.username + ' not found.',
          data: null
        })
      } else {
        res.json({
          success: true,
          message: req.params.username + ' found!',
          data: user
        })
      }
    });
  } else {
    res.json({
      success: false,
      message: 'You are not ' + req.params.username + ' or an admin!',
      data: null
    });
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
        res.status(400).json({
          success: false,
          message: err,
          data: null
        });
      }
      if (user.result.n === 0) {
        res.status(404).json({
          success: false,
          message: 'Could not find ' + req.params.username,
          data: null
        })
      } else {
        res.json({
          success: true,
          message: 'Successfully deleted ' + req.params.username,
          data: user
        })
      }
    });
  } else {
    res.json({
      success: false,
      message: 'You are not ' + req.params.username + ' or an admin!',
      data: null
    });
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
        res.status(400).json({
          success: false,
          message: err,
          data: null
        });
      }
      if (user.result.n === 0) {
        res.status(404).json({
          success: false,
          message: 'There are no users to delete besides the admin account.',
          data: null
        })
      } else {
        res.json({
          success: true,
          message: 'Successfully deleted all users but the admin.',
          data: user
        })
      }
    });
  } else {
    res.json({
      success: false,
      message: 'You are not ' + req.params.username + ' or an admin!',
      data: null
    });
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
