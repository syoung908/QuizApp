import React from 'react';
import {mount, shallow} from 'enzyme';
import DifficultyFilter from '../../../src/components/Homepage/DifficultyFilter';
import 'mobx-react-lite/batchingForReactDom';

const searchStore = require('../../../src/stores/searchStore');

let store;
let storeContext;
let contextSpy;
let fetchSpy;

beforeEach((function(){
  store = searchStore.createSearchStore()
  storeContext = React.createContext(store);

  //Inject our test store into the component so we can view internals
  contextSpy = jest.spyOn(searchStore, 'useSearchStore');
  contextSpy.mockImplementation(()=>{
    return React.useContext(storeContext);
  });

  //Mock fetchQuizzes function
  fetchSpy = jest.spyOn(store, 'fetchQuizzes');
  fetchSpy.mockImplementation(()=>{
    return undefined;
  })
}));

afterEach((function(){
  if(contextSpy) {
    contextSpy.mockRestore();
  } 
  if (fetchSpy) {
    fetchSpy.mockRestore();
  }
}));


test('Basic toggle', async function() {
  const wrapper = shallow((
      <DifficultyFilter/>
  ));

  //Simulate easy button click
  let easyButton = wrapper.find({'aria-label': 'Easy-button'});
  easyButton.simulate('click');
  expect(fetchSpy).toBeCalledTimes(1);
  expect(store.difficultyFilter['Easy']).toBe(false);
  expect(store.queryString()).toBe("?page=1&limit=15&filter=Easy,");
});

test('Toggle medium twice', async function() {
  const wrapper = shallow((
      <DifficultyFilter/>
  ));

  let medButton = wrapper.find({'aria-label': 'Medium-button'});
  medButton.simulate('click');
  medButton.simulate('click');
  expect(fetchSpy).toBeCalledTimes(2);
  expect(store.difficultyFilter['Medium']).toBe(true);
  expect(store.queryString()).toBe("?page=1&limit=15");
});

test('Toggle all', async function() {
  const wrapper = shallow((
      <DifficultyFilter/>
  ));

  let easyButton = wrapper.find({'aria-label': 'Easy-button'})
  let medButton = wrapper.find({'aria-label': 'Medium-button'});
  let hardButton = wrapper.find({'aria-label': 'Hard-button'});
  easyButton.simulate('click');
  medButton.simulate('click');
  hardButton.simulate('click');
  expect(fetchSpy).toBeCalledTimes(3);
  expect(store.difficultyFilter['Easy']).toBe(false);
  expect(store.difficultyFilter['Medium']).toBe(false);
  expect(store.difficultyFilter['Hard']).toBe(false);
  expect(store.queryString()).toBe("?page=1&limit=15&filter=Easy,Medium,Hard,");
});