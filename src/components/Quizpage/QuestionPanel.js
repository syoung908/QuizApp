/**
 * QuestionPanel.
 *
 * Primary QuizPage component that contains all subcomponents for each question.
 * The QuestionPanel contains the question and all answers associated with that
 * question. Each question has their own QuestionPanel.
 *
 * @module  QuestionPanel
 * @file    This file defines the style and components for the QuestionPanel
 *          component.
 * @author  syoung908
 * @version 1.0.0
 * @since   1.0.0
 */

import React from 'react';
import {makeStyles, withStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';

import {useObserver} from "mobx-react";
import {useQuizStore} from '../../stores/quizStore';

import {useSnackbar} from 'notistack';
import snackbarSettings from '../../clientUtil/snackbarSettings';

import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

import AnswerGrid from './AnswerGrid';

const useStyles = makeStyles((theme) => ({
  questionPanel: {
    minHeight: '400px',
    maxWidth: '800px',
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  buttonPanel: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    justifyContent: 'space-between'
  },
  submit: {
    root: {
      backgroundColor: '#4AD295 ! important',
    }
  }
}));

const StyledButton = withStyles({
  root: {
    boxShadow: 'none',
    textTransform: 'none',
    backgroundColor: '#344955',
    color: 'white',
    alignSelf: 'flexEnd',
    width: '120px',
    '&:hover': {
      backgroundColor: '#4A6572',
      borderColor: '#0062cc',
    },
  },
})(Button);

export default function QuestionPanel(props) {
  const classes = useStyles();
  const quizStore = useQuizStore();
  const {enqueueSnackbar, } = useSnackbar();

  // Go to previous question
  const handlePrev = () => {
    quizStore.currentQuestionIndex--;
  }

  // Go to next question, or submit if last question.
  const handleNext = () => {
    if (quizStore.currentQuestionIndex !== quizStore.length - 1) {
      quizStore.currentQuestionIndex++;
    } else {
      quizStore.handleSubmitButton()
      .then(err => {
        if (err) enqueueSnackbar(`${err}`, snackbarSettings('error'));
      });
    }
  }

  const PrevButton = (
    <StyledButton
      variant="contained"
      className={classes.button}
      startIcon={<ArrowBackIosIcon/>}
      size={"large"}
      disableElevation
      disabled={quizStore.currentQuestionIndex === 0}
      onClick={handlePrev}
    >
      Back
    </StyledButton>
  );

  const NextButton = (
    <StyledButton
      style ={
        (quizStore.currentQuestionIndex === quizStore.length - 1) 
        ? {backgroundColor: '#4AD295'}
        : {} 
      }
      variant="contained"
      className={classes.button}
      endIcon={<ArrowForwardIosIcon/>}
      size={"large"}
      disableElevation
      onClick={handleNext}
    >
      {(quizStore.currentQuestionIndex === quizStore.length - 1) ? 'Submit' : 'Next'}
    </StyledButton>
  );

  return useObserver(() => (
    <Card className={classes.questionPanel} variant="outlined">
      <CardHeader
        title={"Question " + (props.index + 1)}
      />
      <CardContent>
        <Typography variant="h6">
          {(quizStore.questions[props.id]) ? quizStore.questions[props.id].question : ""}
        </Typography>
      </CardContent>
      <CardContent>
        <AnswerGrid id={props.id}/>
      </CardContent>
      <CardActions className={classes.buttonPanel}>
        {PrevButton}
        {NextButton}
      </CardActions>
    </Card>
  ));
}