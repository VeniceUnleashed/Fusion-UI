import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as ActionTypes from '../constants/ActionTypes'

import * as ConnectionStatus from '../constants/ConnectionStatus'
import LoadingIndicator from "../components/LoadingIndicator";

class Connection extends Component
{
    render()
    {
        if (this.props.base.connectionStatus === ConnectionStatus.DISCONNECTED)
        {
            return (
                <div className="center-notice">
                    <div className="notice-content">
                        <h1>Connection Error</h1>
                        <p>You have been disconnected from the Zeus Backend.</p>
                        <a href="#" className="btn border-btn" onClick={this.onReconnect.bind(this)}>Reconnect</a>
                    </div>
                </div>
            );
        }

        if (this.props.base.connectionStatus === ConnectionStatus.CONNECTING || this.props.base.connectionStatus === ConnectionStatus.CONNECTED)
        {
            return (
                <div className="center-notice">
                    <div className="notice-content">
                        <h1>Connecting</h1>
                        <p>Connecting to the Zeus Backend. Please wait...</p>
                        <LoadingIndicator/>
                    </div>
                </div>
            );
        }

        let errorCode = 'Unknown';

        if (this.props.base.error && 'code' in this.props.base.error)
        {
            switch (this.props.base.error.code)
            {
                case 0:
                    errorCode = 'Connection timed out.';
                    break;

                case 4:
                    errorCode = 'No servers available.';
                    break;

                case 23:
                    errorCode = 'Servers are busy. Keep retrying.';
                    break;

                default:
                    errorCode = 'Unknown (' + this.props.base.error.code + ')';
            }
        }

        return (
            <div className="center-notice">
                <div className="notice-content">
                    <h1>Connection Failed</h1>
                    <p>Could not connect to the Zeus Backend. Reason: {errorCode}.</p>
                    <a href="#" className="btn border-btn" onClick={this.onReconnect.bind(this)}>Reconnect</a>
                </div>
            </div>
        );
    }

    componentDidMount()
    {
        this.props.enableBlur();
        this.props.disableMenu();
    }

    onReconnect(e)
    {
        e.preventDefault();
        WebUI.Call('Reconnect');
    }
}

const mapStateToProps = (state) => {
    return {
        base: state.base
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        enableBlur: () => {
            dispatch({ type: ActionTypes.SET_BLUR, blur: true })
        },
        disableMenu: () => {
            dispatch({ type: ActionTypes.SET_MENU, menu: false })
        }
    };
};

export default connect(
    mapStateToProps, mapDispatchToProps
)(Connection);
