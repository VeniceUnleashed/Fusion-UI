Element.prototype.scrollTo = function (val) {
    if (typeof val === 'object') {
        this.scrollTop = val.top || 0;
        this.scrollLeft = val.left || 0;
    } else {
        this.scrollTop = val || 0;
    }

    // Immediate repaint without setTimeout
    (this as any).style.transform = 'translateZ(0)';
    (this as any).offsetHeight; // Force layout immediately
    (this as any).style.transform = ''; // Remove immediately
    (this as any).dispatchEvent(new Event('scroll')); // Trigger scroll event
};

import clsx from 'clsx';
import React, { useEffect, useRef, useState } from 'react';
import { Virtuoso } from 'react-virtuoso';

import { ActionTypes } from '../../constants/ActionTypes';
import useBaseStore from '../../stores/useBaseStore';
import useConsoleStore from '../../stores/useConsoleStore';

const GameConsole: React.FC = () => {
    const consoleUpdater = useConsoleStore((s) => s.consoleUpdater);
    const active = useConsoleStore((s) => s.active);
    const fullExpanded = useConsoleStore((s) => s.fullExpanded);
    const suggestions = useConsoleStore((s) => s.suggestions);
    const text = useConsoleStore((s) => s.text);
    const previousCommands = useConsoleStore((s) => s.previousCommands);
    const productCode = useBaseStore((s) => s.productCode);
    const version = useBaseStore((s) => s.version);
    const build = useBaseStore((s) => s.build);

    const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState<number>(-1);
    const [previous, setPrevious] = useState<number>(-1);
    const [currentText, setCurrentText] = useState<string>('');

    const outputRef = useRef<any>(null); // TODO: Fix any
    const conRef = useRef<any>(null); // TODO: Fix any
    const textRef = useRef<any>([]);

    const scrollBottom = () => {
        setTimeout(() => {
            window.requestAnimationFrame(() => {
                outputRef.current?.scrollToIndex(textRef.current.length - 1);
            });
        }, 50);
    };

    const closeConsole = () => {
        window.DispatchAction(ActionTypes.SET_CONSOLE_ACTIVE, { active: false });
    };

    const clearSuggestions = () => {
        window.DispatchAction(ActionTypes.SET_CONSOLE_SUGGESTIONS, { suggestions: [] });
    };

    const addConsoleText = (text: string) => {
        window.DispatchAction(ActionTypes.ADD_CONSOLE_TEXT, { text });
    };

    const executeConsoleCommand = (command: string) => {
        window.DispatchAction(ActionTypes.EXECUTE_CONSOLE_COMMAND, { command });
    };

    const clearConsole = () => {
        window.DispatchAction(ActionTypes.CLEAR_CONSOLE);
    };

    const renderRow = (index: number) => {
        if (index === 0 || index - 1 >= text.length) {
            return <div className="padding-row" />;
        }

        return (
            <div
                className="console-row"
                dangerouslySetInnerHTML={{ __html: text[index - 1].text.replace('(null).', '') }}
            />
        );
    };

    const onInput = () => {
        // Reset the previous counter when we type.
        setPrevious(-1);
        window.WebUI.Call('ConSuggest', conRef.current.value);
    };

    const onKeyDown = (e: KeyboardEvent) => {
        if (!e) return;

        // Down arrow
        if (e.keyCode === 40) {
            e.preventDefault();

            if (suggestions.length === 0) {
                if (previousCommands.length === 0) return;

                // If we have no suggestions we're in "previous command mode".
                const _previous = previous;

                if (_previous >= previousCommands.length - 1) {
                    setPrevious(-1);
                } else {
                    setPrevious((p) => p + 1);
                }

                // Set the text.
                if (_previous >= 0) {
                    // Save the typed text.
                    if (_previous === -1) {
                        setCurrentText(conRef.current.value);
                    }

                    conRef.current.value = previousCommands[_previous];
                } else {
                    conRef.current.value = currentText;
                }

                setPrevious(_previous);

                return;
            }

            // Otherwise we're browsing suggestions.
            if (selectedSuggestionIndex >= suggestions.length - 1) {
                setSelectedSuggestionIndex(-1);
            } else {
                setSelectedSuggestionIndex((p) => p + 1);
            }

            return;
        }

        // Up arrow
        if (e.keyCode === 38) {
            e.preventDefault();

            if (suggestions.length === 0) {
                if (previousCommands.length === 0) return;

                // If we have no suggestions we're in "previous command mode".
                let _previous = previous;

                if (previous <= -1) _previous = previousCommands.length - 1;
                else _previous -= 1;

                // Set the text.
                if (_previous >= 0) {
                    // Save the typed text.
                    if (_previous === -1) {
                        setCurrentText(conRef.current.value);
                    }

                    conRef.current.value = previousCommands[_previous];
                } else {
                    conRef.current.value = currentText;
                }

                setPrevious(_previous);

                return;
            }

            // Otherwise we're browsing suggestions.
            if (selectedSuggestionIndex <= -1) {
                setSelectedSuggestionIndex(suggestions.length - 1);
            } else {
                setSelectedSuggestionIndex((p) => p - 1);
            }

            return;
        }

        // Enter
        if (e.keyCode === 13) {
            e.preventDefault();

            // Reset previous counter.
            setPrevious(-1);

            // If we have a suggestion selected then type it out instead of submitting.
            if (selectedSuggestionIndex >= 0) {
                conRef.current.value = `${suggestions[selectedSuggestionIndex].text} `;
                clearSuggestions();
                return;
            }

            // Otherwise submit the console command (if it's not empty).
            const submission = conRef.current.value.trim();
            if (submission.length > 0) {
                // Intercept calls to UI.DrawEnable so we can show a warning.
                const parts = submission.split(' ');

                if (parts.length > 1) {
                    const command = parts[0].toLowerCase();

                    if (command === 'ui.drawenable') {
                        // TODO: Pull this key from the game when we make it configurable.
                        const key = 'F11';

                        addConsoleText(
                            '**WARNING** `UI.DrawEnable` is not writable from the console, which will also be hidden when the UI is not drawing. You can use *' +
                                key +
                                '* to toggle the game UI.',
                        );

                        // Clear the text.
                        conRef.current.value = '';
                        clearSuggestions();

                        return;
                    }
                }

                // Handle `clear` calls.
                if (parts[0].toLowerCase() === 'clear') {
                    conRef.current.value = '';
                    clearSuggestions();
                    clearConsole();

                    return;
                }

                executeConsoleCommand(conRef.current.value);
            }

            // Clear the text.
            conRef.current.value = '';
            clearSuggestions();

            return;
        }

        // Escape
        if (e.keyCode === 27) {
            conRef.current.value = '';
            closeConsole();

            return;
        }

        // Tab
        if (e.keyCode === 9) {
            e.preventDefault();

            if (selectedSuggestionIndex >= 0) {
                conRef.current.value = `${suggestions[selectedSuggestionIndex].text} `;
                clearSuggestions();
            }

            return;
        }
    };

    useEffect(() => {
        const onResize = () => {
            scrollBottom();
        };

        window.addEventListener('resize', onResize);

        return () => {
            window.removeEventListener('resize', onResize);
        };
    }, []);

    useEffect(() => {
        if (active) {
            setSelectedSuggestionIndex(-1);

            window.WebUI.Call('EnableKeyboard');
            window.WebUI.Call('EnableMouse');

            setTimeout(() => {
                conRef.current?.focus();
            }, 50);
        } else {
            window.WebUI.Call('ResetKeyboard');
            window.WebUI.Call('ResetMouse');
        }
    }, [active]);

    useEffect(() => {
        setSelectedSuggestionIndex(-1);
    }, [suggestions]);

    useEffect(() => {
        textRef.current = text;
    }, [text]);

    useEffect(() => {
        scrollBottom();
    }, [consoleUpdater]);

    let _suggestions = null;

    if (suggestions.length > 0) {
        const suggestionList = [];

        for (let i = 0; i < suggestions.length; ++i) {
            suggestionList.push(
                <li
                    className={clsx({ active: selectedSuggestionIndex === i })}
                    key={`suggestion-${suggestions.text}-${i}`}
                    onMouseEnter={() => setSelectedSuggestionIndex(i)}
                    onClick={(e) => {
                        e.preventDefault();
                        conRef.current.value = `${suggestions[selectedSuggestionIndex].text} `;
                        clearSuggestions();
                    }}
                >
                    {suggestions[i].text} <strong>{suggestions[i].desc}</strong>
                </li>,
            );
        }

        _suggestions = <ul id="console-suggestions">{suggestionList}</ul>;
    }

    return (
        <div
            id="game-console-container"
            style={{
                display: active ? 'block' : 'none',
                visibility: active ? 'visible' : 'hidden',
                pointerEvents: active ? 'auto' : 'none',
            }}
        >
            <div id="console-input">
                <label
                    onClick={(e) => {
                        e.preventDefault();
                        conRef.current?.focus();
                    }}
                >
                    {`${productCode} ${version} [${build}] >`}
                </label>
                <div className="console-input-wrapper" onClick={() => conRef.current?.focus()}>
                    <input
                        type="text"
                        ref={conRef}
                        autoFocus
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"
                        onInput={() => onInput()}
                        onKeyDown={(e) => onKeyDown(e as any)}
                    />
                </div>
            </div>
            <div id="console-body-container">
                <Virtuoso
                    ref={outputRef}
                    totalCount={text.length + 2}
                    overscan={2}
                    item={renderRow}
                    followOutput
                    className="console-output"
                    style={{ height: fullExpanded ? '935rem' : '150rem' }}
                />
                {_suggestions}
            </div>
        </div>
    );
};

export default GameConsole;
