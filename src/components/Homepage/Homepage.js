/**
 * Homepage.
 *
 * Primary UI component that represents the Homepage of the WebApp. Contains a
 * text search bar, a difficulty filter, a random quiz button, and a table to 
 * display quiz results.
 *
 * @module  Homepage
 * @file    This file defines the style and components for the Homepage 
 *          component.
 * @author  syoung908
 * @version 1.0.0
 * @since   1.0.0
 */

import React, { Fragment, useEffect } from 'react';
import {useHistory} from 'react-router-dom';
import { Waypoint } from "react-waypoint";
import {makeStyles, MuiThemeProvider, 
        ThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import MUIDataTable from "mui-datatables";
import {red, orange, green} from '@material-ui/core/colors';
import {theme} from '../../clientUtil/Theme';
import {useSnackbar} from 'notistack';
import snackbarSettings from '../../clientUtil/snackbarSettings';

import {useSearchStore} from "../../stores/searchStore";
import {useObserver} from "mobx-react";

import LoadingWheel from '../../clientUtil/LoadingWheel';
import Navbar from './Navbar';
import ToolBar from './Toolbar';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: '500px',
  },

  contentContainer: {
    maxWidth: '1000px',
    width: '100%',
  },

  tableContainer: {
    width: '100%'
  },

  row: {
    animation:'$animateIn 500ms ease-in-out calc(var(--animation-order) * '+ 
              '250ms) both, $gradAnimation 10s ease infinite',
    "&:hover": {
      background: 'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)',
      backgroundSize: '400% 400%',
      animationDelay: 0,
      color: 'white',
      fontWeight: 'bold',
    },
  },

  '@keyframes animateIn': {
    '0%' :{
      opacity: 0,
      transform: 'scale(0.6) translateY(-8px)',
    },
    
    '100%': {
      opacity: 1,
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

// MUI Datatable Styling Override
const getMuiTheme = () => createMuiTheme({
  overrides: {
    MUIDataTableHeadCell: {
      root: {
        '&:nth-child(1)': {
          minWidth: 200
        },
        boxShadow: '0px 1px rgba(0, 0, 0, 0.12)',
      }
    },
    MuiTableRow: {
      root: {
        cursor: 'pointer',
      },
    },

    MuiTableCell: {
      head: {
        fontWeight: 'bold',
      }, 
    },
  }
});

export default function Homepage() {
  const classes = useStyles();
  const searchStore = useSearchStore();
  const history = useHistory();
  const {enqueueSnackbar, } = useSnackbar();
  const PAGE_SIZE = 15;

  useEffect(() => {
    searchStore.fetchQuizzes()
    .then(err => {
      if (err) enqueueSnackbar(`${err}`, snackbarSettings('error'));
    });
  }, []);

  /**
   * openQuiz
   * 
   * Callback function that opens the quiz associated with the row that the 
   * user clicked on.
   * 
   * @since  1.0.0
   * 
   * @param {Object} rowData   All data members of the clicked row
   * @param {Object} rowState  The current state of the clicked row
   */
  const openQuiz = (rowData, rowState) => {
    history.push('/quiz/' + rowData[4])
  }

  // Loading Screen
  const loadingComponent = (
    <div style={{
      width: '100%', 
      height: '500px', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center' 
    }}>
      <LoadingWheel />
    </div>
  );

  // Custom column that displays the tags of the row as a Chip
  const difficultyChip = (value, tableMeta, updateValue) => {
    let color="primary"
    switch (value.toLowerCase()) {
      case 'easy': color = green[500]; break;
      case 'medium': color = orange[500]; break;
      case 'hard': color = red[500]; break;
      default: color = "primary"
    }
  
    return(
      <Chip
        label={value}
        size="small"
        key={value}
        onClick={()=> openQuiz(tableMeta.rowData)}
        style={{
          backgroundColor: color, 
          color: "white",
          fontFamily: 'Alata, sans-serif',
        }}
      />
    );
  }

  // Custom column that displays the tags of the row as Chips
  const tagChip = (value, tableMeta, updateValue) => {
    let chips = [];
    value.forEach(tag => {
      chips.push(
        <Chip
          label={tag}
          size="small"
          key={tag + tableMeta.rowIndex + "_" + tableMeta.columnIndex}
          onClick={()=> openQuiz(tableMeta.rowData)}
          style={{
            color: "white",
            fontFamily: 'Alata, sans-serif',
            backgroundColor: '#344955',
            margin: '2px',
            padding: '10px',
          }}
        />
      )
    });
    return(
      <div style={{maxWidth: '300px'}}>
        {chips}
      </div>
    );
  }

  const parseDifficulty = (difficulty) => {
    switch(difficulty){
      case 'Easy': return 1;
      case 'Medium': return 2;
      case 'Hard': return 3;
    }
  }

  // MUI datatables custom columns options
  const columns = [
    {
      name: "name",
      label: "Name",
      options: {
        setCellProps: value => {
          return {
            style: {
              fontSize: '1em',
              whiteSpace: 'nowrap',
              color: 'inherit'
            }
          }
        }
      }
    },
    {
      name: "tags",
      label: "Tags",
      options: {
        customBodyRender: tagChip
      },
      sort: false,
    },
    {
      name: "difficulty",
      label: "Difficulty",
      options: {
        customBodyRender: difficultyChip,
        sortCompare: (order) => {
          return (obj1, obj2) => {
            let val1 = parseDifficulty(obj1.data);
            let val2 = parseDifficulty(obj2.data);
            return (val1 - val2) * (order === 'asc' ? 1 : -1);
          };
        }
      }
    },
    {
      name: "length",
      label: "Questions",
      options: {
        setCellProps: value => {
          return {
            style: {
              fontSize: '1em',
              whiteSpace: 'nowrap',
              textAlign: 'center',
              color: 'inherit'
            }
          }
        }
      }
    },
    {
      name: "_id",
      label:"ID",
      options: {
        display: 'excluded',
        filter: false,
      }
    }
  ]

  // MUI Datatables Options
  const options = {
    elevation: 0,
    fixedHeader: true,
    filter: false,
    search: false,
    print: false,
    download: false,
    viewColumns: false,
    customToolbar: null,
    customFooter: null,
    pagination: false,
    responsive: "standard",
    selectableRows: false,
    tableBodyHeight:'500px',
    tableBodyWidth: '100%',
    onRowClick: openQuiz,
    textLabels: {
      body: {
        noMatch: "No Quizzes Found",
      },
    },
    setRowProps: (row, dataIndex, rowIndex) => {
      return {
        className: classes.row,
        style: {'--animation-order': rowIndex % 15}
      };
    }
  }


  /**
   * wayPointName
   * 
   * @since   1.0.0
   * 
   * Custom row value that creates a label with a Waypoint that will trigger
   * a request to fetch the next page on entry. Is used to implement infinite
   * scrolling. It will attatch a waypoint to the current last element in the
   * table. 
   * 
   * @param  {Number}  dataIndex   The index of the data in the original data
   * @param  {Number}  rowIndex    The index of the row in the table
   */
  const wayPointName = (dataIndex, rowIndex) => {
    let value = searchStore.data[dataIndex].name
    if (rowIndex === searchStore.data.length - 1) {
      return (
        <Fragment>
          <Waypoint
            onEnter={() => {
              searchStore.fetchNextPage(
                Math.floor((rowIndex+1) / PAGE_SIZE) + 1
              );
            }}
          />
          {value}
        </Fragment>
      );
    } else {
      return <Fragment>{value}</Fragment>;
    }
  }
  columns[0].options.customBodyRenderLite = wayPointName;

  return useObserver(() => (
    <div className={classes.root}>
      <Navbar variant="homepage"/>
      <div style={{height: '94px', width: '100%'}}/>
      <ThemeProvider theme={theme}>
        <div className={classes.contentContainer}>
          <ToolBar/>
          <Paper className={classes.tableContainer} variant="outlined">
          <MuiThemeProvider theme={getMuiTheme()}>
          {searchStore.loading && loadingComponent}
          {!searchStore.loading &&
            <MUIDataTable 
              data={searchStore.data}  
              columns={columns} 
              options={options} 
            />
          }
          </MuiThemeProvider>
          </Paper>
        </div>
      </ThemeProvider>
    </div>
  ));
}