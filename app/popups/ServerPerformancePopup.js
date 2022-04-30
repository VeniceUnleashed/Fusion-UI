import React, { Component } from 'react';
import { connect } from 'react-redux'
import * as ActionTypes from '../constants/ActionTypes'
import ServerPasswordPopup from "./ServerPasswordPopup";

class ServerPerformancePopup extends Component
{
    render()
    {
        return (
            <div className="center-notice">
                <div className="notice-content">
                    <h1>Server Performance Warning</h1>
                    <p>The server you are trying to join is experiencing performance issues.</p>
                    <p>This means that you could experience lag, inconsistent hitreg, rubberbanding, etc.</p>
                    <a href="#" className="btn border-btn" onClick={this.onClosePopup.bind(this)}>Cancel</a>
                    <a href="#" className="btn border-btn primary" onClick={this.onJoin.bind(this)}>Join anyway</a>
                </div>
            </div>
        );
    }

    onClosePopup(e)
    {
        if (e)
            e.preventDefault();

        this.props.closePopup();
    }

    onJoin(e)
    {
        if (e)
            e.preventDefault();

        this.props.closePopup();

        if (this.props.server.passworded)
        {
            this.props.setPopup(<ServerPasswordPopup server={this.props.server} onJoin={this.props.onJoin} />);
            return;
        }

        if (this.props.onJoin)
            this.props.onJoin(this.props.server.guid);
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
)(ServerPerformancePopup);
