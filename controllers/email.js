var User = require('../models/user');
var bcrypt = require('bcrypt-nodejs');
var nev = require('email-verification')(require('mongoose'));

// sync version of hashing function
var myHasher = function(password, tempUserData, insertTempUser, callback) {
  var hash = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  return insertTempUser(hash, tempUserData, callback);
};

// async version of hashing function
myHasher = function(password, tempUserData, insertTempUser, callback) {
  bcrypt.genSalt(8, function(err, salt) {
    if (err) console.log(err);
    bcrypt.hash(password, salt, function(err, hash) {
      if (err) console.log(err);
      return insertTempUser(hash, tempUserData, callback);
    });
  });
};

// HANDLE EMAIL VALIDATION
exports.confEmailValidation = function() {

  // NEV configuration =====================
  nev.configure({
    persistentUserModel: User,
    expirationTime: 86400, // 24 hours

    verificationURL: process.env.APP_URL + '/api/email-verification/${URL}',
    transportOptions: {
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PWD
      }
    },

    hashingFunction: myHasher,
    passwordFieldName: 'password',
  }, function(err, options) {
    if (err) {
      console.log(err);
      return;
    }

    console.log('configured: ' + (typeof options === 'object'));
  });

  nev.generateTempUserModel(User, function(err, tempUserModel) {
    if (err) {
      console.log(err);
      return;
    }

    console.log('generated temp user model: ' + (typeof tempUserModel === 'function'));
  });
};

// HANDLE EMAIL verification
exports.verify = function(req, res) {
  var url = req.params.URL;

  nev.confirmTempUser(url, function(err, user) {
    if (err) {
      console.log(err);
      return;
    }
    if (user) {
      nev.sendConfirmationEmail(user.email, function(err, info) {
        if (err) {
          return res.status(404).send('ERROR: sending confirmation email FAILED');
        }
        res.json({
          msg: 'CONFIRMED!',
          info: info
        });
      });
    } else {
      return res.status(404).send('ERROR: confirming temp user FAILED');
    }
  });
};
