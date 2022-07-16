/**
 * The Quit button provides a reuseable method to return to the Main Menu.
 */
import React from 'react';
import { __GLOBAL_REFRESH_FUNC_REF } from '../../App';
import { StateContext } from '../../Models/GlobalContextStore';
import { PageContainer } from '../Enums/PageContainer';

export default function QuitButtonComponent() {
    const [state, setState] = React.useContext(StateContext);

    return (
        <button
            onClick={() => {
                state.page = PageContainer.MainMenu;
                __GLOBAL_REFRESH_FUNC_REF();
            }}
        >
            Quit
        </button>
    );
}
