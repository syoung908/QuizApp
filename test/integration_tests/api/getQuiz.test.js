const request = require('supertest');
const app = require('../../../server');

test('Returned all questions', async(done) => {
  const response = await request(app).get('/api/quiz/5f1cc728671d9165b0ee2f64');

  expect(response.statusCode).toBe(200);
  expect(response.body).toHaveProperty("results");
  expect(response.body.results.length).toBe(10);
  expect(response.body.results[0]).toEqual(expect.objectContaining({
    question: expect.any(String),
    type: expect.any(String),
    media: expect.any(String)
  }));
  expect(response.body.results[0]).toMatchObject({_quizId: '5f1cc728671d9165b0ee2f64'})
  done();
});

test('Status 404 on no quizId', async(done) => {
  const response = await request(app).get('/api/quiz/');

  expect(response.statusCode).toBe(404);
  done();
});

test('Returns empty list on valid quizId with no quiz found', async(done) => {
  const response = await request(app).get('/api/quiz/5f1bc778e2cd9639d08da128');

  expect(response.statusCode).toBe(200);
  expect(response.body).toHaveProperty("results");
  expect(response.body.results.length).toBe(0);
  done();
});

test('Status 400 on invalid quizID', async(done) => {
  const response = await request(app).get('/api/quiz/A1');

  expect(response.statusCode).toBe(400);
  done();
});

