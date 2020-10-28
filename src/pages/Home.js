import React from 'react'
import Dashboard from '../_components/Dashboard'
import Wrapper from '../_components/Wrapper'
import {
    Switch,
    Route,
    useRouteMatch
  } from "react-router-dom";

export default function Home () {
    let { path } = useRouteMatch();
    return (
        <Wrapper>
            <Switch>
                <Route exact path={path}>
                    <Dashboard/>
                </Route>
                <Route path={`${path}/product/:Id`}>
                </Route>
            </Switch>
        </Wrapper>
    )
}
