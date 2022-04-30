import React, { Component } from 'react';
import Slider from 'rc-slider';

export default class VoipSlider extends Component
{
    render()
    {
        let volumeClassName = 'voip-volume';

        if (this.props.volume >= this.props.value)
            volumeClassName += ' active';

        return (
            <div className="slider-input voip-slider">
                <input className="slider-value" type="text" maxLength={3} onChange={this._onInputChange} value={Math.round(this.props.value * 100)} />
                <Slider onChange={this._onSliderChange} value={this.props.value * 100}>
                    <div className={volumeClassName} style={{ width: (this.props.volume * 100.0) + '%' }} />
                </Slider>
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
