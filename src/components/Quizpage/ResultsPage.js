import React, { useEffect } from 'react';
import {useHistory} from 'react-router-dom';
import {makeStyles, withStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';

import HomeIcon from '@material-ui/icons/Home';
import ReplayIcon from '@material-ui/icons/Replay';

import {RadialChart} from 'react-vis';
import {useQuizStore} from '../../stores/quizStore';
import {useObserver} from "mobx-react"

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },

  container: {
    minHeight: '400px',
    maxWidth: '800px',
    width: '100%',
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  
  chartContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },

  resultsLabel: {
    position: 'absolute',
    top: '35%',
    left: '16%',
    textAlign: 'center',
    maxWidth: '350px',
  },

  chart: {
    position: 'relative',
  },

  buttonPanel: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    justifyContent: 'space-between'
  },

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

export default function ResultsPage() {
  const classes = useStyles();
  const quizStore = useQuizStore();
  const history = useHistory();

  const [data, setData] = React.useState({
    correct: 0,
    total: quizStore.results.total,
  })

  useEffect(() =>{
    setTimeout(()=> {
      setData({
        correct: quizStore.results.correct,
        total: quizStore.results.total,
      })
    }, 1500)
  }, [])

  const resultsLabel = (
    <div className={classes.resultsLabel}>
      <Typography variant="h2" style={{paddingBottom: '20px'}}>
        {Number.parseFloat(((quizStore.results.correct / quizStore.results.total) * 100).toFixed(2)).toString()}%
      </Typography>
      <Typography>
        {`You answered ${quizStore.results.correct} questions correctly out of ${quizStore.results.total}`} 
      </Typography>
    </div>
  );
  
  const HomepageButton = (
    <StyledButton
      variant="contained"
      className={classes.button}
      size={"large"}
      disableElevation
      endIcon={<HomeIcon/>}
      onClick={()=> {history.push('/')}}
    >
      Home
    </StyledButton>
  );

  const ResetButton = (
    <StyledButton
      variant="contained"
      className={classes.button}
      size={"large"}
      disableElevation
      endIcon={<ReplayIcon/>}
      onClick={()=> {quizStore.reset()}}
    >
      Retry
    </StyledButton>
  );


  return useObserver(() => (
    <div className={classes.root}>
      <Card className={classes.container} variant={"outlined"}>
        <CardHeader
          style={{textAlign: 'center'}}
          title={
            <Typography variant="h4">
              Your Score
            </Typography>
          }
        />
        <CardContent className={classes.chartContainer}>
          <div className={classes.chart}>
            <RadialChart
              className={'donut-chart-example'}
              data={[
                {
                  angle: data.correct, //quizStore.results.correct,
                  color: '#4AD295',
                }, 
                {
                  angle: data.total - data.correct,//quizStore.results.total - quizStore.results.correct,
                  color: '#344955',
                }
              ]}
              width={500}
              height={500}
              innerRadius={200}
              radius={250}
              animation={"gentle"}
              colorType={"literal"}
            />
            {resultsLabel}
          </div>
        </CardContent>
        <CardActions className={classes.buttonPanel}>
          {HomepageButton}
          {ResetButton}
        </CardActions>
      </Card>
    </div>
  ));
}