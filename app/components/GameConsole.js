import React, {Component} from 'react';
import {connect} from 'react-redux'

import * as ActionTypes from '../constants/ActionTypes'
import { Virtuoso } from 'react-virtuoso';

class GameConsole extends Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            suggestion: -1,
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight,
            outputHeight: 0,
        };

        this.previous = -1;
        this.currentText = '';
        this.maxTextLength = 0;
    }

    componentDidMount()
    {
        this._onResize();
        window.addEventListener('resize', this._onResize);
    }

    componentWillUnmount()
    {
        window.removeEventListener('resize', this._onResize);
    }

    _onResize = () =>
    {
        this.setState({
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight,
        });

        this.scrollBottom();
    };

    scrollBottom()
    {
        window.requestAnimationFrame(this._doScroll);
    }

    _doScroll = () =>
    {
        if (this.refs.output && this.maxTextLength > 0)
            this.refs.output.scrollToIndex(this.maxTextLength - 1);
    };

    componentDidUpdate(prevProps, prevState)
    {
        if (prevProps.console.consoleUpdater !== this.props.console.consoleUpdater)
            this.scrollBottom();

        if (prevProps.console.active !== this.props.console.active)
            setTimeout(() => this.scrollBottom(), 50);

        // Bring input to focus.
        if (this.props.console.active)
        {
            setTimeout(() =>
            {
                if (this.props.console.active)
                    this.refs.con.focus();
            }, 50);
        }
    }

    componentWillReceiveProps(nextProps)
    {
        if ((this.props.console.active && !nextProps.console.active) || (!this.props.console.active && nextProps.console.active)) {
            this.setState({
                suggestion: -1,
            });
        }

        if (this.props.console.suggestions.length !== nextProps.console.suggestions.length) {
            this.setState({
                suggestion: -1,
            });
        }

        if (!this.props.console.active && nextProps.console.active) {
            WebUI.Call('EnableKeyboard');
            WebUI.Call('EnableMouse');
        } else if (this.props.console.active && !nextProps.console.active) {
            WebUI.Call('ResetKeyboard');
            WebUI.Call('ResetMouse');
        }
    }

    render()
    {
        let suggestions = null;

        if (this.props.console.suggestions.length > 0)
        {
            let suggestionList = [];

            for (let i = 0; i < this.props.console.suggestions.length; ++i)
            {
                suggestionList.push(
                    <li className={this.state.suggestion === i ? 'active' : ''}
                        key={i}
                        onMouseEnter={this.onHoverSuggestion.bind(this, i)}
                        onClick={this.onSuggestionClick.bind(this, i)}>
                        {this.props.console.suggestions[i].text} <strong>{this.props.console.suggestions[i].desc}</strong>
                    </li>
                );
            }

            suggestions = (
                <ul id="console-suggestions">
                    {suggestionList}
                </ul>
            );
        }

        let height = '13.88888888888889vh'; // 150px

        if (this.props.console.fullExpanded) {
            height = '86.57407407407407vh'; // 935px
        }

        this.maxTextLength = this.props.console.text.length;

        const output = (
            <Virtuoso
                ref="output"
                totalCount={this.props.console.text.length + 2}
                item={this._renderRow}
                followOutput={true}
                className="console-output"
                style={{ height }}
            />
        );

        const style = {
            display: 'block',
            visibility: 'hidden',
            pointerEvents: 'none',
        };

        if (this.props.console.active) {
            style.visibility = 'visible';
            style.pointerEvents = 'auto';
        }

        return (
            <div id="game-console-container" style={style}>
                <div id="console-input">
                    <label onClick={this.onLabelClick.bind(this)}>{this.props.base.productCode} {this.props.base.version} [{this.props.base.build}] ></label>
                    <input type="text"
                           ref="con"
                           autoFocus={true}
                           autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false"
                           onInput={this.onInput.bind(this)}
                           onKeyDown={this.onKeyDown.bind(this)}
                    />
                </div>
                <div id="console-body-container">
                    {output}
                    {suggestions}
                </div>
            </div>
        );
    }

    _renderRow = (index) =>
    {
        if (index === 0 || index - 1 >= this.props.console.text.length) {
            return (
                <div className="padding-row" />
            );
        }

        return (
            <div className="console-row" dangerouslySetInnerHTML={{ __html: this.props.console.text[index - 1].text }} />
        )
    };

    onLabelClick(e)
    {
        if (e)
            e.preventDefault();

        this.refs.con.focus();
    }

    onInput(e)
    {
        // Reset the previous counter when we type.
        this.previous = -1;
        WebUI.Call('ConSuggest', this.refs.con.value);
    }

    onKeyDown(e)
    {
        if (!e)
            return;

        // Down arrow
        if (e.keyCode === 40)
        {
            e.preventDefault();

            if (this.props.console.suggestions.length === 0)
            {
                if (this.props.console.previousCommands.length === 0)
                    return;

                // If we have no suggestions we're in "previous command mode".
                let previous = this.previous;

                if (this.previous >= this.props.console.previousCommands.length - 1)
                    previous = -1;
                else
                    previous += 1;


                // Set the text.
                if (previous >= 0) {
                    // Save the typed text.
                    if (this.previous === -1) {
                        this.currentText = this.refs.con.value;
                    }

                    this.refs.con.value = this.props.console.previousCommands[previous];
                } else {
                    this.refs.con.value = this.currentText;
                }

                this.previous = previous;

                return;
            }

            // Otherwise we're browsing suggestions.
            if (this.state.suggestion >= this.props.console.suggestions.length - 1)
                this.setState({ suggestion: -1 });
            else
                this.setState({ suggestion: this.state.suggestion + 1 });

            return;
        }

        // Up arrow
        if (e.keyCode === 38)
        {
            e.preventDefault();

            if (this.props.console.suggestions.length === 0)
            {
                if (this.props.console.previousCommands.length === 0)
                    return;

                // If we have no suggestions we're in "previous command mode".
                let previous = this.previous;

                if (this.previous <= -1 )
                    previous = this.props.console.previousCommands.length - 1;
                else
                    previous -= 1;

                // Set the text.
                if (previous >= 0) {
                    // Save the typed text.
                    if (this.previous === -1) {
                        this.currentText = this.refs.con.value;
                    }

                    this.refs.con.value = this.props.console.previousCommands[previous];
                } else {
                    this.refs.con.value = this.currentText;
                }

                this.previous = previous;

                return;
            }

            // Otherwise we're browsing suggestions.
            if (this.state.suggestion <= -1 )
                this.setState({ suggestion: this.props.console.suggestions.length - 1 });
            else
                this.setState({ suggestion: this.state.suggestion - 1 });

            return;
        }

        // Enter
        if (e.keyCode === 13)
        {
            e.preventDefault();

            // Reset previous counter.
            this.previous = -1;

            // If we have a suggestion selected then type it out instead of submitting.
            if (this.state.suggestion >= 0) {
                this.refs.con.value = this.props.console.suggestions[this.state.suggestion].text + ' ';
                this.props.clearSuggestions();

                return;
            }

            // Otherwise submit the console command (if it's not empty).
            if (this.refs.con.value.trim().length > 0) {
                // Intercept calls to UI.DrawEnable so we can show a warning.
                const submission = this.refs.con.value.trim();
                const parts = submission.split(' ');

                if (parts.length > 1) {
                    const command = parts[0].toLowerCase();

                    if (command === 'ui.drawenable') {
                        // TODO: Pull this key from the game when we make it configurable.
                        const key = 'F11';

                        this.props.addConsoleText('**WARNING** `UI.DrawEnable` is not writable from the console, which will also be hidden when the UI is not drawing. You can use *' + key + '* to toggle the game UI.');

                        // Clear the text.
                        this.refs.con.value = '';
                        this.props.clearSuggestions();

                        return;
                    }
                }

                // Handle `clear` calls.
                if (parts[0].toLowerCase() === 'clear') {
                    this.refs.con.value = '';
                    this.props.clearSuggestions();
                    this.props.clearConsole();

                    return;
                }

                this.props.executeConsoleCommand(this.refs.con.value);
            }

            // Clear the text.
            this.refs.con.value = '';
            this.props.clearSuggestions();

            return;
        }

        // Escape
        if (e.keyCode === 27)
        {
            this.refs.con.value = '';
            this.props.closeConsole();

            return;
        }

        // Tab
        if (e.keyCode === 9)
        {
            e.preventDefault();

            if (this.state.suggestion >= 0) {
                this.refs.con.value = this.props.console.suggestions[this.state.suggestion].text + ' ';
                this.props.clearSuggestions();
            }

            return;
        }
    }

    onHoverSuggestion(i)
    {
        this.setState({ suggestion: i });
    }

    onSuggestionClick(i, e)
    {
        if (e)
            e.preventDefault();

        this.refs.con.value = this.props.console.suggestions[this.state.suggestion].text + ' ';
        this.props.clearSuggestions();
    }
}

const mapStateToProps = (state) => {
    return {
        base: state.base,
        console: state.console
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        closeConsole: () => {
            dispatch({ type: ActionTypes.SET_CONSOLE_ACTIVE })
        },
        clearSuggestions: () => {
            dispatch({ type: ActionTypes.SET_CONSOLE_SUGGESTIONS, suggestions: [] })
        },
        addConsoleText: (text) => {
            dispatch({ type: ActionTypes.ADD_CONSOLE_TEXT, text })
        },
        executeConsoleCommand: (command) => {
            dispatch({ type: ActionTypes.EXECUTE_CONSOLE_COMMAND, command });
        },
        clearConsole: () => {
            dispatch({ type: ActionTypes.CLEAR_CONSOLE });
        },
    };
};

export default connect(
    mapStateToProps, mapDispatchToProps
)(GameConsole);
