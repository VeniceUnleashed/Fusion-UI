import React, { Component } from 'react';
import { connect } from 'react-redux'
import * as ActionTypes from '../constants/ActionTypes'

class ServerPasswordPopup extends Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            isCapsLockOn: false
        }
    }

    componentDidMount()
    {
        this.setState({
            isCapsLockOn: false
        })
    }

    render()
    {
        return (
            <div className="center-notice">
                <div className="notice-content">
                    <h1>Enter Server Password</h1>
                    <form onSubmit={this.onSubmit.bind(this)}>
                        <div className="label-wrapper">
                            <label htmlFor="password">Server Password</label><br/>
                            {
                                this.state.isCapsLockOn ? <div className="caps-lock-notice">
                                    <i className="material-icons">info</i>CAPS LOCK IS ON
                                </div>: null
                            }
                        </div>

                        <input type="password" name="password" ref="password" id="password" onKeyUp={this.onKeyUp.bind(this)} />

                        <div className="form-actions">
                            <a href="#" className="btn border-btn" onClick={this.onClosePopup.bind(this)}>Close</a>
                            <a href="#" className="btn border-btn primary" onClick={this.onSubmit.bind(this)}>Connect</a>
                        </div>
                        <input type="submit" style={{ position: 'absolute', opacity: 0.0 }} />
                    </form>
                </div>
            </div>
        );
    }

    onKeyUp(e)
    {
        const isCapsLockOn = e.getModifierState('CapsLock');

        if (this.state.isCapsLockOn !== isCapsLockOn)
        {
            this.setState({ isCapsLockOn })
        }
    }

    onClosePopup(e)
    {
        if (e)
            e.preventDefault();

        this.props.closePopup();
    }

    onSubmit(e)
    {
        if (e)
            e.preventDefault();

        let serverPassword = this.refs.password.value;

        this.props.closePopup();

        if (this.props.onJoin)
            this.props.onJoin(this.props.server.guid, serverPassword);
    }

    componentDidMount()
    {
        document.activeElement.blur();

        if (this.refs.password)
            this.refs.password.focus();
    }
}

const mapStateToProps = () => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {
        closePopup: () => {
            dispatch({ type: ActionTypes.SET_POPUP, popup: null })
        }
    };
};

export default connect(
    mapStateToProps, mapDispatchToProps
)(ServerPasswordPopup);
