import React from 'react'
import { Router, Route, hashHistory } from 'react-router'

import App from '../containers/App'

import Login from '../containers/Login'
import Connection from '../containers/Connection'
import OriginLink from '../containers/OriginLink'
import Players from '../containers/Players'
import MainMenu from '../containers/MainMenu'
import ServerBrowser from '../containers/ServerBrowser'
import Soldiers from '../containers/Soldiers'
import Credits from '../containers/Credits'
import Settings from "../containers/Settings";

export default class ClientRenderer extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    render()
    {
        return (
            <Router history={hashHistory}>
                <Route path="/" component={App}>
                    <Route path="login" component={Login} />
                    <Route path="connection" component={Connection} />
                    <Route path="origin-link" component={OriginLink} />
                    <Route path="players" component={Players} />
                    <Route path="main-menu" component={MainMenu} />
                    <Route path="server-browser" component={ServerBrowser} />
                    <Route path="soldiers" component={Soldiers} />
                    <Route path="credits" component={Credits} />
                    <Route path="settings" component={Settings} />
                </Route>
            </Router>
        );
    }
}