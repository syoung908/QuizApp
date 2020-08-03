import React from "react";
import {useLocalStore} from 'mobx-react';

const storeContext = React.createContext();

export const PAGE_SIZE = 15;

export const SearchStoreProvider = ({children}) => {
  const store = useLocalStore(() => ({
    searchText: "",
    difficultyFilter: {
      Easy: true,
      Medium: true,
      Hard: true,
    },
    page: 1,
    loading: false,
    lastPage: false,

    addData: (item) => {
      store.quizData.push(item);
      console.log(item);
    },

    toggleDifficulty: (difficulty) => {
      store.difficultyFilter[difficulty] = !store.difficultyFilter[difficulty];
    },

    queryString: () =>{
      //Add query size and current page
      let query = `?page=${store.page}&limit=${PAGE_SIZE}`;

      //Add search bar as keywords
      if (store.searchText !== "") {
        query += ("&q=" + store.searchText.split(' ').join('+'));
      }

      //Add difficulty settings
      let ignoredDifficulties = [];
      for (const [difficulty, value] of Object.entries(store.difficultyFilter)) {
        if (!value) {
          ignoredDifficulties.push(difficulty);
        }
      }

      if (ignoredDifficulties.length !== 0) {
        query += ("&filter=" + ignoredDifficulties.join(',') + ",");
      }
      console.log(query);
      return query;
    },
  }));

  return(
    <storeContext.Provider value={store}>
      {children}
    </storeContext.Provider>
  );
}

export const useSearchStore = () => {
  const store = React.useContext(storeContext);
  if (!store) {
    throw new Error('useStore must be used within a StoreProvider.')
  }
  return store;
}


