import React, { Component } from 'react';

export default class Watermark extends Component
{
    render()
    {
        let buildNumber = null;

        if (this.props.build !== null) {
            buildNumber = <span>#{this.props.build}</span>;
        }

        return (
            <div id="watermark">
                <img src="/assets/img/logo-outline.svg" />
                {buildNumber}
            </div>
        );
    }
}
