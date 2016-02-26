// Load required packages  USER
var nodemailer = require('nodemailer');
var async = require('async');
var crypto = require('crypto');
var User = require('../models/user');
var dbHelper = require('./dbHelper');
var emailRegEx = /^[a-zA-Z]([a-zA-Z0-9_\-])+([\.][a-zA-Z0-9_]+)*\@((([a-zA-Z0-9\-])+\.){1,2})([a-zA-Z0-9]{2,40})$/gi;

// Create new user
exports.postUsers = function(req, res) {
  // Make sure that it has a valid email adress.
  var email = req.body.email;
  if (emailRegEx.test(email)) {
    
    // It is a valid e-mail, generate the new user object
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

// ISSUE RESET PASSWORD TOKEN
exports.postForgotPWD = function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({
        email: req.body.email
      }, function(err, user) {
        if (err) {
          res.status(400).json({
            error: err
          });
        }
        if (!user) {
          console.log('No account with that email address exists.');
          return res.redirect('/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport('SMTP', {
        service: 'SendGrid',
        auth: {
          api_user: process.env.EMAIL,
          api_key: process.env.PWD
        }
      });
      var mailOptions = {
        from: 'passwordreset@demo.com',
        to: user.email,
        subject: 'Node.js Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n',
        html: '<b>Hello world</b>'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        if (err) {
          console.log('Error occurred');
          console.log(err.message);
          return;
        }
        console.log('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/forgot');
  });
};

// CHECK IS PASSWORD RESET TOKEN WAS ISSUED
exports.findPWDresetToken = function(req, res) {
  User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: {
      $gt: Date.now()
    }
  }, function(err, user) {
    if (err) {
      res.status(400).json({
        error: err
      });
    }
    if (!user) {
      console.log('Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    res.render('reset', {
      user: req.user
    });
  });
};

// RESET THE PASSWORD
exports.resetPWD = function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: {
          $gt: Date.now()
        }
      }, function(err, user) {
        if (err) {
          res.status(400).json({
            error: err
          });
        }
        if (!user) {
          console.log('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }
        
        // Set new password
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        
        // Save changes
        user.save(function(err) {
          if (err) {
            res.status(400).json({
              error: err
            });
          }
          req.logIn(user, function(err) {
            done(err, user);
          });
        });
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport('SMTP', {
        service: 'SendGrid',
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PWD
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'passwordreset@demo.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        console.log('success', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], function(err) {
    res.status(400).json({
      error: err
    });
  });
};