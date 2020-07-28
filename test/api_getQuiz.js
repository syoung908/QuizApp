var app = require('../app');
var chai = require('chai');
var should = chai.should();
var request = require('supertest');

describe("[API] getQuiz", () => {
  it('Returned all Questions', (done) => {
    request(app)
    .get('/api/quiz/5f1cc728671d9165b0ee2f64')
    .set('Accept', 'application/json')
    .expect(200).end((err, res) => {
      should.not.exist(err);
      should.exist(res);
      res.status.should.equal(200);
      res.body.results.should.be.an('array').that.has.lengthOf(10);

      should.exist(res.body.results[0]);
      res.body.results[0].should.have.all.keys([
        '_id', 'question', 'answers', 'type', 'media', '_quizId'
      ]);

      res.body.results[0].should.not.have.any.keys([
        '__v', 'correct'
      ]);

      res.body.results[0]._id.should.be.a('string');
      res.body.results[0].question.should.be.a('string');
      res.body.results[0].answers.should.be.an('object');
      res.body.results[0].type.should.be.a('string');
      res.body.results[0].media.should.be.a('string');
      res.body.results[0]._quizId.should.be.a('string');

      done();
    });
  });

  it('Status 404 on no quizId', (done) => {
    request(app)
    .get('/api/quiz/')
    .set('Accept', 'application/json')
    .expect(404).end((err, res) => {
      should.not.exist(err);
      should.exist(res);
      res.status.should.equal(404);
      done();
    });
  });

  it('Returns empty list on valid quizId with no quiz found', (done) => {
    request(app)
    .get('/api/quiz/5f1bc778e2cd9639d08da128')
    .set('Accept', 'application/json')
    .expect(200).end((err, res) => {
      should.not.exist(err);
      should.exist(res);
      res.status.should.equal(200);
      res.body.results.should.be.an('array').that.has.lengthOf(0);
      done();
    });
  });

  it('Status 400 on invalid quizId', (done) => {
    request(app)
    .get('/api/quiz/1')
    .set('Accept', 'application/json')
    .expect(400).end((err, res) => {
      should.not.exist(err);
      should.exist(res);
      res.status.should.equal(400);
      done();
    });
  });


});