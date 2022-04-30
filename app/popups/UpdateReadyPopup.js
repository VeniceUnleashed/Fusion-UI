import React, { Component } from 'react';
import { connect } from 'react-redux'
import * as ActionTypes from '../constants/ActionTypes'

class UpdateReadyPopup extends Component
{
    render()
    {
        return (
            <div className="center-notice">
                <div className="notice-content">
                    <h1>Update Ready</h1>
                    <p>An update has been downloaded and will be automatically applied the next time you launch VU.</p>
                    <a href="#" className="btn border-btn" onClick={this.onClosePopup.bind(this)}>Close</a>
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
)(UpdateReadyPopup);
