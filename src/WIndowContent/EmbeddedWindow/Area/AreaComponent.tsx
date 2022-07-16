/**
 * The area component holds the player's current area information and provides
 * travel options to other areas.
 */
import React from 'react';
import { __GLOBAL_REFRESH_FUNC_REF } from '../../../App';
import Area from '../../../Models/Area/Area';
import { StateContext } from '../../../Models/GlobalContextStore';
import './AreaComponent.css';

export default function AreaComponent() {
    const [store, setState] = React.useContext(StateContext);
    let player = store.player;

    return (
        <div className="area-parent-container">
            <p className="center-p">Travel To:</p>
            <div className="area-container">
                {store.gameStateManager.areaContainer.getAreaList(player).map((v: Area, i: number) => {
                    return (
                        <span className="area-item" key={i}>
                            {v.name}
                            <br />
                            {v.getLevelDisplay()}
                            <button
                                onClick={() => {
                                    player.currentArea = v;
                                    __GLOBAL_REFRESH_FUNC_REF();
                                }}
                            >
                                GO
                            </button>
                        </span>
                    );
                })}
            </div>
        </div>
    );
}
