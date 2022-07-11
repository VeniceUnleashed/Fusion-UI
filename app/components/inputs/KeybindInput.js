import React, { Component } from "react";

import "./KeybindInput.scss";

export default class KeybindInput extends Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            editing: false,
        };
    };

    render()
    {
        return (
            <div className="keybind-input">
                <input
                    type="text"
                    value={!this.state.editing ? this.props.value : ""}
                    placeholder={this.state.editing ? "Press a key..." : (this.props.placeholder??"")}
                    onKeyDown={this._onKeyDown}
                    onClick={() => this.setState({ editing: true })}
                    onBlur={() => this.setState({ editing: false })}
                    readOnly
                />
                {this.props.value !== "" &&
                    <button className="keybind-reset" onClick={() => this.props.onChange("")}>
                        Reset
                    </button>
                }
            </div>
        );
    }

    _onKeyDown = (e) =>
    {
        e.preventDefault();
        this.setState({ editing: false });
        this.props.onChange(e.keyCode)
    };
}
