import React, { Component } from 'react';
import { connect } from 'react-redux'
import * as ActionTypes from '../constants/ActionTypes'
import LoadingIndicator from "../components/LoadingIndicator";
import ServerEntry from "../components/ServerEntry";
import ConnectingServerPopup from "./ConnectingServerPopup";
import * as ServerConnectStatus from "../constants/ServerConnectStatus";
import ServerPasswordPopup from "./ServerPasswordPopup";

class ConnectToPendingServerPopup extends Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            compatibility: null,
            cannotSpectate: false,
        };
    }

    componentDidMount()
    {
        document.activeElement.blur();

        // If we're connecting to another server or didn't get any data cancel.
        if (this.props.base.pendingServer === null || this.props.servers.connectStatus === ServerConnectStatus.CONNECTING)
        {
            this.props.closePopup();
            return;
        }

        const server = this.props.base.pendingServer;
        const password = this.props.base.pendingServerPassword;

        const compatibility = ServerEntry.checkServerCompatibility(
            server,
            this.props.availableXPacks,
            this.props.minServerBuild,
            this.props.build,
            this.props.vextVersion
        );

        let cannotSpectate = false;

        if (parseInt(server.variables.maxspectators, 10) <= 0 && this.props.base.pendingServerSpectate)
            cannotSpectate = true;

        const spectateServer = this.props.base.pendingServerSpectate;

        this.setState({
            compatibility,
            cannotSpectate,
        });

        // If we're compatible then connect.
        if (compatibility === null)
        {
            // If we requested to spectate and we cannot spectate then do nothing.
            if (spectateServer && cannotSpectate)
            {
                return;
            }

            const joinCallback = (guid, password) => {
                DispatchAction(ActionTypes.SET_PENDING_SERVER, { server: null, spectate: false, password: '' });
                DispatchAction(ActionTypes.CHANGE_SERVER_CONNECT_STATUS, { status: ServerConnectStatus.CONNECTING });
                DispatchAction(ActionTypes.SET_POPUP, { popup: <ConnectingServerPopup />  });

                const call = spectateServer ? 'SpectateServer' : 'ConnectToServer';

                if (password && password.length > 0)
                {
                    setTimeout(function() { WebUI.Call(call, guid, password); }, 500);
                    return;
                }

                setTimeout(function() { WebUI.Call(call, guid); }, 500);
            };

            // If the server is passworded we need to show the password popup.
            if (server.passworded && (!password || password.length === 0))
            {
                this.props.setPopup(<ServerPasswordPopup server={server} onJoin={joinCallback} />);
                return;
            }

            // Otherwise connect immediately.
            joinCallback(server.guid, password);
        }
    }

    render()
    {
        if (this.state.compatibility !== null)
        {
            return (
                <div className="center-notice">
                    <div className="notice-content">
                        <h1>Joining Failed</h1>
                        <p>{this.state.compatibility}</p>
                        <a href="#" className="btn border-btn" onClick={this.onClosePopup.bind(this)}>Close</a>
                    </div>
                </div>
            );
        }

        if (this.state.cannotSpectate)
        {
            return (
                <div className="center-notice">
                    <div className="notice-content">
                        <h1>Joining Failed</h1>
                        <p>The server you're trying to join does not allow spectators.</p>
                        <a href="#" className="btn border-btn" onClick={this.onClosePopup.bind(this)}>Close</a>
                    </div>
                </div>
            );
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
    }

}

const mapStateToProps = (state) => {
    return {
        base: state.base,
        servers: state.servers,
        minServerBuild: state.servers.minServerBuild,
        availableXPacks: state.servers.availableXPacks,
        vextVersion: state.base.vextVersion,
        build: state.base.build,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        closePopup: () => {
            dispatch({ type: ActionTypes.SET_PENDING_SERVER, server: null, spectate: false });
            dispatch({ type: ActionTypes.SET_POPUP, popup: null });
        },
        setPopup: (popup) => {
            dispatch({ type: ActionTypes.SET_PENDING_SERVER, server: null });
            dispatch({ type: ActionTypes.SET_POPUP, popup });
        },
        setConnectionStatus: () => {
            dispatch({ type: ActionTypes.CHANGE_SERVER_CONNECT_STATUS, status: ServerConnectStatus.CONNECTING })
        },
    };
};

export default connect(
    mapStateToProps, mapDispatchToProps
)(ConnectToPendingServerPopup);
