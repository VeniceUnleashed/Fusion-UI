import React, { Component } from 'react';
import { connect } from 'react-redux'
import * as ActionTypes from '../constants/ActionTypes'
import * as PlayerDeleteStatus from '../constants/PlayerDeleteStatus'

import DeletingPlayerPopup from './DeletingPlayerPopup'

class QuitConfirmationPopup extends Component
{
    render()
    {
        return (
            <div className="center-notice">
                <div className="notice-content">
                    <h1>Quit Game</h1>
                    <p>Are you sure you want to quit {this.props.base.productName}?</p>
                    <a href="#" className="btn border-btn" onClick={this.onClosePopup.bind(this)}>Cancel</a>
                    <a href="#" className="btn border-btn primary" onClick={this.onConfirmQuit.bind(this)}>Quit</a>
                </div>
            </div>
        );
    }

    onConfirmQuit(e)
    {
        if (e)
            e.preventDefault();

        this.props.closePopup();
        WebUI.Call('Quit');
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
)(QuitConfirmationPopup);
