import * as serviceWorker from './serviceWorker';

import { StoreProvider, action, createStore } from 'easy-peasy';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import App from './App';
import { CookiesProvider } from 'react-cookie';
import CssBaseline from '@material-ui/core/CssBaseline';
import React from 'react';
import ReactDOM from 'react-dom';
import { SnackbarProvider } from 'notistack';

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

const store = createStore({
  stripeAccountLinks : {},
  setStripeAccountLinks: action((state, payload) => {
    state.stripeAccountLinks=payload;
  }),
  customerLocation: {},
  setCustomerLocation: action((state, payload) => {
    state.customerLocation=payload;
  }),
});

ReactDOM.render(
  <React.StrictMode>
    <StoreProvider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <CookiesProvider>
          <SnackbarProvider maxSnack={3}>
            <App />
          </SnackbarProvider>
        </CookiesProvider>
      </ThemeProvider>
    </StoreProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
