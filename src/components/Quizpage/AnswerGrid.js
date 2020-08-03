/**
 * AnswerGrid.
 *
 * Quizpage component that displays the answers to the current question. The 
 * user can select answers and change their answer simply by clicking. 
 * Current implementation only works for single choice multiple choice.
 *
 * @module  AnswerGrid
 * @file    This file defines the style and components for the AnswerGrid 
 *          component.
 * @author  syoung908
 * @version 1.0.0
 * @since   1.0.0
 */

import React from 'react';
import {makeStyles, withStyles} from '@material-ui/core/styles';
import MuiAccordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import {useQuizStore} from '../../stores/quizStore';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import {useObserver} from "mobx-react";

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    flexBasis: '5%',
    flexShrink: 0,
    marginRight: theme.spacing(3),
  },
  selected: {
    backgroundColor: '#4AD295'
  },
  notSelected: {
    backgroundColor: 'white'
  }
}));

const Accordion = withStyles({
  root: {
    border: '1px solid rgba(0, 0, 0, .125)',
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
    },
    '&:hover': {
      background: '#344955 !important',
      color: 'white',
      transform: 'scale(1.011)',
    }
  },
  expanded: {},
})(MuiAccordion);

/**
 * AnswerGrid
 * 
 * Container that wraps the answers associated with the question. 
 * 
 * @since  1.0.0
 * 
 * @param {String} props.id  The ID string of the question.
 */
export default function AnswerGrid(props) {
  const classes = useStyles();
  const quizStore = useQuizStore();

  let answerList = [];
  if (quizStore.questions[props.id]) {
    let keys = (Object.keys(quizStore.questions[props.id].answers));
    answerList = keys.map(key => (
      <AnswerSquare
        key={key}
        id={props.id}
        keyAnswers={key}
        answer={quizStore.questions[props.id].answers[key]}
      />
    ))
  }

  return useObserver(() => (
    <Paper className={classes.root} elevation={0}>
        {answerList}
    </Paper>
  ));
}

/**
 * AnswerSquare 
 * 
 * Subcomponent that contains a single answer.
 * 
 * @since  1.0.0
 * 
 * @param {Number} props.keyAnswers  The key associated with the answer. 
 *                                   (Generally, the letters: a, b, c, d, ...)
 * 
 * @param {String} props.id          The ID string of the associated question.
 * 
 * @param {String} props.answer      The text content of the answer.
 */
function AnswerSquare(props) {
  const classes = useStyles();
  const quizStore = useQuizStore();

  return useObserver(() => (
    <Accordion 
      expanded={false}
      style={
        (quizStore.answers[props.id] === props.keyAnswers )
        ? {backgroundColor: '#4AD295'}
        : {}
      }
      onClick={()=> {
        quizStore.answers[props.id] = props.keyAnswers;
      }}
    >
      <AccordionSummary>
        <Typography 
          className={classes.heading}
          variant="h6"
        > 
          {props.keyAnswers.toUpperCase()} 
        </Typography>
        <Typography 
          className={classes.answer}
          variant="h6"
        > 
          {props.answer}
        </Typography>
      </AccordionSummary>
    </Accordion>
  ));
}