/**
 * This is the version of the embedded component suitable for persisting within a floating window.
 */
import React from 'react';
import { StateContext } from '../../Models/GlobalContextStore';
import { getMainComponentContent } from './EmbeddedMainComponent';
import './EmbeddedMainComponent.css';

export default function FloatingMainComponent(): JSX.Element {
    const [state, setState] = React.useContext(StateContext);
    let content = getMainComponentContent(state, false);
    return <div className="window-core-large embedded-window-copy-core">{content}</div>;
}
