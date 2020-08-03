import React, { Fragment, useEffect } from 'react';
import {useHistory} from 'react-router-dom';
import { Waypoint } from "react-waypoint";
import {makeStyles, MuiThemeProvider, ThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import MUIDataTable from "mui-datatables";
import {red, orange, green} from '@material-ui/core/colors';
import {theme} from '../../clientUtil/Theme';
import {useSnackbar} from 'notistack';
import snackbarSettings from '../../clientUtil/snackbarSettings';

import {timeoutFetch} from '../../clientUtil/TimeoutFetch';
import {useSearchStore} from "../../stores/searchStore";
import {useObserver} from "mobx-react";

import LoadingWheel from '../../clientUtil/LoadingWheel';
import Navbar from './Navbar';
import ToolBar from './Toolbar';

const useStyles = makeStyles((theme) => ({
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
    /*
    animationName: '$animateIn',
    animationDuration: '500ms',
    animationDelay: 'calc(var(--animation-order) * 250ms)',
    animationFillMode: 'both',
    animationTimingFunction: 'ease-in-out',
    */
    animation:'$animateIn 500ms ease-in-out calc(var(--animation-order) * 250ms) both, $gradAnimation 10s ease infinite',
    "&:hover": {
      background: 'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)',
      backgroundSize: '400% 400%',
      //animation: '$gradAnimation 15s ease infinite',
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

  const [data, setData] = React.useState([]);

  const fetchQuizzes = async() => {
    try {
      setData([]);
      searchStore.loading = true;
      searchStore.page =  1;
      const response = await timeoutFetch('/api/quizzes'+ searchStore.queryString(), 'GET');
        if (response.status === 200) {
          const datajson = await response.json();
          setData(datajson.results);
          searchStore.lastPage = (datajson.results.length < PAGE_SIZE);
        } else {
          return(`HTTP Error ${response.status}: ${response.statusText}`);
        }
    } catch (err) {
      return (err.name === 'AbortError') 
        ? 'Request Timed Out' 
        : `Fetch Error: ${err}`;
    } finally {
      searchStore.loading = false;
    }
  };

    
  useEffect(() => {
    fetchQuizzes()
    .then(err => {
      if (err) enqueueSnackbar(`${err}`, snackbarSettings('error'));
    });
  }, []);

  const fetchNextPage = async(nextpage) => {
    try {
      if (searchStore.lastPage) {
        console.log(data.length);
        console.log("LAST PAGE")
        return;
      }

      if (nextpage === searchStore.page) {
        console.log('returning');
        return;
      } else {
        console.log(nextpage);
        searchStore.page = nextpage;
      }

      const response = await timeoutFetch('/api/quizzes'+ searchStore.queryString(), 'GET');
      if (response.status === 200) {
        const datajson = await response.json();
        setData([...data, ...datajson.results]);
        searchStore.lastPage = (datajson.results.length < PAGE_SIZE);
      } else {
        return(`HTTP Error ${response.status}: ${response.statusText}`);
      }
    } catch (err) {
      return (err.name === 'AbortError') 
        ? 'Request Timed Out' 
        : `Fetch Error: ${err}`;
    }
  }

  const openQuiz = (rowData, rowState) => {
    history.push('/quiz/' + rowData[4])
  }

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
      }
    },
    {
      name: "difficulty",
      label: "Difficulty",
      options: {
        customBodyRender: difficultyChip
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
    //responsive: "simple",
    selectableRows: false,
    tableBodyHeight:'500px',
    tableBodyWidth: '100%',
    onRowClick: openQuiz,
    textLabels: {
      body: {
        noMatch: "No Quizzes Found",
      },
    }, 
  }

  options.setRowProps = (row, dataIndex, rowIndex) => {
    return {
      className: classes.row,
      style: {'--animation-order': rowIndex % 15}
    };
  }

  const wayPointName = (dataIndex, rowIndex) => {
    let value = data[dataIndex].name
    if (rowIndex === data.length - 1) {
      return (
        <Fragment>
          <Waypoint
            onEnter={() => {
              console.log("WAYPOINT REACHED for " + (Math.floor((rowIndex+1) / PAGE_SIZE) + 1));
              fetchNextPage(Math.floor((rowIndex+1) / PAGE_SIZE) + 1);
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
          <ToolBar
            fetchQuizzes={fetchQuizzes}
          />
          <Paper className={classes.tableContainer} variant="outlined">
          <MuiThemeProvider theme={getMuiTheme()}>
          {searchStore.loading && loadingComponent}
          {!searchStore.loading &&
            <MUIDataTable 
              //data={searchStore.quizData}
              data={data}  
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