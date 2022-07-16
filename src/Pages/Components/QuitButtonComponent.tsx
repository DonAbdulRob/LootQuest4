/**
 * The Quit button provides a reuseable method to return to the Main Menu.
 */
import React from 'react';
import { __GLOBAL_REFRESH_FUNC_REF } from '../../App';
import { StateContext, _G_GET_NEW_GLOBAL_CONTEXT_STATE_OBJECT } from '../../Models/GlobalContextStore';
import { PageContainer } from '../Enums/PageContainer';

export default function QuitButtonComponent() {
    const [state, setState] = React.useContext(StateContext);

    return (
        <button
            onClick={() => {
                setState(_G_GET_NEW_GLOBAL_CONTEXT_STATE_OBJECT());
                // __GLOBAL_REFRESH_FUNC_REF();
            }}
        >
            Quit
        </button>
    );
}
