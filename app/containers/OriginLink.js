import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as ActionTypes from '../constants/ActionTypes'
import * as OriginLinkStatus from '../constants/OriginLinkStatus'

class OriginLink extends Component
{
    render()
    {
        let originState = 'Waiting for Origin...';
        let canRetry = false;
        let spinning = false;

        switch (this.props.user.originLinkStatus)
        {
            case OriginLinkStatus.IDLE:
                originState = 'Waiting for Origin...';
                spinning = true;
                break;

            case OriginLinkStatus.LINKING:
                originState = 'Linking Account...';
                spinning = true;
                break;

            case OriginLinkStatus.LINK_SUCCESSFUL:
                originState = 'Successfully Linked!';
                break;

            case OriginLinkStatus.CHECKING_OWNERSHIP:
                originState = 'Checking Ownership...';
                spinning = true;
                break;

            case OriginLinkStatus.LINK_FAILED:
                originState = 'Link Failed, Try later';
                canRetry = true;
                break;

            case OriginLinkStatus.PRODUCT_MISSING:
                originState = 'Your account does not own Battlefield 3';
                canRetry = true;
                break;

            case OriginLinkStatus.LINK_TAKEN:
                originState = 'This Origin Account is already linked to another account';
                canRetry = true;
                break;

            case OriginLinkStatus.LINK_UNAVAILABLE:
                originState = 'Link Service Unavailable';
                canRetry = true;
                break;

            case OriginLinkStatus.ORIGIN_ERROR:
                originState = 'An error occurred while communicating with Origin';
                canRetry = true;
                break;
        }

        let retryButton = canRetry ? <a href="#" className="btn border-btn" onClick={this.onRetry.bind(this)}>Retry</a> : null;

        return (
            <div id="origin-link-page">
                <div className="middle-container">
                    <h1>Ownership Verification</h1>
                    <p>In order to use {this.props.base.productName} we will first need to verify your game ownership through your Origin account. Please launch the Origin client on your computer and log in with your account. This is a one-time process and will link your Origin account with your Venice Unleashed account.</p>
                    <div className="status-container">
                        <img src="/assets/img/common/origin.svg" className={spinning ? 'spinning' : ''} />
                        <h2>{originState}</h2>
                        {retryButton}
                    </div>
                </div>
            </div>
        );
    }

    componentDidMount()
    {
        this.props.enableBlur();
        this.props.disableMenu();

        WebUI.Call('LinkOrigin');
    }

    componentWillUnmount()
    {
        this.props.setPopup(null);
    }

    onRetry(e)
    {
        if (e)
            e.preventDefault();

        WebUI.Call('LinkOrigin');
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
        enableBlur: () => {
            dispatch({ type: ActionTypes.SET_BLUR, blur: true })
        },
        disableMenu: () => {
            dispatch({ type: ActionTypes.SET_MENU, menu: false })
        },
        setPopup: (popup) => {
            dispatch({ type: ActionTypes.SET_POPUP, popup: popup })
        },
        onSetLogin: () => {
            dispatch({ type: ActionTypes.CHANGE_LOGIN_STATUS, status: LoginStatus.LOGGING_IN })
        }
    };
};

export default connect(
    mapStateToProps, mapDispatchToProps
)(OriginLink);
