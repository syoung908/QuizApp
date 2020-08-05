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
import {timeoutFetch} from '../clientUtil/TimeoutFetch';

const storeContext = React.createContext();

export const PAGE_SIZE = 15;

/**
 * createSearchStore.
 * 
 * @since 1.0.0
 * 
 * Constructs the searchStore, which contains data and functions to manage
 * the query string that is sent to the server to request quizzes that meet
 * the user's parameters.
 */
export const createSearchStore = () => { return ({
  searchText: "",         //Content of the search bar.
  difficultyFilter: {     //Difficulty filter.
    Easy: true,           //True means include that difficulty.
    Medium: true,
    Hard: true,
  },
  page: 0,                //Index of last loaded page of the quizzes.
  loading: false,         //Loading Flag (when a fetch is occurring).
  lastPage: false,        //Whether the last page of a series has been loaded.
  data: [],               //List of queried quiz objects.

    
  /**
   * toggleDifficulty.
   * 
   * Toggles the whether to include the given difficulty in the queryString.
   * 
   * @memberOf createSearchStore
   * @since  1.0.0
   * 
   * @param {String} difficulty   The difficulty to be toggled (Easy, Medium,
   *                              Hard).
   */
  toggleDifficulty(difficulty) {
    this.difficultyFilter[difficulty] = !this.difficultyFilter[difficulty];
  },

  /**
   * fetchQuizzes
   * 
   * Fetches quizzes from the database that match the current options specified
   * in the mobX store searchStore. Is triggered on the initial Homepage 
   * component mount and whenever a searchBar search is entered or a difficulty
   * in the Difficulty Filter component is toggled.
   * 
   * @memberOf createSearchStore
   * @since   1.0.0
   * 
   * @return {String} An error message if an error has occurred. Null otherwise.
   */
  async fetchQuizzes() {
    try {
      this.data = [];
      this.loading = true;
      const response = await timeoutFetch('/api/quizzes'+ 
                                          this.queryString(1), 'GET');
        if (response.status === 200) {
          const datajson = await response.json();
          this.data = datajson.results;
          this.lastPage = (datajson.results.length < PAGE_SIZE);
          this.page =  1; //page is the last successfully loaded page
        } else {
          return(`HTTP Error ${response.status}: ${response.statusText}`);
        }
    } catch (err) {
      return (err.name === 'AbortError') 
        ? 'Request Timed Out' 
        : `Fetch Error: ${err}`;
    } finally {
      this.loading = false;
    }
  },

  /**
   * fetchNextPage.
   * 
   * Fetches the next page of quizzes that match the current options specified
   * in the mobX store searchStore. The page is reset upon any changes to 
   * these parameters. 
   * 
   * @memberOf createSearchStore
   * @since  1.0.0
   * 
   * @param {Number} nextpage  The index of the requested next page. If the 
   *                           page has already been queried, the last page 
   *                           has already been queried, or no more pages 
   *                           exist, the request will be ignored.
   */
  async fetchNextPage(nextpage) {
    try {
      // Return if the last page has already been found
      if (this.lastPage) {
        return;
      }
      
      // Return if the requested page has already been queried
      if (nextpage <= this.page) {
        return;
      } 
      
      // Fetch the next page
      const response = await timeoutFetch('/api/quizzes'+ 
                             this.queryString(nextpage), 'GET');
      if (response.status === 200) {
        const datajson = await response.json();
        this.data = this.data.concat(datajson.results);
        this.lastPage = (datajson.results.length < PAGE_SIZE);
        this.page = nextpage;
      } else {
        return(`HTTP Error ${response.status}: ${response.statusText}`);
      }
    } catch (err) {
      return (err.name === 'AbortError') 
        ? 'Request Timed Out' 
        : `Fetch Error: ${err}`;
    }
  },

  /**
   * queryString.
   * 
   * Generates a query string based on the current state of the store. This 
   * query string is intended to be passed to the server database to query
   * quizzes associated with the store's parameters.
   * 
   * @memberOf createSearchStore
   * @since  1.0.0
   * 
   * @param {Number} page   (optional) Specifies what page of the query the user 
   *                        wants the server to return. Will generate a string 
   *                        that requests the first page by default.
   *                       
   * 
   */
  queryString(page=1) {
    //Add query size and current page
    let query = `?page=${page}&limit=${PAGE_SIZE}`;

    //Add search bar as keywords
    if (this.searchText !== "") {
      query += ("&q=" + this.searchText.split(' ').join('+'));
    }

    //Add difficulty settings
    let ignoredDifficulties = [];
    for (const [difficulty, value] of Object.entries(this.difficultyFilter)) {
      if (!value) {
        ignoredDifficulties.push(difficulty);
      }
    }

    if (ignoredDifficulties.length !== 0) {
      query += ("&filter=" + ignoredDifficulties.join(',') + ",");
    }
    return query;
  },
  })}

/**
 * SearchStoreProvider.
 * 
 * Provider component for the searchStore such that any child components have 
 * access to react hook that can be used to interact with the store.
 * 
 * @since  1.0.0
 * 
 * @param {Component} children  Child component that will have access to the 
 *                              store hook.
 */
export const SearchStoreProvider = ({children}) => {
  const store = useLocalStore(createSearchStore);
   
  return(
    <storeContext.Provider value={store}>
      {children}
    </storeContext.Provider>
  );
}

/**
 * useSearchStore.
 * 
 * Hook that returns a searchStore context object such that a function/react
 * component has access to the searchStore functions and properties.
 */
export const useSearchStore = () => {
  const store = React.useContext(storeContext);
  if (!store) {
    throw new Error('useSearchStore must be used within a StoreProvider.')
  }
  return store;
}


