/**
 * QuizNavbar.
 *
 * Navigation Bar for the QuizPage component. In addition to the Logo the 
 * Bavbar contains a progress bar that fill based on the number of questions
 * completed and a submit button that submits the quiz to be scored.
 *
 * @module  QuizNavbar
 * @file    This file defines the style and components for the QuizNavbar 
 *          component.
 * @author  syoung908
 * @version 1.0.0
 * @since   1.0.0
 */
import React from 'react';
import {useHistory} from 'react-router-dom';
import {makeStyles, createMuiTheme, 
        ThemeProvider, withStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';

import LinearProgress from '@material-ui/core/LinearProgress';

import HomeIcon from '../QIcon.svg'
import {useQuizStore} from '../../stores/quizStore';
import {useObserver} from "mobx-react";

import SubmitButton from '../Custom/SubmitButton';

const useStyles = makeStyles((theme) => ({
  root: {
    zIndex: theme.zIndex.drawer + 1,
  },
  logoButton: {
    display: 'flex',
    flexDirection: 'row',
    marginRight: '10px',
  },
  logolabel: {
    fontFamily: 'Alata, sans-serif',
    color: 'white',
    fontSize: '2.5em',
    whiteSpace: "nowrap",
  },
  statusBar: {
    maxWidth:'850px', 
  },
  statusContent: {
    display:  'flex',
  },
  progressBarContainer: {
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    flexGrow: 1,
    paddingRight: theme.spacing(2),
  },
  submitButtonContainer: {
    display: 'flex', 
    justifyContent: 'flex-end', 
    flexShrink: 0 
  }
}));

const getMuiTheme = () => createMuiTheme({
  overrides: {
    MuiToolbar: {
      
      regular: {
        minHeight: '64px',
        '@media (min-width: 0px) and (orientation: landscape)': {
          minHeight: '64px',
        },
      },
      
      gutters: {
        paddingLeft: 24,
        paddingRight: 24,
        '@media (min-width: 600px)': {
          paddingLeft: 24,
          paddingRight: 24,
        },
      },
    },
  }
});

const BorderLinearProgress = withStyles((theme) => ({
  root: {
    height: 10,
    borderRadius: 5,
    width: '100%',
    maxWidth: '750px',
  },
  colorPrimary: {
    backgroundColor: "white",
  },
  bar: {
    borderRadius: 5,
    backgroundColor: '#4AD295',
  },
}))(LinearProgress);

export default function Navbar(props) {
  const classes = useStyles();
  const history = useHistory();
  const quizStore = useQuizStore();

  const LogoButton = (
    <ButtonBase
      className={classes.logoButton}
      onClick={()=> {history.push('/')}}
    >
      <HomeIcon style={{width: '50px', height: '50px'}}/>
      <Typography
        className={classes.logolabel}
        variant="h4"
      >
        uizMe!
      </Typography>
    </ButtonBase>
  );

  return useObserver(() => (
    <AppBar className={classes.root} position="fixed">
      <Grid item sm={12} xs={12} className={classes.container}>
      <ThemeProvider theme={getMuiTheme}>
      <Toolbar>
        {LogoButton}
        <Grid container
          direction="row"
          justify="center"
          alignItems="center"
        >
          <Grid item xs={12} className={classes.statusBar}>
            <div className={classes.statusContent}
            >
              <div className={classes.progressBarContainer}>
                <BorderLinearProgress
                  variant="determinate" 
                  value={quizStore.completeRate}
                />
              </div>
              <div className={classes.submitButtonContainer}>
                <SubmitButton/>
              </div>
            </div>
          </Grid>
        </Grid>
      </Toolbar>
      </ThemeProvider>
      </Grid>
    </AppBar>
  ));
}