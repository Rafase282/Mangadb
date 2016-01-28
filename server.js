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
var Manga = require('./models/manga.js');
var api = require('./controller/api.js'); // Where all the api routes are
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
api(app, router, Manga);

// CONFIGURE & START THE SERVER
// =============================================================================
var port = process.env.PORT || 8080; // set our port
app.listen(port, function() {
  console.log('Node.js listening on port ' + port);
});