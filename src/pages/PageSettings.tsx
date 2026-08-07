import React, { useEffect, useRef, useState } from 'react';
import { MdSearch } from 'react-icons/md';

import Input from '../components/form/Input';
import { Select } from '../components/form/Select';
import ApplySettingsPopup from '../components/popups/ApplySettingsPopup';
import AudioSettings from '../components/settings/AudioSettings';
import BoolInput from '../components/settings/BoolInput';
import KeybindInput from '../components/settings/KeybindInput';
import MultiKeybindInput from '../components/settings/MultiKeybindInput';
import NumberInput from '../components/settings/NumberInput';
import { ActionTypes } from '../constants/ActionTypes';
import { ModSettingType } from '../constants/ModSettingType';
import useSettingsStore from '../stores/useSettingsStore';

interface IProps {
    popup?: boolean;
}

const displayModeOptions = [
    { value: true, label: 'Exclusive Fullscreen' },
    { value: false, label: 'Windowed' },
];

const enabledOrDisabledOptions = [
    { value: true, label: 'Enabled' },
    { value: false, label: 'Disabled' },
];

const PageSettings: React.FC<IProps> = ({ popup }) => {
    const modSettings = useSettingsStore((s) => s.modSettings);
    const selectedMod = useSettingsStore((s) => s.selectedMod);
    const currentSettings = useSettingsStore((s) => s.currentSettings);
    const activeTab = useSettingsStore((s) => s.tab);

    const [modName, setModName] = useState<string>('');

    const modListScrollbarRef = useRef<any>(null);
    const modSettingsScrollbarRef = useRef<any>(null);
    const modsearchRef = useRef<any>(null);

    const disableBlur = () => {
        window.DispatchAction(ActionTypes.SET_BLUR, {
            blur: false,
        });
    };

    const enableMenu = () => {
        window.DispatchAction(ActionTypes.SET_MENU, {
            menu: true,
        });
    };

    const setPopup = (popup: any) => {
        window.DispatchAction(ActionTypes.SET_POPUP, {
            popup: popup,
        });
    };

    const setResolutionIndex = (index: any) => {
        window.DispatchAction(ActionTypes.SET_CURRENT_SETTINGS, {
            settings: { selectedResolution: index },
        });
    };

    const setScreenIndex = (index: any) => {
        window.DispatchAction(ActionTypes.SET_CURRENT_SETTINGS, {
            settings: { selectedScreen: index },
        });
    };

    const setFullscreen = (fullscreen: boolean) => {
        window.DispatchAction(ActionTypes.SET_CURRENT_SETTINGS, {
            settings: { fullscreen },
        });
    };

    const setShaderCache = (enabled: boolean) => {
        window.DispatchAction(ActionTypes.SET_CURRENT_SETTINGS, {
            settings: { enableShaderCache: enabled },
        });
    };


    const setEyefinity = (enabled: boolean) => {
        window.DispatchAction(ActionTypes.SET_CURRENT_SETTINGS, {
            settings: { enableEyefinity: enabled },
        });
    };

    const hideSettingsPopup = () => {
        window.DispatchAction(ActionTypes.SHOW_SETTINGS_POPUP, {
            show: false,
        });
    };

    const setSettingsTab = (tab: any) => {
        window.DispatchAction(ActionTypes.SET_SETTINGS_TAB, {
            tab: tab,
        });
    };

    const setSettingsSelectedMod = (selectedMod: any) => {
        window.DispatchAction(ActionTypes.SET_SETTINGS_SELECTED_MOD, {
            selectedMod: selectedMod,
        });
    };

    const setSettingValue = (modSettings: any, selectedMod: any, settingKey: any, value: any) => {
        const newSettings = {
            ...modSettings,
            [selectedMod]: {
                ...modSettings[selectedMod],
                [settingKey]: {
                    ...modSettings[selectedMod][settingKey],
                    currentValue: value,
                },
            },
        };

        window.DispatchAction(ActionTypes.SET_MOD_SETTINGS, {
            settings: newSettings,
        });
    };

    const setSettings = (newSettings: any) => {
        window.DispatchAction(ActionTypes.SET_MOD_SETTINGS, {
            settings: newSettings,
        });
    };

    const _onChangeModInput = (settingKey: any, value: any) => {
        setSettingValue(modSettings, selectedMod, settingKey, value);
    };

    const _onChangeModName = (e?: any) => {
        if (modListScrollbarRef.current) {
            modListScrollbarRef.current.update();
            modListScrollbarRef.current.element.scrollTop = 0;
        }
        setModName(e.target.value);
    };

    const _onSelectMod = (mod?: any) => {
        if (modSettingsScrollbarRef.current) {
            modSettingsScrollbarRef.current.update();
            modSettingsScrollbarRef.current.element.scrollTop = 0;
        }
        setSettingsSelectedMod(mod);
    };

    const _isTabActive = (tab?: any) => {
        if (tab === activeTab) {
            return 'tab active';
        }
        return 'tab';
    };

    const _onApplySettings = (e?: any) => {
        if (e) e.preventDefault();

        window.WebUI.Call('ApplySettings', currentSettings);

        // For mod settings:
        // WebUI.Call('SetModSettingBool', modName: string, settingName: string, value: boolean);
        // WebUI.Call('SetModSettingNumber', modName: string, settingName: string, value: number);
        // WebUI.Call('SetModSettingKeybind', modName: string, settingName: string, value: number);
        // WebUI.Call('SetModSettingMultiKeybind', modName: string, settingName: string, value: number[]);
        // WebUI.Call('SetModSettingString', modName: string, settingName: string, value: string);
        // WebUI.Call('SetModSettingOption', modName: string, settingName: string, value: string | null);

        Object.entries(modSettings).forEach((mod: any) => {
            const modName = mod[0];
            Object.entries(mod[1]).forEach((setting: any) => {
                const settingName = setting[0];
                const value = setting[1].currentValue;
                if (value === undefined) {
                    return;
                }

                switch (setting[1].type) {
                    case ModSettingType.BOOL:
                        window.WebUI.Call('SetModSettingBool', modName, settingName, value);
                        break;
                    case ModSettingType.NUMBER:
                        window.WebUI.Call('SetModSettingNumber', modName, settingName, value);
                        break;
                    case ModSettingType.KEYBIND:
                        window.WebUI.Call('SetModSettingKeybind', modName, settingName, value);
                        break;
                    case ModSettingType.MULTI_KEYBIND:
                        window.WebUI.Call('SetModSettingMultiKeybind', modName, settingName, value); // TODO: Fixme
                        break;
                    case ModSettingType.STRING:
                        window.WebUI.Call('SetModSettingString', modName, settingName, value);
                        break;
                    case ModSettingType.OPTION:
                        window.WebUI.Call('SetModSettingOption', modName, settingName, value);
                        break;
                }
            });
        });

        if (popup) {
            hideSettingsPopup();
        } else {
            setPopup(<ApplySettingsPopup />);
        }
    };

    const _onResetSettings = (e?: any) => {
        if (e) e.preventDefault();

        let newSettings = {
            ...modSettings,
        };
        Object.entries(modSettings).forEach((mod: any) => {
            const modName = mod[0];
            Object.entries(mod[1]).forEach((setting: any) => {
                const settingName = setting[0];
                const value = setting[1].currentValue;
                if (value !== undefined) {
                    newSettings = {
                        ...newSettings,
                        [modName]: {
                            ...newSettings[modName],
                            [settingName]: {
                                ...newSettings[modName][settingName],
                                currentValue: undefined,
                            },
                        },
                    };
                }
            });
        });
        setSettings(newSettings);

        window.WebUI.Call('RefreshSettings');
    };

    const _onDisplayModeChange = (value: any) => {
        setFullscreen(value);
    };

    const _onResolutionChange = (value: any) => {
        setResolutionIndex(value);
    };

    const _onScreenChange = (value: any) => {
        setScreenIndex(value);
    };

    const _onEyefinityModeChange = (value: any) => {
        setEyefinity(value);
    };

    const _onShaderCacheModeChange = (value: any) => {
        setShaderCache(value);
    };

    useEffect(() => {
        window.WebUI.Call('RefreshSettings');
        window.WebUI.Call('SettingsActive');

        disableBlur();
        enableMenu();

        return () => {
            window.WebUI.Call('SettingsInactive');
        };
    }, []);

    useEffect(() => {
        if (modListScrollbarRef.current) {
            modListScrollbarRef.current.update();
        }
        if (modSettingsScrollbarRef.current) {
            modSettingsScrollbarRef.current.update();
        }
    });

    const renderModSetting = (settingKey: any, setting: any) => {
        switch (setting.type) {
            case ModSettingType.BOOL:
                return (
                    <BoolInput
                        value={setting.currentValue ?? setting.value}
                        onChange={(value) => _onChangeModInput(settingKey, value)}
                    />
                );
            case ModSettingType.NUMBER:
                return (
                    <NumberInput
                        value={setting.currentValue ?? setting.value.value}
                        onChange={(e) => {
                            _onChangeModInput(settingKey, e);
                        }}
                        min={setting.value.min ?? 0}
                        max={setting.value.max ?? 100}
                    />
                );
            case ModSettingType.KEYBIND:
                return (
                    <KeybindInput
                        value={setting.currentValue !== undefined ? setting.currentValue : setting.value}
                        onChange={(e) => {
                            _onChangeModInput(settingKey, e);
                        }}
                    />
                );
            case ModSettingType.MULTI_KEYBIND:
                return (
                    <MultiKeybindInput
                        value={setting.currentValue ?? setting.value}
                        onChange={(e) => {
                            _onChangeModInput(settingKey, e);
                        }}
                    />
                );
            case ModSettingType.STRING:
                return (
                    <Input
                        type="text"
                        value={setting.currentValue ?? setting.value}
                        onChange={(e) => {
                            _onChangeModInput(settingKey, e.target.value);
                        }}
                        isFullWidth
                    />
                );
            case ModSettingType.OPTION:
                return (
                    <Select
                        value={setting.currentValue ?? setting.value.value}
                        options={setting.value.options.map((t: any) => ({ value: t, label: t }))}
                        // allowEmpty={setting.allowEmpty}
                        onChange={(value) => {
                            _onChangeModInput(settingKey, value);
                        }}
                    />
                );
            default:
                return <div></div>;
        }
    };

    const renderActiveModSettings = () => {
        if (selectedMod === '') {
            return <></>;
        }

        return (
            <>
                {Object.entries(modSettings[selectedMod])
                    .sort((settingA: any, settingB: any) =>
                        settingA[1].displayName.localeCompare(settingB[1].displayName),
                    )
                    .map((setting: any) => (
                        <div className="settings-row" key={setting[0]}>
                            <h3>{setting[1].displayName ?? ''}</h3>
                            {renderModSetting(setting[0], setting[1])}
                        </div>
                    ))}
            </>
        );
    };

    const renderActiveTab = () => {
        switch (activeTab) {
            default:
            case 'game':
                return gameSettingsRender;
            case 'mods':
                return modSettingsRender;
            case 'gpu':
                return gpuSettingsRender;
        }
    };

    const fullscreenOptions: any = [];
    for (let i = 0; i < currentSettings.resolutions[currentSettings.selectedScreen].length; ++i) {
        const resolution = currentSettings.resolutions[currentSettings.selectedScreen][i];
        fullscreenOptions.push({ value: i, label: resolution });
    }

    const screenOptions = [];
    for (let i = 0; i < currentSettings.screens; ++i) {
        screenOptions.push({ value: i, label: `Monitor #${i + 1}` });
    }


    const gameSettingsRender = (
        <div className="general-settings">
            {!popup ? (
                <>
                    <h2>Display settings</h2>
                    <div className="settings-row">
                        <h3>Display mode</h3>
                        <Select
                            options={displayModeOptions}
                            value={currentSettings.fullscreen === true}
                            onChange={_onDisplayModeChange}
                        />
                    </div>
                    <div className="settings-row">
                        <h3>Fullscreen resolution</h3>
                        <Select
                            options={fullscreenOptions}
                            value={currentSettings.selectedResolution}
                            onChange={_onResolutionChange}
                        />
                    </div>
                    <div className="settings-row">
                        <h3>Fullscreen monitor</h3>
                        <Select
                            options={screenOptions}
                            value={currentSettings.selectedScreen}
                            onChange={_onScreenChange}
                        />
                    </div>
                </>
            ) : null}

            <hr />

            <AudioSettings />
        </div>
    );

    const modSettingsRender = (
        <div className="mod-settings-container">
            <div className="mod-search-bar">
                <Input
                    type="text"
                    key="modsearch"
                    id="modsearch"
                    placeholder="Search..."
                    value={modName}
                    onChange={_onChangeModName}
                    onFocus={() => setModName('')}
                    ref={modsearchRef}
                    startIcon={<MdSearch style={{ marginRight: '10rem' }} />}
                />
            </div>
            <div className="mod-list" style={{ overflowX: 'hidden', overflowY: 'auto' }}>
                {Object.keys(modSettings)
                    .filter((key) => key.toLowerCase().search(modName.toLowerCase()) != -1)
                    .sort((a, b) => a.localeCompare(b))
                    .map((key) => (
                        <div
                            className={'mod' + (selectedMod === key ? ' active' : '')}
                            key={key}
                            onClick={() => _onSelectMod(key)}
                        >
                            <span>{key || ''}</span>
                        </div>
                    ))}
            </div>
            {selectedMod !== '' ? (
                <div className="mod-settings" style={{ overflowX: 'hidden', overflowY: 'auto' }}>
                    <h2>{selectedMod}</h2>
                    <div className="settings-container">{renderActiveModSettings()}</div>
                </div>
            ) : (
                <div className="mod-settings no-mod">
                    <h3>Please select a mod on the left side to see the settings...</h3>
                </div>
            )}
        </div>
    );

    const gpuSettingsRender = (
        <div className="general-settings">
            <h2>GPU settings</h2>
            <div className="settings-row">
                <h3>Nvidia Shader Cache</h3>
                <Select
                    options={enabledOrDisabledOptions}
                    value={currentSettings.enableShaderCache === true}
                    onChange={_onShaderCacheModeChange}
                />
            </div>
            <div className="settings-row">
                <h3>AMD Eyefinity</h3>
                <Select
                    options={enabledOrDisabledOptions}
                    value={currentSettings.enableEyefinity === true}
                    onChange={_onEyefinityModeChange}
                />
            </div>

            <div style={{ fontSize: '1.5vmin', width: '60%', marginTop: '5%' }}>
                These options are disabled by default because they cause issues on certain computers due to driver
                bugs, so you should be careful when enabling them. Changes to these settings apply after restarting
                VU.
            </div>
        </div>
    );

    return (
        <div className="settings content-wrapper">
            {popup ? <div style={{ marginTop: '120rem' }} /> : null}
            <div className="tabs">
                <a className={_isTabActive('game')} onClick={() => setSettingsTab('game')}>
                    General settings
                </a>
                <a className={_isTabActive('gpu')} onClick={() => setSettingsTab('gpu')}>
                    GPU settings
                </a>
                <a className={_isTabActive('mods')} onClick={() => setSettingsTab('mods')}>
                    Mod settings
                </a>
            </div>
            <div className="tab-inner">{renderActiveTab()}</div>
            <div className="settings-buttons">
                <a href="#" className="btn border-btn" onClick={_onResetSettings}>
                    Reset settings
                </a>
                <a href="#" className="btn border-btn primary" onClick={_onApplySettings}>
                    Apply settings
                </a>
            </div>
        </div>
    );
};
export default PageSettings;
