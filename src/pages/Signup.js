import React, {useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useCookies } from 'react-cookie';
import axios from 'axios'
import Cookies from 'js-cookie';
import { useSnackbar } from 'notistack';
import CheckIcon from '@material-ui/icons/Check';
import CircularProgress from '@material-ui/core/CircularProgress';
import { green } from '@material-ui/core/colors';

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
        marginTop: theme.spacing(3),
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

export default function SignUp(props) {
    const { enqueueSnackbar } = useSnackbar();
    const classes = useStyles();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [cookies, setCookie] = useCookies(['shopifyShopName', 'shopifyToken', 'userToken']);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    if(!cookies.shopifyShopName || !cookies.shopifyToken){
        props.history.push('/login')
    }
    const submitHandler = (event) => {
        event.preventDefault();
        if (!loading) {
            axios.post('/signup', {
                email: email,
                password: password,
                confirmPassword: confirmPassword,
                shopifyToken: Cookies.get('shopifyToken'),
                shopName: Cookies.get('shopifyShopName')
            }).then(function (response) {
                let response_copy = JSON.parse(JSON.stringify(response.data))
                setCookie('userToken', response_copy?.token, { path: '/' });
                enqueueSnackbar('Logged in!', { 
                    variant: 'success',
                });
                setSuccess(true);
                setLoading(false);
                props.history.push('/')
            })
            .catch(function (error) {
                setLoading(false);
                setError('Invalid email');
                enqueueSnackbar('Invalid email', { 
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
        else if(name === 'confirm-password'){
            setConfirmPassword(value);
        }
    };
    return (
        <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
            <div className={classes.wrapper}>
                <Avatar className={classes.avatar}>
                    {success ? <CheckIcon /> : <PermIdentityIcon />}
                </Avatar>
                {loading && <CircularProgress size={46} thickness={3} className={classes.fabProgress} />}
            </div>
            <Typography component="h1" variant="h5">
            Sign up
            </Typography>
            <form className={classes.form}
            noValidate
            onSubmit = {(event) => {submitHandler(event)}}
            >
            <Grid container spacing={2}>
                <Grid item xs={12}>
                <TextField
                    variant="outlined"
                    autoFocus
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    onChange = {(event) => onChangeHandler(event)}

                />
                </Grid>
                <Grid item xs={12}>
                <TextField
                    variant="outlined"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    onChange = {(event) => onChangeHandler(event)}
                />
                </Grid>
                <Grid item xs={12}>
                <TextField
                    variant="outlined"
                    required
                    fullWidth
                    name="confirm-password"
                    label="Confirm Password"
                    type="password"
                    id="confirm-password"
                    onChange = {(event) => onChangeHandler(event)}
                />
                </Grid>
            </Grid>
            <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={loading}
                className={classes.submit}
                onClick = {(event) => {submitHandler(event)}}
            >
                Sign Up
            </Button>
            <Grid container justify="flex-end">
                <Grid item>
                <Link href="/login" variant="body2">
                    Already have an account? Sign in
                </Link>
                </Grid>
            </Grid>
            </form>
            <Typography variant="body2" color="textSecondary" align="center">
                {error}
            </Typography>
        </div>
        <Box mt={5}>
            <Copyright />
        </Box>
        </Container>
    );
}
