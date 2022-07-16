/**
 * We take advantage of W3.CSS to handle the modal code easily with some minor modifications for react compatibility and customized usage.
 * The modal can take any sub-component as a prop to display within it, along with button text and an icon.
 */

import Icon from '@mdi/react';
import * as React from 'react';
import { __GLOBAL_REFRESH_FUNC_REF } from '../App';
import { StateContext, iconSizeStr } from '../Models/GlobalContextStore';
import ModalStateManager from '../Models/Singles/ModalStateManager';
import './BaseModal.css';

export interface ModalProps {
    id: number;
    buttonText: string;
    component: JSX.Element;
    iconPath: string;
}

export default function BaseModal(props: ModalProps) {
    const [state, setState] = React.useContext(StateContext);
    let modalStateManager: ModalStateManager = state.modalStateManager;
    let modalClassName = 'w3-modal max-z';
    let marginIconRight = props.buttonText !== undefined ? ' margin-right-3' : '';

    // post-render event setup.
    React.useEffect(() => {
        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function (event) {
            let e: any = event.target;

            if (e.className === modalClassName && modalStateManager.isVisible) {
                modalStateManager.toggleVisible();
                __GLOBAL_REFRESH_FUNC_REF();
            }
        };
    });

    // We return a W3.CSS modal containing our 'coreDisplay' which is our own Settings Component.
    return (
        <div>
            <button
                className={'button-with-icon'}
                onClick={() => {
                    modalStateManager.toggleVisible();
                    modalStateManager.setActive(props.id);
                    __GLOBAL_REFRESH_FUNC_REF();
                }}
            >
                <span className={'button-icon' + marginIconRight}>
                    <Icon path={props.iconPath} size={iconSizeStr} />
                </span>
                {props.buttonText}
            </button>

            {modalStateManager.isActive(props.id) && (
                <div className={modalClassName} style={{ display: modalStateManager.getBlockOrNot() }}>
                    <div className="w3-modal-content modal-border">
                        <span
                            onClick={() => {
                                modalStateManager.toggleVisible();
                                __GLOBAL_REFRESH_FUNC_REF();
                            }}
                            className="w3-button w3-display-topright"
                        >
                            &times;
                        </span>
                        {props.component}
                    </div>
                </div>
            )}
        </div>
    );
}
