const request = require('supertest');
const app = require('../../../server');

test('Returned all quizzes', async(done) => {
  const response = await request(app).get('/api/quizzes/');

  expect(response.statusCode).toBe(200);
  expect(response.body).toHaveProperty("results");
  expect(response.body.results.length).toBeGreaterThanOrEqual(0);
  expect(response.body.results[0]).toEqual(expect.objectContaining({
    name: expect.any(String),
    difficulty: expect.any(String),
    length: expect.any(Number)
  }));
  done();
});

test('Returned all quizzes', async(done) => {
  const response = await request(app).get('/api/quizzes/?q=unique+test+tag');

  expect(response.statusCode).toBe(200);
  expect(response.body).toHaveProperty("results");
  expect(response.body.results.length).toBe(1);
  expect(response.body.results[0]).toEqual(expect.objectContaining({
    name: expect.any(String),
    difficulty: expect.any(String),
    length: expect.any(Number)
  }));
  expect(response.body.results[0]).toMatchObject(
    {_id: '5f1cc728671d9165b0ee2f64'});
  
  expect(response.body.results[0].tags).toEqual(
    expect.arrayContaining(['Unique Test Tag']));
  done();
});

test('Basic tag query with filters', async(done) => {
  const response = await request(app).get(
    '/api/quizzes?page=1&limit=15&q=unique+test+tag&filter=Easy,Hard');

  expect(response.statusCode).toBe(200);
  expect(response.body).toHaveProperty("results");
  expect(response.body.results.length).toBe(1);
  expect(response.body.results[0]).toEqual(expect.objectContaining({
    name: expect.any(String),
    difficulty: expect.any(String),
    length: expect.any(Number)
  }));
  expect(response.body.results[0].tags).toEqual(
    expect.arrayContaining(['Unique Test Tag']));
  done();
});

test('Bad query', async(done) => {
  const response = await request(app).get(
    '/api/quizzes?asdasdaswewdfvlkcjxv');

  expect(response.statusCode).toBe(200);
  expect(response.body).toHaveProperty("results");
  expect(response.body.results.length).toBeGreaterThanOrEqual(0);
  expect(response.body.results[0]).toEqual(expect.objectContaining({
    name: expect.any(String),
    difficulty: expect.any(String),
    length: expect.any(Number)
  }));
  done();
});