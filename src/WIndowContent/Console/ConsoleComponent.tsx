import React, { MutableRefObject, useEffect } from 'react';
import { __GLOBAL_REFRESH_FUNC_REF } from '../../App';
import { StateContext } from '../../Models/GlobalContextStore';
import { RpgConsole } from '../../Models/Singles/RpgConsole';
import { __G_REFRESH_PLAY_PAGE } from '../../Pages/PlayPage';
import './ConsoleComponent.css';

export interface Line {
    text: string;
    time: string;
}

export function getFormattedTime(x: number) {
    if (x < 10) {
        return '0' + x;
    }
    return x;
}

function sendMessage(
    inputRef: MutableRefObject<HTMLInputElement>,
    consoleRef: MutableRefObject<HTMLDivElement>,
    rpgConsole: RpgConsole,
) {
    return () => {
        // Disallow adding empty strings.
        if (inputRef.current.value === '') {
            return;
        }

        // Handle rest of processing.
        rpgConsole.add(inputRef.current.value);
        inputRef.current.value = '';
        consoleRef.current.scrollTop = 999999;
        __G_REFRESH_PLAY_PAGE(); // Refresh play page instead of global, because global causes inputRef defocusing.
    };
}

export default function ConsoleComponent() {
    const [state, setState] = React.useContext(StateContext);
    let rpgConsole: RpgConsole = state.rpgConsole;
    let inputRef: MutableRefObject<HTMLInputElement> = React.useRef<HTMLInputElement>(null);
    let consoleRef: MutableRefObject<HTMLDivElement> = React.useRef<HTMLDivElement>(null);

    return (
        <div className="window-core">
            <div className="console-text-region" ref={consoleRef}>
                {rpgConsole.get()}
            </div>
            <hr />
            <div>
                <input
                    type="text"
                    placeholder="Enter a message."
                    ref={inputRef}
                    onKeyDown={(e: any) => {
                        if (e.key === 'Enter') {
                            sendMessage(inputRef, consoleRef, rpgConsole)();
                        }
                    }}
                />
                <button onClick={sendMessage(inputRef, consoleRef, rpgConsole)}>Send</button>
            </div>
        </div>
    );
}
