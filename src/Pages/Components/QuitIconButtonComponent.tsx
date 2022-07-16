/**
 * The Quit button provides a reuseable method to return to the Main Menu.
 */
import { mdiClose } from '@mdi/js';
import React from 'react';
import { __GLOBAL_REFRESH_FUNC_REF } from '../../App';
import IconButton from '../../Components/IconButton/IconButton';
import { StateContext } from '../../Models/GlobalContextStore';
import { PageContainer } from '../Enums/PageContainer';

export default function QuitIconButtonComponent() {
    const [state, setState] = React.useContext(StateContext);

    return (
        <IconButton
            onClick={() => {
                state.page = PageContainer.MainMenu;
                __GLOBAL_REFRESH_FUNC_REF();
            }}
            path={mdiClose}
            text="Quit"
        />
    );
}
