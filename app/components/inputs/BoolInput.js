import React, { Component } from "react";

import "./BoolInput.scss";

export default class BoolInput extends Component
{
    render()
    {
        return (
            <label className="bool-input">
                <input
                    type="checkbox"
                    defaultChecked={this.props.value}
                    checked={this.props.value}
                    onChange={this.props.onChange}
                />
                <span className="slider round"></span>
                <span className="off">Off</span>
                <span className="on">On</span>
            </label>
        );
    }
}
