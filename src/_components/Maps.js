import React from 'react';
import GoogleMapReact from 'google-map-react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import parse from 'autosuggest-highlight/parse';
import throttle from 'lodash/throttle';
import clsx from 'clsx';
import NotFoundSVG from '../_assets/around_the_world.svg';
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
  imageContainer:{
    padding: theme.spacing(3),
    textAlign: "center"
  },
  image: {
    width:"100%",
  }
}));

const SimpleMap = (props) => {

  const classes = useStyles();
  const [value, setValue] = React.useState(null);
  // eslint-disable-next-line
  const [details, setDetails] = React.useState(null);
  const [inputValue, setInputValue] = React.useState('');
  const [options, setOptions] = React.useState([]);
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const [autocompleteService, setAutocompleteService] = React.useState(null);
  const [placeService, setPlaceService] = React.useState(null);
  const [latlngbounds, setLatlngbounds] = React.useState(null);
  const [map, setMap] =  React.useState(null);
  const [maps, setMaps] = React.useState(null);
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

  const fetchPlace = React.useMemo(
    () =>
      throttle((request, callback) => {
        placeService.getDetails(request, callback);
      }, 200),
    [placeService],
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
    if (value) {
      console.log(value);
      fetchPlace({
        placeId: value.place_id,
        fields: ["name", "formatted_address", "place_id", "geometry"]
      }, (place) => {
        setDetails(place);
        new maps.Marker({
          map,
          position: place.geometry.location,
        });
        map.setCenter(place.geometry.location);
        latlngbounds.extend(place.geometry.location);
        map.fitBounds(latlngbounds);
      })
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
  }, [value, inputValue, fetchAutocomplete,fetchPlace, autocompleteService, map, maps.Marker, latlngbounds]);

  return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={8}>
          <Paper className={fixedHeightPaper}>
            <GoogleMapReact
                  bootstrapURLKeys={{ key: 'AIzaSyCqeZgqATeNkxEb4X5UEQO-shY1FESUQJk' , libraries:['places']}}
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
              id="google-map-demo"
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.description)}
              filterOptions={(x) => x}
              options={options}
              autoComplete
              includeInputInList
              filterSelectedOptions
              value={value}
              onChange={(event, newValue) => {
                setOptions(newValue ? [newValue, ...options] : options);
                setValue(newValue);
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
            <div className={classes.imageContainer}>
              <img src={NotFoundSVG} alt="icon" className={classes.image} />
              <Typography variant="overline" color="primary">
                We cannot find any nearby stores
              </Typography>
            </div>
          </Paper>
        </Grid>
      </Grid>

    );
}

export default SimpleMap;