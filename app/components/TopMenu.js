import React, { Component } from 'react';
import { Link } from 'react-router'

export default class TopMenu extends Component
{
    render()
    {
        return (
            <div className="top-menu">
                <ul className="left-items">
                    <li><Link to="/main-menu" activeClassName="active">News</Link></li>
                    <li><Link to="/server-browser" activeClassName="active">Servers</Link></li>
                </ul>
                <div className="menu-logo">
                </div>
                <ul className="right-items">
                    <li><Link to="/settings" activeClassName="active">Settings</Link></li>
                    <li><Link to="/credits" activeClassName="active">Credits</Link></li>
                </ul>
            </div>
        );
    }
}
