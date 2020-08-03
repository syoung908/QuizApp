import React from 'react';
import {useHistory} from 'react-router-dom';
import {makeStyles, createMuiTheme, ThemeProvider} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import HomeIcon from '../QIcon.svg'

const useStyles = makeStyles((theme) => ({
  root: {
    zIndex: theme.zIndex.drawer + 1,
  },

  logoButton: {
    display: 'flex',
    flexDirection: 'row',
  },

  logolabel: {
    fontFamily: 'Alata, sans-serif',
    color: 'white',
    fontSize: '2.5em',
    whiteSpace: "nowrap",
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

//<img src={HomeIcon} height="50" width="50" alt="Logo"/>
export default function Navbar(props) {
  const classes = useStyles();
  const history = useHistory();

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

  return (
    <AppBar className={classes.root} position="fixed">
      <Grid item sm={12} xs={12} className={classes.container}>
      <ThemeProvider theme={getMuiTheme}>
      <Toolbar>
        {LogoButton}
      </Toolbar>
      </ThemeProvider>
      </Grid>
    </AppBar>
  );
}