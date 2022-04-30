import {
    SET_INITIALIZED,
    SET_ERROR,
    CHANGE_INGAME,
    CHANGE_CONNECTION_STATUS,
    SET_BLUR,
    SET_MENU,
    SET_POPUP,
    SET_PRODUCT_NAME,
    SET_PRODUCT_CODE,
    SET_BUILD_NUMBER,
    SET_VERSION_NUMBER,
    SET_VEXT_VERSION,
    SET_PENDING_SERVER,
    CHANGE_UPDATE_STATE,
    SET_NEWS,
    SET_GLOBAL_NOTICE,
} from '../constants/ActionTypes'

import React from 'react';

import * as ConnectionStatus from '../constants/ConnectionStatus'

import { hashHistory } from 'react-router'
import * as UpdateState from "../constants/UpdateState";
import ConnectToPendingServerPopup from "../popups/ConnectToPendingServerPopup";
import UpdateReadyPopup from "../popups/UpdateReadyPopup";

const initialState = {
    initialized: false,
    productName: '',
    productCode: '',
    error: null,
    ingame: false,
    connectionStatus: 0,
    hasBlur: true,
    hasMenu: false,
    popup: null,
    build: 0,
    version: '',
    vextVersion: '',
    pendingServer: null,
    pendingServerSpectate: false,
    pendingServerPassword: '',
    news: null,
    globalNotice: null,
};

function createStateCopy(state)
{
    return {
        ...state,
    };
}

export default function base(state = initialState, action)
{
    switch (action.type)
    {
        case SET_GLOBAL_NOTICE:
        {
            let finalState = createStateCopy(state);

            finalState.globalNotice = action.notice;

            return finalState;
        }

        case SET_INITIALIZED:
        {
            let finalState = createStateCopy(state);

            finalState.initialized = true;

            setTimeout(function() {
                if (finalState.connectionStatus === ConnectionStatus.CONNECTED)
                    hashHistory.push('/login');
                else
                    hashHistory.push('/connection');
            }, 50);

            return finalState;
        }

        case SET_PRODUCT_NAME:
        {
            let finalState = createStateCopy(state);

            finalState.productName = action.name;

            return finalState;
        }

        case SET_PRODUCT_CODE:
        {
            let finalState = createStateCopy(state);

            finalState.productCode = action.code;

            return finalState;
        }

        case SET_BUILD_NUMBER:
        {
            let finalState = createStateCopy(state);

            finalState.build = action.build;

            return finalState;
        }

        case SET_VERSION_NUMBER:
        {
            let finalState = createStateCopy(state);

            finalState.version = action.version;

            return finalState;
        }

        case SET_VEXT_VERSION:
        {
            let finalState = createStateCopy(state);

            finalState.vextVersion = action.version;

            return finalState;
        }

        case SET_ERROR:
        {
            let finalState = createStateCopy(state);

            finalState.error = action.error;

            if (action.page && action.page.length > 0)
            {
                setTimeout(function() {
                    hashHistory.push('/' + action.page);
                }, 50);
            }

            return finalState;
        }

        case CHANGE_INGAME:
        {
            let finalState = createStateCopy(state);

            finalState.ingame = action.ingame;

            if (!finalState.ingame && finalState.pendingServer !== null)
            {
                finalState.popup = <ConnectToPendingServerPopup />;
            }

            return finalState;
        }

        case CHANGE_CONNECTION_STATUS:
        {
            let finalState = createStateCopy(state);

            finalState.connectionStatus = action.status;

            setTimeout(function() {
                if (finalState.connectionStatus === ConnectionStatus.CONNECTED)
                    hashHistory.push('/login');
                else
                    hashHistory.push('/connection');
            }, 50);

            return finalState;
        }

        case SET_BLUR:
        {
            let finalState = createStateCopy(state);

            finalState.hasBlur = action.blur;

            return finalState;
        }

        case SET_MENU:
        {
            let finalState = createStateCopy(state);

            finalState.hasMenu = action.menu;

            return finalState;
        }

        case SET_POPUP:
        {
            let finalState = createStateCopy(state);

            finalState.popup = action.popup;

            return finalState;
        }

        case SET_PENDING_SERVER:
        {
            let finalState = {
                ...state,
                pendingServer: action.server,
                pendingServerSpectate: action.spectate,
                pendingServerPassword: action.password,
            };

            // If we're not in-game start connecting to the server immediately.
            if (!state.ingame)
            {
                finalState.popup = <ConnectToPendingServerPopup />;
            }

            return finalState;
        }

        case CHANGE_UPDATE_STATE:
        {
            if (action.state !== UpdateState.DONE_UPDATING)
                return state;

            if (state.popup !== null)
                return state;

            return {
                ...state,
                popup: <UpdateReadyPopup />,
            };
        }

        case SET_NEWS:
        {
            return {
                ...state,
                news: action.news,
            };
        }

        default:
            return state;
    }
}
