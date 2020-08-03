import React from 'react';
import {createMuiTheme} from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';

import {red, orange, green} from '@material-ui/core/colors';

const openQuiz = (rowData, rowState) => {
  console.log(rowData);
}

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
      disableRipple
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
        disableRipple
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

export {getMuiTheme, columns, options}
