import React, { Component } from "react";
import Select from 'react-select';

import { SELECT_STYLE } from "../../constants/Styles";

export default class OptionsInput extends Component
{
    render()
    {
        let val = null;
        if (this.props.value) {
            val = {
                value: this.props.value.value,
                label: this.props.value
            };
        }

        let options = [];
        if (this.props.options) {
            options = this.props.options.map(t=>({value: t, label: t}));
        }

        return (
            <Select
                isSearchable={false}
                styles={SELECT_STYLE}
                value={val}
                options={options}
                onChange={this.props.onChange}
                isClearable={!!this.props.allowEmpty}
            />
        );
    }
}
