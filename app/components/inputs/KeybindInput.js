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
            originalValue: props.value
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
                    onBlur={this._onCancel}
                    readOnly
                />
                {this.state.editing &&
                    <button className="keybind-reset" onClick={this._onCancel}>
                        Cancel
                    </button>
                }
                {(!this.state.editing && this.props.value !== this.state.originalValue) &&
                    <button className="keybind-reset" onClick={this._onReset}>
                        Reset
                    </button>
                }
            </div>
        );
    }

    _onCancel = (e) =>
    {
        e.preventDefault();

        this.setState({ editing: false });
    }

    _onReset = (e) =>
    {
        this.props.onChange(this.state.originalValue);
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
