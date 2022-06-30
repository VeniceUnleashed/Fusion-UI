import React, { Component } from "react";

import Slider from '../../components/Slider';

import "./NumberInput.scss";

export default class NumberInput extends Component
{
    render()
    {
        return (
            <Slider
                onChange={this.props.onChange}
                value={this.props.value}
            />
        );
    }
}
