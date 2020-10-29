import React from 'react'
import queryString from 'query-string';
import { useCookies } from 'react-cookie';
import { Redirect } from 'react-router-dom';
 
export default function Shopify (props) {
    let params = queryString.parse(props.location.search)
    const [cookies, setCookie] = useCookies(['shopifyShopName', 'shopifyToken']);
    if(params.shop){
        setCookie('shopifyShopName', params.shop, { path: '/' , maxAge:2147483647});
    }
    if(params.token){
        setCookie('shopifyToken', params.token, { path: '/', maxAge:2147483647 });
    }
    return (
        (cookies.shopifyShopName && cookies.shopifyToken) && <Redirect to={{ pathname: '/signup' }} />
    )
}
