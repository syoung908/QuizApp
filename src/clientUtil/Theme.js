/**
 * MaterialUI Theme
 *
 * Defines the site wide theme.
 *
 * @module  Theme
 * @file    Defines colors, fonts, to be used for style site wide.
 * @author  syoung908
 * @since   1.0.0
 * @version 1.0.0
 */
import {createMuiTheme} from '@material-ui/core/styles';

export const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#4A6572',
      main: '#344955',
      dark: '#232F34',
      contrastText: '#fff',
    },
    secondary: {
      light: '#FFDC65',
      main: '#F9AA33',
      dark: '#C17B00',
      contrastText: '#000',
    },
  },
  typography: {
    fontFamily: [
      'Alata', 'sans-serif'
    ].join(','),
  },
});