import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as PlayerCreateStatus from '../constants/PlayerCreateStatus'
import * as PlayerDeleteStatus from '../constants/PlayerDeleteStatus'
import * as PlayerLoginStatus from '../constants/PlayerLoginStatus'
import * as ActionTypes from '../constants/ActionTypes'

import LoggingPlayerPopup from '../popups/LoggingPlayerPopup'
import CreatePlayerPopup from '../popups/CreatePlayerPopup'
import PlayerDeleteConfirmationPopup from '../popups/PlayerDeleteConfirmationPopup'

import SoldierEntry from '../components/SoldierEntry'

class Players extends Component
{
    render()
    {
        // Handle player creation.
        let players = [];

        for (let i = 0; i < this.props.user.players.length; ++i)
        {
            players.push(
                <SoldierEntry
                    key={this.props.user.players[i].guid}
                    name={this.props.user.players[i].name}
                    actions={[
                        {
                            icon: 'exit_to_app',
                            callback: (e) => { this.onLoginPlayer(this.props.user.players[i].guid, e)}
                        }
                    ]}
                    deleteCallback={(e) => { this.onDeletePlayer(this.props.user.players[i].name, this.props.user.players[i].guid, e)}}
                    title="Soldier"
                    />
            );
        }

        let playerCount = players.length;

        for (let i = 0; i < 4 - playerCount; ++i)
        {
            players.push(
                <SoldierEntry
                    key={'create-' + i}
                    actions={[
                        {
                            icon: 'library_add',
                            callback: (e) => { this.onCreatePlayer(e)}
                        }
                    ]}
                    title="Create new Soldier"
                    className="empty"
                />
            );
        }

        return (
            <div className="soldier-listing">
                {players}
            </div>
        );
    }

    onDeletePlayer(name, guid, e)
    {
        if (e)
            e.preventDefault();

        this.props.onSetPlayerDelete();
        this.props.setPopup(<PlayerDeleteConfirmationPopup name={name} guid={guid} />);
    }

    onLoginPlayer(guid, e)
    {
        if (e)
            e.preventDefault();

        this.props.onSetPlayerLogin();
        this.props.setPopup(<LoggingPlayerPopup />);

        WebUI.Call('LoginPlayer', guid);
    }

    onResetPlayerCreate(e)
    {
        if (e)
            e.preventDefault();

        this.props.onResetPlayerCreate();
    }

    onResetPlayerDelete(e)
    {
        if (e)
            e.preventDefault();

        this.props.onResetPlayerDelete();
    }

    onResetPlayerLogin(e)
    {
        if (e)
            e.preventDefault();

        this.props.onResetPlayerLogin();
    }

    onCreatePlayer(e)
    {
        if (e)
            e.preventDefault();

        this.props.onSetPlayerCreate();
        this.props.setPopup(<CreatePlayerPopup />);
    }

    componentDidMount()
    {
        this.props.enableBlur();
        this.props.disableMenu();
    }

    componentWillUnmount()
    {
        this.props.setPopup(null);
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
        onResetPlayerCreate: () => {
            dispatch({ type: ActionTypes.CHANGE_PLAYER_CREATE_STATUS, status: PlayerCreateStatus.NO_STATUS })
        },
        onResetPlayerDelete: () => {
            dispatch({ type: ActionTypes.CHANGE_PLAYER_DELETE_STATUS, status: PlayerDeleteStatus.NO_STATUS })
        },
        onResetPlayerLogin: () => {
            dispatch({ type: ActionTypes.CHANGE_PLAYER_LOGIN_STATUS, status: PlayerLoginStatus.LOGGED_OUT })
        },
        onSetPlayerCreate: () => {
            dispatch({ type: ActionTypes.CHANGE_PLAYER_CREATE_STATUS, status: PlayerCreateStatus.CREATION_INIT })
        },
        onSetPlayerDelete: () => {
            dispatch({ type: ActionTypes.CHANGE_PLAYER_DELETE_STATUS, status: PlayerDeleteStatus.DELETING })
        },
        onSetPlayerLogin: () => {
            dispatch({ type: ActionTypes.CHANGE_PLAYER_LOGIN_STATUS, status: PlayerLoginStatus.LOGGING_IN })
        },
        enableBlur: () => {
            dispatch({ type: ActionTypes.SET_BLUR, blur: true })
        },
        disableMenu: () => {
            dispatch({ type: ActionTypes.SET_MENU, menu: false })
        },
        setPopup: (popup) => {
            dispatch({ type: ActionTypes.SET_POPUP, popup: popup })
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Players);
