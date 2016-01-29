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
var User = require('./models/user');
var passport = require('./controllers/passport');
//var mangaController = require('./controllers/manga');
var routesController = require('./controllers/routes');
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

// configure the view
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// REGISTER OUR ROUTES -------------------------------
var router = express.Router(); // get an instance of the express Router

// all of our routes will be prefixed with /api
app.use('/api', router);
passport(app, User);


// middleware to use for all requests
router.use(routesController.logConnection);

// test route to make sure everything is working (accessed at GET https://mangadb-r282.herokuapp.com/api)
router.route('/')
  .get(routesController.getWelcome);

// Serve index.jade
app.route('/')
  .get(routesController.getIndex);

//Create endpoint handlers for /mangas/:manga_title    
router.route('/mangas/:manga_title')
  .get(routesController.getManga)
  .put(routesController.putManga)
  .delete(routesController.delManga);

// Create endpoint handlers for /mangas    
router.route('/mangas')
  .get(routesController.getMangas)
  .post(routesController.postMangas);
  
// Create endpoint handlers for /users
router.route('/users')
  .post(userController.postUsers)
  .get(userController.getUsers);

// CONFIGURE & START THE SERVER
// =============================================================================
var port = process.env.PORT || 8080; // set our port
app.listen(port, function() {
  console.log('Node.js listening on port ' + port);
});