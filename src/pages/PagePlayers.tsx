import React, { useEffect, useRef } from 'react';
import { MdOutlineExitToApp, MdOutlineLibraryAdd, MdOutlineStarBorder, MdStar } from 'react-icons/md';

import SoldierEntry from '../components/players/SoldierEntry';
import CreatePlayerPopup from '../components/popups/CreatePlayerPopup';
import LoggingPlayerPopup from '../components/popups/LoggingPlayerPopup';
import PlayerDeleteConfirmationPopup from '../components/popups/PlayerDeleteConfirmationPopup';
import { PRIMARY_SOLDIER_GUID } from '../constants/AccountStorageKeys';
import { ActionTypes } from '../constants/ActionTypes';
import { PlayerCreateStatus } from '../constants/PlayerCreateStatus';
import { PlayerDeleteStatus } from '../constants/PlayerDeleteStatus';
import { PlayerLoginStatus } from '../constants/PlayerLoginStatus';
import useUserStore from '../stores/useUserStore';

const PagePlayers: React.FC = () => {
    const players = useUserStore((s) => s.players);
    const accountStorage = useUserStore((s) => s.accountStorage);
    const accountStorageLoaded = useUserStore((s) => s.accountStorageLoaded);
    const autoLogin = useUserStore((s) => s.autoLogin);
    const autoLoginAnySoldier = useUserStore((s) => s.autoLoginAnySoldier);
    const primaryGuid = accountStorage[PRIMARY_SOLDIER_GUID];
    const hasAutoSelected = useRef(false);

    const onSetPlayerCreate = () => {
        window.DispatchAction(ActionTypes.CHANGE_PLAYER_CREATE_STATUS, {
            status: PlayerCreateStatus.CREATION_INIT,
        });
    };

    const onSetPlayerDelete = () => {
        window.DispatchAction(ActionTypes.CHANGE_PLAYER_DELETE_STATUS, {
            status: PlayerDeleteStatus.DELETING,
        });
    };

    const onSetPlayerLogin = () => {
        window.DispatchAction(ActionTypes.CHANGE_PLAYER_LOGIN_STATUS, {
            status: PlayerLoginStatus.LOGGING_IN,
        });
    };

    const enableBlur = () => {
        window.DispatchAction(ActionTypes.SET_BLUR, {
            blur: true,
        });
    };

    const disableMenu = () => {
        window.DispatchAction(ActionTypes.SET_MENU, {
            menu: false,
        });
    };

    const setPopup = (popup: any) => {
        window.DispatchAction(ActionTypes.SET_POPUP, {
            popup: popup,
        });
    };

    const onDeletePlayer = (name: string, guid: string, e?: any) => {
        if (e) e.preventDefault();

        onSetPlayerDelete();
        setPopup(<PlayerDeleteConfirmationPopup name={name} guid={guid} />);
    };

    const onLoginPlayer = (guid: string, e?: any) => {
        if (e) e.preventDefault();

        onSetPlayerLogin();
        setPopup(<LoggingPlayerPopup />);

        window.WebUI.Call('LoginPlayer', guid);
    };

    const onSetPrimary = (guid: string, e?: any) => {
        if (e) e.preventDefault();

        window.DispatchAction(ActionTypes.SET_ACCOUNT_STORAGE_VALUE, {
            key: PRIMARY_SOLDIER_GUID,
            value: guid,
        });
    };

    const onCreatePlayer = (e?: any) => {
        if (e) e.preventDefault();

        onSetPlayerCreate();
        setPopup(<CreatePlayerPopup />);
    };

    useEffect(() => {
        enableBlur();
        disableMenu();

        return () => {
            setPopup(null);
        };
    }, []);

    // Log in the primary soldier without a click (-autoLogin, or a join link). Without a primary, -autoLogin
    // takes the first soldier and a join link waits for a pick. Waits for account storage, which arrives
    // independently of the player list, so an existing primary is not mistaken for none.
    useEffect(() => {
        if (!autoLogin || hasAutoSelected.current || !players || players.length === 0 || !accountStorageLoaded) return;

        const primary = players.find((p: any) => p.guid === primaryGuid);
        const soldier = primary ?? (autoLoginAnySoldier ? players[0] : undefined);

        hasAutoSelected.current = true;

        if (soldier) onLoginPlayer(soldier.guid);
    }, [autoLogin, autoLoginAnySoldier, players, accountStorageLoaded, primaryGuid]);

    // Handle player creation.
    const playersRender = [];

    for (let i = 0; i < players.length; ++i) {
        playersRender.push(
            <SoldierEntry
                key={players[i].guid}
                name={players[i].name}
                actions={[
                    {
                        icon: <MdOutlineExitToApp />,
                        callback: (e?: any) => {
                            onLoginPlayer(players[i].guid, e);
                        },
                    },
                    {
                        icon: players[i].guid === primaryGuid ? <MdStar /> : <MdOutlineStarBorder />,
                        callback: (e?: any) => {
                            onSetPrimary(players[i].guid, e);
                        },
                    },
                ]}
                deleteCallback={(e) => {
                    onDeletePlayer(players[i].name, players[i].guid, e);
                }}
                title="Soldier"
            />
        );
    }

    const playerCount = playersRender.length;

    for (let i = 0; i < 4 - playerCount; ++i) {
        playersRender.push(
            <SoldierEntry
                key={'create-' + i}
                actions={[
                    {
                        icon: <MdOutlineLibraryAdd />,
                        callback: (e?: any) => {
                            onCreatePlayer(e);
                        },
                    },
                ]}
                title="Create new Soldier"
                className="empty"
            />
        );
    }

    return <div className="soldier-listing">{playersRender}</div>;
};
export default PagePlayers;
