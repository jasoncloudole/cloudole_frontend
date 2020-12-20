import { Redirect, Route } from 'react-router-dom';

import Cookies from 'js-cookie';
import React from 'react';

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