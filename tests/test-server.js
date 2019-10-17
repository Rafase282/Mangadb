'use strict';

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const mongoose = require('mongoose');
const User = require('../models/user');
const Manga = require('../models/manga');
const sendEmail = require('../utils/mailModule').sendEmail;
require('dotenv').config({silent: true});
chai.should();
chai.use(chaiHttp);

// Gloabls
mongoose.Promise = global.Promise;
const api = `/api/${process.env.API_VERSION}`;
const mongouri = `mongodb://${process.env.IP}:27017/testdb`;
const id = mongoose.Types.ObjectId();
const manga = new UserManga(id);
const admin = new MangaUser();
const title = encodeURI(manga.title);
const chapter = 282;
const user = admin.username;
const newuser = new MangaUser('testuser', 'rafase_282@hotmail.com');
const newuser2 = new MangaUser('testuser2', 'test@hotmail.com');
const newmanga = new UserManga(mongoose.Types.ObjectId(), 'aiki', 282, 'pepe');

let token = '';

//Object Constructors
function MangaUser(usr='rafase282', email='rafase282@gmail.com', pwd='adminpwd',
 firstname='rafael', lastname='rodriguez') {
  this.username = usr;
  this.password = pwd;
  this.email = email;
  this.firstname = firstname;
  this.lastname = lastname;
}
function UserManga(id=mongoose.Types.ObjectId(), title='kingdom', chapter=41,
 username='rafase282', altName='name1, name 2', author='hara yasuhisa',
 url='http://www.readmanga.today/kingdom', type='japanese',
 categories='action, historical',  userStatus='reading',
 seriesStatus='ongoing', plot='something', direction='right to left',
 thumbnail='http://www.readmanga.today/uploads/posters/0001_576.jpg') {
  this.title = title;
  this.chapter = chapter;
  this.altName = altName;
  this.author = author;
  this.url = url;
  this.type = type;
  this.categories = categories;
  this.userStatus = userStatus;
  this.seriesStatus = seriesStatus;
  this.plot = plot;
  this.direction = direction;
  this.thumbnail = thumbnail;
  this._id = id;
  this.username = username;
}

// Repeated testing
function testObj(res, err, type) {
  res.status.should.be.oneOf([200, 400, 402, 403, 404])
  res.should.have
    .header('content-type', 'application/json; charset=utf-8');
  res.body.should.be.a('object')
  res.body.should.have.property('success').be.a('boolean').equal(true);
  res.body.should.have.property('message').be.a('string');
  res.body.should.have.property('data').be.a(type);
  if (err) console.log(err.response.error);
  if (type === 'array'){
    res.body.data.length.should.be.above(0);
    res.body.data[0].should.be.a('object');
    res.body.data[0].username.should.be.a('string');
  }
}
function getAuth(cb, username = 'rafase282', password = 'adminpwd') {
  const credentials = {
    username,
    password
  }
  chai.request(server)
    .post(`${api}/auth`)
    .send(credentials)
    .end((err, res) => {
      testObj(res, err, 'string');
      token = res.body.data;
      cb();
    });
}

describe('Test server and service functionalities', () => {

  before(() => {
    mongoose.createConnection(mongouri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', console.log.bind(console, 'Connected!'));
  });
  beforeEach((done) => {
    // Populate the DB
    new User(admin).save().then(() => {
      new Manga(manga).save().then(() => {
        new Manga(newmanga).save().then(() => {
          new User(newuser2).save().then(() => {
            getAuth(done);
          });
        });
      });
    });
  });
  afterEach((done) => {
    // Delete Populated DB
    mongoose.connection.db.dropDatabase().then(() => {
      token = '';
      done();
    });
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
  it('Send email to user', (done) => {
    sendEmail({
      from : 'MangaDB <rafase282@gmail.com>',
      to : 'rafase282@gmail.com',
      subject : 'Test',
      text : 'This is a test, powered by Chai!'
    }, (err, msg) => {
      chai.expect(err).to.equal(null);
      chai.expect(msg.accepted[0]).to.equal(process.env.mainEmail);
      chai.expect(msg.response).to.match(/2.0.+OK/);
      done();
    });
  });

  describe('Test creating, updating and retrieving of Users', () => {
    it(`POST ${api}/users: Creates a new user`, (done) => {
      chai.request(server)
        .post(`${api}/users`)
        .send(newuser)
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
        getAuth(done);
      });
    it(`GET ${api}/users/${user}: Find user by username`, (done) => {
      chai.request(server)
        .get(`${api}/users/${user}`)
        .set('x-access-token', `${token}`)
        .end((err, res) => {
          testObj(res, err, 'array');
          res.body.data[0].username.should.be.equal(user);
          done();
        });
    });
    it(`PUT ${api}/users/${user}: Update ${user}'s information`, (done) => {
      const firstname = admin.firstname;
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
      new User(newuser).save().then(() => {
        chai.request(server)
          .get(`${api}/users`)
          .set('x-access-token', `${token}`)
          .end((err, res) => {
            testObj(res, err, 'array');
            done();
          });
      });

    });
  });
  describe('Test creating, updating and retrieving of Mangas', () => {
    it(`POST ${api}/mangas/${user}: Create ${manga.title} manga for ${user}`,
      (done) => {
        chai.request(server)
          .post(`${api}/mangas/${user}`)
          .set('x-access-token', `${token}`)
          .send(new UserManga())
          .end((err, res) => {
            testObj(res, err, 'object');
            res.body.data.title.should.equal(manga.title);
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
    it(`GET ${api}/mangas/${user}/${title}: Find manga by id`, (done) => {
      chai.request(server)
        .get(`${api}/mangas/${user}/${id}`)
        .set('x-access-token', `${token}`)
        .end((err, res) => {
          testObj(res, err, 'array');
          done();
        });
    });
    it(`GET ${api}/mangas/${user}/title/${title}: Find manga by title`, (done) => {
      chai.request(server)
        .get(`${api}/mangas/${user}/title/${title}`)
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
    it(`PUT ${api}/mangas/${user}/${id}: Update ${manga.title} manga for ${user}`,
      (done) => {
        chai.request(server)
          .put(`${api}/mangas/${user}/${id}`)
          .set('x-access-token', `${token}`)
          .send({chapter})
          .end((err, res) => {
            testObj(res, err, 'object');
            res.body.data.chapter.should.equal(chapter);
            done();
          });
    });
  });
  describe('Test Manga deletion', () => {
    it(`DEL ${api}/mangas/${user}/${id}: Delete ${manga.title} manga for ${user}`,
      (done) => {
        chai.request(server)
          .del(`${api}/mangas/${user}/${id}`)
          .set('x-access-token', `${token}`)
          .end((err, res) => {
            testObj(res, err, 'object');
            done();
          });
    });
    it(`DEL ${api}/mangas/${user}: Delete all mangas for ${user}`,
      (done) => {
        chai.request(server)
          .del(`${api}/mangas/${user}`)
          .set('x-access-token', `${token}`)
          .end((err, res) => {
            testObj(res, err, 'object');
            done();
          });
    });
    it(`DEL ${api}/mangas: Delete all mangas`,
      (done) => {
        chai.request(server)
          .del(`${api}/mangas`)
          .set('x-access-token', `${token}`)
          .end((err, res) => {
            testObj(res, err, 'object');
            done();
          });
    });
  });
  describe('Test User deletion', () => {
    it(`DEL ${api}/users: Deletes all users`, (done) => {
      chai.request(server)
        .del(`${api}/users`)
        .set('x-access-token', `${token}`)
        .end((err, res) => {
          testObj(res, err, 'object');
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

});
