'use strict';

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const mongoose = require('mongoose');
require('dotenv').config({silent: true});
chai.should();
chai.use(chaiHttp);

// Gloabls
const api = `/api/${process.env.API_VERSION}`;
const mongouri = process.env.MONGOLAB_URI ||
  `mongodb://${process.env.IP}:27017/mangadb`;
const User = require('../models/user');
const manga = {
  "categories": [
    "action", "historical"
  ],
  "altName": [""],
  "title": "kingdom",
  "author": "hara yasuhisa",
  "url": "http://www.readmanga.today/kingdom",
  "userStatus": "finished",
  "type": "japanese",
  "chapter": 41,
  "seriesStatus": "ongoing",
  "plot": "Some plot here",
  "direction": "right to left",
  "thumbnail": "http://www.readmanga.today/uploads/posters/0001_576.jpg"
}
const userObj = {
  "lastname": "rodriguez",
  "firstname": "rafael",
  "email": "rafase282@gmail.com",
  "password": "adminpwd",
  "username": "rafase282"
};
const title = encodeURI(manga.title);
const chapter = 282;
const user = userObj.username;

// Repeated testing
function testObj(res, err, type) {
  res.status.should.be.oneOf([200, 400, 403, 404])
  res.should.have
    .header('content-type', 'application/json; charset=utf-8');
  res.body.should.be.a('object')
  res.body.should.have.property('success').be.a('boolean').equal(true);
  res.body.should.have.property('message').be.a('string');
  res.body.should.have.property('data').be.a(type);
  if (err) console.log(err.response.error);
}

describe('Test for server response', () => {
  let token = '';

  before(() => {
    mongoose.createConnection(mongouri);
    new User(userObj).save();
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
        if (err) console.log(err.response.error);
        done();
      });
  });
  it(`GET ${api}: Respond with JSON Greeting`, (done) => {
    chai.request(server)
      .get(api)
      .end((err, res) => {
        testObj(res, err, 'null');
        done();
      });
  });

  describe('Test User Interactions', () => {
    it(`POST ${api}/users: Creates a new user`, (done) => {
      chai.request(server)
        .post(`${api}/users`)
        .send(userObj)
        .end((err, res) => {
          testObj(res, err, 'object');
          res.body.data.should.have.all
            .keys([
              'username',
              'password',
              'email',
              'firstname',
              'lastname',
              '_id',
              '__v'
            ]);
          done();
        });
    });
    it(`POST ${api}/auth: Should return JSON data containing the JWT`,
      (done) => {
        const credentials = {
          username: "rafase282",
          password: "adminpwd"
        }
        chai.request(server)
          .post(`${api}/auth`)
          .send(credentials)
          .end((err, res) => {
            testObj(res, err, 'string');
            token = res.body.data;
            done();
          });
      });
    it(`GET ${api}/users/${user}: Find user by username`, (done) => {
      chai.request(server)
        .get(`${api}/users/${user}`)
        .set('x-access-token', `${token}`)
        .end((err, res) => {
          testObj(res, err, 'array');
          res.body.data[0].username.should.be.a('string');
          res.body.data[0].username.should.be.equal(user);
          done();
        });
    });
    it(`PUT ${api}/users/${user}: Update ${user}'s information`, (done) => {
      const firstname = 'rafael';
      chai.request(server)
        .put(`${api}/users/${user}`)
        .set('x-access-token', `${token}`)
        .send({firstname})
        .end((err, res) => {
          testObj(res, err, 'object');
          res.body.data.firstname.should.be.a('string');
          res.body.data.firstname.should.equal(firstname);
          done();
        });
    });
    it(`GET ${api}/users: Admin retrieves all users in the DB`, (done) => {
      chai.request(server)
        .get(`${api}/users`)
        .set('x-access-token', `${token}`)
        .end((err, res) => {
          testObj(res, err, 'array');
          res.body.data[0].should.be.a('object');
          res.body.data[0].username.should.be.a('string');
          done();
        });
    });
    it(`DEL ${api}/users/${user}: Deletes ${user}`, (done) => {
      chai.request(server)
        .del(`${api}/users/${user}`)
        .set('x-access-token', `${token}`)
        .end((err, res) => {
          testObj(res, err, 'object');
          done();
        });
    });

  });
  describe('Test Manga Interactions', () => {
    it(`POST ${api}/mangas/${user}: Create ${manga.title} manga for ${user}`,
      (done) => {
        chai.request(server)
          .post(`${api}/mangas/${user}`)
          .set('x-access-token', `${token}`)
          .send(manga)
          .end((err, res) => {
            testObj(res, err, 'object');
            res.body.data.title.should.equal('kingdom');
            done();
          });
    });
    it(`GET ${api}/mangas/${user}: Returns list of ${user}'s mangas`,
      (done) => {
        chai.request(server)
          .get(`${api}/mangas/${user}`)
          .set('x-access-token', `${token}`)
          .end((err, res) => {
            testObj(res, err, 'array');
            done();
          });
    });
    it(`GET ${api}/mangas/${user}/${title}: Find manga by title`, (done) => {
      chai.request(server)
        .get(`${api}/mangas/${user}/${title}`)
        .set('x-access-token', `${token}`)
        .end((err, res) => {
          testObj(res, err, 'array');
          done();
        });
    });
    it(`GET ${api}/mangas: Admin retrieves all mangas in the DB`, (done) => {
      chai.request(server)
        .get(`${api}/mangas`)
        .set('x-access-token', `${token}`)
        .end((err, res) => {
          testObj(res, err, 'array');
          done();
        });
    });
    it(`PUT ${api}/mangas/${user}/${title}: Update ${manga} manga for ${user}`,
      (done) => {
        chai.request(server)
          .put(`${api}/mangas/${user}/${title}`)
          .set('x-access-token', `${token}`)
          .send({chapter})
          .end((err, res) => {
            testObj(res, err, 'object');
            res.body.data.chapter.should.equal(chapter);
            done();
          });
    });
    it(`DEL ${api}/mangas/${user}/${title}: Delete ${manga} manga for ${user}`,
      (done) => {
        chai.request(server)
          .del(`${api}/mangas/${user}/${title}`)
          .set('x-access-token', `${token}`)
          .end((err, res) => {
            testObj(res, err, 'object');
            done();
          });
    });

  });


});
