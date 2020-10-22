import React from 'react';
import Cookies from 'js-cookie';
import { Route, Redirect } from 'react-router-dom';

 const PrivateRoute  = ({ component: Component, ...rest }) => {
    const shopifyToken = Cookies.get('shopifyToken');
    const userToken = Cookies.get('userToken');
    const shopifyShopName = Cookies.get('shopifyShopName');
    return (
    <Route {...rest} render={props => (
            shopifyToken && userToken && shopifyShopName
            ? <Component {...props} />
            : shopifyToken && shopifyShopName ?
            <Redirect to={{ pathname: '/signup', state: { from: props.location } }} />
            : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
    )} />)
}
export default PrivateRoute