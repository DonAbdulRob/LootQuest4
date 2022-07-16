import Icon from '@mdi/react';
import React, { MouseEventHandler } from 'react';
import { iconSizeStr } from '../../Models/GlobalContextStore';
import './IconButton.css';

export interface IconButtonProps {
    path: string;
    text?: string;
    onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
    allowClick?: boolean; // Prevents clicking icon if set.
}

export default function IconButton(props: IconButtonProps) {
    // Add icon-no-click if we don't allow click.
    let iconClassName = !props.allowClick ? 'icon-no-click' : '';

    /* If the text isn't empty, we need to add a little padding to the right of buttons
     to balance out the icon's visual impact on the left side of the text.
     And add margins to the right of the icons. */
    let buttonPadding = '';
    let marginIconRight = '';

    if (props.text !== undefined) {
        buttonPadding = ' pad-right-10';
        marginIconRight = ' margin-right-3';
    }

    return (
        <button className={'button-with-icon' + buttonPadding} onClick={props.onClick}>
            <span className={'button-icon' + marginIconRight}>
                <Icon className={iconClassName} path={props.path} size={iconSizeStr} />
            </span>
            {props.text}
        </button>
    );
}
