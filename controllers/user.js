// Load required packages
var User = require('../models/user');
var dbHelper = require('./dbHelper');
var emailRegEx = /^[a-zA-Z]([a-zA-Z0-9_\-])+([\.][a-zA-Z0-9_]+)*\@((([a-zA-Z0-9\-])+\.){1,2})([a-zA-Z0-9]{2,40})$/gi;
var nev = require('email-verification')(require('mongoose'));

// Create new user
exports.postUsers = function(req, res) {
  // Make sure that it has a valid email adress.
  var email = req.body.email;
  if (emailRegEx.test(email)) {
    // It is a valid e-mail.
    var user = new User({
      username: req.body.username,
      password: req.body.password,
      email: email,
      firstname: req.body.firstname,
      lastname: req.body.lastname
    });

    //if (req.body.type === 'register') {
    nev.createTempUser(user, function(err, existingPersistentUser, newTempUser) {
      if (err) {
        return res.status(404).send('ERROR: creating temp user FAILED');
      }

      // user already exists in persistent collection
      if (existingPersistentUser) {
        return res.json({
          msg: 'You have already signed up and confirmed your account. Did you forget your password?'
        });
      }

      // new user created
      if (newTempUser) {
        var URL = newTempUser[nev.options.URLFieldName];

        nev.sendVerificationEmail(email, URL, function(err, info) {
          if (err) {
            return res.status(404).send('ERROR: sending verification email FAILED');
          }
          res.json({
            msg: 'An email has been sent to you. Please check it to verify your account.',
            info: info
          });
        });

        // user already exists in temporary collection!
      } else {
        res.json({
          msg: 'You have already signed up. Please check your email to verify your account.'
        });
      }
    });
    /*
              // resend verification button was clicked
            } else {
              nev.resendVerificationEmail(email, function(err, userFound) {
                if (err) {
                  return res.status(404).send('ERROR: resending verification email FAILED');
                }
                if (userFound) {
                  res.json({
                    msg: 'An email has been sent to you, yet again. Please check it to verify your account.'
                  });
                } else {
                  res.json({
                    msg: 'Your verification code has expired. Please sign up again.'
                  });
                }
              });
            }
    */


    var msg = 'New manga reader ' + req.body.username + ' has been added.';
    dbHelper.objSave(user, res, msg);
  } else {
    res.json({
      err: 'Invalid E-mail'
    });
  }
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
        var out = users == null || users.length < 1 ? {
          msg: noOK,
          info: {
            message: noOK
          }
        } : {
          msg: ok,
          info: users
        };
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
        var out = user == null ? {
          msg: noOK,
          info: {
            message: noOK
          }
        } : {
          msg: ok,
          info: user
        };
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
        res.json({
          message: msg
        });
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
        res.json({
          message: msg
        });
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
