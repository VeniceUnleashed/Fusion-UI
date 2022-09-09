import React, { Component } from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';

import * as ActionTypes from "../constants/ActionTypes";
import { SELECT_STYLE } from "../constants/Styles";
import VoipSlider from "../components/VoipSlider";
import Slider from "../components/Slider";

class AudioSettings extends Component
{
    render() {
        const voipDevices = [];
        let selectedDevice = 0;
        for (let i = 0; i < this.props.voip.devices.length; ++i)
        {
            let device = this.props.voip.devices[i];
            voipDevices.push({ value: device.id, label: device.name });

            if (device.id === this.props.voip.selectedDevice) {
                selectedDevice = i;
            }
        }

        if (voipDevices.length === 0)
        {
            voipDevices.push({ value: -1, label: 'No microphone detected' });
            selectedDevice = 0; // I don't think we need this one
        }

        return (
            <>
                <h2>Audio settings</h2>
                <div className="settings-row">
                    <h3>Master volume</h3>
                    <Slider onChange={this._onMasterVolumeChange} value={this.props.settings.currentSettings.masterVolume} />
                </div>
                <div className="settings-row">
                    <h3>Music volume</h3>
                    <Slider onChange={this._onMusicVolumeChange} value={this.props.settings.currentSettings.musicVolume} />
                </div>
                <div className="settings-row">
                    <h3>Dialogue volume</h3>
                    <Slider onChange={this._onDialogueVolumeChange} value={this.props.settings.currentSettings.dialogueVolume} />
                </div>
                <h2>VoIP settings</h2>
                <div className="settings-row">
                    <h3>Microphone Device</h3>
                    <Select
                        options={voipDevices}
                        isSearchable={false}
                        value={voipDevices[selectedDevice]}
                        onChange={this._onVoipDeviceChange}
                        styles={SELECT_STYLE}
                    />
                </div>
                <div className="settings-row">
                    <h3>Voice activation threshold</h3>
                    <VoipSlider onChange={this._onVoipCutoffVolumeChange} volume={this.props.voip.volume} value={this.props.voip.cutoffVolume} />
                </div>
            </>
        );
    }

    _onMasterVolumeChange = (volume) =>
    {
        this.props.setMasterVolume(volume);
    };
    
    _onMusicVolumeChange = (volume) =>
    {
        this.props.setMusicVolume(volume);
    };

    _onDialogueVolumeChange = (volume) =>
    {
        this.props.setDialogueVolume(volume);
    };

    _onVoipDeviceChange = (device) =>
    {
        WebUI.Call('VoipSelectDevice', device.value);
    };

    _onVoipCutoffVolumeChange = (volume) =>
    {
        WebUI.Call('VoipCutoffVolume', volume);
    };
};

const mapStateToProps = (state) => {
    return {
        settings: state.settings,
        voip: state.voip,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setMasterVolume: (volume) => {
            dispatch({ type: ActionTypes.SET_CURRENT_SETTINGS, settings: { masterVolume: volume } });
        },
        setMusicVolume: (volume) => {
            dispatch({ type: ActionTypes.SET_CURRENT_SETTINGS, settings: { musicVolume: volume } });
        },
        setDialogueVolume: (volume) => {
            dispatch({ type: ActionTypes.SET_CURRENT_SETTINGS, settings: { dialogueVolume: volume } });
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AudioSettings);
