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
    body1: {
      fontSize: '0.875rem',
    }
  },
  overrides: {
    MuiListItemText: {
      primary: {
        fontWeight: 'bold'
      }
    }
  }
});

const store = createStore({
  stripeAccountLinks: {},
  setStripeAccountLinks: action((state, payload) => {
    state.stripeAccountLinks = payload;
  }),
  customerLocation: {},
  setCustomerLocation: action((state, payload) => {
    state.customerLocation = payload;
  }),
  currentLocation: [],
  setCurrentLocation: action((state, payload) => {
    state.currentLocation = payload;
    state.cart = state.cart.map(item => ({ ...item, targetLocation: payload }));
    console.log(state.cart);
  }),
  locations: [],
  setLocations: action((state, payload) => {
    state.locations = payload;
  }),
  cart: [],
  addToCart: action((state, payload) => {
    state.cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const item = state.cart.find(o => o.location_id === payload.location_id && o.inventory_item_id === payload.inventory_item_id);
    console.log(item)
    if (item)
      state.cart = [...state.cart.map(o => o.location_id === payload.location_id && o.inventory_item_id === payload.inventory_item_id ? payload : o)]
    else
      state.cart = [...state.cart, payload]
    localStorage.setItem('cart', JSON.stringify(state.cart));

  }),
  removeFromCart: action((state, payload) => {
    state.cart = JSON.parse(localStorage.getItem("cart") || "[]");
    state.cart = [...state.cart.filter(o => o.location_id !== payload.location_id || o.inventory_item_id !== payload.inventory_item_id)]
    localStorage.setItem('cart', JSON.stringify(state.cart));
  }),
  setShoppingCart: action((state) => {
    state.cart = JSON.parse(localStorage.getItem("cart") || "[]");
  }),
  clearShoppingCart: action((state) => {
    state.cart = [];
    localStorage.setItem('cart', JSON.stringify(state.cart));
  }),
  orders: [],
  setOrders: action((state, payload) => {
    console.log(payload);
    state.orders = payload || [];
  }),
  orderConfirmed: false,
  setOrderConfirmed: action((state, payload) => {
    state.orderConfirmed = payload || false;
  }),
  orderHistory:null,
  setOrderHistory: action((state, payload) => {
    state.orderHistory = payload || null;
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
