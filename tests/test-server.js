var request = require('supertest');
var expect = require('chai').expect;

var url = 'https://mangadb-rafase282.c9users.io';

describe('GET /api', function(){
  it('respond with json', function(done){
    request(url)
      .get('/api')
      .set('accept-language', 'no, Just testing')
      .set('user-agent', 'a test server (Test unit with mocha) Test stuff')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res){
        if (err) return done(err);
        console.log(res.body)
        done();
      });
  });
})