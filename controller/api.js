'use strict';

module.exports = function(app, router, Manga) {
  // middleware to use for all requests
  router.use(function(req, res, next) {
    // do logging
    var ip = req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;
    var info = JSON.stringify({
      'ip-address': ip,
      'language': req.headers["accept-language"].split(',')[0],
      'software': req.headers['user-agent'].split(') ')[0].split(' (')[1]
    });
    console.log('Something is happening from ' + info);
    next(); // make sure we go to the next routes and don't stop here
  });

  // test route to make sure everything is working (accessed at GET http://localhost:8080/api)
  router.get('/', function(req, res) {
    res.json({
      message: 'hooray! welcome to our api!'
    });
  });
  app.route('/')
    .get(function(req, res) {
      res.render('index');
    });

  // Find manga by id.
  // on routes that end in /mangas/:manga_title
  // ----------------------------------------------------
  router.route('/mangas/:manga_title')

  // get the manga with that id (accessed at GET http://localhost:8080/api/mangas/:manga_title)
  .get(function(req, res) {
    Manga.findOne({title: req.params.manga_title}, function(err, manga) {
      if (err) {
        res.status(404).json({
          error: req.params.manga_title + ' not found.'
        });
        console.log('Manga not found.');
      } else {
        console.log(req.params.manga_title + ' found!');
        res.json(manga);
      }
    });
  });

  // Update manga by id.
  app.put('/api/mangas/:id', function(req, res) {

  });

  // CREATE NEW MANGA
  router.route('/mangas')

  // create a manga (accessed at POST http://localhost:8080/api/mangas)
  .post(function(req, res) {

    var manga = new Manga(); // create a new instance of the Manga model
    manga.title = req.body.title; // set the manga name (comes from the request)
    manga.author = req.body.author;
    manga.url = req.body.url;
    manga.userStatus = req.body.userStatus;
    manga.type = req.body.type;
    manga.categories = req.body.categories;
    manga.chapter = req.body.chapter;
    manga.seriesStatus = req.body.seriesStatus;
    manga.plot = req.body.plot;

    // save the manga and check for errors
    manga.save(function(err) {
      if (err) {
        res.status(409).json({
          error: 'A manga already exist with duplicated name or url.'
        });
        console.log('Error creating manga.');
      } else {
        console.log('Manga Created!');
        res.json({
          message: 'Manga created!'
        });
      }
    });

  })

  // FIND ALL MANGAS.
  // get all the mangas (accessed at GET http://localhost:8080/api/mangas)
  .get(function(req, res) {
    Manga.find(function(err, mangas) {
      if (err) {
        res.status(404).json({
          error: 'No mangas found.'
        });
        console.log('No mangas found.');
      } else {
        console.log('Mangas found!');
        res.json(mangas);
      }
    });
  });

  // Delete manga by id.
  app.delete('/api/mangas/:id', function(req, res) {

  });
};