import React from 'react';
import ItemPopup from '../../../Components/Popups/ItemPopup';
import { Item } from '../../../Models/Item/Item';
import { __GLOBAL_REFRESH_FUNC_REF } from '../../../App';
import { StateContext } from '../../../Models/GlobalContextStore';

function getLootDisplay(loot: Array<Item>) {
    return loot.map((v: Item, i: number) => {
        return <ItemPopup prefix="" key={i} item={v} addLootButton={true} />;
    });
}

export default function LootTransitionComponent() {
    const [store, setState] = React.useContext(StateContext);
    let player = store.player;
    let rpgConsole = store.rpgConsole;
    let combatState = store.combatState;

    let loot = combatState.loot;

    return (
        <div>
            <h1>Loot!</h1>
            {getLootDisplay(loot)}
            <hr />
            <button
                onClick={() => {
                    // Add all items to inventory.
                    let res = player.inventory.addItems(player, loot);

                    if (res) {
                        combatState.endLooting(store);
                    } else {
                        rpgConsole.add('Unable to loot all. Not enough inventory space.');
                    }

                    // Refresh screen.
                    __GLOBAL_REFRESH_FUNC_REF();
                }}
            >
                Loot All & Exit
            </button>
            <button
                onClick={() => {
                    combatState.endLooting(store);
                }}
            >
                Exit Looting
            </button>
        </div>
    );
}
