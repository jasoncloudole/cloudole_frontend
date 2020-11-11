import React from 'react'
import Dashboard from '../_components/Dashboard'
import GoogleMaps from '../_components/Maps'
import Wrapper from '../_components/Wrapper'
import {
    Switch,
    Route
  } from "react-router-dom";

export default function Home (props) {
    return (
        <Wrapper>
            <Switch>
                <Route exact path={'/'}>
                    <Dashboard {...props}/>
                </Route>
                <Route exact path={`/product/:barcode`}>
                    <GoogleMaps {...props}/>
                </Route>
            </Switch>
        </Wrapper>
    )
}
