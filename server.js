/*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
// server.js
'use strict';

// BASE SETUP
// =============================================================================

// call the packages we need
var express = require('express'); // call express
var app = express(); // define our app using express
var bodyParser = require('body-parser');
var path = require('path');
var mongoose = require('mongoose');
var authController = require('./controllers/auth');
var mangaController = require('./controllers/manga');
var userController = require('./controllers/user');
require('dotenv').config({
  silent: true
});

// Connect to the database
var mongouri = process.env.MONGOLAB_URI ||
  'mongodb://' + process.env.IP + ':27017/mangadb';
mongoose.connect(mongouri);

app.set('superSecret', process.env.SECRET); // secret variable

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// REGISTER OUR ROUTES -------------------------------
var router = express.Router(); // get an instance of the express Router
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'x-access-token');
  next();
});

// all of our routes will be prefixed with /api
app.use('/api/' + process.env.API_VERSION, router);

// Serve index.pug at ttps://mangadb-r282.herokuapp.com
app.route('/')
  .get(mangaController.getIndex);

// test route to make sure everything is working
//(accessed at GET https://mangadb-r282.herokuapp.com/api)
router.route('/')
  .get(mangaController.getWelcome);

//Create endpoint handlers for /mangas/:user/:manga_tile
router.route('/mangas/:username/:manga_title')
  // get user's manga info
  .get(authController.validateToken, mangaController.getManga)
  // update user's manga info
  .put(authController.validateToken, mangaController.putManga)
  // deletes user's manga
  .delete(authController.validateToken, mangaController.delManga);

// Create endpoint handlers for /mangas/:username
router.route('/mangas/:username')
  //get all user's manga
  .get(authController.validateToken, mangaController.getMangas)
  //create new manga
  .post(authController.validateToken, mangaController.postManga)
  // Deletes all user mangas
  .delete(authController.validateToken, mangaController.delUserMangas);

// Get all mangas by admin
router.route('/mangas')
  //admin get all mangas
  .get(authController.validateToken, mangaController.getAllMangas)
  // admin delete all mangas
  .delete(authController.validateToken, mangaController.delMangas);

// HANDLE USER RELATED ROUTES
// =============================================================================

// Request token generator at /mangas/auth
router.route('/auth')
  .post(authController.generateToken); //Get token

// Create endpoint handlers for /users
router.route('/users')
  // Creates new user
  .post(userController.postUsers)
  //admin get all users
  .get(authController.validateToken, userController.getUsers)
  //admin delete all users
  .delete(authController.validateToken, userController.delUsers);

//Create endpoint handlers for /mangas/:username
router.route('/users/:username')
  // get user info
  .get(authController.validateToken, userController.getUser)
  // update user info
  .put(authController.validateToken, userController.putUser)
  // deletes user
  .delete(authController.validateToken, userController.delUser);

// CONFIGURE & START THE SERVER
// =============================================================================
var port = process.env.PORT || 8080; // set our port
app.listen(port, function () {
  console.log('Node.js listening on port ' + port);
});
