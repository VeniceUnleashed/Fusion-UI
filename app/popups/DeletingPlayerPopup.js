import React, { Component } from 'react';
import { connect } from 'react-redux'
import * as ActionTypes from '../constants/ActionTypes'
import * as PlayerDeleteStatus from '../constants/PlayerDeleteStatus'
import LoadingIndicator from "../components/LoadingIndicator";

class DeletingPlayerPopup extends Component
{
    render()
    {
        if (this.props.user.playerDeleteStatus === PlayerDeleteStatus.DELETION_FAILED)
        {
            return (
                <div className="center-notice">
                    <div className="notice-content">
                        <h1>Deletion Failed</h1>
                        <p>Your Soldier could not be deleted. Please try again later.</p>
                        <a href="#" className="btn border-btn" onClick={this.onClosePopup.bind(this)}>Close</a>
                    </div>
                </div>
            );
        }

        if (this.props.user.playerDeleteStatus === PlayerDeleteStatus.NO_STATUS)
        {
            setTimeout(() => { this.props.closePopup(); }, 50);
            return (<div></div>);
        }

        return (
            <div className="center-notice">
                <div className="notice-content">
                    <h1>Deleting Soldier</h1>
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
        }
    };
};

export default connect(
    mapStateToProps, mapDispatchToProps
)(DeletingPlayerPopup);
