import React, { Component } from 'react';

export default class LoadingIndicator extends Component
{
    constructor(props)
    {
        super(props);

        this.timeout = null;

        this.state = {
            style: {}
        };
    }

    componentDidMount()
    {
        this.timeout = setTimeout(() => {
            this.timeout = null;

            this.setState({
                style: { borderRadius: "52%" }
            });
        }, 150);
    }

    componentWillUnmount()
    {
        if (this.timeout === null)
            return;

        clearTimeout(this.timeout);
        this.timeout = null;
    }

    render()
    {
        return (
            <i className="loading-indicator" style={this.state.style} />
        );
    }
}