/**
 * The main component handles the highest-level routing of pages based on user interaction.
 * See EPages.tsx for page options and PageSlice.tsx for page store management.
 */

import * as React from 'react';
import { StateContext, _G_GET_NEW_GLOBAL_CONTEXT_STATE_OBJECT } from './Models/GlobalContextStore';
import { io } from 'socket.io-client';
import { MultiplayerManager } from './Models/Multiplayer/MultiplayerManager';
import { __GLOBAL_REFRESH_FUNC_REF } from './App';

export const socket = io('http://localhost:8080/');

export default function AppDataLayer() {
    const [state, setState] = React.useContext(StateContext);
    let mpm: MultiplayerManager = state.multiplayerManager;

    // Setup socket.io logic wtihin the lifecycle callbacks.
    React.useEffect(() => {
        mpm.setupSockets(setState);

        return () => {
            mpm.cleanupSockets();
        };
    });

    return null;
}
