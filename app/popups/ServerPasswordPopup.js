import React, { Component } from 'react';
import { connect } from 'react-redux'
import * as ActionTypes from '../constants/ActionTypes'

class ServerPasswordPopup extends Component
{
    render()
    {
        return (
            <div className="center-notice">
                <div className="notice-content">
                    <h1>Enter Server Password</h1>
                    <form onSubmit={this.onSubmit.bind(this)}>
                        <label htmlFor="password">Server Password</label><br/>
                        <input type="password" name="password" ref="password" id="password" />
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
