import React, { Component } from "react";

import "./KeybindInput.scss";

export default class KeybindInput extends Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            focus: false,
            value: props.value??"",
        };
    };

    render()
    {
        return (
            <div className="keybind-input">
                <input
                    type="text"
                    value={this.state.value}
                    placeholder={this.state.focus ? "Press a key..." : (this.props.placeholder??"")}
                    onKeyDown={this._onKeyDown}
                    onFocus={() => this.setState({ focus: true })}
                    onBlur={() => this.setState({ focus: false })}
                    disabled={this.state.value !== ""}
                />
                {this.state.value !== "" &&
                    <button className="keybind-reset" onClick={() => this.setState({ value: "" })}>
                        Reset
                    </button>
                }
            </div>
        );
    }

    _onKeyDown = (e) =>
    {
        e.preventDefault();
        this.setState({ value: e.key });
        // this.props.onChange(e.keyCode)
    };
}
