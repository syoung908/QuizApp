/**
 * Toolbar.
 *
 * Container component that wraps the SearchBar, DifficultyFilter, and the 
 * random quiz button.
 *
 * @module  Toolbar
 * @file    This file defines the style and components for the Toolbar
 *          component.
 * @author  syoung908
 * @version 1.0.0
 * @since   1.0.0
 */

import React from 'react';
import {useHistory} from 'react-router-dom';
import {makeStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import ShuffleIcon from '@material-ui/icons/Shuffle';

import {useSnackbar} from 'notistack';
import snackbarSettings from '../../clientUtil/snackbarSettings';
import {timeoutFetch} from '../../clientUtil/TimeoutFetch';

import SearchBar from './SearchBar';
import DifficultyFilter from './DifficultyFilter';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  randomButtonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  randomButton: {
    color: 'white',
    backgroundColor: '#344955',
    '&:hover': {
      background: 'linear-gradient(45deg, rgba(52,73,85,1) 0%, rgba(57,106,100,1) 45%, rgba(68,170,130,1) 65%, rgba(74,210,149,1) 100%);',
      backgroundSize: '400% 400%',
      animation: `$gradAnimation 10s ease infinite`,
    }
  },
  '@keyframes gradAnimation': {
    "0%": {
      backgroundPosition: '0% 50%',
    },
    "50%": {
      backgroundPosition: '100% 50%',
    },
    "100%": {
      backgroundPosition: '0% 50%',
    }
  },
}));

export default function ToolBar(props) {
  const classes = useStyles();  
  const history = useHistory();
  const {enqueueSnackbar, } = useSnackbar();


  /**
   * getRandomQuiz
   * 
   * Fetches a random quiz from the database and then redirects the user to 
   * that random quiz.
   * 
   * @return {String} An error message if an error has occurred. Null otherwise.
   */
  const getRandomQuiz = async() => {
    try {
      const response = await timeoutFetch('http://localhost:8080/api/random', 
                                          'GET');
        if (response.status === 200) {
          const datajson = await response.json();
          history.push('/quiz/' + datajson.results._id)
        } else {
          return(`HTTP Error ${response.status}: ${response.statusText}`);
        }
    } catch (err) {
      return (err.name === 'AbortError') 
        ? 'Request Timed Out' 
        : `Fetch Error: ${err}`;
    } 
  }

  // Callback function for random button onClick
  const randomHandler = () => {
    getRandomQuiz()
    .then(err => {
      if (err) enqueueSnackbar(`${err}`, snackbarSettings('error'));
    });
  }

  // Random button
  const randomButton = (
    <div className={classes.randomButtonContainer}>
      <Button
        className={classes.randomButton}
        startIcon={<ShuffleIcon />}
        variant="contained"
        disableElevation
        onClick={randomHandler}
      >
        <Typography variant='caption' style={{whiteSpace: 'nowrap'}}>
          Random Quiz
        </Typography>
      </Button>
    </div>
  );

  return(
    <Paper className={classes.root} elevation={0} >
      <Grid container spacing={2} alignItems="flex-end" justify="space-between">
        <Grid item xs={4}>
          <SearchBar fetchQuizzes={props.fetchQuizzes}/>
        </Grid>
        <Grid item xs={4}>
          <DifficultyFilter fetchQuizzes={props.fetchQuizzes}/>
        </Grid>
        <Grid item xs={3}>
          {randomButton}
        </Grid>
      </Grid>
    </Paper>
  );
}