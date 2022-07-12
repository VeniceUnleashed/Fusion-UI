import React, { Component } from "react";

import { InputDeviceKeyNames, getInputDeviceKeyFromKeyboardEvent } from "../../constants/InputDeviceKey";
import "./KeybindInput.scss";

export default class KeybindInput extends Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            editing: false,
        };
        this.inputRef = React.createRef();
    };

    render()
    {
        return (
            <div className="keybind-input">
                <input
                    type="text"
                    ref={this.inputRef}
                    value={!this.state.editing ? InputDeviceKeyNames[this.props.value]??"" : ""}
                    placeholder={this.state.editing ? "Press a key..." : (this.props.placeholder??"")}
                    onKeyDown={this._onKeyDown}
                    onClick={() => this.setState({ editing: true })}
                    onBlur={() => this.setState({ editing: false })}
                    readOnly
                />
                {this.state.editing &&
                    <button className="keybind-reset" onClick={() => this.setState({ editing: false })}>
                        Cancel
                    </button>
                }
                {(!this.state.editing && this.props.value !== "") &&
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

        // Cancel
        if (e.key === 'Escape') {
            this.inputRef.current.blur();
            return;
        }

        const key = getInputDeviceKeyFromKeyboardEvent(e);
        if (!key) {
            console.warn(`${e.key}(${e.keyCode}) is not a supported InputDeviceKey`);
            return;
        }

        this.inputRef.current.blur();
        this.props.onChange(key);
    };
}
