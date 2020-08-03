import React from 'react';
import clsx from 'clsx';
import {makeStyles} from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import SendIcon from '@material-ui/icons/Send';

import {useSnackbar} from 'notistack';
import snackbarSettings from '../../clientUtil/snackbarSettings';
import {useQuizStore} from '../../stores/quizStore';
import {useObserver} from "mobx-react";

const useStyles = makeStyles((theme) => ({
  button: {
    height: '36px',
  },

  '@keyframes rotate': {
    '100%': {
      transform: 'rotate(1turn)',
    }
  },

  activated: {
    '&:before': {
      opacity: '1 !important',
    }
  },

  disabled: {
    '&:after': {
      background: '#5c6d77 !important',
    }
  },

  container: {
    display: 'flex',
    position: 'relative',
    zIndex: 0,
    //width: '100%',
    //height: '100%',
    borderRadius: '10px',
    overflow: 'hidden',
    padding: '10px',
    paddingLeft: '20px',
    paddingRight: '20px',

    '&:hover': {
      '&:after': {
        background: '#339368',
      }
    },

    "&:before": {
      opacity: 0,
      content: '""',
      position: 'absolute',
      zIndex: -2,
      left: '-25%',
      top: '-100%',
      width: '150%',
      height: '300%',
      backgroundColor: '#ffffff00',
      backgroundRepeat: 'no-repeat',
      backgroundSize: '50% 50%, 50% 50%',
      backgroundPosition: '0 0, 100% 0, 100% 100%, 0 100%',
      backgroundImage: 'linear-gradient(#ffffff00, #ffffff00), linear-gradient(#ffffff, #ffffff), linear-gradient(#ffffff00, #ffffff00), linear-gradient(#ffffff, #ffffff)',
      animation: '$rotate 4s linear infinite',
    },

    '&:after': {
      content: '""',
      position: 'absolute',
      zIndex: -1,
      left: '3px',
      top: '3px',
      width: 'calc(100% - 6px)',
      height: 'calc(100% - 6px)',
      background: '#4AD295',
      borderRadius: '8px',
    },
  }

}));

//backgroundImage: 'linear-gradient(#399953, #399953), linear-gradient(#fbb300, #fbb300), linear-gradient(#d53e33, #d53e33), linear-gradient(#377af5, #377af5)',

export default function ButtonBases(props) {
  const classes = useStyles();
  const quizStore = useQuizStore();
  const {enqueueSnackbar, } = useSnackbar();

  const color = (quizStore.submitted) ? '#A9A9A9': 'white';

  const handleSubmit = () => {
    quizStore.handleSubmitButton()
    .then(err => {
      if (err) enqueueSnackbar(`${err}`, snackbarSettings('error'));
    });
  } 

  return useObserver(() => (
      <ButtonBase className={classes.button}
        disabled={quizStore.submitted}
        onClick={handleSubmit}
      >
      <div className={clsx(classes.container,
          {[classes.activated]: quizStore.remaining === 0 && quizStore.length !== 0 && !quizStore.submitted},
          {[classes.disabled]: quizStore.submitted}
      )}
      >
        <Typography style={{color: color}}> Submit </Typography>
        <SendIcon style={{color: color, marginLeft: '10px'}}/>
      </div>
      </ButtonBase>
  ));
}