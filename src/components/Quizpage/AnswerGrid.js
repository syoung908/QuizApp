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
    //transition: 'all .2s ease-in-out',
    '&:hover': {
      background: '#344955 !important',
      color: 'white',
      transform: 'scale(1.011)',
    }
  },
  expanded: {},
})(MuiAccordion);

export default function AnswerGrid(props) {
  const classes = useStyles();
  const quizStore = useQuizStore();

  const [selectedAnswer, setSelectedAnswer] = React.useState("");

  const changeAnswer = (id) => {
    setSelectedAnswer(id);
    console.log(selectedAnswer);
  }

  let answerList = [];
  if (quizStore.questions[props.id]) {
    //console.log(quizStore.questions[props.id].answers);
    let keys = (Object.keys(quizStore.questions[props.id].answers));
    answerList = keys.map(key => (
      <AnswerSquare
        key={key}
        id={props.id}
        keyAnswers={key}
        answer={quizStore.questions[props.id].answers[key]}
        selected={(selectedAnswer === props.id)}
        setSelected={changeAnswer}
      />
    ))
  }

  return useObserver(() => (
    <Paper className={classes.root} elevation={0}>
        {answerList}
    </Paper>
  ));
}

function AnswerSquare(props) {
  const classes = useStyles();
  const quizStore = useQuizStore();

  //const [expanded, setExpanded] = React.useState(false);

  return useObserver(() => (
    <Accordion 
      expanded={false}
      style={
        (quizStore.answers[props.id] === props.keyAnswers )
        ? {backgroundColor: '#4AD295'}
        : {}
      }
      //onMouseOver={() => {setExpanded(true)}}
      //onMouseLeave={() => {setExpanded(false)}}
      onClick={()=> {
        quizStore.answers[props.id] = props.keyAnswers;
        //console.log(quizStore.answers[props.id]);
        //props.setSelected(props.keyAnswers);
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