import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import {ThemeProvider} from '@material-ui/core/styles';
import {theme} from './clientUtil/Theme';
import {SnackbarProvider} from 'notistack';

import Homepage from './components/Homepage/Homepage';
import Quizpage from './components/Quizpage/Quizpage';
import {SearchStoreProvider} from '../src/stores/searchStore';
import {QuizStoreProvider} from '../src/stores/quizStore';

import "core-js/stable";
import "regenerator-runtime/runtime";

const homepageWrapper = () => {
  return(
  <SearchStoreProvider>
    <Homepage/>
  </SearchStoreProvider>
  );
};

const quizpageWrapper = () => {
  return(
    <QuizStoreProvider>
      <Quizpage/>
    </QuizStoreProvider>
  );
}

function App() {
  return(
    <div>
      <SnackbarProvider maxSnack={3}>
      <BrowserRouter>
      <ThemeProvider theme={theme}>
        <main>
          <Switch>
            <Route exact path='/' component={homepageWrapper}/>
            <Route path='/quiz/:quizID' children={quizpageWrapper}/>
          </Switch>
        </main>
      </ThemeProvider>
      </BrowserRouter>
      </SnackbarProvider>
    </div>
  );
}

ReactDOM.render(
  <App/>,
  document.getElementById('root')
);