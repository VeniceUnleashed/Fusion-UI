import React, { memo, useMemo } from 'react';

import { ActionTypes } from '../../constants/ActionTypes';
import useSettingsStore from '../../stores/useSettingsStore';
import useVoipStore from '../../stores/useVoipStore';
import { Select } from '../form/Select';
import NumberInput from './NumberInput';
import VoipSlider from './VoipSlider';

const AudioSettings: React.FC = () => {
    const devices = useVoipStore((s) => s.devices);
    const volume = useVoipStore((s) => s.volume);
    const currentSettings = useSettingsStore((s) => s.currentSettings);

    const setMasterVolume = (volume: number | number[]) => {
        window.DispatchAction(ActionTypes.SET_CURRENT_SETTINGS, { settings: { masterVolume: volume } });
    };

    const setMusicVolume = (volume: number | number[]) => {
        window.DispatchAction(ActionTypes.SET_CURRENT_SETTINGS, { settings: { musicVolume: volume } });
    };

    const setDialogueVolume = (volume: number | number[]) => {
        window.DispatchAction(ActionTypes.SET_CURRENT_SETTINGS, { settings: { dialogueVolume: volume } });
    };

    // Voip changes are previewed live so they can be heard, and saved or dropped with the other settings.
    const onVoipDeviceChange = (value: number) => {
        window.WebUI.Call('VoipSelectDevice', value);
        window.DispatchAction(ActionTypes.SET_CURRENT_SETTINGS, { settings: { voipDevice: value } });
    };

    const onVoipCutoffVolumeChange = (volume: number | number[]) => {
        window.WebUI.Call('VoipCutoffVolume', volume);
        window.DispatchAction(ActionTypes.SET_CURRENT_SETTINGS, { settings: { voipCutoffVolume: volume } });
    };

    // The slider's 0-100% maps to a multiplier of 0-5: voip is quiet, so full volume is 5x.
    const onVoipVolumeMultiplierChange = (fraction: number | number[]) => {
        const volumeMultiplier = (fraction as number) * 5;

        window.WebUI.Call('VoipVolumeMultiplier', volumeMultiplier);
        window.DispatchAction(ActionTypes.SET_CURRENT_SETTINGS, { settings: { voipVolumeMultiplier: volumeMultiplier } });
    };

    const voipDevicesMemo: Array<{ value: number; label: string }> = useMemo(() => {
        if (devices.length === 0) {
            return [{ value: -1, label: 'No microphone detected' }];
        }
        return devices.map((device) => ({ value: device.id, label: device.name }));
    }, [devices]);

    const selectedDeviceIndexMemo: number = useMemo(() => {
        if (devices.length === 0) return -1; // I don't think we need this one
        return currentSettings.voipDevice;
    }, [devices, currentSettings.voipDevice]);

    return (
        <>
            <h2>Audio settings</h2>
            <div className="settings-row">
                <h3>Master volume</h3>
                <NumberInput onChange={setMasterVolume} value={currentSettings.masterVolume} />
            </div>
            <div className="settings-row">
                <h3>Music volume</h3>
                <NumberInput onChange={setMusicVolume} value={currentSettings.musicVolume} />
            </div>
            <div className="settings-row">
                <h3>Dialogue volume</h3>
                <NumberInput onChange={setDialogueVolume} value={currentSettings.dialogueVolume} />
            </div>

            <hr />

            <h2>VoIP settings</h2>
            <div className="settings-row">
                <h3>Microphone Device</h3>
                <Select
                    options={voipDevicesMemo}
                    value={selectedDeviceIndexMemo}
                    onChange={(value: any) => onVoipDeviceChange(value)}
                />
            </div>
            <div className="settings-row">
                <h3>Voice activation threshold</h3>
                <VoipSlider onChange={onVoipCutoffVolumeChange} volume={volume} value={currentSettings.voipCutoffVolume} />
            </div>
            <div className="settings-row">
                <h3>Volume</h3>
                <NumberInput value={currentSettings.voipVolumeMultiplier / 5} onChange={onVoipVolumeMultiplierChange} />
            </div>
        </>
    );
};
export default memo(AudioSettings);
