import Axios from 'axios';
import React from 'react'
import { Redirect } from 'react-router-dom';
import queryString from 'query-string';

const apiSecret = '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';
const apiKey = '3184f521fc3473624d2142ae452aaec6';
export default function EmbeddedCallback(props) {
    const { shop, hmac, code } = queryString.parse(props.location.search); 
    if (shop && hmac && code) {
        const accessTokenRequestUrl = 'https://' + shop + '/admin/oauth/access_token';
        const accessTokenPayload = {
          client_id: apiKey,
          client_secret: apiSecret,
          code,
        };
        Axios.post(accessTokenRequestUrl, accessTokenPayload, {headers: {"Access-Control-Allow-Origin": "https://cloudole-2f23d.web.app"}})
        .then((response) => {
          let data_copy = JSON.parse(JSON.stringify(response.data))
          data_copy['shop'] = shop
          const frontendURL = '/signup' +
          '?token=' + data_copy.access_token +
          '&shop=' + shop;
          return <Redirect to={{ pathname: frontendURL }} />
        });
      }
    return <div/>
}