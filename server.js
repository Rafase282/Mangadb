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
var passport = require('passport');
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

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// Use the passport package in our application
app.use(passport.initialize());

// configure the view
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// REGISTER OUR ROUTES -------------------------------
var router = express.Router(); // get an instance of the express Router

// all of our routes will be prefixed with /api
app.use('/api', router);

// middleware to use for all requests
router.use(mangaController.logConnection);

// test route to make sure everything is working (accessed at GET https://mangadb-r282.herokuapp.com/api)
router.route('/')
  .get(mangaController.getWelcome);

// Serve index.jade
app.route('/')
  .get(mangaController.getIndex);

//Create endpoint handlers for /mangas/:user/:manga_tile   
router.route('/mangas/:user/:manga_title')
  .get(authController.isAuthenticated, mangaController.getManga) // get user's manga info
  .put(authController.isAuthenticated, mangaController.putManga) // update user's manga info
  .delete(authController.isAuthenticated, mangaController.delManga); // deletes user's manga

// Create endpoint handlers for /mangas/:user  
router.route('/mangas/:user')
  .get(authController.isAuthenticated, mangaController.getMangas) //get all user's manga
  .post(authController.isAuthenticated, mangaController.postManga); //create new manga
  
// Get all mangas by admin
router.route('/mangas')
  .get(authController.isAuthenticated, mangaController.getAllMangas) //admin get all mangas
  .delete(authController.isAuthenticated, mangaController.delMangas); // admin delete all mangas
  
// Create endpoint handlers for /users
router.route('/users')
  .post(userController.postUsers) // Creates new user
  .get(authController.isAuthenticated, userController.getUsers) //admin get all users
  .delete(authController.isAuthenticated, userController.delUsers); //admin delete all users
  
//Create endpoint handlers for /mangas/:username    
router.route('/users/:username')
  .get(authController.isAuthenticated, userController.getUser) // get user info
  .put(authController.isAuthenticated, userController.putUser) // update user info
  .delete(authController.isAuthenticated, userController.delUser); // deletes user

// CONFIGURE & START THE SERVER
// =============================================================================
var port = process.env.PORT || 8080; // set our port
app.listen(port, function() {
  console.log('Node.js listening on port ' + port);
});