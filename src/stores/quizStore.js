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
 * createQuizStore.
 * 
 * @since  1.0.0
 * 
 * Constructs the quizStore, which contains data and functions to manage the 
 * state of the currently selected quiz on the QuizPage.
 */
export const createQuizStore = () => { return ({
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
      return Object.keys(this.answers).length
        === Object.keys(this.questions).length;
    },

    //Returns the number of questions in the current quiz.
    get length() {
      return this.indexMap.length;
    },

    //Returns the number of unanswered questions.
    get remaining() {
      return this.indexMap.length - Object.keys(this.answers).length;
    },

    //Returns the number of questions completed as a percentage (out of 100)
    get completeRate() {
      return (this.indexMap.length !== 0 && !this.loading)
        ? Math.floor((Object.keys(this.answers).length / this.indexMap.length) * 100)
        : 0;
    },

    /**
     * reset.
     * 
     * Resets the state of the current quiz in the event that the user wishes
     * to retry the current quiz.
     * 
     * @memberOf createQuizStore
     * @since    1.0.0
     */
    reset() {
      this.currentQuestionIndex = 0;
      this.answers = {};
      this.submitted = false;
      this.results.correct = 0;
      this.results.total = 0;
      this.results.corrections = {}
    },

    /**
     * fetchQuestions.
     * 
     * Fetches the questions from the database associated with the currently
     * selected quiz. All questions associated with the quiz are returened and
     * empty quizzes will load an empty object.
     * 
     * @memberOf createQuizStore
     * @since    1.0.0
     * 
     * @param {String} quizID  The quizID string associated with the current
     *                         quiz. 
     * 
     * @return {String} An error message if an error has occurred. Null 
     *                  otherwise.
     */
    async fetchQuestions(quizID) {
      try {
        this.loading = true;
        let id = (quizID) ? quizID : ""; 
        const response = await timeoutFetch('/api/quiz/'+ id, 'GET');
        if (response.status === 200) {
          const datajson = await response.json();
          this.quizID = quizID;
          datajson.results.forEach(question => {
            this.questions[question._id] = question;
            this.indexMap.push(question._id);
          });
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
     * handleSubmitButton.
     * 
     * Callback function for the submit button. There are two submit buttons 
     * that both use this function. If there are unanswered questions this 
     * function triggers a confirmation popup. Otherwise the answers ares 
     * submitted to the server.
     * 
     * @memberOf createQuizStore
     * @since  1.0.0
     */
    async handleSubmitButton() {
      if (this.remaining !== 0) {
        this.warningDialog = true;
      } else {
        return this.submitAnswers();
      }
    },

    /**
     * submitAnswers.
     * 
     * Submits the answers to the server using the user's answered stored in 
     * the mobX quizStore. Upon success, it loads the results into the results 
     * object in the quizStore for display on the ResultsPage.
     * 
     * @memberOf createQuizStore
     * @since  1.0.0
     * 
     * @return {String} An error message if an error has occurred. Null 
     *                  otherwise.
     */
    async submitAnswers() {
      try {
        this.loading = true;
        const response = await timeoutFetch(
          '/api/quiz/'+ this.quizID, 
          'POST',
          {answers: this.answers},
        );
        if (response.status === 200) {
          const datajson = await response.json();
          this.results.correct = datajson.correct;
          this.results.total = datajson.total;
          this.corrections = datajson.corrections;
          this.submitted = true;
        } else {
          return(`HTTP Error ${response.status}: ${response.statusText}`);
        }
      } catch (err) {
        return (err.name === 'AbortError') 
        ? 'Request Timed Out' 
        : `Fetch Error: ${err}`
      } finally {
        this.loading = false;
      }
    },
  });
} 

/**
 * QuizStoreProvider.
 * 
 * Provider component for the quizStore such that any child components have 
 * access to react hook that can be used to interact with the store.
 * 
 * @memberOf createQuizStore
 * @since  1.0.0
 * 
 * @param {Component} children  Child component that will have access to the 
 *                              store hook.
 */
export const QuizStoreProvider = ({children}) => {
  const store = useLocalStore(createQuizStore);

  return(
    <storeContext.Provider value={store}>
      {children}
    </storeContext.Provider>
  );
}

/**
 * useQuizStore.
 * 
 * Hook that returns a quizStore context object such that a function/react 
 * component has access to the quizStore functions and properties.
 * 
 * @memberOf createQuizStore
 * @since  1.0.0
 * 
 */
export const useQuizStore = () => {
  const store = React.useContext(storeContext);
  if (!store) {
    throw new Error('useSearchStore must be used within a StoreProvider.')
  }
  return store;
}