import React, { Component } from 'react';
import { connect } from 'react-redux'
import * as ActionTypes from '../constants/ActionTypes'
import * as ServerConnectStatus from '../constants/ServerConnectStatus'
import LoadingIndicator from "../components/LoadingIndicator";

class ConnectingServerPopup extends Component
{
    render()
    {
        if (this.props.servers.connectStatus === ServerConnectStatus.CONNECTION_FAILED)
        {
            let text = 'An error occurred while connecting to the server. Please try again later.';

            if (this.props.error && 'code' in this.props.error)
            {
                switch (this.props.error.code)
                {
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
                    if ('reason' in this.props.error && this.props.error.reason.length > 0)
                        text = this.props.error.reason;
                    else
                        text = 'You were not allowed to connect to this server.';

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
                        <a href="#" className="btn border-btn" onClick={this.onClosePopup.bind(this)}>Close</a>
                    </div>
                </div>
            );
        }

        if (this.props.servers.connectStatus === ServerConnectStatus.DISCONNECTED)
        {
            let title = 'Disconnected';
            let text = 'You have been disconnected from the server you were in.';

            if (this.props.error && 'code' in this.props.error)
            {
                switch (this.props.error.code)
                {
                    case 1:
                    case 2:
                        text = 'The server you tried joining is not compatible with your client.';
                        break;

                    case 3:
                        text = 'The server is full.';
                        break;

                    case 4:
                        if ('reason' in this.props.error && this.props.error.reason.length > 0)
                            text = 'You were kicked from the server. Reason: ' + this.props.error.reason;
                        else
                            text = 'You were kicked from the server.';

                        break;

                    case 5:
                        if ('reason' in this.props.error && this.props.error.reason.length > 0)
                            text = this.props.error.reason;
                        else
                            text = 'You were banned from the server.';

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
                        if ('reason' in this.props.error && this.props.error.reason.length > 0)
                            text = 'You were kicked from the server. Reason: ' + this.props.error.reason;
                        else
                            text = 'You were kicked from the server.';

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
                        <a href="#" className="btn border-btn" onClick={this.onClosePopup.bind(this)}>Close</a>
                    </div>
                </div>
            );
        }

        if (this.props.servers.connectStatus === ServerConnectStatus.DOWNLOAD_FAILED)
        {
            let title = 'Connection failed';
            let text = 'Could not download the files required to join this server.';

            return (
                <div className="center-notice">
                    <div className="notice-content">
                        <h1>{title}</h1>
                        <p>{text}</p>
                        <a href="#" className="btn border-btn" onClick={this.onClosePopup.bind(this)}>Close</a>
                    </div>
                </div>
            );
        }

        // TODO: This isn't right.
        if (this.props.servers.connectStatus === ServerConnectStatus.CONNECTED)
        {
            return (
                <div className="center-notice">
                    <div className="notice-content">
                        <h1>Connecting</h1>
                        <p>Please wait while we connect you to the Game Server...</p>
                        <LoadingIndicator/>
                    </div>
                </div>
            );
        }

        if (this.props.servers.connectStatus === ServerConnectStatus.DOWNLOADING)
        {
            if (this.props.servers.downloadProgress.totalFiles === 0)
            {
                return (
                    <div className="center-notice">
                        <div className="notice-content">
                            <h1>Connecting</h1>
                            <p>Fetching list of files to download...</p>
                            <LoadingIndicator/>
                        </div>
                    </div>
                );
            }

            const currFile = this.props.servers.downloadProgress.currentFileIndex + 1;
            const totalFiles = this.props.servers.downloadProgress.totalFiles;
            const progress = Math.round((this.props.servers.downloadProgress.downloaded / this.props.servers.downloadProgress.setSize) * 100);

            return (
                <div className="center-notice">
                    <div className="notice-content">
                        <h1>Downloading</h1>
                        <p>Downloading file {currFile} of {totalFiles}. Download progress: {progress}%</p>
                        <LoadingIndicator/>
                    </div>
                </div>
            );
        }

        if (this.props.servers.connectStatus !== ServerConnectStatus.CONNECTING)
        {
            setTimeout(() => { this.props.closePopup(); }, 50);
            return (<div></div>);
        }

        return (
            <div className="center-notice">
                <div className="notice-content">
                    <h1>Connecting</h1>
                    <p>Please wait while we connect you to the Game Server...</p>
                    <LoadingIndicator/>
                </div>
            </div>
        );
    }

    onClosePopup(e)
    {
        if (e)
            e.preventDefault();

        this.props.closePopup();
        this.props.resetLogin();
    }

    componentDidMount()
    {
        document.activeElement.blur();
    }
}

const mapStateToProps = (state) => {
    return {
        servers: state.servers,
        error: state.base.error,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        closePopup: () => {
            dispatch({ type: ActionTypes.SET_ERROR, error: null });
            dispatch({ type: ActionTypes.SET_POPUP, popup: null });
        },
        resetLogin: () => {
            dispatch({ type: ActionTypes.CHANGE_SERVER_CONNECT_STATUS, status: ServerConnectStatus.IDLE });
        }
    };
};

export default connect(
    mapStateToProps, mapDispatchToProps
)(ConnectingServerPopup);
