import React, { Component } from 'react';
import UpdateIndicator from "./UpdateIndicator";

export default class TopRightActions extends Component
{
    render()
    {
        return (
            <ul className="top-actions right">
                <li><UpdateIndicator/></li>
            </ul>
        );
    }

    onLogout(e)
    {
        if (e)
            e.preventDefault();

        if (this.props.onLogout)
            this.props.onLogout();
    }
}