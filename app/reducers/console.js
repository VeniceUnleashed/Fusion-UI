import {
    TOGGLE_CONSOLE_ACTIVE,
    ADD_CONSOLE_TEXT,
    SET_CONSOLE_SUGGESTIONS,
    SET_CONSOLE_ACTIVE,
    EXECUTE_CONSOLE_COMMAND, CLEAR_CONSOLE,
} from '../constants/ActionTypes'

const initialState = {
    text: [],
    active: false,
    fullExpanded: false,
    suggestions: [],
    previousCommands: [],
    consoleUpdater: { update: true },
};

function createStateCopy(state)
{
    return {
        ...state,
    };
}

export default function console(state = initialState, action)
{
    switch (action.type)
    {
        case TOGGLE_CONSOLE_ACTIVE:
        {
            let finalState = createStateCopy(state);

            if (!finalState.active)
            {
                finalState.suggestions = [];
                finalState.active = true;
                finalState.fullExpanded = false;
            }
            else
            {
                if (finalState.fullExpanded)
                {
                    finalState.suggestions = [];
                    finalState.active = false;
                }
                else
                {
                    finalState.fullExpanded = true;
                }
            }

            return finalState;
        }

        case SET_CONSOLE_ACTIVE:
        {
            let finalState = createStateCopy(state);

            finalState.suggestions = [];
            finalState.active = action.active;

            return finalState;
        }

        case ADD_CONSOLE_TEXT:
        {
            let finalState = createStateCopy(state);

            let text = action.text.trim();

            if (text.startsWith('Unknown console command "')) {
                let lastIndex = text.lastIndexOf('"');

                if (lastIndex === -1) {
                    lastIndex = text.length;
                }

                const command = text.substring(25, lastIndex);

                text = "**WARNING** Unknown console command `" + command + "`. You can use *list* to list all available commands.";
            }

            // Escape HTML characters.
            text = text
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");

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
                        currentLine += '<u>'
                    }

                    openUnderline = !openUnderline;
                } else if (char === '*') {
                    if (nextChar === '*') {
                        if (openBold) {
                            currentLine += '</strong>';
                        } else {
                            currentLine += '<strong>'
                        }

                        openBold = !openBold;
                        ++i;
                    } else {
                        if (openItalics) {
                            currentLine += '</em>';
                        } else {
                            currentLine += '<em>'
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

                    finalState.text.push({ text: currentLine, length: currentLineLength });

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

            finalState.text.push({ text: currentLine, length: currentLineLength });

            /*if (finalState.text.length > 100)
                finalState.text.splice(0, finalState.text.length - 100);*/

            finalState.consoleUpdater = { ...finalState.consoleUpdater };

            /*let previousLines = [ ...finalState.text ];

            if (previousLines.length > 1000)
                previousLines.splice(0, previousLines.length - 1000);*/

            /*finalState.text = [
                ...finalState.text,
                ...newLines
            ];*/

            return finalState;
        }

        case SET_CONSOLE_SUGGESTIONS:
        {
            if (!state.active)
                return state;

            let finalState = createStateCopy(state);

            // 10 suggestions max.
            finalState.suggestions = action.suggestions.slice(0, 10);

            return finalState;
        }

        case EXECUTE_CONSOLE_COMMAND:
        {
            if (action.command.trim().length === 0)
                return state;

            let finalState = createStateCopy(state);

            // Execute the command.
            WebUI.Call('ConCommand', action.command);

            // Add to previous commands.
            finalState.previousCommands = [
                ...finalState.previousCommands,
                action.command,
            ];

            return finalState;
        }

        case CLEAR_CONSOLE:
        {
            let finalState = createStateCopy(state);

            finalState.text = [];
            finalState.consoleUpdater = { ...finalState.consoleUpdater };

            return finalState;
        }

        default:
            return state;
    }
}
