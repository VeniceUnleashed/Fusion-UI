import React, { useEffect } from 'react';

import { PRIMARY_SOLDIER_GUID } from '../../constants/AccountStorageKeys';
import { ActionTypes } from '../../constants/ActionTypes';
import { PlayerDeleteStatus } from '../../constants/PlayerDeleteStatus';
import useUserStore from '../../stores/useUserStore';
import DeletingPlayerPopup from './DeletingPlayerPopup';

interface IProps {
    name: string;
    guid: string;
}

const PlayerDeleteConfirmationPopup: React.FC<IProps> = ({ name, guid }) => {
    const primaryGuid = useUserStore((s) => s.accountStorage[PRIMARY_SOLDIER_GUID]);

    const closePopup = () => {
        window.DispatchAction(ActionTypes.SET_POPUP, {
            popup: null,
        });
    };

    const setPopup = (popup: any) => {
        window.DispatchAction(ActionTypes.SET_POPUP, {
            popup: popup,
        });
    };

    const resetLogin = () => {
        window.DispatchAction(ActionTypes.CHANGE_PLAYER_DELETE_STATUS, {
            status: PlayerDeleteStatus.NO_STATUS,
        });
    };

    const onConfirmDeletion = (e?: any) => {
        if (e) e.preventDefault();

        if (guid === primaryGuid) {
            window.DispatchAction(ActionTypes.REMOVE_ACCOUNT_STORAGE_VALUE, {
                key: PRIMARY_SOLDIER_GUID,
            });
        }

        setPopup(<DeletingPlayerPopup />);
        window.WebUI.Call('DeletePlayer', guid);
    };

    const onClosePopup = (e?: any) => {
        if (e) e.preventDefault();

        closePopup();
        resetLogin();
    };

    useEffect(() => {
        (document.activeElement as HTMLElement).blur();
    }, []);

    return (
        <div className="center-notice">
            <div className="notice-content">
                <h1>Delete Soldier</h1>
                <p>Are you sure you want to delete your soldier "{name}? This action cannot be reversed.</p>
                <div className="action-buttons">
                    <a href="#" className="btn border-btn" onClick={onClosePopup}>
                        Cancel
                    </a>
                    <a href="#" className="btn border-btn primary" onClick={onConfirmDeletion}>
                        Confirm
                    </a>
                </div>
            </div>
        </div>
    );
};
export default PlayerDeleteConfirmationPopup;
