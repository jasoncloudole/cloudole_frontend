import { Button, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, Typography, makeStyles } from '@material-ui/core';
import {CardElement, useElements, useStripe} from '@stripe/react-stripe-js';

import { CheckOutlined } from '@material-ui/icons';
import Cookies from 'js-cookie';
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
}));
const PaymentForm = ({handleNext, handleBack, store}) => {
  const stripe = useStripe();
  const elements = useElements();
  const classes = useStyles();
  const [succeeded, setSucceeded] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [processing, setProcessing] = React.useState('');
  const [disabled, setDisabled] = React.useState(true);
  const [clientSecret, setClientSecret] = React.useState('');
  const [cards, setCards] = React.useState([]);
  const [selected, setSelected] = React.useState(null);
  React.useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    axios.post('/checkout', {
      customer_id: Cookies.get('stripeID'),
      currency: 'cad',
      price: parseFloat(store.product.price),
      save_card: true,
    }).then(res => {
      setCards(res.data.paymentMethods.data);
      setClientSecret(res.data.clientSecret);
    });
  }, []);

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
      setError(null);
      setProcessing(false);
      setSucceeded(true);
      handleNext();
    }
  };
  
  return (
    <React.Fragment>
      {cards && <Typography variant="body1" gutterBottom style={{ fontWeight: 'bold' }} >Your Cards</Typography>}
      {cards &&
      <List className={classes.list}>{
            cards.map((card, key) => (
              <ListItem key={key}>
                <ListItemText primary={`**** **** **** ${card.card.last4}`}/>
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
      <Typography variant="body1" gutterBottom style={{ fontWeight: 'bold' }} >New Card</Typography>
      <CardElement/>
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
    </React.Fragment>

  );
};
export default PaymentForm;