/**
 * quizStore.
 *
 * mobX store that contains data and functions that interact with the currently
 * selected quiz. This store manages the state of the QuizPage and its 
 * subcomponents.
 *
 * @module  quizStore
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

/**
 * QuizStoreProvider.
 * 
 * Provider component for the quizStore such that any child components have 
 * access to react hook that can be used to interact with the store.
 * 
 * @param {Component} children  Child component that will have access to the 
 *                              store hook.
 */
export const QuizStoreProvider = ({children}) => {
  const store = useLocalStore(() => ({
    quizID: "",                //ID of currently selected Quiz
    questions: {},             //Object containing all question objects
    currentQuestionIndex: 0,   //Currently selected question index (in indexMap)
    loading: false,            //Loading flag (when a fetch is occurring)
    answers: {},               //All user answers {[ID]: userAnswer, ...}
    indexMap:[],               //Maps order of questions with ID (Q1 -> ID)
    results: {                 //Results after user submits answers.
      correct: 0,              //Questions correct
      total: 0,                //Total number of questions in quiz
      corrections: {},         //Object containing correct answers
    },
    warningDialog: false,      //Toggles confirmation popup on QuizPage
    submitted: false,          //Displays results if true.

    //Returns whether all questions have been answered.
    get isComplete() {
      return store.complete === store.questions.length;
    },

    //Returns the number of questions in the current quiz.
    get length() {
      return store.indexMap.length;
    },

    //Returns the number of unanswered questions.
    get remaining() {
      return store.indexMap.length - Object.keys(store.answers).length;
    },

    //Returns the number of questions completed as a percentage (out of 100)
    get completeRate() {
      return (store.indexMap.length !== 0 && !store.loading)
        ? Math.floor((Object.keys(store.answers).length / store.indexMap.length) * 100)
        : 0;
    },

    /**
     * reset.
     * 
     * Resets the state of the current quiz in the event that the user wishes
     * to retry the current quiz.
     */
    reset() {
      store.currentQuestionIndex = 0;
      store.answers = {};
      store.submitted = false;
      store.results.correct = 0;
      store.results.total = 0;
      store.results.corrections = {}
    },

    /**
     * fetchQuestions.
     * 
     * Fetches the questions from the database associated with the currently
     * selected quiz. All questions associated with the quiz are returened and
     * empty quizzes will load an empty object.
     * 
     * @since  1.0.0
     * 
     * @param {String} quizID  The quizID string associated with the current
     *                         quiz. 
     * 
     * @return {String} An error message if an error has occurred. Null 
     *                  otherwise.
     */
    async fetchQuestions(quizID) {
      try {
        store.loading = true;
        const response = await timeoutFetch('/api/quiz/'+ quizID, 'GET');
        if (response.status === 200) {
          const datajson = await response.json();
          datajson.results.forEach(question => {
            store.questions[question._id] = question;
            store.indexMap.push(question._id);
          });
        } else {
          return(`HTTP Error ${response.status}: ${response.statusText}`);
        }
      } catch (err) {
        return (err.name === 'AbortError') 
        ? 'Request Timed Out' 
        : `Fetch Error: ${err}`;
      } finally {
        store.loading = false;
      }
    },

    /**
     * handleSubmitButton.
     * 
     * Callback function for the submit button. There are two submit buttons 
     * that both use this function. If there are unanswered questions this 
     * function triggers a confirmation popup. Otherwise the answers ares 
     * submitted to the server.
     * 
     * @since  1.0.0
     */
    async handleSubmitButton() {
      if (store.remaining !== 0) {
        store.warningDialog = true;
      } else {
        return store.submitAnswers();
      }
    },

    /**
     * submitAnswers.
     * 
     * Submits the answers to the server using the user's answered stored in 
     * the mobX quizStore. Upon success, it loads the results into the results 
     * object in the quizStore for display on the ResultsPage.
     * 
     * @since  1.0.0
     * 
     * @return {String} An error message if an error has occurred. Null 
     *                  otherwise.
     */
    async submitAnswers() {
      try {
        store.loading = true;
        const response = await timeoutFetch(
          '/api/quiz/'+ store.quizID, 
          'POST',
          {answers: store.answers},
        );
        if (response.status === 200) {
          const datajson = await response.json();
          store.results.correct = datajson.correct;
          store.results.total = datajson.total;
          store.corrections = datajson.corrections;
          store.submitted = true;
        } else {
          return(`HTTP Error ${response.status}: ${response.statusText}`);
        }
      } catch (err) {
        return (err.name === 'AbortError') 
        ? 'Request Timed Out' 
        : `Fetch Error: ${err}`
      } finally {
        store.loading = false;
      }
    },
  }));

  return(
    <storeContext.Provider value={store}>
      {children}
    </storeContext.Provider>
  );
}

export const useQuizStore = () => {
  const store = React.useContext(storeContext);
  if (!store) {
    throw new Error('useStore must be used within a StoreProvider.')
  }
  return store;
}