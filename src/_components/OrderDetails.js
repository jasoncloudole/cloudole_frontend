import Card from '@material-ui/core/Card';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    root: {
        width: '100%',
        padding: 12,
        marginBottom: 12,
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
});

export default function OutlinedCard({ orders }) {
    const classes = useStyles();

    return (
        <React.Fragment>
            {
                orders.map(order =>
                    <Card className={classes.root} variant="outlined" key={order.orderId}>
                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                            {order.email}
                        </Typography>
                        <Typography variant="h6" component="h2">
                            {order.product.title}
                        </Typography>
                        <Typography className={classes.pos} color="textSecondary">
                            {order.quantity} X {order.unitPrice} cad
                        </Typography>
                        <Typography variant="body2" component="p">
                            Delivery Fee: {order.deliveryFee} cad
                            <br />
                            Stripe Transaction Fee: {order.stripeTransactionFee} cad
                        </Typography>
                        <Typography variant='overline' color="primary" display="block">Total: {order.deliveryFee + order.stripeTransactionFee + order.price} cad</Typography>
                    </Card>)

            }
        </React.Fragment>

    );
}