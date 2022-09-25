import React, { Component } from "react";
import Slider from "rc-slider";

import "./NumberInput.scss";

export default class NumberInput extends Component
{
    render()
    {
        let className = 'slider-input';

        if (this.props.className)
            className += ' ' + this.props.className;

        return (
            <div className={className}>
                <input
                    className="slider-value"
                    type="text"
                    onChange={this._onInputChange}
                    value={this.props.value}
                />
                <Slider
                    onChange={this._onSliderChange}
                    value={this.props.value}
                    min={this.props.min}
                    max={this.props.max}
                />
            </div>
        );
    }

    _onSliderChange = (value) =>
    {
        this.props.onChange(value);
    };

    _onInputChange = (e) =>
    {
        // Make sure to only allow numbers.
        if (e.target.value.length > 0 && !e.target.value.match(/[0-9]+/g)) {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
            return;
        }

        if (e.target.value.length === 0) {
            e.target.value = 0;
        }

        let value = parseInt(e.target.value, 10);

        if (value > this.props.max) {
            e.target.value = this.props.max;
            value = this.props.max;
        }

        if (value < this.props.min) {
            e.target.value = this.props.min;
            value = this.props.min;
        }

        this.props.onChange(value);
    };
}
