var app = require('../app');
var chai = require('chai');
var should = chai.should();
var request = require('supertest');

describe("[API] getQuiz", () => {
  it('Returned all quizzes', (done) => {
    request(app)
    .get('/api/quizzes')
    .set('Accept', 'application/json')
    .expect(200).end((err, res) => {
      should.not.exist(err);
      should.exist(res);
      res.status.should.equal(200);
      should.exist(res.body);
      should.exist(res.body.results);
      res.body.results.should.be.an('array').that.is.not.empty;
      done();
    });
  });

  it('Basic tag query q=unique+test+tag', (done) => {
    request(app)
    .get('/api/quizzes?q=unique+test+tag')
    .set('Accept', 'application/json')
    .expect(200).end((err, res) => {
      should.not.exist(err);
      should.exist(res);
      res.status.should.equal(200);
      should.exist(res.body);
      should.exist(res.body.results);
      res.body.results.should.be.an('array').that.is.not.empty;
      should.exist(res.body.results[0].keywords);
      res.body.results[0].keywords.should.be.an('array')
        .that.does.include('unique test tag');
      //console.log(res.body.results);
      done();
    });
  });

  it('Basic tag query with filters', (done) => {
    request(app)
    .get('/api/quizzes?page=1&limit=15&q=unique+test+tag&filter=Easy,Hard')
    .set('Accept', 'application/json')
    .expect(200).end((err, res) => {
      should.not.exist(err);
      should.exist(res);
      res.status.should.equal(200);
      should.exist(res.body);
      should.exist(res.body.results);
      res.body.results.should.be.an('array').that.is.not.empty;
      should.exist(res.body.results[0].keywords);
      res.body.results[0].keywords.should.be.an('array')
        .that.does.include('unique test tag');
      //console.log(res.body.results);
      done();
    });
  });

  it('Basic tag query with bad filters', (done) => {
    request(app)
    .get('/api/quizzes?page=1&limit=15&q=unique+test+tag&filter=Easy')
    .set('Accept', 'application/json')
    .expect(200).end((err, res) => {
      should.not.exist(err);
      should.exist(res);
      res.status.should.equal(200);
      should.exist(res.body);
      should.exist(res.body.results);
      res.body.results.should.be.an('array').that.is.not.empty;
      should.exist(res.body.results[0].keywords);
      res.body.results[0].keywords.should.be.an('array')
        .that.does.include('unique test tag');
      //console.log(res.body.results);
      done();
    });
  });


});