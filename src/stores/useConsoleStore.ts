import { create } from 'zustand';

import { ActionTypes } from '../constants/ActionTypes';
interface State {
    text: Array<{ text: string; length: number }>;
    active: boolean;
    fullExpanded: boolean;
    suggestions: any;
    previousCommands: any;
    consoleUpdater: number;
    //
    actions: { [key: number]: (action: any) => void };
}

const CONSOLE_TEXT_LIMIT = 1_000;

const useConsoleStore = create<State>((set) => ({
    text: [],
    active: false,
    fullExpanded: false,
    suggestions: [],
    previousCommands: [],
    consoleUpdater: 0,
    //
    actions: {
        [ActionTypes.TOGGLE_CONSOLE_ACTIVE]: () => {
            set((state) => {
                if (!state.active) {
                    return {
                        suggestions: [],
                        active: true,
                        fullExpanded: false,
                        consoleUpdater: Math.random(),
                    };
                }

                if (state.fullExpanded) {
                    return {
                        suggestions: [],
                        active: false,
                    };
                }

                return {
                    fullExpanded: true,
                    consoleUpdater: Math.random(),
                };
            });
        },
        [ActionTypes.SET_CONSOLE_ACTIVE]: (action: any) => {
            set({
                suggestions: [],
                active: action.active,
                consoleUpdater: Math.random(),
            });
        },
        [ActionTypes.ADD_CONSOLE_TEXT]: (action: any) => {
            set((state) => {
                let text = action.text.trim();
                const finalStateText = state.text.splice(-CONSOLE_TEXT_LIMIT + 1);

                if (text.startsWith('Unknown console command "')) {
                    let lastIndex = text.lastIndexOf('"');

                    if (lastIndex === -1) {
                        lastIndex = text.length;
                    }

                    const command = text.substring(25, lastIndex);

                    text = `**WARNING**  Unknown console command \`${command}\`. You can use *list*  to list all available commands.`;
                }

                // Escape HTML characters.
                text = text
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;')
                    .replace(/'/g, '&#039;');

                // Do formatting.
                let openBold = false;
                let openItalics = false;
                let openUnderline = false;
                let openEscapedChar = false;

                let currentLineLength = 0;
                let currentLine = '';

                for (let i = 0; i < text.length; ++i) {
                    const char = text[i];
                    let nextChar = null;

                    if (i < text.length - 1) {
                        nextChar = text[i + 1];
                    }

                    if (char === '`') {
                        if (openUnderline) {
                            currentLine += '</u>';
                        } else {
                            currentLine += '<u>';
                        }

                        openUnderline = !openUnderline;
                    } else if (char === '*') {
                        if (nextChar === '*') {
                            if (openBold) {
                                currentLine += '</strong>';
                            } else {
                                currentLine += '<strong>';
                            }

                            openBold = !openBold;
                            ++i;
                        } else {
                            if (openItalics) {
                                currentLine += '</em>';
                            } else {
                                currentLine += '<em>';
                            }

                            openItalics = !openItalics;
                        }
                    } else if (char === '\r' || char === '\n') {
                        if (char === '\r' && nextChar === '\n') {
                            ++i;
                        }

                        if (openBold) {
                            currentLine += '</strong>';
                        }

                        if (openUnderline) {
                            currentLine += '</u>';
                        }

                        if (openItalics) {
                            currentLine += '</em>';
                        }

                        finalStateText.push({ text: currentLine, length: currentLineLength });

                        currentLine = '';
                        currentLineLength = 0;

                        if (openBold) {
                            currentLine += '<strong>';
                        }

                        if (openUnderline) {
                            currentLine += '<u>';
                        }

                        if (openItalics) {
                            currentLine += '<em>';
                        }
                    } else if (char === '&') {
                        if (openEscapedChar) {
                            currentLine += char;
                            ++currentLineLength;
                        } else {
                            currentLine += char;
                            openEscapedChar = true;
                        }
                    } else if (char === ';') {
                        if (openEscapedChar) {
                            currentLine += char;
                            ++currentLineLength;
                            openEscapedChar = false;
                        } else {
                            currentLine += char;
                            ++currentLineLength;
                        }
                    } else {
                        currentLine += char;

                        if (!openEscapedChar) {
                            ++currentLineLength;
                        }
                    }
                }

                if (openBold) {
                    currentLine += '</strong>';
                }

                if (openItalics) {
                    currentLine += '</em>';
                }

                if (openUnderline) {
                    currentLine += '</u>';
                }

                finalStateText.push({ text: currentLine, length: currentLineLength });

                return {
                    text: finalStateText,
                    consoleUpdater: Math.random(),
                };
            });
        },
        [ActionTypes.SET_CONSOLE_SUGGESTIONS]: (action: any) => {
            set((state) => {
                if (!state.active) {
                    return {};
                }

                return {
                    suggestions: action.suggestions.slice(0, 10),
                };
            });
        },
        [ActionTypes.EXECUTE_CONSOLE_COMMAND]: (action: any) => {
            set((state) => {
                if (action.command.trim().length === 0) {
                    return {};
                }

                window.WebUI.Call('ConCommand', action.command);

                return {
                    previousCommands: [...state.previousCommands, action.command],
                };
            });
        },
        [ActionTypes.CLEAR_CONSOLE]: () => {
            set(() => ({
                text: [],
                consoleUpdater: Math.random(),
            }));
        },
    },
}));
export default useConsoleStore;
