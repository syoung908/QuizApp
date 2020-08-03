/**
 * Quizpage.
 *
 * Container component that displays the quiz and its constituent questions
 * Will also display the Results page when the user submits their answers. This
 * component contains the QuizUI and the ResultsPage components.
 * 
 * @module  Quizpage
 * @file    This file defines the style and components for the Quizpage 
 *          component.
 * @author  syoung908
 * @version 1.0.0
 * @since   1.0.0
 */

import React, {useEffect} from 'react';
import {makeStyles, ThemeProvider} from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import LoadingWheel from '../../clientUtil/LoadingWheel';
import snackbarSettings from '../../clientUtil/snackbarSettings';
import {theme} from '../../clientUtil/Theme';
import {useParams} from "react-router-dom";
import {useQuizStore} from '../../stores/quizStore';
import {useSnackbar} from 'notistack';
import {useObserver} from "mobx-react";
import Navbar from "./QuizNavbar";
import QuizUI from "./QuizUI"; 
import ResultsPage from './ResultsPage';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'column',
    minHeight: '98vh',
    overflow: 'hidden',
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
  },
}));

export default function Quizpage() {
  const classes = useStyles();

  const quizStore = useQuizStore();
  const {quizID} = useParams();
  const {enqueueSnackbar, } = useSnackbar();

  useEffect(() => {
    quizStore.quizID = quizID;
    quizStore.fetchQuestions(quizID)
    .then(err => {
      if (err) enqueueSnackbar(`${err}`, snackbarSettings('error'));
    });
  }, []);

  const loadingComponent = (
    <Backdrop className={classes.backdrop} open={true} invisible={true}>
      <LoadingWheel />
    </Backdrop>
  );

  return useObserver(() => (
    <div className={classes.root}>
      <ThemeProvider theme={theme}>
      <Navbar variant={"quiz"}/>
      <div style={{height: '70px', width: '100%'}}/>
        { quizStore.loading 
          ? loadingComponent
          : quizStore.submitted
            ? <ResultsPage quizID={quizID}/>
            : <QuizUI/>
        }
      </ThemeProvider>
    </div>
  ));
}
