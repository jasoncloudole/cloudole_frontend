import React from 'react'
import queryString from 'query-string';
import { useCookies } from 'react-cookie';
 
export default function Home (props) {
    let params = queryString.parse(props.location.search)
    console.log(params)
    const [cookies, setCookie] = useCookies(['shopifyShopName', 'shopifyToken']);
    if(params.shop){
        setCookie('shopifyShopName', params.shop, { path: '/' });
    }
    if(params.token){
        setCookie('shopifyToken', params.token, { path: '/' });
    }
    return (
        <div>
            {cookies.shopifyShopName && <h1>Hello {cookies.shopifyShopName}!</h1>}
        </div>
    )
}
