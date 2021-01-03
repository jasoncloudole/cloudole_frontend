import { Button, CircularProgress, List, ListItem, ListItemSecondaryAction, ListItemText, Typography, makeStyles } from '@material-ui/core';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';

import Cookies from 'js-cookie';
import OrderDetails from './OrderDetails';
import React from 'react';
import axios from 'axios';
import { useStoreState } from 'easy-peasy';

const useStyles = makeStyles((theme) => ({
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
  list: {
    width: '100%',
  },
  card: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  loadingContainer: {
    display: 'flex',
    width: "100%",
    justifyContent: 'center',
    alignItems: 'center',
  },
}));
const PaymentForm = ({ handleNext, handleBack }) => {
  const stripe = useStripe();
  const elements = useElements();
  const classes = useStyles();
  const cart = useStoreState(state => state.cart);
  const [, setSucceeded] = React.useState(false);
  const [, setError] = React.useState(null);
  const [, setProcessing] = React.useState('');
  const [clientSecret, setClientSecret] = React.useState('');
  const [cards, setCards] = React.useState([]);
  const [price, setPrice] = React.useState(0);
  const [orders, setOrders] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    if (!clientSecret) {
      setLoading(true);
      axios.post('/checkout', {
        orders: cart,
        customer_id: Cookies.get('stripeID'),
        currency: 'cad',
      }).then(res => {
        setLoading(false);
        setPrice(res.data.totalFee);
        setOrders(res.data.transactionDetail.map((item, id) => ({ ...item, id, name: item.product.title })));
        setCards(res.data.paymentMethods.data);
        setClientSecret(res.data.clientSecret);
      }).catch(() => setLoading(false));
    }

  }, [clientSecret, cart]);

  const handleSubmit = async (event) => {
    // Block native form submission.
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement)
      },
      setup_future_usage: 'off_session'
    });

    if (payload.error) {
      setError(`Payment failed ${payload.error.message}`);
      setProcessing(false);
    } else {
      await axios.post('/createOrder', {
        orders: cart,
        buyerEmail: Cookies.get('email'),
      })
      setError(null);
      setProcessing(false);
      setSucceeded(true);
      handleNext();
    }
  };
  const handlePay = (id) => async (event) => {
    // Block native form submission.
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: id
    });

    if (payload.error) {
      setError(`Payment failed ${payload.error.message}`);
      setProcessing(false);
    } else {
      await axios.post('/createOrder', {
        orders: cart,
        buyerEmail: Cookies.get('email'),
      })
      setError(null);
      setProcessing(false);
      setSucceeded(true);
      handleNext();
    }
  };
  return (
    <React.Fragment>
      {loading && <div className={classes.loadingContainer}>
        <CircularProgress className={classes.loading} />
      </div>}
      {!loading && orders.length > 0 && <>
      <OrderDetails orders={orders} />
      <Typography variant="h5" gutterBottom style={{ fontWeight: 'bold' }} >Total: {price} cad</Typography>
      </>}
      {!loading && cards && <Typography variant="body1" gutterBottom style={{ fontWeight: 'bold' }} >Pay With Saved Cards</Typography>}
      {!loading && cards &&
        <List className={classes.list}>{
          cards.map((card, key) => (
            <ListItem key={key}>
              <ListItemText primary={`**** **** **** ${card.card.last4}`} />
              <ListItemSecondaryAction>
                <Button onClick={handlePay(card.id)}>
                  Pay
                  </Button>
              </ListItemSecondaryAction>
            </ListItem>
          ))
        }
        </List>
      }
      {!loading && <>
        <Typography variant="body1" gutterBottom style={{ fontWeight: 'bold' }} >Pay With New Card</Typography>
        <CardElement />
        <div className={classes.buttons}>
          <Button onClick={handleBack} className={classes.button}>
            Back
        </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            className={classes.button}
          >
            Pay
        </Button>
        </div>
      </>}



    </React.Fragment>

  );
};
export default PaymentForm;