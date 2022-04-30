import React, { Component } from 'react';

export default class GlobalNotice extends Component
{
    render()
    {
        return (
            <div id="global-notice">
                <div className="header"><i className="material-icons">report_problem</i>Global message<i className="material-icons">report_problem</i></div>
                <div className="notice">{this.props.notice}</div>
            </div>
        );
    }
}
