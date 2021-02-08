import React from 'react'
import nonce from 'nonce';
import queryString from 'query-string';
const apiKey = '2a408467c2d45917e57c5e0138a7d9f4';
const forwardingAddress = "https://us-central1-cloudole-2f23d.cloudfunctions.net/api";
const scopes = 'read_products,read_inventory,write_inventory';
export default function Embedded(props) {
    const {shop} = queryString.parse(props.location.search);
    if (shop) {
      const state = nonce();
      const redirectUri = forwardingAddress + '/shopify/callback';
      const installUrl = 'https://' + shop +
        '/admin/oauth/authorize?client_id=' + apiKey +
        '&scope=' + scopes +
        '&state=' + state() +
        '&redirect_uri=' + redirectUri;
      window.location.href = installUrl;
      return (
        <div>Redirecting</div>
      )
    }
    return (<div>
        Home
    </div>)
}