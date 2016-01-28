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

  // FIND MANGA BY TITLE
  // on routes that end in /mangas/:manga_title
  // ----------------------------------------------------
  router.route('/mangas/:manga_title')

  // get the manga with that id (accessed at GET http://localhost:8080/api/mangas/:manga_title)
  .get(function(req, res) {
    Manga.findOne({
      title: req.params.manga_title
    }, function(err, manga) {
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
  })

  // UPDATE MANGA BY TITLE
  // update the manga with this id (accessed at PUT http://localhost:8080/api/mangas/:manga_title)
  .put(function(req, res) {

    // use our manga model to find the manga we want
    Manga.findOne({
      title: req.params.manga_title
    }, function(err, manga) {
      if (err) {
        res.status(404).json({
          error: req.params.manga_title + ' not found.'
        });
        console.log('Manga not found.');
      } else {
        manga.title = req.body.title; // update the mangas info
        manga.author = req.body.author;
        manga.url = req.body.url;
        manga.userStatus = req.body.userStatus;
        manga.type = req.body.type;
        manga.categories = req.body.categories;
        manga.chapter = req.body.chapter;
        manga.seriesStatus = req.body.seriesStatus;
        manga.plot = req.body.plot;
        // update the manga
        var msg = req.body.title + ' manga updated.';
        save(manga, res, msg);
      }
    });
  })

  // DELETE MANGA BY TITLE
  // delete the manga with this id (accessed at DELETE http://localhost:8080/api/mangas/:manga_title)
  .delete(function(req, res) {
    Manga.remove({
      title: req.params.manga_title
    }, function(err, manga) {
      if (err) {
        res.status(404).json({
          error: 'Could not find manga'
        });
        console.log('Manga not found');
      } else {
        res.json({
          message: 'Successfully deleted'
        });
      }
    });
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

    // Call function to save manga
    var msg = req.body.title + ' manga created.';
    save(manga, res, msg);

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

  function save(manga, res, msg) {
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
          message: msg
        });
      }
    });
  }

};