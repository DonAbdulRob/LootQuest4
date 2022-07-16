import React from 'react';
import ItemPopup from '../../Components/Popups/ItemPopup';
import { EquipmentType } from '../../Models/Item/Item';
import { __GLOBAL_REFRESH_FUNC_REF } from '../../App';
import { EquipmentSlotMapping } from '../../Models/Fighter/Storage/EquipmentSlots';
import { PlayerAbilityEffectLib } from '../../Models/Shared/EffectLib/PlayerAbilityEffectLib';
import { GlobalContextInterface, StateContext } from '../../Models/GlobalContextStore';

function unequip(store: GlobalContextInterface, inventorySlot: number) {
    let player = store.player;
    let invItem = player.equipmentSlots.items[inventorySlot];

    // Add equipment item to inventory.
    if (invItem !== null) {
        let res = player.inventory.addItem(player, invItem);

        if (!res) {
            store.rpgConsole.addItemFail(invItem.name);
            __GLOBAL_REFRESH_FUNC_REF();
            return;
        }

        // Clear out equipment slot.
        switch (invItem.equipmentType) {
            case EquipmentType.WEAPON:
                player.equipmentSlots.items[EquipmentSlotMapping.weapon] = null;
                break;
            case EquipmentType.CHESTPLATE:
                player.equipmentSlots.items[EquipmentSlotMapping.chestplate] = null;
                break;
            default:
                break;
        }

        // Do equip 'effect'.
        PlayerAbilityEffectLib.equip(store);
    }

    __GLOBAL_REFRESH_FUNC_REF();
}

function getEquipmentMap(store: GlobalContextInterface): JSX.Element[] {
    let player = store.player;

    if (player.equipmentSlots.items.length === 0) {
        return [<div key={0}></div>];
    }

    let keys = Object.keys(EquipmentType);
    let finalKeys: Array<string> = [];

    for (let i = Math.floor(keys.length / 2); i < keys.length; i++) {
        finalKeys.push(keys[i]);
    }

    let item;
    let button;

    return player.equipmentSlots.items.map((v, i) => {
        item = player.equipmentSlots.items[i];

        if (item != null) {
            button = (
                <button
                    onClick={() => {
                        unequip(store, i);
                    }}
                >
                    Unequip
                </button>
            );
        } else {
            button = null;
        }

        return (
            <div className="equipment-list" key={i}>
                <ItemPopup prefix={finalKeys[i] + ': '} item={item} addLootButton={false} />
                {button}
            </div>
        );
    });
}

export default function EquipmentComponent(): JSX.Element {
    const [state, setState] = React.useContext(StateContext);

    return <div className="window-core">{getEquipmentMap(state)}</div>;
}
