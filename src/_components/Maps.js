import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Checkout from './Checkout';
import { ChevronLeftRounded } from '@material-ui/icons';
import CircularProgress from '@material-ui/core/CircularProgress';
import Cookies from 'js-cookie';
import GoogleMapReact from 'google-map-react';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import NotFoundSVG from '../_assets/around_the_world.svg';
import Paper from '@material-ui/core/Paper';
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import axios from 'axios'
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import parse from 'autosuggest-highlight/parse';
import throttle from 'lodash/throttle';
import { useParams } from "react-router-dom";
import { useSnackbar } from 'notistack';
import { useStoreActions } from 'easy-peasy';

const useStyles = makeStyles((theme) => ({
  icon: {
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: '45rem',
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
  gap:{
    height: theme.spacing(2),
  },
}));

const SimpleMap = (props) => {
  let { barcode } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const [value, setValue] = React.useState(null);
  const setCustomerLocation = useStoreActions(actions => actions.setCustomerLocation);
  // eslint-disable-next-line
  const [details, setDetails] = React.useState(null);
  const [inputValue, setInputValue] = React.useState('');
  const [options, setOptions] = React.useState([]);
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const [autocompleteService, setAutocompleteService] = React.useState(null);
  const [placeService, setPlaceService] = React.useState(null);
  const [latlngbounds, setLatlngbounds] = React.useState(null);
  const [map, setMap] = React.useState(null);
  const [maps, setMaps] = React.useState(null);
  const [storelist, setStoreList] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [checkout, setCheckout] = React.useState(false);
  const [markers, setMarkers] = React.useState([]);
  // const [shopList, setShopList] = React.useState([]);
  const handleApiLoaded = (map, maps) => {
    setMap(map);
    setMaps(maps);
    setAutocompleteService(new maps.places.AutocompleteService());
    setPlaceService(new maps.places.PlacesService(map));
    setLatlngbounds(new maps.LatLngBounds());
  };

  const fetchAutocomplete = React.useMemo(
    () =>
      throttle((request, callback) => {
        autocompleteService.getPlacePredictions(request, callback);
      }, 200),
    [autocompleteService],
  );

  React.useEffect(() => {
    let active = true;
    if (!autocompleteService) {
      return undefined;
    }

    if (inputValue === '') {
      setOptions(value ? [value] : []);
      return undefined;
    }
    fetchAutocomplete({ input: inputValue }, (results) => {
      if (active) {
        let newOptions = [];
        if (value) {
          newOptions = [value];
        }
        if (results) {
          newOptions = [...newOptions, ...results];
        }
        setOptions(newOptions);
      }
    });

    return () => {
      active = false;
    };
  }, [value, inputValue, fetchAutocomplete, autocompleteService]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={12} lg={12}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link color="inherit" href="/">
            Dashboard
            </Link>
          <Typography color="textPrimary">Product</Typography>
        </Breadcrumbs>
      </Grid>
      <Grid item xs={12} md={6} lg={8}>
        <Paper className={fixedHeightPaper}>
          <GoogleMapReact
            bootstrapURLKeys={{ key: 'AIzaSyCqeZgqATeNkxEb4X5UEQO-shY1FESUQJk', libraries: ['places'] }}
            defaultCenter={[43.65, -79.38]}
            defaultZoom={11}
            yesIWantToUseGoogleMapApiInternals
            onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
          >
          </GoogleMapReact>
        </Paper>
      </Grid>
      <Grid item xs={12} md={6} lg={4}>
        <Paper className={fixedHeightPaper}>
          <Autocomplete
            id="google-map"
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.description)}
            filterOptions={(x) => x}
            options={options}
            autoComplete
            includeInputInList
            filterSelectedOptions
            value={value}
            onChange={(_event, newValue) => {
              setOptions(newValue ? [newValue, ...options] : options);
              setValue(newValue);
              if (newValue) {
                placeService.getDetails({
                  placeId: newValue.place_id,
                  fields: ["name", "formatted_address", "place_id", "geometry", "address_components"]
                }, (place) => {
                  console.log(place);
                  const location = {};
                  place.address_components.forEach(item => location[item.types[0]] = item.short_name);
                  setCustomerLocation(location);
                  setDetails(place);
                  setLoading(true);
                  let latitude = Number(place.geometry.location.lat());
                  let longitude = Number(place.geometry.location.lng());
                  let mk = new maps.Marker({
                    map,
                    position: place.geometry.location,
                    icon: { url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" }
                  })
                  
                  for (let mark of markers) {
                    mark.setMap(null);
                  }
                  const mks = [mk]
                  const bounds = new maps.LatLngBounds();
                  bounds.extend(place.geometry.location);

                  axios.get('/storeNearCustomer', {
                    headers: {
                      shopifyToken: Cookies.get('shopifyToken'),
                      shopifyShopName: Cookies.get('shopifyShopName'),
                      latitude,
                      longitude,
                      distance: 5,
                      barcode: barcode,
                    }
                  }).then(function (response) {
                    setStoreList(response.data);
                    for (let store of response.data) {
                      let lat = store.coordinates.latitude;
                      let lng = store.coordinates.longitude;
                      mks.push(new maps.Marker({
                        map,
                        position: { lat, lng }
                      }))
                      bounds.extend({ lat, lng });
                    }

                    setMarkers(mks);
                    map.fitBounds(bounds);
                    setLoading(false);
                    enqueueSnackbar('Loaded stores!', {
                      variant: 'success',
                    });
                  })
                    .catch(function () {
                      setLoading(false);
                      enqueueSnackbar('Server error, unable to load stores', {
                        variant: 'error',
                      });
                    });
                  map.setCenter(place.geometry.location);
                  latlngbounds.extend(place.geometry.location);
                  map.fitBounds(latlngbounds);
                })
              }
            }}
            onInputChange={(event, newInputValue) => {
              setInputValue(newInputValue);
            }}
            renderInput={(params) => (
              <TextField {...params} label="Customer Address" variant="outlined" fullWidth />
            )}
            renderOption={(option) => {
              const matches = option.structured_formatting.main_text_matched_substrings;
              const parts = parse(
                option.structured_formatting.main_text,
                matches.map((match) => [match.offset, match.offset + match.length]),
              );

              return (
                <React.Fragment>
                  <Grid container alignItems="center">
                    <Grid item>
                      <LocationOnIcon className={classes.icon} />
                    </Grid>
                    <Grid item xs>
                      {parts.map((part, index) => (
                        <span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>
                          {part.text}
                        </span>
                      ))}

                      <Typography variant="body2" color="textSecondary">
                        {option.structured_formatting.secondary_text}
                      </Typography>
                    </Grid>
                  </Grid>
                </React.Fragment>
              );
            }}
          />
          {!loading && storelist.length === 0 && <div className={classes.imageContainer}>
            <img src={NotFoundSVG} alt="icon" className={classes.image} />
            <Typography variant="overline" color="primary">
              We cannot find any nearby stores
              </Typography>
          </div>}
          {loading && <div className={classes.loadingContainer}>
            <CircularProgress className={classes.loading} />
          </div>}
          {!checkout && !loading && storelist.length > 0 && <List className={classes.list}>{
            storelist.map((store, key) => (
              <ListItem key={key}>
                <ListItemText primary={store.product.title} secondary={`$${store.product.price}`} />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="delete" onClick={() => setCheckout(store)}>
                    <AddShoppingCartIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))
          }</List>}
          {checkout && 
          <React.Fragment>
            <div className={classes.gap}/>
            <Paper variant='outlined' className={classes.paper}>
              <Checkout store={checkout} onCancel={() => setCheckout(false)}/>
            </Paper>
          </React.Fragment>
}
        </Paper>
      </Grid>
    </Grid>
  );
}

export default SimpleMap;