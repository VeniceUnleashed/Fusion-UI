import React, { Component } from "react";

import { InputDeviceKeyNames, getInputDeviceKeyFromKeyboardEvent } from "../../constants/InputDeviceKey";
import "./MultiKeybindInput.scss";

export default class MultiKeybindInput extends Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            editing: false,
            value: [],
            originalValue: props.value
        };
        this.inputRef = React.createRef();
    };

    render()
    {
        return (
            <div className="multi-keybind-input">
                <input
                    type="text"
                    ref={this.inputRef}
                    value={this._getValue()}
                    placeholder={this.state.editing ? "Press a key..." : (this.props.placeholder??"")}
                    onKeyDown={this._onKeyDown}
                    onClick={this._onStartEditing}
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

    _getValue()
    {
        if (this.state.editing) {
            if (this.state.value.length === 0) {
                return "";
            }
            return this.state.value.map(it => InputDeviceKeyNames[it.key]).join(' + ') + ' +';
        }
        return this.props.value.map(value => InputDeviceKeyNames[value]).join(' + ');
    }

    _onStartEditing = (e) =>
    {
        if (this.state.editing) {
            return;
        }

        this.setState({
            value: [],
            editing: true
        });
    }

    _onCancel = (e) => {
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

        // Check if key was already added to the list
        // const exists = this.state.value.findIndex(it => it.keyCode === e.keyCode) !== -1;
        // if (exists) {
        //     console.warn(`${e.key}(${e.keyCode}) was already registered`);
        //     return;
        // }

        // Filter out any similar modifier key, add the new key and sort it by key code
        const newValue = [...this.state.value.filter(it => it.keyCode !== e.keyCode), { keyCode: e.keyCode, key }]
            .sort((a, b) => a.keyCode < b.keyCode);

        this.setState({
            value: newValue
        });

        // Check if key is not a moddifer
        if (e.key !== 'Control' && e.key !== 'Shift' && e.key !== 'Alt') {
            this.inputRef.current.blur();
            this.props.onChange(newValue.map(it => it.key));
        }
    };
}
