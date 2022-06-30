import React, { Component } from "react";

import "./TextInput.scss";

export default class TextInput extends Component
{
    render()
    {
        return (
            <input
                type="text"
                value={this.props.value}
                onChange={this.props.onChange}
                placeholder={this.props.placeholder??""}
                className="text-input"
            />
        );
    }
}
