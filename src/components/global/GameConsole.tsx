import clsx from 'clsx';
import React, { useEffect, useRef, useState } from 'react';

import { ActionTypes } from '../../constants/ActionTypes';
import useBaseStore from '../../stores/useBaseStore';
import useConsoleStore, { type ConsoleTextRow } from '../../stores/useConsoleStore';

const VISIBLE_ROWS = 60;
const MAX_SEGMENTS_PER_ROW = 6;
const ROW_HEIGHT = 19;
const PADDING_ROW_HEIGHT = 14;

interface PoolRow {
    div: HTMLDivElement;
    spans: HTMLSpanElement[];
    textNodes: Text[];
}

function renderPoolSlice(
    pool: PoolRow[],
    text: ConsoleTextRow[],
    firstIndex: number
): void {
    for (let r = 0; r < pool.length; r++) {
        const row = text[firstIndex + r] ?? null;
        const { spans, textNodes } = pool[r];

        for (let s = 0; s < MAX_SEGMENTS_PER_ROW; s++) {
            const seg = row && s < row.segments.length ? row.segments[s] : null;

            if (seg) {
                let segText = seg.t;
                if (segText.charCodeAt(0) === 32) {
                    let i = 0;
                    while (i < segText.length && segText.charCodeAt(i) === 32) i++;
                    segText = '\u00A0'.repeat(i) + segText.slice(i);
                }
                if (textNodes[s].nodeValue !== segText) textNodes[s].nodeValue = segText;

                let cls = '';
                if (seg.b) cls = 'b';
                if (seg.i) cls = cls ? cls + ' i' : 'i';
                if (seg.u) cls = cls ? cls + ' u' : 'u';
                if (spans[s].className !== cls) spans[s].className = cls;
                if (spans[s].style.display !== '') spans[s].style.display = '';
            } else {
                if (textNodes[s].nodeValue !== '') textNodes[s].nodeValue = '';
                if (spans[s].style.display !== 'none') spans[s].style.display = 'none';
            }
        }
    }
}

function clearPool(pool: PoolRow[]): void {
    for (let r = 0; r < pool.length; r++) {
        for (let s = 0; s < MAX_SEGMENTS_PER_ROW; s++) {
            if (pool[r].textNodes[s].nodeValue !== '') pool[r].textNodes[s].nodeValue = '';
            if (pool[r].spans[s].style.display !== 'none') pool[r].spans[s].style.display = 'none';
        }
    }
}

function updateSpacers(
    topSpacer: HTMLDivElement,
    bottomSpacer: HTMLDivElement,
    totalRows: number,
    firstIndex: number
): void {
    const above = firstIndex * ROW_HEIGHT;
    const below = Math.max(0, totalRows - firstIndex - VISIBLE_ROWS) * ROW_HEIGHT;
    const aboveStr = above + 'px';
    const belowStr = below + 'px';
    if (topSpacer.style.height !== aboveStr) topSpacer.style.height = aboveStr;
    if (bottomSpacer.style.height !== belowStr) bottomSpacer.style.height = belowStr;
}

