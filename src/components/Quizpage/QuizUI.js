/**
 * QuizUI.
 *
 * Primary UI component that displays the quiz and its constituent questions
 * Contains a QuestionPanel that displays the currently selected question as 
 * well as a Navigation Drawer to select particular questions.
 * 
 * @module  QuizUI
 * @file    This file defines the style and components for the QuizUI component.
 * @author  syoung908
 * @version 1.0.0
 * @since   1.0.0
 */

import React from 'react';
import {useHistory} from 'react-router-dom';
import clsx from 'clsx';
import {makeStyles, withStyles, useTheme} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Drawer from '@material-ui/core/Drawer';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import SwipeableViews from 'react-swipeable-views';
import HomeIcon from '@material-ui/icons/Home';
import Typography from '@material-ui/core/Typography';

import ConfirmationDialog from './ConfirmationDialog';
import QuestionPanel from './QuestionPanel';
import {useQuizStore} from '../../stores/quizStore';
import {useObserver} from "mobx-react";

const drawerWidth = 150;

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
  },
  questionPanel: {
    minHeight: '400px',
    padding: theme.spacing(3),
  },
  indicator: {
    backgroundColor: '#4AD295',
    width: '5px',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    flexGrow: 1,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(2),
    paddingLeft: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  answered: {
    color: '#4AD295 !important',
  },
  emptyPanel: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: '400px',
    maxWidth: '800px',
    flexGrow: 1,
    padding: theme.spacing(3),
    textAlign: 'center',
  },
  buttonPanel: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    justifyContent: 'center',
  },
}));

const StyledTab = withStyles((theme) => ({
  root: {
    textTransform: 'none',
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(15),
    opacity: 1,
    paddingLeft: theme.spacing(5),
    paddingRight: theme.spacing(5),
    '&$selected': {
      color: 'white',
      background: theme.palette.primary.main,
      opacity: 1
    },
    '&:hover': {
      background: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      opacity: 1,
    },
  },
  wrapper: {
    alignItems: "flex-start"
  },
  selected:{}
}))((props) => <Tab disableRipple {...props}/>);

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      style={{display: 'flex', flexGrow: 1}}
      {...other}
    >
      {value === index && (
        <Box style={{
          display: 'flex',
          justifyContent: 'center',
          flexGrow: 1
        }}
        >
          {children}
        </Box>
      )}
    </div>
  );
}

const StyledButton = withStyles({
  root: {
    boxShadow: 'none',
    textTransform: 'none',
    backgroundColor: '#344955',
    color: 'white',
    alignSelf: 'flexEnd',
    '&:hover': {
      backgroundColor: '#4A6572',
      borderColor: '#0062cc',
    },
  },
})(Button);

export default function QuizUI() {
  const classes = useStyles();
  const quizStore = useQuizStore();
  const history = useHistory();
  const theme = useTheme();
  const [open, ] = React.useState(true);

  const questionTabs = [];
  const questionPanels = [];

  if (quizStore.questions) {
    let length = Object.keys(quizStore.questions).length;
    for (let i = 0; i < length; i++) {
      questionTabs.push(
        <StyledTab
          className={clsx({
            [classes.answered]: (quizStore.answers[quizStore.indexMap[i]]),
          })}
          key={i}
          label={`Question ${i+1}`}
          {...a11yProps(i)}
        />
      );

      questionPanels.push(
        <TabPanel
          value={quizStore.currentQuestionIndex}
          index={i}
          key={"tab-"+ i}
          dir={theme.direction}
        >
          <QuestionPanel
            id={quizStore.indexMap[i]}
            index={i}
          />
        </TabPanel>
      );
    }
  }

  // Handles selection for Question navigation drawer
  const handleChange = (event, newValue) => {
    quizStore.currentQuestionIndex = newValue;
  };

  const HomeButton = (
    <StyledButton
      variant="contained"
      className={classes.button}
      size={"large"}
      disableElevation
      endIcon={<HomeIcon/>}
      onClick={()=> {history.push('/')}}
    >
      Go Back Home
    </StyledButton>
  )

  /**
   * Displayed when no questions are found in the database or the client fails
   * to load any queries
   */
  const emptyQuizPanel = (
    <Card className={classes.emptyPanel} variant={'outlined'}>
      <CardHeader
        title={'No Questions Found'}
      />
      <CardContent style={{height: '100%'}}>
        <Typography variant="h6">
          No questions were found in our database for this quiz. <br/>
          Either an error has occurred
          or there are no questions for this quiz yet.
        </Typography>
      </CardContent>
      <CardActions className={classes.buttonPanel}>
        {HomeButton}
      </CardActions>
  </Card>
  );

  return useObserver(() => (
    <div className={classes.root}>
      <ConfirmationDialog/>
      <Drawer
        className={classes.drawer}
        classes={{
          paper: classes.drawerPaper,
        }}
        variant="persistent"
        anchor="left"
        open={true}
      >
        <div style={{height: '95px', width: '100%'}}/>
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={quizStore.currentQuestionIndex}
          onChange={handleChange}
          aria-label="Vertical tabs"
          className={classes.tabs}
          classes={{
            indicator: classes.indicator
          }}
        >
          {questionTabs}
        </Tabs>
      </Drawer>
      
      <div className={clsx(classes.content, {
            [classes.contentShift]: open,
          })}
      >
        {quizStore.length !== 0 && <SwipeableViews
          axis={theme.direction === 'ltr' ? 'x-reverse' : 'x'}
          index={quizStore.currentQuestionIndex}
        >
          {questionPanels}
        </SwipeableViews>}
        {quizStore.length === 0 && emptyQuizPanel}
      </div>
    </div>
  ));
}