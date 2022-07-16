/**
 * The intro page is what the player sees immediately upon starting the game.
 */

import { mdiInformationOutline, mdiPlus } from '@mdi/js';
import Icon from '@mdi/react';
import produce from 'immer';
import * as React from 'react';
import BannerComponent from '../Components/BannerComponent/BannerComponent';
import BaseModal from '../Modals/BaseModal';
import HelpModal from '../Modals/Content/HelpModal';
import { GlobalContextInterface, iconSizeStr, StateContext } from '../Models/GlobalContextStore';
import ModalStateManager from '../Models/Singles/ModalStateManager';
import LoadGameComponent from './Components/LoadGame/LoadGameComponent';
import { PageContainer } from './Enums/PageContainer';
import './MainMenu.css';

export function getSetPageButton(pageArg: PageContainer) {
    const [state, setState] = React.useContext(StateContext);

    const setPageState = React.useCallback((page) => {
        setState(
            produce((draft: GlobalContextInterface) => {
                // Update page.
                draft.page = page;
            }),
        );
    }, []);

    return (
        <button
            className={'button-with-icon'}
            onClick={() => {
                setPageState(pageArg);
            }}
        >
            <Icon className={'button-with-icon'} path={mdiPlus} size={iconSizeStr} />
            <p className="glowing-text">Start a New Adventure</p>
            <Icon className={'button-with-icon'} path={mdiPlus} size={iconSizeStr} />
        </button>
    );
}

export default function MainMenuPage() {
    return (
        <div className="main-game-container">
            <hr />

            {/* Banner */}
            <BannerComponent />

            {/* Start adventure button. */}
            {getSetPageButton(PageContainer.NewGame)}

            {/* Load Game Bar */}
            <LoadGameComponent />

            {/* Credits */}
            <div>
                <p>Created By: Donald Abdullah-Robinson</p>
            </div>

            {/* Help button in modal */}
            <BaseModal
                id={ModalStateManager.playHelpId}
                buttonText={'Game Manual & Help'}
                iconPath={mdiInformationOutline}
                component={<HelpModal />}
            />

            <hr />
        </div>
    );
}
