import React, { Component } from 'react';

export default class SoldierEntry extends Component
{
    onFilteredClick(cb, e)
    {
        if (e)
            e.stopPropagation();

        if (cb)
            cb(e);
    }

    _onMainClick = (e) =>
    {
        if (e)
            e.preventDefault();

        if (this.props.actions.length > 0)
            this.props.actions[0].callback(e);
    };

    render()
    {
        let actions = [];

        if (this.props.actions && this.props.actions.length > 0)
        {
            for (let i = 0; i < this.props.actions.length; ++i)
            {
                let action = this.props.actions[i];
                actions.push(<a key={i} href="#" onClick={this.onFilteredClick.bind(this, action.callback)}><i className="material-icons">{action.icon}</i></a>);
            }
        }

        let name = null;

        if (this.props.name && this.props.name.length > 0)
            name = <h1>{this.props.name}</h1>;

        let className = 'soldier-entry';

        if (this.props.className && this.props.className.length > 0)
            className += ' ' + this.props.className;

        let deleteButton = null;

        if (this.props.deleteCallback)
            deleteButton = <a href="#" onClick={this.onFilteredClick.bind(this, this.props.deleteCallback)}><i className="material-icons">delete</i></a>;

        return (
            <div className={className} onClick={this._onMainClick}>
                <div className="actions">
                    {actions}
                </div>
                <div className="bottom-content">
                    <h2>{this.props.title}</h2>
                    {name}
                    {deleteButton}
                </div>
            </div>
        );
    }
}