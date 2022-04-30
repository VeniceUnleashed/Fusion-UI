import React, { Component } from 'react';
import LoadingIndicator from "./LoadingIndicator";
import ProgressIndicator from "./ProgressIndicator";
import {connect} from "react-redux";
import * as UpdateState from '../constants/UpdateState'
import * as UpdateError from '../constants/UpdateError'

class UpdateIndicator extends Component
{
    render()
    {
        switch (this.props.update.state)
        {
            case UpdateState.IDLE:
            {
                if (this.props.update.error !== UpdateError.NONE)
                    return this.renderError();

                return this.renderEmpty();
            }

            case UpdateState.CHECKING_FOR_UPDATES:
            case UpdateState.DOWNLOADING_FILE_LIST:
                return this.renderChecking();

            case UpdateState.UPDATING:
                return this.renderUpdating();

            case UpdateState.DONE_UPDATING:
                return this.renderUpdated();

            default:
                return this.renderEmpty();
        }
    }

    renderEmpty()
    {
        return <div/>;
    }

    renderChecking()
    {
        return (
            <div className="update-indicator">
                <div className="update-indicator-container">
                    <span>Starting Update</span>
                    <LoadingIndicator/>
                </div>
            </div>
        );
    }

    renderUpdating()
    {
        const percentage = Math.round(this.props.update.percentage * 100.0);

        if (percentage >= 99.9)
        {
            return (
                <div className="update-indicator">
                    <div className="update-indicator-container">
                        <span>Finishing Update</span>
                        <ProgressIndicator percentage={100} />
                    </div>
                </div>
            );
        }

        return (
            <div className="update-indicator">
                <div className="update-indicator-container">
                    <span>Updating {percentage}%</span>
                    <ProgressIndicator percentage={this.props.update.percentage * 100.0} />
                </div>
            </div>
        );
    }

    renderUpdated()
    {
        return (
            <div className="update-indicator updated">
                <div className="update-indicator-container">
                    <span>Update Ready</span>
                    <ProgressIndicator percentage={100} completed={true} />
                </div>
            </div>
        );
    }

    renderError()
    {
        let errorText = 'Update Error';

        switch (this.props.update.error)
        {
            case UpdateError.ACCESS_ERROR:
                errorText = 'Access Error';
                break;

            case UpdateError.DECOMPRESSION_ERROR:
            case UpdateError.DOWNLOAD_ERROR:
                errorText = 'Download Failed';
                break;
        }

        return (
            <div className="update-indicator error">
                <div className="update-indicator-container">
                    <span>{errorText}</span>
                    <ProgressIndicator percentage={100} error={true} />
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        update: state.update,
    };
};

export default connect(mapStateToProps)(UpdateIndicator);
