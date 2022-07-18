import produce from 'immer';
import React from 'react';
import { __GLOBAL_REFRESH_FUNC_REF } from '../../App';
import { IGlobalContext, StateContext } from '../../Models/GlobalContextStore';
import { MultiplayerManager } from '../../Models/Multiplayer/MultiplayerManager';

export default function PartyComponent() {
    const [state, setState] = React.useContext(StateContext);
    const mpm: MultiplayerManager = state.multiplayerManager;
    // mpm.lastPongState = React.useState('');

    return (
        <div>
            <h1>Players 1/100</h1>
            <p>You: Currently Exploring Woods</p>
            <p>Nate (P2): Fighting Adorable Rat</p>
            <div>
                <p>Connecting: {'' + mpm.isConnectingMultiplayer}</p>
                <p>Connected: {'' + mpm.multiplayerEnabled}</p>
                <p>Last pong: {mpm.lastPong || '-'}</p>
                <button onClick={mpm.sendPing}>Send ping</button>
            </div>
        </div>
    );
}
