import { Breadcrumbs, Button, Divider, Link, Step, StepLabel, Stepper, Typography } from '@material-ui/core';
import { useStoreActions, useStoreState } from 'easy-peasy';

import Axios from 'axios';
import Cookies from 'js-cookie';
import Grid from '@material-ui/core/Grid';
import OrderDetails from './OrderDetails';
import Paper from '@material-ui/core/Paper';
import React from 'react';
import Title from './Title';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
    details: {
        padding: theme.spacing(3)
    },
    button: {
        marginTop: theme.spacing(2)
    }
}));
const groupBy = (xs, key) => {
    return xs.reduce((rv, x) => {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
};
export default function Dashboard() {
    const classes = useStyles();
    const orderHistory = useStoreState(state => state.orderHistory);
    const setOrderHistory = useStoreActions(action => action.setOrderHistory);
    const [details, setDetails] = React.useState({});
    React.useEffect(() => {
        if (!orderHistory) {
            Axios.get('/getOrder', {
                headers: {
                    email: Cookies.get('email'),
                }
            }).then(function (response) {
                if (response.data) {
                    setOrderHistory(groupBy(response.data.orderList.filter(o => o.buyer), 'orderId'));
                }
            });
        }
    }, [orderHistory, setOrderHistory]);
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
                {orderHistory && Object.values(orderHistory).map(orders => {
                    const total = orders.reduce((rv, x) => rv + x.deliveryFee + x.price + x.stripeTransactionFee, 0);
                    const orderId = orders[0].orderId;
                    const orderPlaced = new Date(orders[0].timestamp[0]);
                    const activeStep = orders[0].timestamp.length - 1;
                    const itemCount = orders.reduce((rv, x) => rv + x.quantity, 0);
                    const title = orders[0].product.title + (orders.length - 1 ? ` and ${orders.length - 1} more...` : '');
                    return (
                        <Paper className={classes.paper} key={orderId}>
                            <Grid container>
                                <Grid item sm={12} md={8} className={classes.stepper}>
                                    <Grid item container sm={12}>
                                        <Grid item sm={12} md={9} className={classes.details}>
                                            <Typography color="textPrimary" variant='h6'>{title}</Typography>
                                            <Typography color="primary" variant='caption'>
                                                <Link href="#" onClick={() => setDetails({...details, [orderId]: true})}>
                                                    details
                                                </Link>
                                            </Typography>
                                        </Grid>
                                        <Grid item sm={12} md={3} className={classes.details}>
                                            <Typography align='right'>CA${total.toFixed(2)}</Typography>
                                            <Typography align='right'>Qty: {itemCount}</Typography>
                                        </Grid>
                                        {details[orderId] && <Grid item sm={12} md={12} className={classes.details}>
                                            <OrderDetails orders={orders} />
                                            <Typography color="primary" variant='caption'>
                                                <Link href="#" onClick={() => setDetails({...details, [orderId]: false})}>
                                                    hide
                                                </Link>
                                            </Typography>
                                            </Grid>}

                                    </Grid>
                                    <Grid item xs={false} sm={12}>
                                        <Stepper activeStep={activeStep}>
                                            <Step>
                                                <StepLabel optional={<Typography variant="caption">{orderPlaced.toDateString()}</Typography>}>Ordered</StepLabel>
                                            </Step>
                                            <Step>
                                                <StepLabel optional={<Typography variant="caption">{
                                                    orders[0].timestamp[1]
                                                        ? new Date(orders[0].timestamp[1]).toDateString()
                                                        : 'processing'
                                                }</Typography>}>Shipped</StepLabel>
                                            </Step>
                                            <Step>
                                                <StepLabel optional={<Typography variant="caption">{
                                                    orders[0].timestamp[2]
                                                        ? new Date(orders[0].timestamp[2]).toDateString()
                                                        : 'processing'
                                                }</Typography>}>Delivered by</StepLabel>
                                            </Step>
                                        </Stepper>
                                    </Grid>
                                </Grid>
                                <Divider orientation="vertical" flexItem />
                                <Grid item sm={12} md={3} className={classes.details}>
                                    <Typography >Order placed:</Typography>
                                    <Typography variant='h6' color="textSecondary">{orderPlaced.toDateString()}</Typography>
                                    <Typography>CA${total.toFixed(2)}</Typography>
                                    <Button variant='contained' color='primary' className={classes.button}>Track Item</Button>
                                </Grid>
                            </Grid>
                        </Paper>
                    )
                })}

            </Grid>
        </Grid>
    );
}