import React, { Component } from 'react'
import { connect } from 'react-redux'
import Select from 'react-select';
import Slider from '../components/Slider';

import * as ActionTypes from '../constants/ActionTypes'
import ApplySettingsPopup from "../popups/ApplySettingsPopup";
import VoipSlider from "../components/VoipSlider";

class Settings extends Component
{
    render()
    {
        const selectStyle = {
            control: (provided) => ({
                ...provided,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                borderRadius: 0,
                border: '0.1574074074074074vh solid rgba(255, 255, 255, 0.7)',
                '&:hover': {
                    borderColor: 'rgba(255, 255, 255, 1)'
                },
                minHeight: 0,
                height: '3.703703703703704vh', // 40px
            }),
            singleValue: (provided) => ({
                ...provided,
                color: '#fff',
                fontWeight: 300,
                fontSize: '1.851851851851852vh', // 20px
            }),
            option: (provided, state) => {
                let backgroundColor = 'transparent';
                let color = '#fff';
                let fontWeight = 300;

                if (state.isFocused && !state.isSelected)
                {
                    backgroundColor = 'rgba(255, 255, 255, 0.2)';
                }
                else if (state.isSelected)
                {
                    backgroundColor = 'rgba(255, 255, 255, 0.8)';
                    color = '#000';
                    fontWeight = 500;
                }

                return {
                    ...provided,
                    backgroundColor,
                    color,
                    fontWeight,
                    fontSize: '1.851851851851852vh', // 20px
                    padding: '0.7407407407407407vh 1.111111111111111vh', // 8px 12px,
                };
            },
            menu: (provided) => ({
                ...provided,
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                backdropFilter: 'blur(20px)',
                willChange: 'top',
                borderRadius: 0,
                boxShadow: 'none',
                border: '0.1574074074074074vh solid rgba(255, 255, 255, 0.4)'
            }),
            dropdownIndicator: (provided) => ({
                ...provided,
                padding: '0.7407407407407407vh', // 8px
                svg: {
                    height: '1.851851851851852vh', // 20px
                    width: '1.851851851851852vh', // 20px
                },
            }),
            indicatorSeparator: (provided) => ({
                ...provided,
                width: '0.1574074074074074vh', // 1.7px
                marginTop: '0.7407407407407407vh', // 8px
                marginBottom: '0.7407407407407407vh', // 8px
            }),
            valueContainer: (provided) => ({
                ...provided,
                padding: '0 0.7407407407407407vh', // 0 8px
                height: '3.546296296296296vh', // 38.3px
            }),
        };

        const fullscreenOptions = [];

        for (let i = 0; i < this.props.settings.currentSettings.resolutions[this.props.settings.currentSettings.selectedScreen].length; ++i)
        {
            const resolution = this.props.settings.currentSettings.resolutions[this.props.settings.currentSettings.selectedScreen][i];
            fullscreenOptions.push({ value: i, label: resolution });
        }

        const screenOptions = [];

        for (let i = 0; i < this.props.settings.currentSettings.screens; ++i)
        {
            screenOptions.push({ value: i, label: 'Monitor #' + (i + 1) })
        }

        const displayModeOptions = [
            { value: true, label: 'Exclusive Fullscreen' },
            { value: false, label: 'Windowed' },
        ];

        const voipDevices = [];
        let selectedDevice = 0;

        for (let i = 0; i < this.props.voip.devices.length; ++i)
        {
            let device = this.props.voip.devices[i];
            voipDevices.push({ value: device.id, label: device.name });

            if (device.id === this.props.voip.selectedDevice)
                selectedDevice = i;
        }

        if (voipDevices.length === 0)
        {
            voipDevices.push({ value: -1, label: 'No microphone detected' });
            selectedDevice = 0;
        }

        let gameSettings = (
            <>
                <h2>Game settings</h2>
                <div className="settings-container">
                    <div className="settings-row">
                        <div className="left">
                            <h3>Display mode</h3>
                            <Select
                                options={displayModeOptions}
                                isSearchable={false}
                                value={displayModeOptions[this.props.settings.currentSettings.fullscreen ? 0 : 1]}
                                onChange={this._onDisplayModeChange}
                                styles={selectStyle}
                            />
                        </div>
                        <div className="middle">
                            <h3>Fullscreen resolution</h3>
                            <Select
                                options={fullscreenOptions}
                                isSearchable={false}
                                value={fullscreenOptions[this.props.settings.currentSettings.selectedResolution]}
                                onChange={this._onResolutionChange}
                                styles={selectStyle}
                            />
                        </div>
                        <div className="right">
                            <h3>Fullscreen monitor</h3>
                            <Select
                                options={screenOptions}
                                isSearchable={false}
                                value={screenOptions[this.props.settings.currentSettings.selectedScreen]}
                                onChange={this._onScreenChange}
                                styles={selectStyle}
                            />
                        </div>
                    </div>
                    <div className="settings-row">
                        <div className="left">
                            <h3>Master volume</h3>
                            <Slider onChange={this._onMasterVolumeChange} value={this.props.settings.currentSettings.masterVolume} />
                        </div>
                        <div className="middle">
                            <h3>Music volume</h3>
                            <Slider onChange={this._onMusicVolumeChange} value={this.props.settings.currentSettings.musicVolume} />
                        </div>
                        <div className="right">
                            <h3>Dialogue volume</h3>
                            <Slider onChange={this._onDialogueVolumeChange} value={this.props.settings.currentSettings.dialogueVolume} />
                        </div>
                    </div>
                </div>
            </>
        );

        let popupHeader = null;

        if (this.props.popup)
        {
            gameSettings = null;

            popupHeader = (
                <h1>VU Options</h1>
            );
        }

        return (
            <div className="settings content-wrapper">
                {popupHeader}
                {gameSettings}
                <h2>VoIP settings</h2>
                <div className="settings-container">
                    <div className="settings-row">
                        <div className="left">
                            <h3>Microphone Device</h3>
                            <Select
                                options={voipDevices}
                                isSearchable={false}
                                value={voipDevices[selectedDevice]}
                                onChange={this._onVoipDeviceChange}
                                styles={selectStyle}
                            />
                        </div>
                        <div className="middle-right">
                            <h3>Voice activation threshold</h3>
                            <VoipSlider onChange={this._onVoipCutoffVolumeChange} volume={this.props.voip.volume} value={this.props.voip.cutoffVolume} />
                        </div>
                    </div>
                </div>
                <h2>Mod settings</h2>
                <div className="settings-container">
                    <h3>Coming soon&trade;</h3>
                </div>
                <div className="settings-buttons">
                    <a href="#" className="btn border-btn" onClick={this._onResetSettings}>Reset settings</a>
                    <a href="#" className="btn border-btn primary" onClick={this._onApplySettings}>Apply settings</a>
                </div>
            </div>
        );
    }

