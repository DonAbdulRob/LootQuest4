/**
 * Our play page represents the game window that the player sees after existing the New Game Page.
 * It is the focal point for all other windows and player interactions.
 */

import React from 'react';
import FloatingWindow from '../Components/FloatingWindow/FloatingWindow';
import CharacterComponent from '../WIndowContent/Character/CharacterComponent';
import InventoryComponent from '../WIndowContent/Inventory/InventoryComponent';
import EquipmentComponent from '../WIndowContent/Equipment/EquipmentComponent';
import ConsoleComponent from '../WIndowContent/Console/ConsoleComponent';
import CheatComponent from '../WIndowContent/Cheat/CheatComponent';
import WindowStateManager from '../Models/Singles/WindowStateManager';
import Ability from '../WIndowContent/Ability/AbilityComponent';
import EmbeddedMainComponent from '../WIndowContent/EmbeddedWindow/EmbeddedMainComponent';
import FloatingMainComponent from '../WIndowContent/EmbeddedWindow/FloatingMainComponent';
import BaseModal from '../Modals/BaseModal';
import { SettingsComponent as SettingsModal } from '../Modals/Content/SettingsComponent';
import { mdiCog, mdiInformationOutline } from '@mdi/js';
import QuitIconButtonComponent from './Components/QuitIconButtonComponent';
import ModalStateManager from '../Models/Singles/ModalStateManager';
import HelpModal from '../Modals/Content/HelpModal';
import { StateContext } from '../Models/GlobalContextStore';
import PartyComponent from '../WIndowContent/Party/PartyComponent';

export interface IFloatingWindowPropsBuilder {
    id?: number;
    title: string;
    contentElement: JSX.Element;
    top?: number;
    left?: number;
}

/**
 * Builds and returns our array of window content to display on the page.
 */
function getWindows(multiplayerEnabled: boolean, debugMode: boolean, windowStateManager: WindowStateManager) {
    let topStart = 95;
    let topBottomStart = topStart + 565;
    let windows: Array<IFloatingWindowPropsBuilder> = [];

    if (!windowStateManager.embedCore) {
        windows.push({
            title: 'Main',
            contentElement: <FloatingMainComponent />,
            top: topStart,
            left: 325,
        });
    } else {
        topStart += 200;
    }

    windows.push({
        title: 'Player',
        contentElement: <CharacterComponent usePlayer={true} />,
        top: topStart,
        left: 10,
    });

    windows.push({
        title: 'Console',
        contentElement: <ConsoleComponent />,
        top: topBottomStart,
        left: 325,
    });

    windows.push({
        title: 'Ability',
        contentElement: <Ability />,
        top: topStart + 350,
        left: 10,
    });

    windows.push({
        title: 'Equipment',
        contentElement: <EquipmentComponent />,
        top: topStart,
        left: 1365,
    });

    windows.push({
        title: 'Inventory',
        contentElement: <InventoryComponent />,
        top: topStart + 130,
        left: 1365,
    });

    if (multiplayerEnabled) {
        windows.push({
            title: 'Party',
            contentElement: <PartyComponent />,
            top: topStart + 500,
            left: 1365,
        });
    }
    if (debugMode) {
        windows.push({
            title: 'Cheat',
            contentElement: <CheatComponent />,
            top: 0,
            left: 500,
        });

        windows.push({
            title: 'Enemy',
            contentElement: <CharacterComponent usePlayer={false} />,
            top: topBottomStart + 350,
            left: 450,
        });
    }

    // Calculate window positions and add to window objects.
    let c: number = 0;

    for (let win of windows) {
        win.id = c;

        if (windowStateManager.isFree(c)) {
            windowStateManager.subscribe(win.id, win);
        }

        c++;
    }

    // Create list of windows to display on page.
    // Flex our skills a bit by using the 'as' keyword to convert our windows object to correct type.
    return windows.map((v: IFloatingWindowPropsBuilder, i: number) => {
        return (
            <div key={i}>
                <FloatingWindow id={i} contentElement={v.contentElement} />
            </div>
        );
    });
}

export let __G_REFRESH_PLAY_PAGE;

export function PlayPage() {
    let [c, sc] = React.useState(0);

    __G_REFRESH_PLAY_PAGE = () => {
        sc(c + 1);
    };

    const [state, setState] = React.useContext(StateContext);
    let multiplayerEnabled = state.multiplayerManager.multiplayerEnabled;
    let debugMode: boolean = state.debugMode;
    let windowStateManager: WindowStateManager = state.windowStateManager;

    return (
        <div>
            <h1>Loot Quest</h1>

            {/* Our main nav bar below logo. */}
            <div style={{ display: 'flex' }}>
                {/* Help button in modal */}
                <BaseModal
                    id={ModalStateManager.playHelpId}
                    buttonText={'Game Manual & Help'}
                    iconPath={mdiInformationOutline}
                    component={<HelpModal />}
                />

                {/* Settings button + modal */}
                <BaseModal
                    id={ModalStateManager.playSettingsId}
                    buttonText={'Settings'}
                    iconPath={mdiCog}
                    component={<SettingsModal />}
                />

                {/* Quit Icon Button */}
                <QuitIconButtonComponent />
            </div>

            {/* All of our windows */}
            <div id="floating-window-container">{getWindows(multiplayerEnabled, debugMode, windowStateManager)}</div>

            {/* Embedded main component IF 'embed' setting is toggled by user. */}
            {windowStateManager.embedCore && (
                <span>
                    <hr /> <EmbeddedMainComponent />
                </span>
            )}
        </div>
    );
}
