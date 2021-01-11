import {
    Route,
    Switch
} from "react-router-dom";

import Dashboard from '../_components/Dashboard'
import GoogleMaps from '../_components/Maps'
import OrderHistory from '../_components/OrderHistory'
import React from 'react'
import Sell from '../_components/Sell'
import Wrapper from '../_components/Wrapper'

export default function Home (props) {
    return (
        <Wrapper>
            <Switch>
                <Route exact path={'/'}>
                    <Dashboard {...props}/>
                </Route>
                <Route exact path={'/order-history'}>
                    <OrderHistory {...props}/>
                </Route>
                <Route exact path={'/sell'}>
                    <Sell {...props}/>
                </Route>
                <Route exact path={`/product/:barcode`}>
                    <GoogleMaps {...props}/>
                </Route>
            </Switch>
        </Wrapper>
    )
}
