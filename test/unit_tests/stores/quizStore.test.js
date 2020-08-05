import {createQuizStore} from '../../../src/stores/quizStore';

const TestQuiz1 = require('./TestQuiz1.json');

beforeEach(()=> {
  fetch.resetMocks();
});

test('No Quiz Loaded', function() {
  const store = createQuizStore();

  expect(store.length).toBe(0);
  expect(store.remaining).toBe(0);
  expect(store.isComplete).toBeTruthy();
});

test('Basic quiz loaded', async function(){
  const store = createQuizStore();
  fetch.mockResponseOnce([JSON.stringify(TestQuiz1)])
  let err = await store.fetchQuestions('5f1cc728671d9165b0ee2f64');

  expect(fetch).toHaveBeenCalledTimes(1);
  expect(fetch).toHaveBeenCalledWith(
    '/api/quiz/5f1cc728671d9165b0ee2f64',
    {"method": "GET", "signal":  new AbortController().signal}
  );
  expect(store.length).toBe(10);
  expect(store.isComplete).toBeFalsy();
  expect(store.loading).toBeFalsy();
  expect(store.currentQuestionIndex).toBe(0);
  expect(store.remaining).toBe(10);
  expect(store.completeRate).toBe(0);
  expect(err).toBeUndefined();
})

test('Partial quiz runthrough', async function(){
  const store = createQuizStore();
  fetch.mockResponseOnce([JSON.stringify(TestQuiz1)])
  let err = await store.fetchQuestions('5f1cc728671d9165b0ee2f64');

  //Answer 3 questions
  store.answers[store.indexMap[0]] = 'a';
  store.answers[store.indexMap[1]] = 'b';
  store.answers[store.indexMap[2]] = 'c';

  expect(err).toBeUndefined();
  expect(fetch).toHaveBeenCalledTimes(1);
  expect(fetch).toHaveBeenCalledWith(
    '/api/quiz/5f1cc728671d9165b0ee2f64',
    {"method": "GET", "signal":  new AbortController().signal}
  );
  expect(store.length).toBe(10);
  expect(store.isComplete).toBeFalsy();
  expect(store.loading).toBeFalsy();

  expect(store.remaining).toBe(7);
  expect(store.completeRate).toBe(30);
  
  // Warning dialog should be displayed
  let submitResults = await store.handleSubmitButton();
  expect(submitResults).toBeUndefined();
  expect(store.submitted).toBeFalsy;
  expect(store.warningDialog).toBeTruthy;
})

test('Full quiz runthrough w/ submit', async function(){
  const store = createQuizStore();
  fetch.mockResponseOnce([JSON.stringify(TestQuiz1)])
  let err = await store.fetchQuestions('5f1cc728671d9165b0ee2f64');

  //Answer 10 questions
  store.answers[store.indexMap[0]] = 'a';
  store.answers[store.indexMap[1]] = 'b';
  store.answers[store.indexMap[2]] = 'c';
  store.answers[store.indexMap[3]] = 'd';
  store.answers[store.indexMap[4]] = 'e';
  store.answers[store.indexMap[5]] = 'a';
  store.answers[store.indexMap[6]] = 'b';
  store.answers[store.indexMap[7]] = 'c';
  store.answers[store.indexMap[8]] = 'd';
  store.answers[store.indexMap[9]] = 'e';

  expect(err).toBeUndefined();
  expect(fetch).toHaveBeenCalledTimes(1);
  expect(fetch).toHaveBeenCalledWith(
    '/api/quiz/5f1cc728671d9165b0ee2f64',
    {"method": "GET", "signal":  new AbortController().signal}
  );
  expect(store.length).toBe(10);
  expect(store.isComplete).toBeTruthy();
  expect(store.loading).toBeFalsy();

  expect(store.remaining).toBe(0);
  expect(store.completeRate).toBe(100);
  
  // Warning dialog should be displayed
  fetch.mockResponseOnce([JSON.stringify({
    correct: 4,
    total: 10,
    corrections: {
        "5f1bcf2ce2cd9639d08da129": "a",
        "5f1bd02ae2cd9639d08da12a": "b",
        "5f1bd2f1e2cd9639d08da12c": "d",
        "5f1bd357e2cd9639d08da12d": "c",
        "5f1bd3ece2cd9639d08da12e": "c",
        "5f1bd558e2cd9639d08da130": "c",
    }
  })])
  let submitResults = await store.handleSubmitButton();
  expect(store.loading).toBeFalsy();
  expect(submitResults).toBeUndefined();
  expect(store.submitted).toBeTruthy;
  expect(fetch).toHaveBeenCalledTimes(2);

  expect(store.results).toEqual(expect.objectContaining({
    correct: 4,
    total: 10,
  }));
})

test('Aborted Request', async function(){
  const store = createQuizStore();
  fetch.mockAbortOnce();
  let err = await store.fetchQuestions('5f1cc728671d9165b0ee2f64');

  expect(fetch).toHaveBeenCalledTimes(1);
  expect(fetch).toHaveBeenCalledWith(
    '/api/quiz/5f1cc728671d9165b0ee2f64',
    {"method": "GET", "signal":  new AbortController().signal}
  );
  expect(store.length).toBe(0);
  expect(store.remaining).toBe(0);
  expect(store.isComplete).toBeTruthy();

  expect(err).toBe('Request Timed Out');
})

test('Bad Request', async function(){
  const store = createQuizStore();
  fetch.mockResponse(JSON.stringify({}),{status: 404, statusText: 'Not Found'});
  let err = await store.fetchQuestions();

  expect(fetch).toHaveBeenCalledTimes(1);
  expect(fetch).toHaveBeenCalledWith(
    '/api/quiz/',
    {"method": "GET", "signal":  new AbortController().signal}
  );
  expect(store.length).toBe(0);
  expect(store.remaining).toBe(0);
  expect(store.isComplete).toBeTruthy();

  expect(err).toBe('HTTP Error 404: Not Found');
})

