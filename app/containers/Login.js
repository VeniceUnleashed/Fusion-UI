import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as ActionTypes from '../constants/ActionTypes'
import * as LoginStatus from '../constants/LoginStatus'

import LoginPopup from '../popups/LoginPopup'

class Login extends Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            capsLock: false,
        };
    }

    render()
    {
        let capsLockNoticeClass = 'capslock-notice';

        if (this.state.capsLock) {
            capsLockNoticeClass += ' on';
        }

        return (
            <div id="login-page">
                <form onSubmit={this.onSubmit.bind(this)}>
                    <img src="/assets/img/logo.svg" />
                    <label htmlFor="username">Username</label><br/>
                    <input type="text" ref="username" key="username" id="username" /><br/>
                    <label htmlFor="password">Password</label><br/>
                    <input type="password" ref="password" key="password" id="password" onKeyDown={this.onUpdateCapsLock} onKeyUp={this.onUpdateCapsLock} onMouseDown={this.onUpdateCapsLock} /><br/>
                    <div className={capsLockNoticeClass}><strong>WARNING</strong>&nbsp;&nbsp;Caps Lock is on.</div>
                    <a href="#" className="btn border-btn primary" onClick={this.onSubmit.bind(this)}>Login</a>
                    <a href="#" className="btn border-btn" onClick={this.onSignUp.bind(this)}>Sign Up</a>
                    <div className="login-actions">
                        <div className="left-actions">
                            <label>Remember Me <input type="checkbox" name="remember" value="yes" ref="remember" /></label>
                        </div>
                        <div className="right-actions">
                            <a href="#" onClick={this.onForgotPassword.bind(this)}>Forgot Password</a>
                        </div>
                    </div>
                    <input type="submit" style={{ position: 'absolute', opacity: 0.0, left: '-999999999px' }}/>
                </form>
            </div>
        );
    }

    onUpdateCapsLock = (e) =>
    {
        const capsLock = e.getModifierState('CapsLock');

        this.setState({
            capsLock,
        });
    };

    componentDidMount()
    {
        this.props.enableBlur();
        this.props.disableMenu();

        if (this.props.user.loginToken !== null)
        {
            this.props.onSetLogin();
            this.props.setPopup(<LoginPopup />);

            WebUI.Call('TokenLogin', this.props.user.loginToken.token);
        }
    }

    componentWillUnmount()
    {
        this.props.setPopup(null);
    }

    onForgotPassword(e)
    {
        if (e)
            e.preventDefault();

        WebUI.Call('Forgot');
    }

    onSubmit(e)
    {
        e.preventDefault();

        this.props.onSetLogin();
        this.props.setPopup(<LoginPopup />);

        WebUI.Call('Login', this.refs.username.value, this.refs.password.value, this.refs.remember.checked);
    }

    onSignUp(e)
    {
        e.preventDefault();
        WebUI.Call('Signup');
    }
}

const mapStateToProps = (state) => {
    return {
        base: state.base,
        user: state.user
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        enableBlur: () => {
            dispatch({ type: ActionTypes.SET_BLUR, blur: true })
        },
        disableMenu: () => {
            dispatch({ type: ActionTypes.SET_MENU, menu: false })
        },
        setPopup: (popup) => {
            dispatch({ type: ActionTypes.SET_POPUP, popup: popup })
        },
        onSetLogin: () => {
            dispatch({ type: ActionTypes.CHANGE_LOGIN_STATUS, status: LoginStatus.LOGGING_IN })
        }
    };
};

export default connect(
    mapStateToProps, mapDispatchToProps
)(Login);
