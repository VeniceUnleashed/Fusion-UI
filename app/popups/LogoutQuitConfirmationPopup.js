import React, { Component } from 'react';
import { connect } from 'react-redux'
import * as ActionTypes from '../constants/ActionTypes'

class LogoutQuitConfirmationPopup extends Component
{
    render()
    {
        return (
            <div className="center-notice">
                <div className="notice-content">
                    <h1>Logout & Quit</h1>
                    <p>Are you sure you want to log out and quit?</p>
                    <a href="#" className="btn border-btn" onClick={this.onClosePopup.bind(this)}>Cancel</a>
                    <a href="#" className="btn border-btn primary" onClick={this.onSwitchSoldier.bind(this)}>Switch Soldier</a>
                    <a href="#" className="btn border-btn primary" onClick={this.onConfirmQuit.bind(this)}>Logout & Quit</a>
                </div>
            </div>
        );
    }

    onConfirmQuit(e)
    {
        if (e)
            e.preventDefault();

        this.props.closePopup();
        WebUI.Call('LogoutQuit');
    }

    onSwitchSoldier(e)
    {
        if (e)
            e.preventDefault();

        this.props.closePopup();
        WebUI.Call('LogoutPlayer');
    }

    onClosePopup(e)
    {
        if (e)
            e.preventDefault();

        this.props.closePopup();
    }

    componentDidMount()
    {
        document.activeElement.blur();
    }
}

const mapStateToProps = (state) => {
    return {
        base: state.base
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        closePopup: () => {
            dispatch({ type: ActionTypes.SET_POPUP, popup: null })
        },
        setPopup: (popup) => {
            dispatch({ type: ActionTypes.SET_POPUP, popup: popup })
        }
    };
};

export default connect(
    mapStateToProps, mapDispatchToProps
)(LogoutQuitConfirmationPopup);
