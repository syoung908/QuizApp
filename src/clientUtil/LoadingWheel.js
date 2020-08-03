/**
 * LoadingWheel.
 *
 * Defines the components and JSS styling for the site wide loading wheel.
 *
 * @module  LoadingWheel
 * @file    Defines the components and JSS styling for the site wide loading 
 *          wheel.
 * @author  syoung908
 * @since   1.0.0
 * @version 1.0.0
 */

import React from 'react';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  fancyspinner: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '5rem',
    height: '5rem',
  },

  ring1: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: '4rem',
    height: '4rem',
    borderRadius: '50%',

    borderWidth: '0.5rem',
    borderStyle: 'solid',
    borderColor: 'transparent',
    animation: '2s $fancy infinite alternate',
    
    borderLeftColor: '#344955',
    borderRightColor: '#344955',
  },

  ring2: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: '4rem',
    height: '4rem',
    borderRadius: '50%',

    borderWidth: '0.5rem',
    borderStyle: 'solid',
    borderColor: 'transparent',
    animation: '2s $fancy infinite alternate',

    borderTopColor: '#4AD295',
    borderBottomColor: '#4AD295',
    animationDelay: '1s',
  },

  dot: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

    width: '1rem',
    height: '1rem',
    backgroundColor: '#4AD295',
    position: 'absolute',
    borderRadius: '50%',

    animation: '4s $colorchange infinite alternate',
    animationTimingFunction: 'ease-in-out',
  },

  '@keyframes fancy': {
    "to": {
      transform: 'rotate(360deg) scale(0.5)',
    }
  },

  '@keyframes colorchange': {
    "from": {
      backgroundColor: '#4AD295'
    },
    "to": {
      backgroundColor: '#344955'
    }
  },
}));

export default function LoadingWheel() {
  const classes = useStyles();

  return(
    <div className={classes.fancyspinner}>
      <div className={classes.ring1}/>
      <div className={classes.ring2}/>
      <div className={classes.dot}/>
    </div>
  );
}