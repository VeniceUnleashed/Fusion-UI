import React, { Component } from 'react';
import Slider from 'rc-slider';

export default class SliderInput extends Component
{
    render()
    {
        let className = 'slider-input';

        if (this.props.className)
            className += ' ' + this.props.className;

        return (
            <div className={className}>
                <input className="slider-value" type="text" maxLength={3} onChange={this._onInputChange} value={Math.round(this.props.value * 100)} />
                <Slider onChange={this._onSliderChange} value={this.props.value * 100} />
            </div>
        );
    }

    _onSliderChange = (value) =>
    {
        this.props.onChange(value / 100.0);
    };

    _onInputChange = (e) =>
    {
        // Make sure to only allow numbers.
        if (e.target.value.length > 0 && !e.target.value.match(/[0-9]+/g))
        {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
            return;
        }

        if (e.target.value.length === 0)
            e.target.value = '0';

        let value = parseInt(e.target.value, 10);

        if (value > 100)
        {
            e.target.value = '100';
            value = 100;
        }

        this.props.onChange(value / 100.0);
    };
}
