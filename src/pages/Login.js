import React, {useState} from 'react';

import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CheckIcon from '@material-ui/icons/Check';
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import axios from 'axios'
import { green } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import { useCookies } from 'react-cookie';
import { useSnackbar } from 'notistack';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Cloudole
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: theme.palette.primary.main,
  },
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  buttonSuccess: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
  fabProgress: {
    color: green[500],
    position: 'absolute',
    top: -3,
    left: -3,
    zIndex: 1,
  },
}));

export default function SignIn(props) {
    const { enqueueSnackbar } = useSnackbar();
    const classes = useStyles();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    // eslint-disable-next-line
    const [cookies, setCookie] = useCookies(['shopifyShopName', 'shopifyToken', 'userToken']);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const submitHandler = (event) => {
        event.preventDefault();
        if (!loading) {
            setSuccess(false);
            setLoading(true);
            enqueueSnackbar('Logging in');
            axios.post('/login', {
                email: email,
                password: password
            }).then(function (response) {
                let response_copy = JSON.parse(JSON.stringify(response.data))
                setCookie('shopifyShopName', response_copy?.shop_name, { path: '/' , maxAge:2147483647});
                setCookie('shopifyToken', response_copy?.shopify_token, { path: '/', maxAge:2147483647 });
                setCookie('userToken', response_copy?.token, { path: '/', maxAge:2147483647 });
                setCookie('stripeID', response_copy?.stripe_id, { path: '/', maxAge:2147483647 });
                setCookie('email', email, { path: '/', maxAge:2147483647 });
                enqueueSnackbar('Logged in!', { 
                    variant: 'success',
                });
                setSuccess(true);
                setLoading(false);
                props.history.push('/')
            })
            .catch(function () {
                setLoading(false);
                setError('Invalid email or password');
                enqueueSnackbar('Invalid email or password!', { 
                    variant: 'error',
                });
            });
        }

    };
    const onChangeHandler = (event) => {
        const {name, value} = event.currentTarget;
        if(name === 'email') {
            setEmail(value);
        }
        else if(name === 'password'){
            setPassword(value);
        }
    };
    return (
        <Container component="main" maxWidth="xs">
        <div className={classes.paper}>
            <div className={classes.wrapper}>
                <Avatar className={classes.avatar}>
                    {success ? <CheckIcon /> : <LockOutlinedIcon />}
                </Avatar>
                {loading && <CircularProgress size={46} thickness={3} className={classes.fabProgress} />}
            </div>
            <Typography component="h1" variant="h5">
                Sign in
            </Typography>
            <form className={classes.form} 
                noValidate
                onSubmit = {(event) => {submitHandler(event)}}
            >
            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange = {(event) => onChangeHandler(event)}
                autoFocus
            />
            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                onChange = {(event) => onChangeHandler(event)}
                autoComplete="current-password"
            />
            <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={loading}
                onClick = {(event) => {submitHandler(event)}}
                className={classes.submit}
            >
                Sign In
            </Button>
            </form>
            <Typography variant="body2" color="textSecondary" align="center">
                {error}
            </Typography>
        </div>
        <Box mt={8}>
            <Copyright />
        </Box>
        </Container>
    );
}