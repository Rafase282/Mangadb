/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "expect" }]*/
/*global describe it */
var request = require('supertest');
var expect = require('chai').expect;
var server = require('../server.js');
server = request.agent('http://localhost:' + process.env.PORT);

describe('SAMPLE unit test', function() {


  it('GET /: Respond with html site', function(done) {
    server
      .get('/')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200, done);
  }); // END JSON MSG



  it('GET /api: Respond with Json msg', function(done) {
    server
      .get('/api')
      .expect('Content-Type', /json/)
      .expect(200, done);
  }); // END JSON MSG

});