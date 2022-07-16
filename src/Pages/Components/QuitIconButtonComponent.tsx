/**
 * The Quit button provides a reuseable method to return to the Main Menu.
 */
import { mdiClose } from '@mdi/js';
import React from 'react';
import { __GLOBAL_REFRESH_FUNC_REF } from '../../App';
import IconButton from '../../Components/IconButton/IconButton';
import { StateContext, _G_GET_NEW_GLOBAL_CONTEXT_STATE_OBJECT } from '../../Models/GlobalContextStore';

export default function QuitIconButtonComponent() {
    const [state, setState] = React.useContext(StateContext);

    return (
        <IconButton
            onClick={() => {
                setState(_G_GET_NEW_GLOBAL_CONTEXT_STATE_OBJECT());
            }}
            path={mdiClose}
            text="Quit"
        />
    );
}
