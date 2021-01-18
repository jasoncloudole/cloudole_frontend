import { Button, CircularProgress, Typography } from '@material-ui/core';
import { useStoreActions, useStoreState } from 'easy-peasy';

import Axios from 'axios';
import Chart from './Chart';
import Cookies from 'js-cookie';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Products from './Products';
import React from 'react';
import TotalEarned from './TotalEarned';
import clsx from 'clsx';
import { green } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
  setupPayment: {
    display:'flex',
    justifyContent:'space-between',
    alignItems:'center'
  },
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}));
const groupBy = (xs, key) => {
  return xs.reduce((rv, x) => {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
  }, {});
};
export default function Dashboard() {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const setAccountLink = useStoreActions(actions => actions.setStripeAccountLinks);
  const accountLink = useStoreState(state => state.stripeAccountLinks) ;
  const sellHistory = useStoreState(state => state.sellHistory);
  const setSellHistory = useStoreActions(action => action.setSellHistory);
  const [data, setData] = React.useState([]);
  React.useEffect(() => {
    if(!accountLink.url){
      Axios.post('/setupConnectedAccount', {
        email: Cookies.get('email'),
      }).then(function (response) {
        setAccountLink(response.data);
      });
    }
    if (!sellHistory) {
      Axios.get('/getOrder', {
          headers: {
              email: Cookies.get('email'),
          }
      }).then(function (response) {
          if (response.data) {
              setSellHistory(groupBy(response.data.orderList.filter(o => !o.buyer), 'orderId'));
          }
      });
  } else if (data.length === 0) {
    setData(Object.values(sellHistory).map(orders => ({
      amount : orders.reduce((rv, x) => rv + x.deliveryFee + x.price + x.stripeTransactionFee, 0),
      time : new Date(orders[0].timestamp[0]).toDateString()
    })))
  }
  },[accountLink, setAccountLink, sellHistory, setSellHistory,data.length]);

  return (
    <Grid container spacing={3}>
      {accountLink.isSetup &&       
      <Grid item xs={12} md={8} lg={9}>
        <Paper className={fixedHeightPaper}>
          <Chart data={data} />
        </Paper>
      </Grid>}
      {accountLink.isSetup && 
      <Grid item xs={12} md={4} lg={3}>
        <Paper className={fixedHeightPaper}>
          <TotalEarned  data={data}/>
        </Paper>
      </Grid>}
      {!accountLink.isSetup &&
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <div className={classes.setupPayment}>
            <Typography color='secondary'>You have not yet set up your payment info, your products will not be listed on our platform</Typography>
            <div className={classes.wrapper}>
              <Button
                variant="contained"
                color="primary"
                disabled={!accountLink.url}
                onClick={() => window.location.replace(accountLink.url)}
              >
                Set up payment info
              </Button>
              {!accountLink.url && <CircularProgress size={24} className={classes.buttonProgress} />}
            </div>
          </div>
        </Paper>
      </Grid>
      }
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <Products />
        </Paper>
      </Grid>
    </Grid>
  );
}