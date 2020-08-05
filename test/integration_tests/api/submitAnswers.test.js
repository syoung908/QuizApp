const request = require('supertest');
const app = require('../../../server');

test('All correct answers', async(done) => {
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

  const response = await request(app).post('/api/quiz/5f1cc728671d9165b0ee2f64')
                                     .send(userAnswers);
  expect(response.statusCode).toBe(200);
  expect(response.body).toHaveProperty("correct");
  expect(response.body).toHaveProperty("total");
  expect(response.body).toHaveProperty("corrections");
  expect(response.body.correct).toBe(expectedCorrect);
  expect(response.body.total).toBe(expectedTotal);
  expect(Object.keys(response.body.corrections).length).toBe(0);
  done();
});

test('Status 404 on no quizId', async(done) => {
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

  const response = await request(app).post('/api/quiz').send(userAnswers);
  expect(response.statusCode).toBe(404);
  done();
});

test('Status 400 on invalid quizId', async(done) => {
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

  const response = await request(app).post('/api/quiz/1').send(userAnswers);
  expect(response.statusCode).toBe(400);

  done();
});

test('Status 400 on valid quizId with no questions', async(done) => {
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

  const response = await request(app)
    .post('/api/quiz/5f1bc778e2cd9639d08da128')
    .send(userAnswers);
  expect(response.statusCode).toBe(400);

  done();
});