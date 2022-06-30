import React, { Component } from 'react'
import { connect } from 'react-redux'
import Select from 'react-select';
import Slider from '../components/Slider';
import PerfectScrollbar from 'perfect-scrollbar';

import * as ActionTypes from "../constants/ActionTypes";
import ApplySettingsPopup from "../popups/ApplySettingsPopup";
import VoipSlider from "../components/VoipSlider";
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

// TODO: Remove me
const DEBUG_MODS = '{"vu-battleroyale":{"Voip_Team_TransmissionMode":{"type":5,"displayName":"Team Voip TransmissionMode","value":{"value":"PushToTalk","allowEmpty":false,"options":["AlwaysOn","PushToTalk","VoiceActivation"]}},"Voip_Team_PushToTalk_Key":{"type":2,"displayName":"Team Voip Push-To-Talk Key","value":11},"PingEnemyMouseButton":{"type":1,"displayName":"Ping Enemy MouseButton","value":{"value":2,"min":0,"max":8}},"Voip_Party_TransmissionMode":{"type":5,"displayName":"Party Voip TransmissionMode","value":{"value":"PushToTalk","allowEmpty":false,"options":["AlwaysOn","PushToTalk","VoiceActivation"]}},"PingEnemyOption":{"type":5,"displayName":"Ping Enemy","value":{"value":"Define MouseButton","allowEmpty":false,"options":["Define MouseButton","Define Key","Press Ping-Key twice"]}},"PingEnemyKey":{"type":2,"displayName":"Ping Enemy Key","value":3},"Voip_Party_PushToTalk_Key":{"type":2,"displayName":"Party Voip Push-To-Talk Key","value":2},"PingKey":{"type":2,"displayName":"Ping Key","value":16},"ShowFPS":{"type":0,"displayName":"Show FPS","value":false}},"realitymod-repo":{"Voip_SL_Direct_9_PushToTalk_Key":{"type":2,"displayName":"SL Direct to squad 9 Push-To-Talk Key","value":73},"Voip_SL_Direct_1_PushToTalk_Key":{"type":2,"displayName":"SL Direct to squad 1 Push-To-Talk Key","value":79},"Voip_SL_Direct_4_PushToTalk_Key":{"type":2,"displayName":"SL Direct to squad 4 Push-To-Talk Key","value":75},"Compass_Toggle_Key":{"type":2,"displayName":"Toggle Compass","value":23},"Voip_Squad_PushToTalk_Key":{"type":2,"displayName":"Squad Radio Push-To-Talk Key","value":48},"Voip_HQ_PushToTalk_Key":{"type":2,"displayName":"HQ Push-To-Talk Key","value":21},"Voip_Local_PushToTalk_Key":{"type":2,"displayName":"Local Push-To-Talk Key","value":34},"Voip_SL_Direct_8_PushToTalk_Key":{"type":2,"displayName":"SL Direct to squad 8 Push-To-Talk Key","value":72},"Voip_SL_Direct_5_PushToTalk_Key":{"type":2,"displayName":"SL Direct to squad 5 Push-To-Talk Key","value":76},"Voip_SL_Direct_7_PushToTalk_Key":{"type":2,"displayName":"SL Direct to squad 7 Push-To-Talk Key","value":71},"Voip_SL_Direct_6_PushToTalk_Key":{"type":2,"displayName":"SL Direct to squad 6 Push-To-Talk Key","value":77},"Voip_SL_Direct_2_PushToTalk_Key":{"type":2,"displayName":"SL Direct to squad 2 Push-To-Talk Key","value":80},"Voip_SL_Direct_3_PushToTalk_Key":{"type":2,"displayName":"SL Direct to squad 3 Push-To-Talk Key","value":81},"Compass_Position":{"type":5,"displayName":"Compass Position","value":{"value":"Bottom","allowEmpty":false,"options":["Bottom","Top"]}},"Tac_Rose_Key":{"type":2,"displayName":"Tac-Rose Key","value":20},"Interactive_Notification_Decline":{"type":2,"displayName":"Interactive Notification Decline Key","value":209},"Interactive_Notification_Accept":{"type":2,"displayName":"Interactive Notification Accept Key","value":201}},"realitymod":{"Compass_Toggle_Key":{"type":2,"displayName":"Toggle Compass","value":23},"Voip_Squad_PushToTalk_Key":{"type":2,"displayName":"Squad Radio Push-To-Talk Key","value":48},"Voip_SL_Direct_4_PushToTalk_Key":{"type":2,"displayName":"SL Direct to squad 4 Push-To-Talk Key","value":75},"Voip_SL_Direct_1_PushToTalk_Key":{"type":2,"displayName":"SL Direct to squad 1 Push-To-Talk Key","value":79},"Voip_SL_Direct_7_PushToTalk_Key":{"type":2,"displayName":"SL Direct to squad 7 Push-To-Talk Key","value":71},"Voip_SL_Direct_3_PushToTalk_Key":{"type":2,"displayName":"SL Direct to squad 3 Push-To-Talk Key","value":81},"Voip_HQ_PushToTalk_Key":{"type":2,"displayName":"HQ Push-To-Talk Key","value":21},"Voip_Local_PushToTalk_Key":{"type":2,"displayName":"Local Push-To-Talk Key","value":34},"Voip_SL_Direct_8_PushToTalk_Key":{"type":2,"displayName":"SL Direct to squad 8 Push-To-Talk Key","value":72},"Voip_SL_Direct_5_PushToTalk_Key":{"type":2,"displayName":"SL Direct to squad 5 Push-To-Talk Key","value":76},"Voip_SL_Direct_9_PushToTalk_Key":{"type":2,"displayName":"SL Direct to squad 9 Push-To-Talk Key","value":73},"Voip_SL_Direct_6_PushToTalk_Key":{"type":2,"displayName":"SL Direct to squad 6 Push-To-Talk Key","value":77},"Voip_SL_Direct_2_PushToTalk_Key":{"type":2,"displayName":"SL Direct to squad 2 Push-To-Talk Key","value":80},"Compass_Position":{"type":5,"displayName":"Compass Position","value":{"value":"Bottom","allowEmpty":false,"options":["Bottom","Top"]}},"Tac_Rose_Key":{"type":2,"displayName":"Tac-Rose Key","value":20},"Interactive_Notification_Decline":{"type":2,"displayName":"Interactive Notification Decline Key","value":209},"Interactive_Notification_Accept":{"type":2,"displayName":"Interactive Notification Accept Key","value":201}},"voipmod-main":{"DefaultVoipVolume":{"type":1,"displayName":"Default Voip Volume","value":{"value":5,"min":0.001,"max":100}},"VoipPushToTalk":{"type":2,"displayName":"Voip Push To Talk key","value":56},"PlayerVoipLevel":{"type":5,"displayName":"PlayerVoipLevel","value":{"value":"Squad","allowEmpty":false,"options":["Team","Squad","Disabled"]}}},"betteringameadmin":{}}';

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

        let gameSettings = (
            <div className="general-settings">
                <h2>Display settings</h2>
                <div className="settings-container">
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
                </div>
            </div>
        );

        const renderModSetting = (setting) => {
            switch (setting.type) {
                case BOOL:
                    return <BoolInput 

                    />;
                case NUMBER:
                    return <NumberInput
                        value={setting.value.value}
                    />;
                case KEYBIND:
                    return <KeybindInput
                        value={setting.value}
                    />;
                case MULTI_KEYBIND:
                    return <KeybindInput />; // TODO: Fixme
                case STRING:
                    return <TextInput />;
                case OPTION:
                    return <OptionsInput
                        value={setting.value.value}
                        options={setting.value.options}
                        allowEmpty={setting.allowEmpty}
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

            const debug = JSON.parse(DEBUG_MODS);

            return (
                <>
                    {Object.entries(debug[this.props.settings.selectedMod]).map((setting) => (
                        <div className="settings-row" key={setting[0]}>
                            <h3>{setting[1].displayName??""}</h3>
                            {renderModSetting(setting[1])}
                        </div>
                    ))}
                    {/*Object.entries(this.props.settings.modSettings[this.props.settings.selectedMod]).map((setting) => (
                        <div className="settings-row" key={setting[0]}>
                            <h3>{setting[1].displayName??""}</h3>
                            {renderModSetting(setting[1])}
                        </div>
                    ))*/}
                </>
            );
        }

        let modSettings = (
            <div className="mod-settings-container">
                <div className="mod-search-bar">
                    <TextInput value={this.state.modName} onChange={this._onChangeModName} placeholder="Search..." />
                </div>
                <div className="mod-list" style={{ overflowX: 'hidden' }} ref={this._onModList}>
                    {Object.keys(JSON.parse(DEBUG_MODS)).filter((key) => {
                        return key.toLowerCase().search(this.state.modName.toLowerCase()) != -1;
                    }).map((key) => (
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
                    {Object.keys(this.props.settings.modSettings).filter((key) => {
                        return key.toLowerCase().search(this.state.modName.toLowerCase()) != -1;
                    }).map((key) => (
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
            gameSettings = null;
            popupHeader = (
                <h1>VU Options</h1>
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

        if (this.props.popup) {
            this.props.hideSettingsPopup();
        } else {
            this.props.setPopup(<ApplySettingsPopup/>);
        }

        // For mod settings:
        // WebUI.Call('SetModSettingBool', modName: string, settingName: string, value: boolean);
        // WebUI.Call('SetModSettingNumber', modName: string, settingName: string, value: number);
        // WebUI.Call('SetModSettingKeybind', modName: string, settingName: string, value: number);
        // WebUI.Call('SetModSettingMultiKeybind', modName: string, settingName: string, value: number[]);
        // WebUI.Call('SetModSettingString', modName: string, settingName: string, value: string);
        // WebUI.Call('SetModSettingOption', modName: string, settingName: string, value: string | null);
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
        },
        setSettingsTab: (tab) => {
            dispatch({ type: ActionTypes.SET_SETTINGS_TAB, tab: tab });
        },
        setSettingsSelectedMod: (selectedMod) => {
            dispatch({ type: ActionTypes.SET_SETTINGS_SELECTED_MOD, selectedMod: selectedMod });
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Settings);
