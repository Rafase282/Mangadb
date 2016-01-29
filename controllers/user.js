// Load required packages
var User = require('../models/user');

// Create endpoint /api/users for POST
exports.postUsers = function(req, res) {
  var user = new User({
    username: req.body.username,
    password: req.body.password
  });

  user.save(function(err) {
    var ok = 'New manga reader ' + req.body.username + ' has been added.';
    var notOk = 'Error creating user ' + req.body.username;
    if (err) {
      res.status(404).json({
        error: notOk
      });
      console.log(notOk);
    } else {
      console.log(ok);
      res.json({ message: ok });
    }
  });
};

// Create endpoint /api/users for GET
exports.getUsers = function(req, res) {
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
};