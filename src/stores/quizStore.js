import React from "react";
import {useLocalStore} from 'mobx-react';
import {timeoutFetch} from '../clientUtil/TimeoutFetch';

const storeContext = React.createContext();

export const QuizStoreProvider = ({children}) => {
  const store = useLocalStore(() => ({
    quizID: "",
    questions: {},
    currentQuestionIndex: 0,
    loading: false,
    answers: {},
    indexMap:[],
    results: {
      correct: 0,
      total: 0,
      corrections: {},
    },
    warningDialog: false,
    submitted: false,

    get isComplete() {
      return store.complete === store.questions.length;
    },

    get length() {
      return store.indexMap.length;
    },

    get remaining() {
      return store.indexMap.length - Object.keys(store.answers).length;
    },

    get completeRate() {
      return (store.indexMap.length !== 0 && !store.loading)
        ? Math.floor((Object.keys(store.answers).length / store.indexMap.length) * 100)
        : 0;
    },

    reset() {
      store.currentQuestionIndex = 0;
      store.answers = {};
      store.submitted = false;
      store.results.correct = 0;
      store.results.total = 0;
      store.results.corrections = {}
    },

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

    async handleSubmitButton() {
      if (store.remaining !== 0) {
        store.warningDialog = true;
      } else {
        return store.submitAnswers();
      }
    },

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
          console.log(datajson);
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