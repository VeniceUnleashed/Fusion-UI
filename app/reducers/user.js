import {
    SET_USER_DATA,
    CHANGE_LOGIN_STATUS,
    SET_USER_PLAYERS,
    CHANGE_PLAYER_DELETE_STATUS,
    CHANGE_PLAYER_CREATE_STATUS,
    CHANGE_PLAYER_LOGIN_STATUS,
    SET_PLAYER_DATA,
    CHANGE_ORIGIN_LINK_STATUS,
    SET_LOGIN_TOKEN,
    SET_LOGIN_DATA,
    CHANGE_CONNECTION_STATUS,
    SET_ACCOUNT_STORAGE,
    SET_ACCOUNT_STORAGE_VALUE,
    REMOVE_ACCOUNT_STORAGE_VALUE,
} from '../constants/ActionTypes'

import * as LoginStatus from '../constants/LoginStatus'
import * as PlayerLoginStatus from '../constants/PlayerLoginStatus'
import * as OriginLinkStatus from '../constants/OriginLinkStatus'
import * as ConnectionStatus from '../constants/ConnectionStatus'

import { hashHistory } from 'react-router'

const initialState = {
    user: null,
    loginStatus: 0,
    players: null,
    player: null,
    playerDeleteStatus: 0,
    playerCreateStatus: 0,
    playerLoginStatus: 0,
    originLinkStatus: 0,
    loginToken: null,
    loginData: null,
    accountStorage: {},
};

function createStateCopy(state)
{
    return {
        ...state
    };
}

export default function user(state = initialState, action)
{
    switch (action.type)
    {
        case CHANGE_CONNECTION_STATUS:
        {
            if (action.status === ConnectionStatus.DISCONNECTED) {
                return {
                    ...initialState,
                    loginToken: state.loginToken,
                };
            }

            return state;
        }

        case SET_USER_DATA:
        {
            let finalState = createStateCopy(state);

            finalState.user = action.data;

            if (finalState.loginStatus === LoginStatus.LOGGED_IN &&
                finalState.user !== null &&
                finalState.players !== null &&
                finalState.player === null &&
                finalState.originLinkStatus === OriginLinkStatus.LINK_SUCCESSFUL)
            {
                setTimeout(function() {
                    hashHistory.push('/players');
                }, 50);
            }

            return finalState;
        }

        case SET_LOGIN_TOKEN:
        {
            let finalState = createStateCopy(state);
            finalState.loginToken = action.data;
            return finalState;
        }

        case SET_LOGIN_DATA:
        {
            let finalState = createStateCopy(state);
            finalState.loginData = action.data;
            return finalState;
        }

        case CHANGE_LOGIN_STATUS:
        {
            let finalState = createStateCopy(state);

            finalState.loginStatus = action.status;

            if (finalState.loginStatus === LoginStatus.LOGGED_IN &&
                finalState.user !== null &&
                finalState.players !== null &&
                finalState.player === null &&
                finalState.originLinkStatus === OriginLinkStatus.LINK_SUCCESSFUL)
            {
                setTimeout(function() {
                    hashHistory.push('/players');
                }, 50);
            }

            return finalState;
        }

        case SET_USER_PLAYERS:
        {
            let finalState = createStateCopy(state);

            finalState.players = action.players;

            if (finalState.loginStatus === LoginStatus.LOGGED_IN &&
                finalState.user !== null &&
                finalState.players !== null &&
                finalState.player === null &&
                finalState.originLinkStatus === OriginLinkStatus.LINK_SUCCESSFUL)
            {
                setTimeout(function() {
                    hashHistory.push('/players');
                }, 50);
            }

            return finalState;
        }

        case CHANGE_PLAYER_DELETE_STATUS:
        {
            let finalState = createStateCopy(state);

            finalState.playerDeleteStatus = action.status;

            return finalState;
        }

        case CHANGE_PLAYER_CREATE_STATUS:
        {
            let finalState = createStateCopy(state);

            finalState.playerCreateStatus = action.status;

            return finalState;
        }

        case CHANGE_PLAYER_LOGIN_STATUS:
        {
            let finalState = createStateCopy(state);

            finalState.playerLoginStatus = action.status;

            if (finalState.loginStatus === LoginStatus.LOGGED_IN &&
                finalState.playerLoginStatus === PlayerLoginStatus.LOGGED_IN &&
                finalState.user !== null &&
                finalState.players !== null &&
                finalState.player !== null)
            {
                setTimeout(function() {
                    hashHistory.push('/main-menu');
                }, 50);
            }

            return finalState;
        }

        case SET_PLAYER_DATA:
        {
            let finalState = createStateCopy(state);

            finalState.player = action.player;

            if (finalState.loginStatus === LoginStatus.LOGGED_IN &&
                finalState.playerLoginStatus === PlayerLoginStatus.LOGGED_IN &&
                finalState.user !== null &&
                finalState.players !== null &&
                finalState.player !== null)
            {
                setTimeout(function() {
                    hashHistory.push('/main-menu');
                }, 50);
            }

            return finalState;
        }

        case CHANGE_ORIGIN_LINK_STATUS:
        {
            let finalState = createStateCopy(state);

            finalState.originLinkStatus = action.status;

            if (finalState.loginStatus === LoginStatus.LOGGED_IN &&
                (finalState.originLinkStatus === OriginLinkStatus.LINK_MISSING ||
                finalState.originLinkStatus === OriginLinkStatus.PRODUCT_MISSING))
            {
                setTimeout(function() {
                    hashHistory.push('/origin-link');
                }, 50);

                return finalState;
            }

            if (finalState.loginStatus === LoginStatus.LOGGED_IN &&
                finalState.user !== null &&
                finalState.players !== null &&
                finalState.player === null &&
                finalState.originLinkStatus === OriginLinkStatus.LINK_SUCCESSFUL)
            {
                setTimeout(function() {
                    hashHistory.push('/players');
                }, 50);
            }

            return finalState;
        }

        case SET_ACCOUNT_STORAGE:
        {
            return {
                ...state,
                accountStorage: { ...action.accountStorage },
            };
        }

        case SET_ACCOUNT_STORAGE_VALUE:
        {
            // Fire native event.
            WebUI.Call('SetAccountStorageObject', action.key, action.value);

            // Optimistic update.
            return {
                ...state,
                accountStorage: {
                    ...state.accountStorage,
                    [action.key]: action.value,
                },
            };
        }

        case REMOVE_ACCOUNT_STORAGE_VALUE:
        {
            // Fire native event.
            WebUI.Call('RemoveAccountStorageObject', action.key);

            // Optimistic update.
            const accountStorage = {
                ...state.accountStorage,
            };

            delete accountStorage[action.key];

            return {
                ...state,
                accountStorage,
            };
        }

        default:
            return state;
    }
}
