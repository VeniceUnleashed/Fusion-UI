import React, { Component } from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import PerfectScrollbar from 'perfect-scrollbar';

import * as ActionTypes from "../constants/ActionTypes";
import ApplySettingsPopup from "../popups/ApplySettingsPopup";
import { SELECT_STYLE } from "../constants/Styles";
import TextInput from "../components/inputs/TextInput";
import BoolInput from "../components/inputs/BoolInput";
import NumberInput from "../components/inputs/NumberInput";
import KeybindInput from "../components/inputs/KeybindInput";
import OptionsInput from "../components/inputs/OptionsInput";
import {
    BOOL,
    NUMBER,
    KEYBIND,
    MULTI_KEYBIND,
    STRING,
    OPTION
} from "../constants/ModSettingType";
import AudioSettings from "../components/settings/AudioSettings";

class Settings extends Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            modName: ""
        };
        this.modListScrollbar = null;
        this.modSettingsScrollbar = null;
    };

    render()
    {
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

        let gameSettings = (
            <div className="general-settings">
                <h2>Display settings</h2>
                <div className="settings-row">
                    <h3>Display mode</h3>
                    <Select
                        options={displayModeOptions}
                        isSearchable={false}
                        value={displayModeOptions[this.props.settings.currentSettings.fullscreen ? 0 : 1]}
                        onChange={this._onDisplayModeChange}
                        styles={SELECT_STYLE}
                    />
                </div>
                <div className="settings-row">
                    <h3>Fullscreen resolution</h3>
                    <Select
                        options={fullscreenOptions}
                        isSearchable={false}
                        value={fullscreenOptions[this.props.settings.currentSettings.selectedResolution]}
                        onChange={this._onResolutionChange}
                        styles={SELECT_STYLE}
                    />
                </div>
                <div className="settings-row">
                    <h3>Fullscreen monitor</h3>
                    <Select
                        options={screenOptions}
                        isSearchable={false}
                        value={screenOptions[this.props.settings.currentSettings.selectedScreen]}
                        onChange={this._onScreenChange}
                        styles={SELECT_STYLE}
                    />
                </div>
                <AudioSettings />
            </div>
        );

        const renderModSetting = (settingKey, setting) => {
            switch (setting.type) {
                case BOOL:
                    return <BoolInput 
                        value={setting.currentValue??setting.value}
                        onChange={(e) => {
                            this._onChangeModInput(settingKey, e.target.checked);
                        }}
                    />;
                case NUMBER:
                    return <NumberInput
                        value={setting.currentValue??setting.value.value}
                        onChange={(e) => {
                            this._onChangeModInput(settingKey, e);
                        }}
                        min={setting.value.min??0}
                        max={setting.value.max??100}
                    />;
                case KEYBIND:
                    return <KeybindInput
                        value={setting.currentValue !== undefined ? setting.currentValue : setting.value}
                        onChange={(e) => {
                            this._onChangeModInput(settingKey, e);
                        }}
                    />;
                case MULTI_KEYBIND:
                    return  <>Unsupported</>; // TODO: Fixme
                case STRING:
                    return <TextInput
                        value={setting.currentValue??setting.value}
                        onChange={(e) => {
                            this._onChangeModInput(settingKey, e.target.value);
                        }}
                    />;
                case OPTION:
                    return <OptionsInput
                        value={setting.currentValue??setting.value.value}
                        options={setting.value.options}
                        allowEmpty={setting.allowEmpty}
                        onChange={(e) => {
                            this._onChangeModInput(settingKey, e.value);
                        }}
                    />;
                default:
                    return <div></div>;
            }
        }

        const renderActiveModSettings = () =>
        {
            if (this.props.settings.selectedMod === "") {
                return <></>;
            }

            return (
                <>
                    {Object.entries(this.props.settings.modSettings[this.props.settings.selectedMod])
                        .sort((settingA, settingB) => settingA[1].displayName.localeCompare(settingB[1].displayName))
                        .map((setting) => (
                        <div className="settings-row" key={setting[0]}>
                            <h3>{setting[1].displayName??""}</h3>
                            {renderModSetting(setting[0], setting[1])}
                        </div>
                    ))}
                </>
            );
        }

        let modSettings = (
            <div className="mod-settings-container">
                <div className="mod-search-bar">
                    <TextInput value={this.state.modName} onChange={this._onChangeModName} placeholder="Search..." />
                </div>
                <div className="mod-list" style={{ overflowX: 'hidden' }} ref={this._onModList}>
                    {Object.keys(this.props.settings.modSettings).filter((key) => {
                        return key.toLowerCase().search(this.state.modName.toLowerCase()) != -1;
                    }).sort((a, b) => a.localeCompare(b)).map((key) => (
                        <div
                            className={"mod" + (this.props.settings.selectedMod === key ? " active" : "")}
                            key={key}
                            onClick={() => this._onSelectMod(key)}
                        >
                            <span>
                                {key??""}
                            </span>
                        </div>
                    ))}
                </div>
                {this.props.settings.selectedMod !== "" ?
                    <div className="mod-settings" style={{ overflowX: 'hidden' }} ref={this._onModSettings}>
                        <h2>{this.props.settings.selectedMod}</h2>
                        <div className="settings-container">
                            {renderActiveModSettings()}
                        </div>
                    </div>
                :
                    <div className="mod-settings no-mod">
                        <h3>No mod selected</h3>
                    </div>
                }
            </div>
        );

        let popupHeader = null;
        if (this.props.popup) {
            gameSettings = (
                <div className="general-settings">
                    <AudioSettings />
                </div>
            );
        }

        const renderActiveTab = () =>
        {
            switch (this.props.settings.tab) {
                default:
                case "game":
                    return gameSettings;
                case "mods":
                    return modSettings;
            }
        }

        return (
            <div className="settings content-wrapper">
                {popupHeader}
                <div className="tabs">
                    <a className={this._isTabActive("game")} onClick={() => this.props.setSettingsTab("game")}>
                        General settings
                    </a>
                    <a className={this._isTabActive("mods")} onClick={() => this.props.setSettingsTab("mods")}>
                        Mod settings
                    </a>
                </div>
                <div className="tab-inner">
                    {renderActiveTab()}
                </div>
                <div className="settings-buttons">
                    <a href="#" className="btn border-btn" onClick={this._onResetSettings}>Reset settings</a>
                    <a href="#" className="btn border-btn primary" onClick={this._onApplySettings}>Apply settings</a>
                </div>
            </div>
        );
    }

    _onChangeModInput = (settingKey, value) => {
        this.props.setSettingValue(
            this.props.settings.modSettings,
            this.props.settings.selectedMod,
            settingKey,
            value
        );
    };

    _onChangeModName = (e) =>
    {
        if (this.modListScrollbar) {
            this.modListScrollbar.update();
            this.modListScrollbar.element.scrollTop = 0;
        }
        this.setState({
            modName: e.target.value,
        });
    };

    _onSelectMod = (mod) =>
    {
        if (this.modSettingsScrollbar) {
            this.modSettingsScrollbar.update();
            this.modSettingsScrollbar.element.scrollTop = 0;
        }
        this.props.setSettingsSelectedMod(mod);
        /*
        this.setState({
            modName: "",
        });
        */
    };
    
    _onModList = (ref) =>
    {
        if (ref === null) {
            this.modListScrollbar = null;
            return;
        }

        this.modListScrollbar = new PerfectScrollbar(ref, {
            wheelSpeed: 1,
        });
    };

    _onModSettings = (ref) =>
    {
        if (ref === null) {
            this.modSettingsScrollbar = null;
            return;
        }

        this.modSettingsScrollbar = new PerfectScrollbar(ref, {
            wheelSpeed: 3,
        });
    };

    _isTabActive = (tab) =>
    {
        if (tab === this.props.settings.tab) {
            return "tab active";
        }
        return "tab";
    }

    _onApplySettings = (e) =>
    {
        if (e)
            e.preventDefault();

        WebUI.Call('ApplySettings', this.props.settings.currentSettings);

        // For mod settings:
        // WebUI.Call('SetModSettingBool', modName: string, settingName: string, value: boolean);
        // WebUI.Call('SetModSettingNumber', modName: string, settingName: string, value: number);
        // WebUI.Call('SetModSettingKeybind', modName: string, settingName: string, value: number);
        // WebUI.Call('SetModSettingMultiKeybind', modName: string, settingName: string, value: number[]);
        // WebUI.Call('SetModSettingString', modName: string, settingName: string, value: string);
        // WebUI.Call('SetModSettingOption', modName: string, settingName: string, value: string | null);

        Object.entries(this.props.settings.modSettings).forEach((mod) => {
            const modName = mod[0];
            Object.entries(mod[1]).forEach((setting) => {
                const settingName = setting[0];
                const value = setting[1].currentValue;
                if (value !== undefined) {
                    switch (setting[1].type) {
                        case BOOL:
                            WebUI.Call('SetModSettingBool', modName, settingName, value);
                            break;
                        case NUMBER:
                            WebUI.Call('SetModSettingNumber', modName, settingName, value);
                            break;
                        case KEYBIND:
                            WebUI.Call('SetModSettingKeybind', modName, settingName, value);
                            break;
                        case MULTI_KEYBIND:
                            WebUI.Call('SetModSettingMultiKeybind', modName, settingName, value); // TODO: Fixme
                            break;
                        case STRING:
                            WebUI.Call('SetModSettingString', modName, settingName, value);
                            break;
                        case OPTION:
                            WebUI.Call('SetModSettingOption', modName, settingName, value);
                            break;
                    }
                }
            });
        });

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

        let settings = {
            ...this.props.settings.modSettings,
        };
        Object.entries(this.props.settings.modSettings).forEach((mod) => {
            const modName = mod[0];
            Object.entries(mod[1]).forEach((setting) => {
                const settingName = setting[0];
                const value = setting[1].currentValue;
                if (value !== undefined) {
                    settings = {
                        ...settings,
                        [modName]: {
                            ...settings[modName],
                            [settingName]: {
                                ...settings[modName][settingName],
                                currentValue: undefined,
                            },
                        },
                    };
                }
            });
        });
        this.props.setSettings(settings);

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
        setFullscreen: (fullscreen) => {
            dispatch({ type: ActionTypes.SET_CURRENT_SETTINGS, settings: { fullscreen } });
        },
        hideSettingsPopup: () => {
            dispatch({ type: ActionTypes.SHOW_SETTINGS_POPUP, show: false });
        },
        setSettingsTab: (tab) => {
            dispatch({ type: ActionTypes.SET_SETTINGS_TAB, tab: tab });
        },
        setSettingsSelectedMod: (selectedMod) => {
            dispatch({ type: ActionTypes.SET_SETTINGS_SELECTED_MOD, selectedMod: selectedMod });
        },
        setSettingValue: (modSettings, selectedMod, settingKey, value) => {
            let settings = {
                ...modSettings,
                [selectedMod]: {
                    ...modSettings[selectedMod],
                    [settingKey]: {
                        ...modSettings[selectedMod][settingKey],
                        currentValue: value,
                    },
                },
            };
            dispatch({ type: ActionTypes.SET_MOD_SETTINGS, settings: settings });
        },
        setSettings: (settings) => {
            dispatch({ type: ActionTypes.SET_MOD_SETTINGS, settings: settings });
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Settings);
