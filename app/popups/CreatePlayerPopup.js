import React, { Component } from 'react';
import { connect } from 'react-redux'
import * as ActionTypes from '../constants/ActionTypes'
import * as PlayerCreateStatus from '../constants/PlayerCreateStatus'
import LoadingIndicator from "../components/LoadingIndicator";

class CreatePlayerPopup extends Component
{
    render()
    {
        if (this.props.user.playerCreateStatus === PlayerCreateStatus.CREATION_FAILED)
        {
            let errorMessage = 'Could not create soldier. Please try again later.';

            if (this.props.error && 'code' in this.props.error)
            {
                switch (this.props.error.code)
                {
                    case 16: // InvalidPlayerName
                        errorMessage = 'The soldier name you entered is invalid. Names must be between 3 and 16 characters and can contain latin letters, numbers, spaces, and the following characters: ._"\'$:-|[]<>!?*@;/\\(){}~^'
                        break;

                    case 20: // PlayerAlreadyExists
                        errorMessage = 'The soldier name you entered is already in use.';
                        break;

                    case 21: // MaximumPlayersReached
                        errorMessage = 'You have reached the limit of soldiers you can create.';
                        break;

                    case 29: // MissingLink
                        errorMessage = 'You must link your Origin account to your VU account before being able to create soldiers. Restart the VU client to link your accounts.';
                        break;

                    case 30: // LinkUnauthorized
                        errorMessage = 'You must have BF3 in your Origin account to your VU account before being able to create soldiers. Restart the VU client to relink your accounts.';
                        break;

                    case 31: // LinkNeedsRefresh
                        errorMessage = 'Your Origin account link has expired because you own BF3 through EA Play. You must refresh your link before creating a soldier. Restart the VU client to refresh your link.';
                        break;
                }
            }

            return (
                <div className="center-notice">
                    <div className="notice-content">
                        <h1>Creation Failed</h1>
                        <p>{errorMessage}</p>
                        <a href="#" className="btn border-btn" onClick={this.onResetPopup.bind(this)}>Close</a>
                    </div>
                </div>
            );
        }

        if (this.props.user.playerCreateStatus === PlayerCreateStatus.CREATING)
        {
            return (
                <div className="center-notice">
                    <div className="notice-content">
                        <h1>Creating Soldier</h1>
                        <p>Please wait while your new Soldier is being created...</p>
                        <LoadingIndicator/>
                    </div>
                </div>
            );
        }

        if (this.props.user.playerCreateStatus !== PlayerCreateStatus.CREATION_INIT)
        {
            setTimeout(() => { this.props.closePopup(); }, 50);
            return (<div></div>);
        }

        return (
            <div className="center-notice">
                <div className="notice-content">
                    <h1>Create new Soldier</h1>
                    <form onSubmit={this.onSubmit.bind(this)}>
                        <label htmlFor="name">Soldier Name</label><br/>
                        <input type="text" name="name" ref="name" id="name" />
                        <div className="form-actions">
                            <a href="#" className="btn border-btn" onClick={this.onClosePopup.bind(this)}>Close</a>
                            <a href="#" className="btn border-btn primary" onClick={this.onSubmit.bind(this)}>Create</a>
                        </div>
                        <input type="submit" style={{ position: 'absolute', opacity: 0.0 }} />
                    </form>
                </div>
            </div>
        );
    }

    onResetPopup(e)
    {
        if (e)
            e.preventDefault();

        this.props.resetPopup();
    }

    onClosePopup(e)
    {
        if (e)
            e.preventDefault();

        this.props.closePopup();
        this.props.resetLogin();
    }

    onSubmit(e)
    {
        if (e)
            e.preventDefault();

        this.props.setCreating();

        let playerName = this.refs.name.value;
        WebUI.Call('CreatePlayer', playerName);
    }

    componentDidMount()
    {
        document.activeElement.blur();

        if (this.refs.name)
            this.refs.name.focus();
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
            dispatch({ type: ActionTypes.CHANGE_PLAYER_CREATE_STATUS, status: PlayerCreateStatus.NO_STATUS });
        },
        setCreating: () => {
            dispatch({ type: ActionTypes.CHANGE_PLAYER_CREATE_STATUS, status: PlayerCreateStatus.CREATING });
        },
        resetPopup: () => {
            dispatch({ type: ActionTypes.CHANGE_PLAYER_CREATE_STATUS, status: PlayerCreateStatus.CREATION_INIT });
        }
    };
};

export default connect(
    mapStateToProps, mapDispatchToProps
)(CreatePlayerPopup);
