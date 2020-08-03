/**
 * searchStore.
 *
 * mobX store that consolidates state of several components that determine the
 * various query parameters used to query the database for quizzes. Its main 
 * function is to generate a querystring that can be passed to the server.
 *
 * @module  searchStore
 * @file    This file defines the mobx store for interacting with the currently
 *          selected quiz.
 * @author  syoung908
 * @version 1.0.0
 * @since   1.0.0
 */

import React from "react";
import {useLocalStore} from 'mobx-react';

const storeContext = React.createContext();

export const PAGE_SIZE = 15;

/**
 * SearchStoreProvider.
 * 
 * Provider component for the searchStore such that any child components have 
 * access to react hook that can be used to interact with the store.
 * 
 * @param {Component} children  Child component that will have access to the 
 *                              store hook.
 */
export const SearchStoreProvider = ({children}) => {
  const store = useLocalStore(() => ({
    searchText: "",         //Content of the search bar.
    difficultyFilter: {     //Difficulty filter.
      Easy: true,           //True means include that difficulty.
      Medium: true,
      Hard: true,
    },
    page: 1,                //Index of last loaded page of the quizzes.
    loading: false,         //Loading Flag (when a fetch is occurring).
    lastPage: false,        //Whether the last page of a series has been loaded.

    
    /**
     * toggleDifficulty.
     * 
     * Toggles the whether to include the given difficulty in the queryString.
     * 
     * @since  1.0.0
     * 
     * @param {String} difficulty   The difficulty to be toggled (Easy, Medium,
     *                              Hard).
     */
    toggleDifficulty: (difficulty) => {
      store.difficultyFilter[difficulty] = !store.difficultyFilter[difficulty];
    },

    /**
     * queryString.
     * 
     * Generates a query string based on the current state of the store. This 
     * query string is intended to be passed to the server database to query
     * quizzes associated with the store's parameters.
     * 
     * @since  1.0.0
     */
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