    _onApplySettings = (e) =>
    {
        if (e)
            e.preventDefault();

        WebUI.Call('ApplySettings', this.props.settings.currentSettings);

        if (this.props.popup) {
            this.props.hideSettingsPopup();
        } else {
            this.props.setPopup(<ApplySettingsPopup/>);
        }
    };

    _onResetSettings = (e) =>
    {
        if (e)
            e.preventDefault();

        WebUI.Call('RefreshSettings');
    };

    _onDisplayModeChange = (displayMode) =>
    {
        this.props.setFullscreen(displayMode.value);
    };

    _onResolutionChange = (resolution) =>
    {
        this.props.setResolutionIndex(resolution.value);
    };

    _onScreenChange = (resolution) =>
    {
        this.props.setScreenIndex(resolution.value);
    };

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

    componentDidMount()
    {
        WebUI.Call('RefreshSettings');
        WebUI.Call('SettingsActive');

        this.props.disableBlur();
        this.props.enableMenu();
    }

    componentWillUnmount()
    {
        WebUI.Call('SettingsInactive');
    }
}

const mapStateToProps = (state) => {
    return {
        base: state.base,
        settings: state.settings,
        voip: state.voip,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        disableBlur: () => {
            dispatch({ type: ActionTypes.SET_BLUR, blur: false })
        },
        enableMenu: () => {
            dispatch({ type: ActionTypes.SET_MENU, menu: true })
        },
        setPopup: (popup) => {
            dispatch({ type: ActionTypes.SET_POPUP, popup: popup })
        },
        setResolutionIndex: (index) => {
            dispatch({ type: ActionTypes.SET_CURRENT_SETTINGS, settings: { selectedResolution: index } });
        },
        setScreenIndex: (index) => {
            dispatch({ type: ActionTypes.SET_CURRENT_SETTINGS, settings: { selectedScreen: index } });
        },
        setMasterVolume: (volume) => {
            dispatch({ type: ActionTypes.SET_CURRENT_SETTINGS, settings: { masterVolume: volume } });
        },
        setMusicVolume: (volume) => {
            dispatch({ type: ActionTypes.SET_CURRENT_SETTINGS, settings: { musicVolume: volume } });
        },
        setDialogueVolume: (volume) => {
            dispatch({ type: ActionTypes.SET_CURRENT_SETTINGS, settings: { dialogueVolume: volume } });
        },
        setFullscreen: (fullscreen) => {
            dispatch({ type: ActionTypes.SET_CURRENT_SETTINGS, settings: { fullscreen } });
        },
        hideSettingsPopup: () => {
            dispatch({ type: ActionTypes.SHOW_SETTINGS_POPUP, show: false });
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Settings);
