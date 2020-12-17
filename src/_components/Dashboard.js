import { Button, Typography } from '@material-ui/core';
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
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';

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
  }
}));

export default function Dashboard() {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const setAccountLink = useStoreActions(actions => actions.setStripeAccountLinks);
  const accountLink = useStoreState(state => state.stripeAccountLinks)
  const history = useHistory()
  React.useEffect(() => {
    Axios.post('/stripe-account-link', {
      email: Cookies.get('email'),
    }).then(function (response) {
      setAccountLink(response.data);
    });
  });
  return (
    <Grid container spacing={3}>
      {accountLink.setup &&       
      <Grid item xs={12} md={8} lg={9}>
        <Paper className={fixedHeightPaper}>
          <Chart />
        </Paper>
      </Grid>}
      {accountLink.setup && 
      <Grid item xs={12} md={4} lg={3}>
        <Paper className={fixedHeightPaper}>
          <TotalEarned/>
        </Paper>
      </Grid>}
      {!accountLink.setup &&
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <div className={classes.setupPayment}>
            <Typography color='secondary'>You have not yet set up your payment info, your products will not be listed on our platform</Typography>
            <Button color='primary' variant='contained' onClick={() => history.push(accountLink.url)}>Set up payment info</Button>
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