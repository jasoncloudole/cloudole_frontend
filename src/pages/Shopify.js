import React from 'react'
import queryString from 'query-string';
import { useCookies } from 'react-cookie';
import { Redirect } from 'react-router-dom';
 
export default function Shopify (props) {
    let params = queryString.parse(props.location.search)
    const [cookies, setCookie] = useCookies(['shopifyShopName', 'shopifyToken']);
    console.log(cookies)
    if(params.shop){
        setCookie('shopifyShopName', params.shop, { path: '/' });
    }
    if(params.token){
        setCookie('shopifyToken', params.token, { path: '/' });
    }
    return (
      <Redirect to={{ pathname: '/signup' }} />
    )
}
