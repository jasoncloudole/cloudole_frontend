import AddressForm from './AddressForm';
import Button from '@material-ui/core/Button';
import { Paper } from '@material-ui/core';
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

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

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
                    Your order number is #2001539. We have emailed your order confirmation, and will
                    send you an update when your order has shipped.
                </Typography>
                <Button onClick={props.onCancel} className={classes.button}>
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