import { Redirect, Route } from 'react-router-dom';

import Cookies from 'js-cookie';
import React from 'react';

const isLogin = () => {
    const shopifyToken = Cookies.get('shopifyToken');
    const userToken = Cookies.get('userToken');
    const shopifyShopName = Cookies.get('shopifyShopName');
    return shopifyToken && userToken && shopifyShopName;
}
const PublicRoute = ({ component: Component, restricted, ...rest }) => {
    return (
        // restricted = false meaning public route
        // restricted = true meaning restricted route
        <Route {...rest} render={props => (
            isLogin() && restricted ?
                <Redirect to="/" />
                : <Component {...props} />
        )} />
    );
};

export default PublicRoute;