const GameConsole: React.FC = () => {
    const active = useConsoleStore((s) => s.active);
    const fullExpanded = useConsoleStore((s) => s.fullExpanded);
    const suggestions = useConsoleStore((s) => s.suggestions);
    const previousCommands = useConsoleStore((s) => s.previousCommands);
    const productCode = useBaseStore((s) => s.productCode);
    const version = useBaseStore((s) => s.version);
    const build = useBaseStore((s) => s.build);

    const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState<number>(-1);
    const [previous, setPrevious] = useState<number>(-1);
    const [currentText, setCurrentText] = useState<string>('');

    const conRef = useRef<any>(null);
    const outputRef = useRef<HTMLDivElement>(null);
    const rowPoolRef = useRef<PoolRow[]>([]);
    const topSpacerRef = useRef<HTMLDivElement | null>(null);
    const bottomSpacerRef = useRef<HTMLDivElement | null>(null);
    const firstIndexRef = useRef(0);
    const pinnedRef = useRef(true);
    const activeRef = useRef(false);

    useEffect(() => {
        const container = outputRef.current;
        if (!container) return;

        const topSpacer = document.createElement('div');
        container.appendChild(topSpacer);
        topSpacerRef.current = topSpacer;

        const pool: PoolRow[] = [];
        for (let r = 0; r < VISIBLE_ROWS; r++) {
            const div = document.createElement('div');
            div.className = 'console-row';

            const spans: HTMLSpanElement[] = [];
            const textNodes: Text[] = [];

            for (let s = 0; s < MAX_SEGMENTS_PER_ROW; s++) {
                const span = document.createElement('span');
                const tn = document.createTextNode('');
                span.appendChild(tn);
                span.style.display = 'none';
                div.appendChild(span);
                spans.push(span);
                textNodes.push(tn);
            }

            container.appendChild(div);
            pool.push({ div, spans, textNodes });
        }
        rowPoolRef.current = pool;

        const bottomSpacer = document.createElement('div');
        container.appendChild(bottomSpacer);
        bottomSpacerRef.current = bottomSpacer;

        return () => {
            for (const row of pool) {
                for (let s = 0; s < row.textNodes.length; s++) row.textNodes[s].nodeValue = '';
                row.div.parentNode?.removeChild(row.div);
            }
            topSpacer.parentNode?.removeChild(topSpacer);
            bottomSpacer.parentNode?.removeChild(bottomSpacer);
            rowPoolRef.current = [];
            topSpacerRef.current = null;
            bottomSpacerRef.current = null;
        };
    }, []);

    const scrollToBottom = (text: ConsoleTextRow[]) => {
        const container = outputRef.current;
        if (!container) return;
        const firstIndex = Math.max(0, text.length - VISIBLE_ROWS);
        firstIndexRef.current = firstIndex;
        renderPoolSlice(rowPoolRef.current, text, firstIndex);
        updateSpacers(topSpacerRef.current!, bottomSpacerRef.current!, text.length, firstIndex);
        container.scrollTop = PADDING_ROW_HEIGHT + text.length * ROW_HEIGHT;
    };

    useEffect(() => {
        const container = outputRef.current;
        if (!container) return;

        const onScroll = () => {
            const text = useConsoleStore.getState().text;
            const rawFirst = Math.floor(
                Math.max(0, container.scrollTop - PADDING_ROW_HEIGHT) / ROW_HEIGHT
            );
            const firstIndex = Math.min(rawFirst, Math.max(0, text.length - VISIBLE_ROWS));
            firstIndexRef.current = firstIndex;

            const maxScroll = container.scrollHeight - container.clientHeight;
            pinnedRef.current = maxScroll <= 0 || container.scrollTop >= maxScroll - 5;

            renderPoolSlice(rowPoolRef.current, text, firstIndex);
            updateSpacers(topSpacerRef.current!, bottomSpacerRef.current!, text.length, firstIndex);
        };

        container.addEventListener('scroll', onScroll);
        return () => container.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        return useConsoleStore.subscribe((state, prev) => {
            if (state.text === prev.text) return;
            if (!activeRef.current) return;

            const text = state.text;
            if (pinnedRef.current) {
                scrollToBottom(text);
            } else {
                const firstIndex = Math.min(firstIndexRef.current, Math.max(0, text.length - VISIBLE_ROWS));
                firstIndexRef.current = firstIndex;
                renderPoolSlice(rowPoolRef.current, text, firstIndex);
                updateSpacers(topSpacerRef.current!, bottomSpacerRef.current!, text.length, firstIndex);
            }
        });
    }, []);

    useEffect(() => {
        activeRef.current = active;
        if (active) {
            setSelectedSuggestionIndex(-1);
            pinnedRef.current = true;
            scrollToBottom(useConsoleStore.getState().text);
            window.WebUI.Call('EnableKeyboard');
            window.WebUI.Call('EnableMouse');
            setTimeout(() => conRef.current?.focus(), 50);
        } else {
            clearPool(rowPoolRef.current);
            window.WebUI.Call('ResetKeyboard');
            window.WebUI.Call('ResetMouse');
        }
    }, [active]);

    useEffect(() => {
        if (!activeRef.current) return;
        const text = useConsoleStore.getState().text;
        if (pinnedRef.current) {
            scrollToBottom(text);
        } else {
            const container = outputRef.current;
            if (!container) return;
            const rawFirst = Math.floor(
                Math.max(0, container.scrollTop - PADDING_ROW_HEIGHT) / ROW_HEIGHT
            );
            const firstIndex = Math.min(rawFirst, Math.max(0, text.length - VISIBLE_ROWS));
            firstIndexRef.current = firstIndex;
            renderPoolSlice(rowPoolRef.current, text, firstIndex);
            updateSpacers(topSpacerRef.current!, bottomSpacerRef.current!, text.length, firstIndex);
        }
    }, [fullExpanded]);

    useEffect(() => {
        setSelectedSuggestionIndex(-1);
    }, [suggestions]);

    const closeConsole = () => {
        window.DispatchAction(ActionTypes.SET_CONSOLE_ACTIVE, { active: false });
    };

    const clearSuggestions = () => {
        window.DispatchAction(ActionTypes.SET_CONSOLE_SUGGESTIONS, { suggestions: [] });
    };

    const addConsoleText = (t: string) => {
        window.DispatchAction(ActionTypes.ADD_CONSOLE_TEXT, { text: t });
    };

    const executeConsoleCommand = (command: string) => {
        window.DispatchAction(ActionTypes.EXECUTE_CONSOLE_COMMAND, { command });
    };

    const clearConsole = () => {
        window.DispatchAction(ActionTypes.CLEAR_CONSOLE);
    };

    const onInput = () => {
        setPrevious(-1);
        window.WebUI.Call('ConSuggest', conRef.current.value);
    };

    const onKeyDown = (e: KeyboardEvent) => {
        if (!e) return;

        if (e.keyCode === 40) {
            e.preventDefault();

            if (suggestions.length === 0) {
                if (previousCommands.length === 0) return;
                const _previous = previous;
                if (_previous >= previousCommands.length - 1) setPrevious(-1);
                else setPrevious((p) => p + 1);
                if (_previous >= 0) {
                    if (previous === -1) setCurrentText(conRef.current.value);
                    conRef.current.value = previousCommands[previous];
                } else {
                    conRef.current.value = currentText;
                }
                setPrevious(_previous);
                return;
            }

            if (selectedSuggestionIndex >= suggestions.length - 1) setSelectedSuggestionIndex(-1);
            else setSelectedSuggestionIndex((p) => p + 1);
            return;
        }

        if (e.keyCode === 38) {
            e.preventDefault();

            if (suggestions.length === 0) {
                if (previousCommands.length === 0) return;
                let _previous = previous;
                if (previous <= -1) _previous = previousCommands.length - 1;
                else _previous -= 1;
                if (previous >= 0) {
                    if (previous === -1) setCurrentText(conRef.current.value);
                    conRef.current.value = previousCommands[previous];
                } else {
                    conRef.current.value = currentText;
                }
                setPrevious(_previous);
                return;
            }

            if (selectedSuggestionIndex <= -1) setSelectedSuggestionIndex(suggestions.length - 1);
            else setSelectedSuggestionIndex((p) => p - 1);
            return;
        }

        if (e.keyCode === 13) {
            e.preventDefault();
            setPrevious(-1);

            if (selectedSuggestionIndex >= 0) {
                conRef.current.value = `${suggestions[selectedSuggestionIndex].text} `;
                clearSuggestions();
                return;
            }

            const submission = conRef.current.value.trim();
            if (submission.length > 0) {
                const parts = submission.split(' ');

                if (parts.length > 1 && parts[0].toLowerCase() === 'ui.drawenable') {
                    addConsoleText(
                        '**WARNING** `UI.DrawEnable` is not writable from the console, which will also be hidden when the UI is not drawing. You can use *F11* to toggle the game UI.'
                    );
                    conRef.current.value = '';
                    clearSuggestions();
                    return;
                }

                if (parts[0].toLowerCase() === 'clear') {
                    conRef.current.value = '';
                    clearSuggestions();
                    clearConsole();
                    return;
                }

                executeConsoleCommand(conRef.current.value);
            }

            conRef.current.value = '';
            clearSuggestions();
            return;
        }

        if (e.keyCode === 27) {
            conRef.current.value = '';
            closeConsole();
            return;
        }

        if (e.keyCode === 9) {
            e.preventDefault();
            if (selectedSuggestionIndex >= 0) {
                conRef.current.value = `${suggestions[selectedSuggestionIndex].text} `;
                clearSuggestions();
            }
            return;
        }
    };

    let _suggestions = null;

    if (active && suggestions.length > 0) {
        const suggestionList = [];
        for (let i = 0; i < suggestions.length; ++i) {
            suggestionList.push(
                <li
                    className={clsx({ active: selectedSuggestionIndex === i })}
                    key={`suggestion-${suggestions[i].text}-${i}`}
                    onMouseEnter={() => setSelectedSuggestionIndex(i)}
                    onClick={(e) => {
                        e.preventDefault();
                        conRef.current.value = `${suggestions[selectedSuggestionIndex].text} `;
                        clearSuggestions();
                    }}
                >
                    {suggestions[i].text} <strong>{suggestions[i].desc}</strong>
                </li>
            );
        }
        _suggestions = <ul id="console-suggestions">{suggestionList}</ul>;
    }

    return (
        <div
            id="game-console-container"
            style={{ display: active ? 'block' : 'none' }}
        >
            <div id="console-input">
                <label onClick={(e) => { e.preventDefault(); conRef.current?.focus(); }}>
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
                <div
                    ref={outputRef}
                    className="console-output"
                    style={{ height: fullExpanded ? '935rem' : '150rem', overflowY: 'auto' }}
                >
                    <div className="padding-row" />
                </div>
                {_suggestions}
            </div>
        </div>
    );
};

export default GameConsole;
