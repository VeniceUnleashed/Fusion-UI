import 'react-hot-loader'
import React from 'react'
import { render } from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { hashHistory } from 'react-router'

import reducer from './reducers'
import ClientRenderer from './renderers/ClientRenderer'

import 'perfect-scrollbar/css/perfect-scrollbar.css';
import 'rc-slider/assets/index.css';
import '../assets/scss/screen.scss';

import * as ActionTypes from './constants/ActionTypes'
import * as ConnectionStatus from './constants/ConnectionStatus'
import * as LoginStatus from './constants/LoginStatus'
import * as PlayerCreateStatus from './constants/PlayerCreateStatus'
import * as PlayerDeleteStatus from './constants/PlayerDeleteStatus'
import * as PlayerLoginStatus from './constants/PlayerLoginStatus'
import * as ServerFetchStatus from './constants/ServerFetchStatus'
import * as ServerConnectStatus from './constants/ServerConnectStatus'
import * as OriginLinkStatus from './constants/OriginLinkStatus'
import * as UpdateState from './constants/UpdateState'
import * as UpdateError from './constants/UpdateError'

import ConnectingServerPopup from './popups/ConnectingServerPopup'
import SettingsPopup from "./popups/SettingsPopup";
import {SHOW_SETTINGS_POPUP} from "./constants/ActionTypes";

window.actions = ActionTypes;
window.connStatus = ConnectionStatus;
window.loginStatus = LoginStatus;
window.playerCreateStatus = PlayerCreateStatus;
window.playerDeleteStatus = PlayerDeleteStatus;
window.playerLoginStatus = PlayerLoginStatus;
window.serverFetchStatus = ServerFetchStatus;
window.serverConnectStatus = ServerConnectStatus;
window.originLinkStatus = OriginLinkStatus;
window.updateState = UpdateState;
window.updateError = UpdateError;

// Create the main application store.
let store = createStore(reducer);

const fetchNews = () => new Promise((resolve, reject) => {
    fetch('https://veniceunleashed.net/vu-ig-news')
        .then((response) => {
            response.json().then((newsJson) => {
                store.dispatch({
                    type: ActionTypes.SET_NEWS,
                    news: newsJson,
                });

                resolve();
            }).catch((err) => {
                reject(err);
            })
        })
        .catch((err) => {
            reject(err);
        });
});

fetchNews();

// Fetch news every 30 minutes.
setInterval(fetchNews, 30 * 60 * 1000);

let globalNoticeTimer = null;

window.GlobalNotice = function(data)
{
    if (globalNoticeTimer !== null)
    {
        clearTimeout(globalNoticeTimer);
        globalNoticeTimer = null;
    }

    store.dispatch({
        type: ActionTypes.SET_GLOBAL_NOTICE,
        notice: data.notice,
    });

    globalNoticeTimer = setTimeout(() => {
        globalNoticeTimer = null;

        store.dispatch({
            type: ActionTypes.SET_GLOBAL_NOTICE,
            notice: null,
        });
    }, 10000);
};

window.DispatchAction = function(action, data)
{
    store.dispatch({
        type: action,
        ...data
    });
};

window.GetServerConnectionPopup = function()
{
    return <ConnectingServerPopup />;
};

window.WebUI = window.WebUI || {
    Call: function() {}
};

document.addEventListener('keydown', function(event) {
    let prevent = false;
    if (event.keyCode === 8) {
        let d = event.srcElement || event.target;

        if ((d.tagName.toUpperCase() === 'INPUT' && (
            d.type.toUpperCase() === 'TEXT' ||
            d.type.toUpperCase() === 'PASSWORD' ||
            d.type.toUpperCase() === 'FILE' ||
            d.type.toUpperCase() === 'SEARCH' ||
            d.type.toUpperCase() === 'EMAIL' ||
            d.type.toUpperCase() === 'NUMBER' ||
            d.type.toUpperCase() === 'DATE')
            ) || d.tagName.toUpperCase() === 'TEXTAREA') {
            prevent = d.readOnly || d.disabled;
        } else {
            prevent = true;
        }
    }

    if (prevent)
        event.preventDefault();
});

render(
    <Provider store={store}>
        <ClientRenderer />
    </Provider>,
    document.getElementById('root')
);

if (process.env.NODE_ENV !== 'production')
{
    require('./test');
}
