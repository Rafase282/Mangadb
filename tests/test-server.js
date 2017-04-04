/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "expect, done" }]*/
/*global describe it */
'use strict';

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const expect = require('expect');
const mongoose = require('mongoose');
require('dotenv').config({silent: true});
chai.should();
chai.use(chaiHttp);

// Gloabls
const api = `/api/${process.env.API_VERSION}`;
const mongouri = process.env.MONGOLAB_URI ||
  `mongodb://${process.env.IP}:27017/mangadb`;

describe('Test for server response\n', () => {
  before(() => {
    mongoose.createConnection(mongouri);
  });

  beforeEach((done) => {
    // Populate the DB
    done();
  });

  afterEach((done) => {
    // Delete Populated DB
    done();
  });

  after(() => {
    mongoose.connection.close();
  });

  it('GET /: Responds with swagger Docs', (done) => {
    chai.request(server)
      .get('/')
      .end((err, res) => {
        res.should.have.status(200);
        res.should.have.header('content-type', 'text/html; charset=UTF-8');
        if (err) throw err;
        done();
      });
  });

  it(`GET ${api}: Respond with JSON Greeting`, (done) => {
    chai.request(server)
      .get(api)
      .end((err, res) => {
        res.should.have.status(200);
        res.should.have.header('content-type', 'application/json; charset=utf-8');
        if (err) throw err;
        done();
      });
  });

  it(`POST ${api}/auth: Should return JSON data containing the JWT`, (done) => {
    const credentials = {
      username: "user",
      password: "user"
    }
    chai.request(server)
      .post(`${api}/auth`)
      .send(credentials)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('success');
        res.body.success.should.be.a('boolean');
        res.body.should.have.property('message');
        res.body.message.should.be.a('string');
        res.body.should.have.property('data');
        if (err) throw err;
        done();
      });
  });

});
