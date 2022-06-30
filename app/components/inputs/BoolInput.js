import React, { Component } from "react";

import "./BoolInput.scss";

export default class BoolInput extends Component
{
    render()
    {
        return (
            <label className="bool-input">
                <input type="checkbox" />
                <span className="slider round"></span>
                <span className="off">Off</span>
                <span className="on">On</span>
            </label>
        );
    }
}
