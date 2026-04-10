import { create } from 'zustand';

import { ActionTypes } from '../constants/ActionTypes';

const MAX_CONSOLE_LINES = 1000;
const MAX_PREVIOUS_COMMANDS = 50;

export interface TextSegment {
    t: string;
    b: boolean;
    i: boolean;
    u: boolean;
}

export interface ConsoleTextRow {
    segments: TextSegment[];
    length: number;
}

function parseLine(raw: string): ConsoleTextRow {
    let bold = false;
    let italic = false;
    let underline = false;
    let cur = '';
    let length = 0;
    const segments: TextSegment[] = [];

    const flush = () => {
        if (cur.length > 0) {
            segments.push({ t: cur, b: bold, i: italic, u: underline });
            length += cur.length;
            cur = '';
        }
    };

    for (let i = 0; i < raw.length; i++) {
        const ch = raw[i];

        if (ch === '`') {
            flush();
            underline = !underline;
        } else if (ch === '*') {
            if (raw[i + 1] === '*') {
                flush();
                bold = !bold;
                i++;
            } else {
                flush();
                italic = !italic;
            }
        } else {
            cur += ch;
            length++;
        }
    }

    flush();

    return { segments, length };
}

interface State {
    text: ConsoleTextRow[];
    active: boolean;
    fullExpanded: boolean;
    suggestions: any;
    previousCommands: any;
    actions: { [key: number]: (action: any) => void };
}

const useConsoleStore = create<State>((set) => ({
    text: [],
    active: false,
    fullExpanded: false,
    suggestions: [],
    previousCommands: [],
    actions: {
        [ActionTypes.TOGGLE_CONSOLE_ACTIVE]: () => {
            set((state: any) => {
                if (!state.active) {
                    return { suggestions: [], active: true, fullExpanded: false };
                }
                if (state.fullExpanded) {
                    return { suggestions: [], active: false };
                }
                return { fullExpanded: true };
            });
        },
        [ActionTypes.SET_CONSOLE_ACTIVE]: (action: any) => {
            set({ suggestions: [], active: action.active });
        },
        [ActionTypes.ADD_CONSOLE_TEXT]: (action: any) => {
            set((state: any) => {
                let input = action.text.trim().replace('(null).', '');

                if (input.startsWith('Unknown console command "')) {
                    const lastQuote = input.lastIndexOf('"');
                    const command = input.substring(25, lastQuote === -1 ? input.length : lastQuote);
                    input = `**WARNING** Unknown console command \`${command}\`. You can use *list* to list all available commands.`;
                }

                const newRows: ConsoleTextRow[] = input.split(/\r?\n/).map(parseLine);

                const combined = state.text.concat(newRows);
                const trimmed =
                    combined.length > MAX_CONSOLE_LINES
                        ? combined.slice(combined.length - MAX_CONSOLE_LINES)
                        : combined;

                return { text: trimmed };
            });
        },
        [ActionTypes.SET_CONSOLE_SUGGESTIONS]: (action: any) => {
            set((state: any) => {
                if (!state.active) return {};
                return { suggestions: action.suggestions.slice(0, 10) };
            });
        },
        [ActionTypes.EXECUTE_CONSOLE_COMMAND]: (action: any) => {
            set((state: any) => {
                if (action.command.trim().length === 0) return {};

                window.WebUI.Call('ConCommand', action.command);

                const next = [...state.previousCommands, action.command];
                return {
                    previousCommands:
                        next.length > MAX_PREVIOUS_COMMANDS
                            ? next.slice(next.length - MAX_PREVIOUS_COMMANDS)
                            : next,
                };
            });
        },
        [ActionTypes.CLEAR_CONSOLE]: () => {
            set({ text: [] });
        },
    },
}));

export default useConsoleStore;
