import { Button, Card, CardActionArea, CircularProgress, makeStyles } from '@material-ui/core';
import { useStoreActions, useStoreState } from 'easy-peasy';

import Axios from 'axios';
import Cookies from 'js-cookie';
import Grid from '@material-ui/core/Grid';
import NotFoundSVG from '../_assets/undraw_Directions_re_kjxs.svg';
import React from 'react';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
  card: {
    padding: theme.spacing(2),
  },
  imageContainer: {
    padding: theme.spacing(3),
    textAlign: "center"
  },
  image: {
    width: "100%",
  },
  list: {
    width: '100%',
  },
  loadingContainer: {
    display: 'flex',
    width: "100%",
    height: "100%",
    justifyContent: 'center',
    alignItems: 'center',
  },
  selected: {
    border: '2px #AC6CBF solid',
  },
}));

export default function AddressForm({ handleBack, handleNext }) {
  const classes = useStyles();
  const locations = useStoreState(state => state.locations);
  const setLocations = useStoreActions(action => action.setLocations);
  const currentLocation = useStoreState(state => state.currentLocation);
  const setCurrentLocation = useStoreActions(action => action.setCurrentLocation);
  const [loading, setLoading] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);
  React.useEffect(() => {
    if (!loaded) {
      setLoading(true);
      Axios.get('/getLocation', {
        headers: {
          shopifyToken: Cookies.get('shopifyToken'),
          shopifyShopName: Cookies.get('shopifyShopName')
        }
      }).then((response) => {
        setLocations(response.data);
        setLoaded(true);
        setLoading(false);

      }).catch(()=>{
        setLoading(false);
        setLoaded(true)
      });
    }
  }, [setLocations, loaded]);
  const handleSelect = (data) => () => {
    setCurrentLocation(data);
  }
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Shipping locations
      </Typography>
      <Grid container spacing={2}>
        {!loading && locations.length === 0 && <div className={classes.imageContainer}>
          <img src={NotFoundSVG} alt="icon" className={classes.image} />
          <Typography variant="overline" color="primary">
            We cannot find active locations
            </Typography>
        </div>}
        {loading && <div className={classes.loadingContainer}>
          <CircularProgress className={classes.loading} />
        </div>}
        {locations.map(data => <Grid item xs={12} key={data.id}>
          <Card variant='outlined' className={currentLocation ? data.id === currentLocation.id ? classes.selected : '' : ''}>
            <CardActionArea className={classes.card} onClick={handleSelect(data)}>
              <Typography variant='body1'>
                {data.address}
              </Typography>
            </CardActionArea>
          </Card>
        </Grid>)}
      </Grid>
      <div className={classes.buttons}>
        <Button onClick={handleBack} className={classes.button}>
          Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleNext}
          className={classes.button}
        >
          Next
          </Button>
      </div>
    </React.Fragment>
  );
}