/**
 * The global context store is our primary game store for holding all program data.
 *
 * I use 'GLOBAL_REFRESH_FUNC' to update state in a lot of places within the program for convenience.
 *
 * However, for the sake of demonstrational purposes and to prove 'I can use native React state',
 *   the 'themeManager' object is implemented to NOT rely or utilize the 'GLOBAL_REFRESH_FUNC'. When working on professional projects
 *   I don't utilize global state refreshing.
 */
import React from 'react';
import { Page } from '../Pages/Enums/Page';
import { PageContainer } from '../Pages/Enums/PageContainer';
import { MonsterManager } from './Fighter/MonsterManager';
import { PlayerManager } from './Fighter/PlayerManager';
import { MultiplayerManager } from './Multiplayer/MultiplayerManager';
import { SaveLib } from './SaveLib';
import CombatState from './Shared/CombatState';
import GameStateManager from './Singles/GameStateManager';
import ModalStateManager from './Singles/ModalStateManager';
import { RpgConsole } from './Singles/RpgConsole';
import ThemeManager from './Singles/ThemeManager';
import WindowStateManager from './Singles/WindowStateManager';

export const baseIconSize = 18;
export const iconSizeStr = baseIconSize + 'px';
export const StateContext = React.createContext(undefined);

export interface IGlobalContext {
    multiplayerManager: MultiplayerManager;
    themeManager: ThemeManager;
    playerManager: PlayerManager;
    monsterManager: MonsterManager;
    combatState: CombatState;
    rpgConsole: RpgConsole;
    windowStateManager: WindowStateManager;
    gameStateManager: GameStateManager;
    modalStateManager: ModalStateManager;
    saveLib: SaveLib;
    debugMode: boolean;
    page: Page;
}

export function _G_GET_NEW_GLOBAL_CONTEXT_STATE_OBJECT(): IGlobalContext {
    return {
        multiplayerManager: new MultiplayerManager(),
        themeManager: new ThemeManager(),
        playerManager: new PlayerManager(),
        monsterManager: new MonsterManager(),
        combatState: new CombatState(),
        rpgConsole: new RpgConsole(),
        windowStateManager: new WindowStateManager(),
        gameStateManager: new GameStateManager(),
        modalStateManager: new ModalStateManager(),
        saveLib: new SaveLib(),
        debugMode: false,
        page: PageContainer.Play, // MainMenu for prod, Play for debug.
    };
}
