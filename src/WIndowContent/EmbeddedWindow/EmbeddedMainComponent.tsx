/**
 * The embedded window component is the region of the game window that is 'embedded' into the screen.
 * All of the floating windows hover over top of it. It is unlabled. And, it is where 'core' game content is meant to be displayed.
 */
import React from 'react';
import ExploreComponent from './SubWindows/Explore/ExploreComponent';
import './EmbeddedMainComponent.css';
import { GlobalContextInterface, StateContext } from '../../Models/GlobalContextStore';

export function getMainComponentContent(store: GlobalContextInterface, isEmbed: boolean): JSX.Element {
    let finalContent = null;
    let encounterContent = store.gameStateManager.getAnyActiveEncounters();
    let finalClass = isEmbed ? 'embedded-window-core' : 'not-embedded-window-core';

    if (encounterContent !== null) {
        finalContent = <div className={finalClass}>{encounterContent}</div>;
    } else {
        finalContent = (
            <div className={finalClass}>
                <ExploreComponent />
            </div>
        );
    }
    return finalContent;
}

export default function EmbeddedMainComponent() {
    const [store, setState] = React.useContext(StateContext);
    return getMainComponentContent(store, true);
}
