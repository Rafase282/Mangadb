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
  "mongodb://" + process.env.IP + ":27017/mangadb";
mongoose.connect(mongouri);

app.set('superSecret', process.env.SECRET); // secret variable

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// configure the view
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// REGISTER OUR ROUTES -------------------------------
var router = express.Router(); // get an instance of the express Router
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header("Access-Control-Allow-Headers", "x-access-token");
  next();
});

// all of our routes will be prefixed with /api
app.use('/api', router);

// Serve index.jade at ttps://mangadb-r282.herokuapp.com
app.route('/')
  .get(mangaController.getIndex);
  
// middleware to use for all requests
//router.use(mangaController.logConnection);

// test route to make sure everything is working (accessed at GET https://mangadb-r282.herokuapp.com/api)
router.route('/')
  .get(mangaController.getWelcome);

//Create endpoint handlers for /mangas/:user/:manga_tile   
router.route('/mangas/:user/:manga_title')
  .get(authController.validateToken, mangaController.getManga) // get user's manga info
  .put(authController.validateToken, mangaController.putManga) // update user's manga info
  .delete(authController.validateToken, mangaController.delManga); // deletes user's manga

// Create endpoint handlers for /mangas/:user  
router.route('/mangas/:user')
  .get(authController.validateToken, mangaController.getMangas) //get all user's manga
  .post(authController.validateToken, mangaController.postManga); //create new manga

// Get all mangas by admin
router.route('/mangas')
  .get(authController.validateToken, mangaController.getAllMangas) //admin get all mangas
  .delete(authController.validateToken, mangaController.delMangas); // admin delete all mangas

// HANDLE USER RELATED ROUTES
// =============================================================================

// Request token generator at /mangas/auth  
router.route('/auth')
  .post(authController.generateToken); //Get token

// Create endpoint handlers for /users
router.route('/users')
  .post(userController.postUsers) // Creates new user
  .get(authController.validateToken, userController.getUsers) //admin get all users
  .delete(authController.validateToken, userController.delUsers); //admin delete all users

//Create endpoint handlers for /mangas/:username    
router.route('/users/:username')
  .get(authController.validateToken, userController.getUser) // get user info
  .put(authController.validateToken, userController.putUser) // update user info
  .delete(authController.validateToken, userController.delUser); // deletes user

// CONFIGURE & START THE SERVER
// =============================================================================
var port = process.env.PORT || 8080; // set our port
app.listen(port, function() {
  console.log('Node.js listening on port ' + port);
});