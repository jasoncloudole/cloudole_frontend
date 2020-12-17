import { Breadcrumbs, Button, Divider, Link, Step, StepLabel, Stepper, Typography } from '@material-ui/core';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import React from 'react';
import Title from './Title';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2)
  },
  details: {
    padding:theme.spacing(3)
  },
  button: {
      marginTop:theme.spacing(2)
  }
}));

export default function Dashboard() {
  const classes = useStyles();
  return (
    <Grid container spacing={3}>
        <Grid item xs={12}>
            <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" href="/">
                Dashboard
                </Link>
            <Typography color="textPrimary">Order History</Typography>
            </Breadcrumbs>
        </Grid>
        <Grid item xs={12}>
            <Title>Order History</Title>
        </Grid>
        <Grid item xs={12}>
            <Paper className={classes.paper}>
                <Grid container>
                    <Grid item sm={12} md={8} className={classes.stepper}>
                        <Grid item container sm={12}>
                            <Grid item sm={12} md={9} className={classes.details}>
                                <Typography color="textPrimary" variant='h6'>Dog food</Typography>
                            </Grid>
                            <Grid item sm={12} md={3} className={classes.details}>
                                <Typography  align='right'>CA$479.00</Typography>
                                <Typography align='right'>Qty: 1</Typography>
                            </Grid>
                        </Grid>
                        <Grid item xs={0} sm={12}>
                            <Stepper activeStep={1}>
                                <Step>
                                    <StepLabel optional={<Typography variant="caption">Dec-15-2020</Typography>}>Ordered</StepLabel>
                                </Step>
                                <Step>
                                    <StepLabel optional={<Typography variant="caption">Dec-15-2020</Typography>}>Shipped</StepLabel>
                                </Step>
                                <Step>
                                    <StepLabel optional={<Typography variant="caption">Dec-16-2020</Typography>}>Delivered by</StepLabel>
                                </Step>
                            </Stepper>
                        </Grid>
                    </Grid>
                    <Divider orientation="vertical" flexItem />
                    <Grid item sm={12} md={3} className={classes.details}>
                        <Typography >Order placed:</Typography>
                        <Typography variant='h6' color="textSecondary">Dec-15-2020</Typography>
                        <Typography>CA$479.00</Typography>
                        <Button variant='contained' color='primary' className={classes.button}>Track Item</Button>
                    </Grid>
                </Grid>
                
            </Paper>
        </Grid>
    </Grid>
  );
}