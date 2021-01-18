import { Button, CircularProgress, Grid, TextField, makeStyles } from "@material-ui/core";

import Axios from "axios";
import Cookies from 'js-cookie';
import React from 'react';
import { green } from "@material-ui/core/colors";
import { useSnackbar } from "notistack";

const useStyles = makeStyles((theme) => ({
    container: {
        width: 500,
        height: '100vh',
    },
    form: {
        padding: theme.spacing(2),
    },
    wrapper: {
        margin: theme.spacing(1),
        position: 'relative',
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    buttonProgress: {
        color: green[500],
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
}));

export default function ProductDetails(props) {
    const classes = useStyles();
    const [data, setData] = React.useState(props);
    const [loading, setLoading] = React.useState(false);
    const { enqueueSnackbar } = useSnackbar();

    const onChangeHandler = (event) => {
        const { name, value } = event.currentTarget;
        setData({ ...data, [name]: value });
    };
    const submitHandler = async () => {
        try {
            setLoading(true);

            await Axios.post('/savePrice', {
                email: Cookies.get('email'),
                barcode: props.barcode,
                price: data.price
            })
            setLoading(false);
            enqueueSnackbar('Price Saved!', {
                variant: 'success',
            });
            props.setOpen(false);
            props.setProducts(null);
        } catch (error) {
            setLoading(false);
            enqueueSnackbar('Error Price not saved!', {
                variant: 'error',
            });
        }
    }
    return (
        <div className={classes.container}>
            <form className={classes.form}
                noValidate
                onSubmit={submitHandler}
            >
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            margin="normal"
                            id="title"
                            label="Title"
                            name="title"
                            disabled={true}
                            value={data.title}
                            onChange={(event) => onChangeHandler(event)}
                            autoFocus
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            margin="normal"
                            id="price"
                            label="Price"
                            name="price"
                            value={data.price}
                            onChange={(event) => onChangeHandler(event)}
                            autoFocus
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            margin="normal"
                            id="quantity"
                            label="Quantity"
                            name="quantity"
                            disabled={true}
                            value={data.quantity}
                            onChange={(event) => onChangeHandler(event)}
                            autoFocus
                        />
                    </Grid>
                </Grid>
                <div className={classes.wrapper}>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        disabled={loading}
                        onClick={submitHandler}
                        className={classes.submit}
                    >
                        Submit
                </Button>
                    {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                </div>

            </form>
        </div>

    )
}