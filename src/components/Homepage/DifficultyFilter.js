/**
 * DifficultyFilter.
 *
 * Homepage UI Component that allows the User to filter Quiz results by toggling
 * the difficulty buttons (Easy, Medium, Hard)
 *
 * @module  DifficultyFilter
 * @file    This file defines the style and components for the DifficultyFilter
 *          Homepage component.
 * @author  syoung908
 * @version 1.0.0
 * @since   1.0.0
 */

import React from "react";
import {makeStyles, withStyles} from '@material-ui/core/styles';

import Chip from '@material-ui/core/Chip';
import FormHelperText from '@material-ui/core/FormHelperText';
import Paper from '@material-ui/core/Paper';
import {red, orange, green, grey} from '@material-ui/core/colors';

import {useObserver} from "mobx-react";
import {useSearchStore} from "../../stores/searchStore";

const difficulties = ["Easy", "Medium", "Hard"];

const difficultyColors = {
  "Easy": green[500],
  "Medium": orange[500],
  "Hard": red[500]
}

const StyledChip = withStyles({
  root: {
    "&:hover": {
      opacity: 0.7,
    }
  }
})(Chip);

const useStyles = makeStyles((theme) => ({
  difficultyFilter: {
    width: '100%',
  },
  difficultyFilterChips: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    padding: theme.spacing(1),
    paddingBottom: 0,
  },
  difficultyFilterLabel: {
    marginLeft: theme.spacing(2),
  },
}));

export default function DifficultyFilter() {
  const classes = useStyles();

  const searchStore = useSearchStore();

  return useObserver(() =>(
    <Paper elevation={0}
      className={classes.difficultyFilter}
    >
      <FormHelperText 
        id="difficulty-filter-helper-text"
        className={classes.difficultyFilterLabel}
      >
        Filter Difficulty
      </FormHelperText>
      <div className={classes.difficultyFilterChips}>
      {
        difficulties.map(value => (
          <StyledChip
            label={value}
            size="small"
            key={value}
            aria-label={`${value}-button`}
            onClick={()=> {
              searchStore.toggleDifficulty(value);
              searchStore.fetchQuizzes();
            }}
            style={{
              backgroundColor: ((searchStore.difficultyFilter[value]) 
                ? difficultyColors[value]
                : grey[400]),
              fontFamily: 'Alata, sans-serif',
              marginLeft: '5px',
              marginRight: '5px',
              color: 'white',
            }}
          />
        ))
      }
      </div>
    </Paper>
  ));
}