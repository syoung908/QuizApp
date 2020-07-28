var app = require('../app');
var chai = require('chai');
var should = chai.should();
var request = require('supertest');

describe("[API] submitAnswers", () => {
  it('All correct answers', (done) => {
    let userAnswers = {
      "answers": {
        "5f1bc778e2cd9639d08da128": "a",
        "5f1bcf2ce2cd9639d08da129": "a",
        "5f1bd02ae2cd9639d08da12a": "b",
        "5f1bd0e3e2cd9639d08da12b": "d",
        "5f1bd2f1e2cd9639d08da12c": "d",
        "5f1bd357e2cd9639d08da12d": "c",
        "5f1bd3ece2cd9639d08da12e": "c",
        "5f1bd4afe2cd9639d08da12f": "c",
        "5f1bd558e2cd9639d08da130": "c",
        "5f1bd658e2cd9639d08da131": "e"
      }
    }
    let expectedTotal = 10;
    let expectedCorrect = 10;

    request(app)
    .post('/api/quiz/5f1cc728671d9165b0ee2f64')
    .send(userAnswers)
    .set('Accept', 'application/json')
    .expect(200).end((err, res) => {
      should.not.exist(err);
      should.exist(res);
      res.status.should.equal(200);
      should.exist(res.body);
      res.body.should.have.property('correct', expectedCorrect);
      res.body.should.have.property('total', expectedTotal);
      res.body.should.have.property('corrections').that.is.an('object');
      Object.keys(res.body.corrections)
        .should.be.lengthOf(expectedTotal - expectedCorrect);
      done();
    });
  });

  it('Status 404 on no quizId', (done) => {
    let userAnswers = {
      "answers": {
        "5f1bc778e2cd9639d08da128": "a",
        "5f1bcf2ce2cd9639d08da129": "a",
        "5f1bd02ae2cd9639d08da12a": "b",
        "5f1bd0e3e2cd9639d08da12b": "d",
        "5f1bd2f1e2cd9639d08da12c": "d",
        "5f1bd357e2cd9639d08da12d": "c",
        "5f1bd3ece2cd9639d08da12e": "c",
        "5f1bd4afe2cd9639d08da12f": "c",
        "5f1bd558e2cd9639d08da130": "c",
        "5f1bd658e2cd9639d08da131": "e"
      }
    }
    request(app)
    .post('/api/quiz/')
    .send(userAnswers)
    .set('Accept', 'application/json')
    .expect(404).end((err, res) => {
      should.not.exist(err);
      should.exist(res);
      res.status.should.equal(404);
      done();
    });
  });

  it('Status 400 on no answers in body', (done) => {
    request(app)
    .post('/api/quiz/5f1cc728671d9165b0ee2f64')
    .send({})
    .set('Accept', 'application/json')
    .expect(400).end((err, res) => {
      should.not.exist(err);
      should.exist(res);
      res.status.should.equal(400);
      done();
    });
  }); 

  it('Status 400 on invalid quizId', (done) => {
    let userAnswers = {
      "answers": {
        "5f1bc778e2cd9639d08da128": "a",
        "5f1bcf2ce2cd9639d08da129": "a",
        "5f1bd02ae2cd9639d08da12a": "b",
        "5f1bd0e3e2cd9639d08da12b": "d",
        "5f1bd2f1e2cd9639d08da12c": "d",
        "5f1bd357e2cd9639d08da12d": "c",
        "5f1bd3ece2cd9639d08da12e": "c",
        "5f1bd4afe2cd9639d08da12f": "c",
        "5f1bd558e2cd9639d08da130": "c",
        "5f1bd658e2cd9639d08da131": "e"
      }
    }

    request(app)
    .post('/api/quiz/1')
    .send(userAnswers)
    .set('Accept', 'application/json')
    .expect(400).end((err, res) => {
      should.not.exist(err);
      should.exist(res);
      res.status.should.equal(400);
      done();
    });
  });
  
  it('Status 400 on valid quizId with no questions', (done) => {
    let userAnswers = {
      "answers": {
        "5f1bc778e2cd9639d08da128": "a",
        "5f1bcf2ce2cd9639d08da129": "a",
        "5f1bd02ae2cd9639d08da12a": "b",
        "5f1bd0e3e2cd9639d08da12b": "d",
        "5f1bd2f1e2cd9639d08da12c": "d",
        "5f1bd357e2cd9639d08da12d": "c",
        "5f1bd3ece2cd9639d08da12e": "c",
        "5f1bd4afe2cd9639d08da12f": "c",
        "5f1bd558e2cd9639d08da130": "c",
        "5f1bd658e2cd9639d08da131": "e"
      }
    }

    request(app)
    .post('/api/quiz/5f1bc778e2cd9639d08da128')
    .send(userAnswers)
    .set('Accept', 'application/json')
    .expect(400).end((err, res) => {
      should.not.exist(err);
      should.exist(res);
      res.status.should.equal(400);
      done();
    });
  }); 
});