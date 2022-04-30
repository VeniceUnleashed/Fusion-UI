import React, { Component } from 'react';
import { connect } from 'react-redux'
import * as ActionTypes from '../constants/ActionTypes'
import * as PlayerDeleteStatus from '../constants/PlayerDeleteStatus'

import DeletingPlayerPopup from './DeletingPlayerPopup'

class PlayerDeleteConfirmationPopup extends Component
{
    render()
    {
        return (
            <div className="center-notice">
                <div className="notice-content">
                    <h1>Delete Soldier</h1>
                    <p>Are you sure you want to delete your soldier '{this.props.name}'? This action cannot be reversed.</p>
                    <a href="#" className="btn border-btn" onClick={this.onClosePopup.bind(this)}>Cancel</a>
                    <a href="#" className="btn border-btn primary" onClick={this.onConfirmDeletion.bind(this)}>Confirm</a>
                </div>
            </div>
        );
    }

    onConfirmDeletion(e)
    {
        if (e)
            e.preventDefault();

        this.props.setPopup(<DeletingPlayerPopup />);
        WebUI.Call('DeletePlayer', this.props.guid);
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
        user: state.user
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        closePopup: () => {
            dispatch({ type: ActionTypes.SET_POPUP, popup: null })
        },
        resetLogin: () => {
            dispatch({ type: ActionTypes.CHANGE_PLAYER_DELETE_STATUS, status: PlayerDeleteStatus.NO_STATUS });
        },
        setPopup: (popup) => {
            dispatch({ type: ActionTypes.SET_POPUP, popup: popup })
        }
    };
};

export default connect(
    mapStateToProps, mapDispatchToProps
)(PlayerDeleteConfirmationPopup);
