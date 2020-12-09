import DashboardIcon from '@material-ui/icons/Dashboard';
import LayersIcon from '@material-ui/icons/Layers';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import LockIcon from '@material-ui/icons/Lock';
import React from 'react';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import { useCookies } from 'react-cookie';
import { useHistory } from 'react-router-dom';
import { useSnackbar } from 'notistack';

export default function MainListItems () {
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
   // eslint-disable-next-line
  const [cookies, setCookie, removeCookie] = useCookies(['shopifyShopName', 'shopifyToken', 'userToken']);
  const logout = () => {
    removeCookie('shopifyShopName', { path: '/' });
    removeCookie('shopifyToken', { path: '/' });
    removeCookie('userToken', { path: '/' });
    enqueueSnackbar('Logged out!', { 
      variant: 'success',
    });
    window.location.reload(false);
  }
  return (
  <div>
    <ListItem button onClick={() => history.push('/')}>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <ShoppingCartIcon />
      </ListItemIcon>
      <ListItemText primary="Current Orders" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <LayersIcon />
      </ListItemIcon>
      <ListItemText primary="Order History" />
    </ListItem>
    <ListItem button onClick={logout} >
      <ListItemIcon>
        <LockIcon />
      </ListItemIcon>
      <ListItemText primary="Logout" />
    </ListItem>
  </div>
)
};