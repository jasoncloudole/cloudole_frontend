import { Add, Delete, Remove } from '@material-ui/icons';
import { Button, Grid, IconButton, InputBase, List, ListItemSecondaryAction, Paper, Typography, makeStyles } from '@material-ui/core';
import { useStoreActions, useStoreState } from 'easy-peasy';

import Checkout from './Checkout';
import Cookies from 'js-cookie';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import React from 'react';

const useStyles = makeStyles((theme) => ({
    list: {
        width: 500,
        height: '100vh',
    },
    button: {
        position:'absolute',
        bottom: theme.spacing(2),
    },
    img: {
        width: '100%',
    },
    title:{padding:theme.spacing(3)},
    spinner: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
    },
}));

export default function ShoppingCart() {
    const classes = useStyles();
    const cart = useStoreState(state => state.cart);
    const addToCart = useStoreActions(actions => actions.addToCart)
    const removeFromCart = useStoreActions(actions => actions.removeFromCart)
    // eslint-disable-next-line
    const [checkout, setCheckout] = React.useState(false);

    const editShoppingCart = ({ location_id,
        inventory_item_id,
        title,
        available,
        unit_price }, itemQuantity) => {
        const payload = {
            title,
            shopifyShopName: Cookies.get('shopifyShopName'),
            location_id,
            inventory_item_id,
            quantity: parseInt(itemQuantity),
            price: parseInt(itemQuantity) * (unit_price)
        }
        if (itemQuantity > 0 && itemQuantity <= available) {
            addToCart(payload);
        } else if (itemQuantity === 0) {
            removeFromCart(payload);
        }
    }
    if (checkout) {
        return <Checkout onCancel={() => setCheckout(false)} />
    }
    return (
        <List className={classes.list}>
            <Typography variant='overline' gutterBottom className={classes.title}>
                Shopping Cart
            </Typography>
            {cart.map(data =>
                <ListItem>
                    <Grid container spacing={2}>
                        <Grid item xs={4} >
                            <Paper className={classes.spinner}>
                                <IconButton
                                    className={classes.iconButton}
                                    onClick={(e) => editShoppingCart(data, data.quantity - 1)}
                                    aria-label="minus">
                                    <Remove />
                                </IconButton>
                                <InputBase
                                    inputProps={{ style: { textAlign: 'center' } }}
                                    className={classes.input}
                                    value={data.quantity}
                                    onChange={(e) => editShoppingCart(data, e.target.value)}
                                />
                                <IconButton
                                    className={classes.iconButton}
                                    disabled={data.quantity === data.available}
                                    onClick={(e) => editShoppingCart(data, data.quantity + 1)}
                                    aria-label="plus">
                                    <Add />
                                </IconButton>
                            </Paper>
                        </Grid>
                        <Grid item container xs={8} >
                            <ListItemText secondary={`${data.title}`}>${data.price}</ListItemText>
                        </Grid>
                    </Grid>
                    <ListItemSecondaryAction>

                        <IconButton
                            edge="end"
                            aria-label="delete"
                            color='secondary'
                            onClick={(e) => editShoppingCart(data, 0)}>
                            <Delete />
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>)}
            <Button color='primary' className={classes.button} fullWidth onClick={() => setCheckout(true)} >Checkout</Button>
        </List>
    )
};