import React, { Component } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default class ProgressIndicator extends Component
{
    render()
    {
        let percentage = Math.round(this.props.percentage);

        let pathStroke = '#fff';

        if (this.props.completed)
            pathStroke = 'rgba(176, 255, 136, 0.82)';

        if (this.props.error)
            pathStroke = 'rgb(255, 95, 95)';

        return (
            <div className="progress-indicator">
                <CircularProgressbar
                    value={percentage}
                    strokeWidth={13}
                    styles={{
                        path: {
                            stroke: pathStroke,
                            strokeLinecap: 'butt'
                        },
                        trail: {
                            stroke: 'rgba(255, 255, 255, 0.2)'
                        }
                    }}
                />
            </div>
        );
    }
}
