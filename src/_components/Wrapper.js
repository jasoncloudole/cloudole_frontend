import { useStoreActions, useStoreState } from 'easy-peasy';

import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import Box from '@material-ui/core/Box';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import MainListItems from './ListItems';
import MenuIcon from '@material-ui/icons/Menu';
import NotFoundSVG from '../_assets/undraw_No_data_re_kwbl.svg';
// import NotificationsIcon from '@material-ui/icons/Notifications';
import React from 'react';
import { ShoppingCart } from '@material-ui/icons';
import ShoppingCartComponent from './ShoppingCart'
import { SwipeableDrawer } from '@material-ui/core';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

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

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  loadingContainer: {
    display: 'flex',
    width: "100%",
    height: "100%",
    justifyContent: 'center',
    alignItems: 'center',
  },
  notification: {
    marginRight: theme.spacing(2),
  },
  imageContainer: {
    width: 500,
    padding: theme.spacing(3),
    marginTop: theme.spacing(20),
    textAlign: "center"
  },
  image: {
    width: '50%',
  },
}));

export default function Dashboard(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const [drawer, setDrawer] = React.useState(false);
  const setShoppingCart = useStoreActions(actions=>actions.setShoppingCart)
  const clearShoppingCart = useStoreActions(actions=>actions.clearShoppingCart)
  const cart = useStoreState(state => state.cart)
  const setOrderConfirmed = useStoreActions(action => action.setOrderConfirmed);
  const setOrders = useStoreActions(action => action.setOrders);

  const orderConfirmed = useStoreState(state => state.orderConfirmed)
  React.useEffect(() => {
    if (cart.length === 0 && localStorage.getItem("cart") && localStorage.getItem("cart") !== '[]') {
        setShoppingCart();
    }
}, [cart, setShoppingCart])
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const handleShoppingCart = () => {
    setDrawer(true);
  }
  const handleShoppingCartClose = () => {
    setDrawer(false);
    console.log(orderConfirmed);
    if (orderConfirmed){
      clearShoppingCart();
      setOrderConfirmed(false);
      setOrders([]);
    }
  }
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
          >
            <MenuIcon />
          </IconButton>
          <Typography component="h3" variant="h6" color="inherit" noWrap className={classes.title}>
            Cloudole
          </Typography>
          <IconButton
            color="inherit"
            className={classes.notification}
            onClick={handleShoppingCart}
          >
            <Badge badgeContent={cart.length} color="secondary">
              <ShoppingCart />
            </Badge>
          </IconButton>
          {/* <IconButton color="inherit" className={classes.notification}>
            <Badge badgeContent={4} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton> */}
          <Avatar color="inherit">J</Avatar>
        </Toolbar>
      </AppBar>
      <SwipeableDrawer
        anchor='right'
        open={drawer}
        onClose={handleShoppingCartClose}
        onOpen={handleShoppingCart}
      >
      {cart.length === 0 && <div className={classes.imageContainer}>
        <img src={NotFoundSVG} alt="icon" className={classes.image} />
        <Typography variant="overline" color="primary" display="block">
          No Items in your cart
        </Typography>
      </div>}
      {cart.length !== 0 && <ShoppingCartComponent />}
      </SwipeableDrawer>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List><MainListItems /></List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          {props.children}
          <Box pt={4}>
            <Copyright />
          </Box>
        </Container>
      </main>
    </div>
  );
}