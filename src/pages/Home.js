import React from 'react'
import Dashboard from '../_components/Dashboard'
import GoogleMaps from '../_components/Maps'
import Wrapper from '../_components/Wrapper'
import {
    Switch,
    Route
  } from "react-router-dom";

export default function Home () {
    return (
        <Wrapper>
            <Switch>
                <Route exact path={'/'}>
                    <Dashboard/>
                </Route>
                <Route path={`/product/:barcode`}>
                    <GoogleMaps/>
                </Route>
            </Switch>
        </Wrapper>
    )
}
