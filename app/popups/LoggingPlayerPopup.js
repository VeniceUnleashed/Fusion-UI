import React, { Component } from 'react';
import { connect } from 'react-redux'
import * as ActionTypes from '../constants/ActionTypes'
import * as PlayerLoginStatus from '../constants/LoginStatus'
import LoadingIndicator from "../components/LoadingIndicator";

class LoggingPlayerPopup extends Component
{
    render()
    {
        if (this.props.user.playerLoginStatus === PlayerLoginStatus.LOGIN_FAILED)
        {
            let errorMessage = 'An error occurred while attempting to login with your Soldier. Please try again later.';

            if (this.props.error && 'code' in this.props.error)
            {
                switch (this.props.error.code)
                {
                    case 24: // PlayerDisabled
                        errorMessage = 'This soldier has been banned.';
                        break;

                    case 29: // MissingLink
                        errorMessage = 'You must link your Origin account to your VU account before being able to play. Restart the VU client to link your accounts.';
                        break;

                    case 30: // LinkUnauthorized
                        errorMessage = 'You must have BF3 in your Origin account to your VU account before being able to play. Restart the VU client to relink your accounts.';
                        break;

                    case 31: // LinkNeedsRefresh
                        errorMessage = 'Your Origin account link has expired because you own BF3 through EA Play. You must refresh your link before being able to play. Restart the VU client to refresh your link.';
                        break;
                }
            }

            return (
                <div className="center-notice">
                    <div className="notice-content">
                        <h1>Login Failed</h1>
                        <p>{errorMessage}</p>
                        <a href="#" className="btn border-btn" onClick={this.onClosePopup.bind(this)}>Close</a>
                    </div>
                </div>
            );
        }

        if (this.props.user.playerLoginStatus !== PlayerLoginStatus.LOGGING_IN)
        {
            setTimeout(() => { this.props.closePopup(); }, 50);
            return (<div></div>);
        }

        return (
            <div className="center-notice">
                <div className="notice-content">
                    <h1>Logging In</h1>
                    <p>Please wait while we login with your Soldier...</p>
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
        user: state.user,
        error: state.base.error,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        closePopup: () => {
            dispatch({ type: ActionTypes.SET_POPUP, popup: null })
        },
        resetLogin: () => {
            dispatch({ type: ActionTypes.CHANGE_PLAYER_LOGIN_STATUS, status: PlayerLoginStatus.LOGGED_OUT });
        }
    };
};

export default connect(
    mapStateToProps, mapDispatchToProps
)(LoggingPlayerPopup);
