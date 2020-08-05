import {createSearchStore} from '../../../src/stores/searchStore';

const TestQuery1 = require('./TestQuery1.json');
const TestQuery2 = require('./TestQuery2.json');

beforeEach(()=> {
  fetch.resetMocks();
});

test('updates searchText', function() {
  const store = createSearchStore();
  store.searchText = "test";

  expect(store.searchText).toBe("test");
  expect(store.queryString()).toBe("?page=1&limit=15&q=test");
  expect(store.queryString(2)).toBe("?page=2&limit=15&q=test");
});

test('toggle easy difficulty', function() {
  const store = createSearchStore();
  store.toggleDifficulty('Easy');

  expect(store.difficultyFilter['Easy']).toBe(false);
  expect(store.queryString()).toBe("?page=1&limit=15&filter=Easy,");
});

test('toggle easy and hard difficulty', function() {
  const store = createSearchStore();
  store.toggleDifficulty('Easy');
  store.toggleDifficulty('Hard');

  expect(store.difficultyFilter['Easy']).toBe(false);
  expect(store.queryString()).toBe("?page=1&limit=15&filter=Easy,Hard,");
});


test('toggle Hard difficulty and search by tags', function() {
  const store = createSearchStore();
  store.toggleDifficulty('Hard');
  store.searchText = "java programming";

  expect(store.difficultyFilter['Hard']).toBe(false);
  expect(store.queryString())
    .toBe("?page=1&limit=15&q=java+programming&filter=Hard,");
});

test('number as searchText', function() {
  const store = createSearchStore();
  store.searchText = "1";

  expect(store.searchText).toBe("1");
  expect(store.queryString()).toBe("?page=1&limit=15&q=1");
});


test('default query', async function(){
  const store = createSearchStore();
  fetch.mockResponseOnce([JSON.stringify(TestQuery1)]);
  let err = await store.fetchQuizzes();

  expect(fetch).toHaveBeenCalledTimes(1);
  expect(fetch).toHaveBeenCalledWith(
    '/api/quizzes?page=1&limit=15',
    {"method": "GET", "signal":  new AbortController().signal}
  );
  
  expect(err).toBeUndefined();
  expect(store.loading).toBeFalsy();
  expect(store.page).toBe(1);
  expect(store.lastPage).toBeFalsy();
  expect(store.data.length).toBe(15);
})

test('Aborted fetchQuizzes Request', async function(){
  const store = createSearchStore();
  fetch.mockAbortOnce();
  let err = await store.fetchQuizzes();
  
  expect(err).toBe('Request Timed Out');
  expect(store.loading).toBeFalsy();
  expect(store.page).toBe(0);
  expect(store.data.length).toBe(0);
})

test('Bad fetchQuizzes Request', async function(){
  const store = createSearchStore();
  fetch.mockResponse(JSON.stringify({}),{status: 404, statusText: 'Not Found'});
  let err = await store.fetchQuizzes();

  expect(err).toBe('HTTP Error 404: Not Found');
  expect(store.loading).toBeFalsy();
  expect(store.page).toBe(0);
  expect(store.data.length).toBe(0);
})

test('2 page query', async function(){
  const store = createSearchStore();
  fetch.mockResponseOnce([JSON.stringify(TestQuery1)]);
  let err = await store.fetchQuizzes();

  expect(fetch).toHaveBeenCalledTimes(1);
  expect(fetch).toHaveBeenCalledWith(
    '/api/quizzes?page=1&limit=15',
    {"method": "GET", "signal":  new AbortController().signal}
  );
  expect(err).toBeUndefined();
  expect(store.loading).toBeFalsy();
  expect(store.page).toBe(1);
  expect(store.lastPage).toBeFalsy();
  expect(store.data.length).toBe(15);
  
  //get next page
  fetch.mockResponseOnce([JSON.stringify(TestQuery2)]);
  let err2 = await store.fetchNextPage(2);
  
  expect(fetch).toHaveBeenCalledTimes(2);
  expect(fetch).toHaveBeenCalledWith(
    '/api/quizzes?page=2&limit=15',
    {"method": "GET", "signal":  new AbortController().signal}
  );
  expect(err2).toBeUndefined();
  expect(store.loading).toBeFalsy();
  expect(store.page).toBe(2);
  expect(store.lastPage).toBeTruthy();
  expect(store.data.length).toBe(26);

  //Fetches beyond last page should not happen
  let err3 = await store.fetchNextPage(3);

  expect(err3).toBeUndefined();
  expect(fetch).toHaveBeenCalledTimes(2);;
  expect(store.loading).toBeFalsy();
  expect(store.page).toBe(2);
  expect(store.lastPage).toBeTruthy();
  expect(store.data.length).toBe(26);
})

test('Aborted fetchNextPage Request', async function(){
  const store = createSearchStore();
  fetch.mockAbortOnce();
  let err = await store.fetchNextPage(2);

  expect(err).toBe('Request Timed Out');
  expect(store.loading).toBeFalsy();
  expect(store.data.length).toBe(0);
  expect(store.page).toBe(0);
})

test('Bad fetchNextPage Request', async function(){
  const store = createSearchStore();
  fetch.mockResponse(JSON.stringify({}),{status: 404, statusText: 'Not Found'});
  let err = await store.fetchNextPage(2);

  expect(err).toBe('HTTP Error 404: Not Found');
  expect(store.loading).toBeFalsy();
  expect(store.page).toBe(0);
  expect(store.data.length).toBe(0);
})

test('Request same page', async function(){
  const store = createSearchStore();
  fetch.mockResponseOnce([JSON.stringify(TestQuery1)]);
  let err = await store.fetchQuizzes();

  expect(fetch).toHaveBeenCalledTimes(1);
  expect(fetch).toHaveBeenCalledWith(
    '/api/quizzes?page=1&limit=15',
    {"method": "GET", "signal":  new AbortController().signal}
  );
  expect(err).toBeUndefined();
  expect(store.loading).toBeFalsy();
  expect(store.page).toBe(1);
  expect(store.lastPage).toBeFalsy();
  expect(store.data.length).toBe(15);

  fetch.mockResponseOnce([JSON.stringify(TestQuery2)]);
  let err2 = await store.fetchNextPage(2);
  
  expect(fetch).toHaveBeenCalledTimes(2);
  expect(fetch).toHaveBeenCalledWith(
    '/api/quizzes?page=2&limit=15',
    {"method": "GET", "signal":  new AbortController().signal}
  );
  expect(err2).toBeUndefined();
  expect(store.loading).toBeFalsy();
  expect(store.page).toBe(2);
  expect(store.lastPage).toBeTruthy();
  expect(store.data.length).toBe(26);
  
  //Should not fetch a page that has already been fetched (page 2)
  fetch.mockResponseOnce([JSON.stringify(TestQuery2)]);
  let err3 = await store.fetchNextPage(1);
  
  expect(err3).toBeUndefined();
  expect(fetch).toHaveBeenCalledTimes(2);
  expect(store.loading).toBeFalsy();
  expect(store.page).toBe(2);
  expect(store.lastPage).toBeTruthy();
  expect(store.data.length).toBe(26);

  //Should not fetch a page that has already been fetched (page 1)
  fetch.mockResponseOnce([JSON.stringify(TestQuery2)]);
  let err4 = await store.fetchNextPage(2);
  
  expect(err4).toBeUndefined();
  expect(fetch).toHaveBeenCalledTimes(2);
  expect(store.loading).toBeFalsy();
  expect(store.page).toBe(2);
  expect(store.lastPage).toBeTruthy();
  expect(store.data.length).toBe(26);
})


