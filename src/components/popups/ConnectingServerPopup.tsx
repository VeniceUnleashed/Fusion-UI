import React from 'react';

import { ActionTypes } from '../../constants/ActionTypes';
import { ServerConnectStatus } from '../../constants/ServerConnectStatus';
import useBaseStore from '../../stores/useBaseStore';
import useServerStore from '../../stores/useServerStore';
import LoadingIndicator from '../global/LoadingIndicator';

const ConnectingServerPopup: React.FC = () => {
    const connectStatus = useServerStore((s) => s.connectStatus);
    const downloadProgress = useServerStore((s) => s.downloadProgress);
    const error = useBaseStore((s) => s.error);

    const closePopup = () => {
        window.DispatchAction(ActionTypes.SET_ERROR, {
            error: null,
        });
        window.DispatchAction(ActionTypes.SET_POPUP, {
            popup: null,
        });
    };

    const resetLogin = () => {
        window.DispatchAction(ActionTypes.CHANGE_SERVER_CONNECT_STATUS, {
            status: ServerConnectStatus.IDLE,
        });
    };

    // Aborts the join: drops the connection, stops any download and returns to
    // the menu if the level load already started.
    const onCancel = (e?: any) => {
        if (e) e.preventDefault();

        window.WebUI.Call('CancelConnect');

        closePopup();
        resetLogin();
    };

    const cancelButton = (
        <a href="#" className="btn border-btn" onClick={onCancel}>
            Cancel
        </a>
    );

    const onClosePopup = (e?: any) => {
        if (e) e.preventDefault();

        closePopup();
        resetLogin();
    };

    if (connectStatus === ServerConnectStatus.CONNECTION_FAILED) {
        let text = 'An error occurred while connecting to the server. Please try again later.';

        if (error && 'code' in error) {
            switch (error.code) {
                case 2:
                    text = 'The server you tried connecting to is no longer available.';
                    break;

                case 4:
                    text = 'Your account is already connected to another server.';
                    break;

                case 6:
                    text = 'The server password you entered is invalid.';
                    break;

                case 7:
                    if ('reason' in error && error.reason.length > 0) text = error.reason;
                    else text = 'You were not allowed to connect to this server.';

                    break;

                case 8:
                    text = 'Failed to establish a connection to the server.';
                    break;
            }
        }

        return (
            <div className="center-notice">
                <div className="notice-content">
                    <h1>Connection Failed</h1>
                    <p>{text}</p>
                    <a href="#" className="btn border-btn" onClick={onClosePopup}>
                        Close
                    </a>
                </div>
            </div>
        );
    }

    if (connectStatus === ServerConnectStatus.DISCONNECTED) {
        let title = 'Disconnected';
        let text = 'You have been disconnected from the server you were in.';

        if (error && 'code' in error) {
            switch (error.code) {
                case 1:
                case 2:
                    text = 'The server you tried joining is not compatible with your client.';
                    break;

                case 3:
                    text = 'The server is full.';
                    break;

                case 4:
                    if ('reason' in error && error.reason.length > 0)
                        text = 'You were kicked from the server. Reason: ' + error.reason;
                    else text = 'You were kicked from the server.';

                    break;

                case 5:
                    if ('reason' in error && error.reason.length > 0) text = error.reason;
                    else text = 'You were banned from the server.';

                    break;

                case 12:
                    text = 'You are missing some content required to join this server.';
                    break;

                case 14:
                    text = 'The connection to the server timed out.';
                    break;

                case 15:
                    title = 'Connection Failed';
                    text = 'Failed to establish a connection to the server.';
                    break;

                case 16:
                    text = 'Did not receive a reply from the server for some time.';
                    break;

                case 18:
                    text = 'Your local content (eg. level data) does not match the content on the server.';
                    break;

                case 19:
                    text = 'You were kicked for due to inactivity.';
                    break;

                case 21:
                    text = 'You were kicked for team-killing too many players.';
                    break;

                case 22:
                    if ('reason' in error && error.reason.length > 0)
                        text = 'You were kicked from the server. Reason: ' + error.reason;
                    else text = 'You were kicked from the server.';

                    break;

                case 24:
                    title = 'Connection Failed';
                    text = 'The server is full.';
                    break;

                case 34:
                    title = 'Connection Failed';
                    text = 'You are not allowed to spectate this server.';
                    break;

                case 35:
                    title = 'Connection Failed';
                    text = 'There are no spectator slots currently available.';
                    break;
            }
        }

        return (
            <div className="center-notice">
                <div className="notice-content">
                    <h1>{title}</h1>
                    <p>{text}</p>
                    <a href="#" className="btn border-btn" onClick={onClosePopup}>
                        Close
                    </a>
                </div>
            </div>
        );
    }

    if (connectStatus === ServerConnectStatus.DOWNLOAD_FAILED) {
        const title = 'Connection failed';
        const text = 'Could not download the files required to join this server.';

        return (
            <div className="center-notice">
                <div className="notice-content">
                    <h1>{title}</h1>
                    <p>{text}</p>
                    <a href="#" className="btn border-btn" onClick={onClosePopup}>
                        Close
                    </a>
                </div>
            </div>
        );
    }

    // TODO: This isn't right.
    if (connectStatus === ServerConnectStatus.CONNECTED) {
        return (
            <div className="center-notice">
                <div className="notice-content">
                    <h1>Connecting</h1>
                    <p>Please wait while we connect you to the Game Server...</p>
                    <LoadingIndicator />
                    {cancelButton}
                </div>
            </div>
        );
    }

    if (connectStatus === ServerConnectStatus.DOWNLOADING) {
        if (downloadProgress.totalFiles === 0) {
            return (
                <div className="center-notice">
                    <div className="notice-content">
                        <h1>Connecting</h1>
                        <p>Fetching list of files to download...</p>
                        <LoadingIndicator />
                        {cancelButton}
                    </div>
                </div>
            );
        }

        const currFile = downloadProgress.currentFileIndex + 1;
        const totalFiles = downloadProgress.totalFiles;
        const progress = Math.round((downloadProgress.downloaded / downloadProgress.setSize) * 100);

        return (
            <div className="center-notice">
                <div className="notice-content">
                    <h1>Downloading</h1>
                    <p>{`Downloading file ${currFile} of ${totalFiles}. Download progress: ${progress}%`}</p>
                    <LoadingIndicator />
                    {cancelButton}
                </div>
            </div>
        );
    }

    if (connectStatus !== ServerConnectStatus.CONNECTING) {
        setTimeout(() => {
            closePopup();
        }, 50);
        return <div></div>;
    }

    return (
        <div className="center-notice">
            <div className="notice-content">
                <h1>Connecting</h1>
                <p>Please wait while we connect you to the Game Server...</p>
                <LoadingIndicator />
                {cancelButton}
            </div>
        </div>
    );
};
export default ConnectingServerPopup;
