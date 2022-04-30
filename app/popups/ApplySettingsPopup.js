import React, { Component } from 'react';
import { connect } from 'react-redux'
import * as ActionTypes from '../constants/ActionTypes'

class ApplySettingsPopup extends Component
{
    constructor(props)
    {
        super(props);

        this.timer = null;
        this.state = {
            timeRemaining: 15,
        };
    }

    render()
    {
        let seconds = this.state.timeRemaining;

        if (seconds < 0)
            seconds = 0;

        let remainingTime = seconds.toString() + ' second';

        if (seconds === 0 || seconds > 1)
            remainingTime += 's';

        return (
            <div className="center-notice">
                <div className="notice-content">
                    <h1>Keep these settings?</h1>
                    <p>Are you sure you want to keep these settings? Reverting to previous settings in {remainingTime}.</p>
                    <a href="#" className="btn border-btn" onClick={this._onRevertSettings}>Revert</a>
                    <a href="#" className="btn border-btn primary" onClick={this._onKeepSettings}>Keep settings</a>
                </div>
            </div>
        );
    }

    _onKeepSettings = (e) =>
    {
        if (e)
            e.preventDefault();

        if (this.timer !== null)
        {
            clearTimeout(this.timer);
            this.timer = null;
        }

        // Persist settings.
        this.props.setSettings(this.props.settings.currentSettings);
        this.props.closePopup();
    };

    _onRevertSettings = (e) =>
    {
        if (e)
            e.preventDefault();

        if (this.timer !== null)
        {
            clearTimeout(this.timer);
            this.timer = null;
        }

        // Revert settings to their previous state.
        WebUI.Call('ApplySettings', this.props.settings.gameSettings);
        this.props.setSettings(this.props.settings.gameSettings);

        this.props.closePopup();
    };

    _tickDown = () =>
    {
        if (this.state.timeRemaining <= 1)
        {
            this.timer = null;
            this._onRevertSettings();
            return;
        }

        this.setState({
            timeRemaining: this.state.timeRemaining - 1,
        });

        this.timer = setTimeout(this._tickDown, 1000);
    };

    componentDidMount()
    {
        document.activeElement.blur();

        this.timer = setTimeout(this._tickDown, 1000);
    }

    componentWillUnmount()
    {
        if (this.timer !== null)
        {
            clearTimeout(this.timer);
            this.timer = null;
        }
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user,
        settings: state.settings,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        closePopup: () => {
            dispatch({ type: ActionTypes.SET_POPUP, popup: null })
        },
        setSettings: (settings) => {
            dispatch({ type: ActionTypes.SET_SETTINGS, settings,  });
        }
    };
};

export default connect(
    mapStateToProps, mapDispatchToProps
)(ApplySettingsPopup);
