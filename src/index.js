import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { CookiesProvider } from 'react-cookie';
import { SnackbarProvider } from 'notistack';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, ThemeProvider  } from '@material-ui/core/styles';

const theme = createMuiTheme({
  typography: {
    body1:{
      fontSize: '0.875rem',
    }
  },
  overrides: {
    MuiListItemText:{
      primary:{
        fontWeight: 'bold'
      }
    }
  }
});
ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CookiesProvider>
        <SnackbarProvider maxSnack={3}>
          <App />
        </SnackbarProvider>
      </CookiesProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
