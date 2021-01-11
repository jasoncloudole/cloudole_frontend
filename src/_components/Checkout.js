import { useStoreActions, useStoreState } from 'easy-peasy';

import AddressForm from './AddressForm';
import Button from '@material-ui/core/Button';
import PaymentForm from './PaymentForm';
import React from 'react';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Stepper from '@material-ui/core/Stepper';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    width: 500,
    padding: theme.spacing(4),
    height: '100vh',
  },
  layout: {
    width: 'auto',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 600,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  stepper: {
    padding: theme.spacing(3, 0, 5),
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
}));

const steps = ['Shipping address', 'Payment details'];

export default function Checkout(props) {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const clearShoppingCart = useStoreActions(action => action.clearShoppingCart);
  const setOrders = useStoreActions(action => action.setOrders);
  const setOrderConfirmed = useStoreActions(action => action.setOrderConfirmed);
  const orders = useStoreState(state => state.orders);
  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleDone = () => {
    clearShoppingCart();
    setOrderConfirmed(false);
    setOrders([]);
    props.onCancel();
  }

  function getStepContent(step) {
    switch (step) {
      case 0:
        return <AddressForm handleNext={handleNext} handleBack={props.onCancel}/>;
      case 1:
        return <PaymentForm  handleNext={handleNext} handleBack={handleBack} />;
      default:
        throw new Error('Unknown step');
    }
  }

  return (
    <div className={classes.root}>
        <Stepper activeStep={activeStep} className={classes.stepper}>
        {steps.map((label) => (
            <Step key={label}>
            <StepLabel>{label}</StepLabel>
            </Step>
        ))}
        </Stepper>
        <React.Fragment>
            {activeStep === steps.length ? (
                <React.Fragment>
                    <Typography variant="h5" gutterBottom>
                    Thank you for your order.
                  </Typography>
                  <Typography variant="subtitle1">
                      Your order number is #{orders.length?orders[0].orderId:''}. We have emailed your order confirmation, and will
                      send you an update when your order has shipped.
                  </Typography>
                <Button onClick={handleDone} fullWidth variant='contained' className={classes.button}>
                  Done
                </Button>
                </React.Fragment>
            ) : (
                <React.Fragment>
                  {getStepContent(activeStep)}
                </React.Fragment>
            )}
        </React.Fragment>
    </div>
  );
}