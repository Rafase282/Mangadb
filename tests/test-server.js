var request = require('supertest');
var expect = require('chai').expect;
//var server = require('../server.js');
var server = request.agent('http://localhost:' + process.env.PORT);

describe('SAMPLE unit test', function () {


  it('GET /: Respond with html site', function (done) {
    server
      .get('/')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(200, done);
  });
  // END JSON MSG



  it('GET /api: Respond with Json msg', function (done) {
    server
      .get('/api')
      .expect('Content-Type', /json/)
      .expect(200, done);
    /* If I want to peek inside, remode done from above
    .end(function(err, res) {
      if (err) return done(err);
      console.log(res.body)
      done();
    });
    */
  }); // END JSON MSG

});