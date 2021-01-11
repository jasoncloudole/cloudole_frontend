import { Button, Card, CardActionArea, CircularProgress, Grid, Typography, makeStyles } from '@material-ui/core';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useStoreActions, useStoreState } from 'easy-peasy';

import Cookies from 'js-cookie';
import OrderDetails from './OrderDetails';
import React from 'react';
import axios from 'axios';

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
  cardAction:{
    padding: theme.spacing(2),
  },
  paymentArea:{
    marginBottom: theme.spacing(2),
  },
  loadingContainer: {
    display: 'flex',
    width: "100%",
    justifyContent: 'center',
    alignItems: 'center',
  },
  selected: {
    border: '2px #AC6CBF solid',
  },
}));
const PaymentForm = ({ handleNext, handleBack }) => {
  const stripe = useStripe();
  const elements = useElements();
  const classes = useStyles();
  const cart = useStoreState(state => state.cart);
  const [, setSucceeded] = React.useState(false);
  const [, setError] = React.useState(null);
  const [clientSecret, setClientSecret] = React.useState('');
  const [cards, setCards] = React.useState([]);
  const [price, setPrice] = React.useState(0);
  const orders = useStoreState(state => state.orders);
  const setOrders = useStoreActions(action => action.setOrders);
  const setOrderConfirmed = useStoreActions(action => action.setOrderConfirmed);
  const [loading, setLoading] = React.useState(false);
  const [currentCard, setCurrentCard] = React.useState();
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
        setOrders(res.data.transactionDetail);
        setCards(res.data.paymentMethods.data);
        setClientSecret(res.data.clientSecret);
      }).catch(() => setLoading(false));
    }

  }, [clientSecret, cart, setOrders]);

  const handleSubmit = async (event) => {
    // Block native form submission.
    event.preventDefault();
    setLoading(true);
    if (!stripe || !elements) {
      return;
    }
    try {
      const payload = currentCard ?
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: currentCard
      })
      :
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)
        },
        setup_future_usage: 'off_session'
      });
  
      if (payload.error) {
        setError(`Payment failed ${payload.error.message}`);
      } else {
        const res = await axios.post('/createOrder', {
          orders: cart,
          buyerEmail: Cookies.get('email'),
        })
        setLoading(false);
        setOrders(res.data.transactionDetail);
        setOrderConfirmed(true);
        console.log(res.data)

        setError(null);
        setSucceeded(true);
        handleNext();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelect = (id) => () => {
    setCurrentCard (id);
  }

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
      {!loading && cards && <Grid container spacing={2} className={classes.paymentArea}>
        {
          cards.map(card => <Grid item xs={12} key={card.id}>
            <Card variant='outlined' className={card.id === currentCard ? classes.selected : ''}>
              <CardActionArea className={classes.cardAction} onClick={handleSelect(card.id)}>
                <Typography variant='body1'>
                  {`**** **** **** ${card.card.last4}`}
                </Typography>
              </CardActionArea>
            </Card>
          </Grid>)
        }
      </Grid>}
      {!loading && <>
        <Typography variant="body1" gutterBottom style={{ fontWeight: 'bold' }} >Pay With New Card</Typography>
        <CardElement onFocus={()=>setCurrentCard(null)}/>
        <div className={classes.buttons}>
          <Button onClick={handleBack} className={classes.button}>
            Back
        </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading}
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