import React, { useEffect } from 'react';
import './FloatingWindow.css';

import WindowStateManager from '../../Models/Singles/WindowStateManager';
import { FloatingWindowData } from '../../Models/Singles/FloatingWindowData';
import { mdiArrowCollapse, mdiArrowExpand, mdiClose } from '@mdi/js';
import IconButton from '../IconButton/IconButton';
import { StateContext } from '../../Models/GlobalContextStore';

// Function taht adds drag-drop behavior to our 'hook' button.
function assignDragBehavior(
    ele: any,
    levelsToParent: number,
    pos1: React.MutableRefObject<number>,
    pos2: React.MutableRefObject<number>,
    pos3: React.MutableRefObject<number>,
    pos4: React.MutableRefObject<number>,
    windowData: FloatingWindowData,
    allowOffScreen: boolean,
) {
    // Function that implements draggable logic.
    function mouseDownFunction(mouseDownEvent: any) {
        mouseDownEvent = mouseDownEvent || window.event;
        mouseDownEvent.preventDefault();

        windowData.isBeingHovered = true;

        // get the mouse cursor position at startup:
        pos3.current = mouseDownEvent.clientX;
        pos4.current = mouseDownEvent.clientY;

        function mouseUp() {
            document.removeEventListener('mouseup', mouseUp);
            document.removeEventListener('mousemove', mouseMove);

            windowData.isBeingHovered = false;

            // Update store
            let elmnt: any = mouseDownEvent.target;

            for (let i = 0; i < levelsToParent; i++) {
                elmnt = elmnt.parentNode;
            }

            let rect = elmnt.getBoundingClientRect();
            windowData.top = rect.top;
            windowData.left = rect.left;
        }

        function mouseMove(e: any) {
            e = e || window.event;
            e.preventDefault();

            // calculate the new cursor position:
            pos1.current = pos3.current - e.clientX;
            pos2.current = pos4.current - e.clientY;
            pos3.current = e.clientX;
            pos4.current = e.clientY;

            // set the element's new position:
            // let elmnt: any = mouseDownEvent.target;
            let p: any = mouseDownEvent.target;
            let elmnt: any = p;

            for (let i = 0; i < levelsToParent; i++) {
                elmnt = elmnt.parentNode;
            }

            let finalTop = elmnt.offsetTop - pos2.current;
            let finalLeft = elmnt.offsetLeft - pos1.current;
            let maxRight = document.body.clientWidth - 400;
            let maxBottom = document.body.clientHeight - 250;

            if (!allowOffScreen) {
                if (finalTop < 0) {
                    finalTop = 0;
                } else if (finalTop >= maxBottom) {
                    finalTop = maxBottom;
                }

                if (finalLeft < 0) {
                    finalLeft = 0;
                } else if (finalLeft >= maxRight) {
                    finalLeft = maxRight;
                }
            }

            elmnt.style.top = finalTop + 'px';
            elmnt.style.left = finalLeft + 'px';
        }

        document.addEventListener('mouseup', mouseUp);
        document.addEventListener('mousemove', mouseMove);
    }

    if (ele !== null) {
        ele.addEventListener('mousedown', mouseDownFunction);
    }
}

function closeClick(e: any) {
    let parent = e.target;

    // Get 6th level parent. Yup. That high up the tree!
    for (var i = 0; i < 6; i++) {
        parent = parent.parentNode;
    }

    parent.hidden = true;
}

function minimizeClick(e: any, windowContentRef: any) {
    windowContentRef.current.hidden = true;
}

function maximizeClick(e: any, windowContentRef: any) {
    windowContentRef.current.hidden = false;
}

interface IFloatingWindowProps {
    id: number;
    contentElement: JSX.Element;
}

export default function FloatingWindow(props: IFloatingWindowProps): JSX.Element {
    const [state, setState] = React.useContext(StateContext);
    let windowStateManager: WindowStateManager = state.windowStateManager;

    const titleBarDragRef = React.useRef<HTMLDivElement>(null);
    const windowContentRef = React.useRef<HTMLDivElement>(null);
    const parentEleRef = React.useRef<HTMLDivElement>(null);

    // Always keep ref var in memory.
    const pos1 = React.useRef(0);
    const pos2 = React.useRef(0);
    const pos3 = React.useRef(0);
    const pos4 = React.useRef(0);

    const windowData: FloatingWindowData = windowStateManager.windowDataArr[props.id];

    // After render, assign drag behavior.
    useEffect(() => {
        windowData.ref = parentEleRef;
        assignDragBehavior(
            titleBarDragRef.current,
            1,
            pos1,
            pos2,
            pos3,
            pos4,
            windowData,
            windowStateManager.allowOffScreen,
        );
    });

    return (
        <div
            className="floating-window"
            ref={parentEleRef}
            style={{
                zIndex: windowData.zIndex,
                top: windowData.top,
                left: windowData.left,
                width: windowData.width + 'px',
                height: windowData.height + 'px',
                opacity: windowStateManager.opacity,
            }}
            onMouseEnter={(e: any) => {
                if (parentEleRef === null || parentEleRef.current === null || windowStateManager.hasActiveHover()) {
                    return true;
                }

                windowStateManager.setOnTop(props.id);
            }}
        >
            <div className="floating-window-titlebar flex-container" ref={titleBarDragRef}>
                {/* Window's Title */}
                <div className="window-title-text">{windowData.title}</div>

                {/* We cancel pointer events in the 'far-right' class to prevent user input from dragging the div in a detached state from the parent floating window.
                    Then, for each element within, we re-enable pointer events. This solution prevents buggy UI behavior. */}
                <div className="far-right">
                    <div style={{ display: 'flex' }}>
                        {/* Minimize */}
                        <span className="allow-pointer-events">
                            <IconButton
                                onClick={(e) => {
                                    minimizeClick(e, windowContentRef);
                                }}
                                path={mdiArrowCollapse}
                            />
                        </span>

                        {/* Maximize */}
                        <span className="allow-pointer-events">
                            <IconButton
                                onClick={(e) => {
                                    maximizeClick(e, windowContentRef);
                                }}
                                path={mdiArrowExpand}
                            />
                        </span>

                        {/* Close */}
                        <span className="allow-pointer-events">
                            <IconButton onClick={closeClick} path={mdiClose} />
                        </span>
                    </div>
                </div>
            </div>

            {/* Window Content.*/}
            <div ref={windowContentRef} style={{ overflow: 'visible !important' }}>
                {props.contentElement}
            </div>
        </div>
    );
}
