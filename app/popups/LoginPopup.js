import React, { Component } from 'react';
import { connect } from 'react-redux'
import * as ActionTypes from '../constants/ActionTypes'
import * as LoginStatus from '../constants/LoginStatus'
import LoadingIndicator from "../components/LoadingIndicator";

class LoginPopup extends Component
{
    render()
    {
        if (this.props.user.loginStatus === LoginStatus.LOGIN_FAILED)
        {
            let errorMessage = 'Your credentials could not be validated. Please make sure they are entered correctly and try again.';

            if (this.props.error && 'code' in this.props.error)
            {
                switch (this.props.error.code)
                {
                    case 29: // AlreadyLoggedIn
                        errorMessage = 'This account is in use from another location.';
                        break;

                    case 24: // PendingVerification
                        errorMessage = 'You must verify your account before you can log in.';
                        break;

                    case 31: // ExpiredToken
                        errorMessage = 'Your session has expired. Please log in again using your credentials.';
                        break;

                    case 27: // AccountDisabled
                        errorMessage = 'Your account has been disabled by an administrator.';
                        break;

                    case 28: // AccountBanned
                        errorMessage = 'Your account has been banned.';
                        break;

                    case 5: // Unauthorized
                        errorMessage = 'Your account does not have access to this branch.'
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

        return (
            <div className="center-notice">
                <div className="notice-content">
                    <h1>Logging In</h1>
                    <p>Please wait...</p>
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
            dispatch({ type: ActionTypes.CHANGE_LOGIN_STATUS, status: LoginStatus.LOGGED_OUT });
        }
    };
};

export default connect(
    mapStateToProps, mapDispatchToProps
)(LoginPopup);
