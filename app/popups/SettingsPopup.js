import React, { Component } from 'react';
import { connect } from 'react-redux'
import * as ActionTypes from '../constants/ActionTypes'
import * as ServerConnectStatus from '../constants/ServerConnectStatus'
import LoadingIndicator from "../components/LoadingIndicator";
import Settings from "../containers/Settings";

class SettingsPopup extends Component
{
    render()
    {
        return (
            <div id="settings-popup">
                <Settings popup />
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
        servers: state.servers,
        error: state.base.error,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        closePopup: () => {
            dispatch({ type: ActionTypes.SET_ERROR, error: null });
            dispatch({ type: ActionTypes.SET_POPUP, popup: null });
        },
    };
};

export default connect(
    mapStateToProps, mapDispatchToProps
)(SettingsPopup);
