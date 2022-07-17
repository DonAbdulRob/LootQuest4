import produce from 'immer';
import React from 'react';
import { IGlobalContext } from '../GlobalContextStore';

export function getThemeChangeButton(themeArg: string, setState: Function) {
    const changeTheme = React.useCallback((theme) => {
        setState(
            produce((draft: IGlobalContext) => {
                draft.themeManager.setThemePreset(theme);

                // Perform theme update to handle global context state changes.
                draft.themeManager.doUpdate();
            }),
        );
    }, []);

    return (
        <button
            onClick={() => {
                changeTheme(themeArg);
            }}
        >
            Use {themeArg} Theme
        </button>
    );
}
