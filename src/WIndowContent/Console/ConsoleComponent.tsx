import React from 'react';
import { StateContext } from '../../Models/GlobalContextStore';

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

export default function ConsoleComponent() {
    const [state, setState] = React.useContext(StateContext);
    let rpgConsole = state.rpgConsole;

    return <div className="window-core">{rpgConsole.get()}</div>;
}
