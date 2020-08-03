import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';

import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

const useStyles = makeStyles((theme) => ({
  root: {
    width: 300,
  },
  button: {
    height: 70,
    "&:hover": {
      background: '#344955 !important',
      color: 'white',
      transform: 'scale(1.05)',
      transition: 'all .2s ease-in-out'
    }
  }
}));

export default function QuizNavbar() {
  const classes = useStyles();

  return (
    <BottomNavigation
      showLabels
      className={classes.root}
    >
       <BottomNavigationAction 
        className={classes.button} 
        label="Prev" icon={<ArrowBackIosIcon  fontSize="large"/>} 
      />
       <BottomNavigationAction 
       className={classes.button} 
       label="Next" 
       icon={<ArrowForwardIosIcon fontSize="large"/>} 
       />
    </BottomNavigation>
  );
}