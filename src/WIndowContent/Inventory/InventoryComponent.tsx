import React from 'react';
import ItemPopup from '../../Components/Popups/ItemPopup';
import { Item, EquipmentType, ItemType, Equipment, Consumable } from '../../Models/Item/Item';
import { CONSUMABLE_EFFECT_FUNCTION } from '../../Models/Item/ItemEffectToCoreEffectMapper';
import { EquipmentSlotMapping } from '../../Models/Fighter/Storage/EquipmentSlots';
import { Player } from '../../Models/Fighter/Player';
import { G_MAX_INV_SIZE } from '../../Models/Fighter/Storage/Inventory';
import { PlayerAbilityEffectLib } from '../../Models/Shared/EffectLib/PlayerAbilityEffectLib';
import { __GLOBAL_REFRESH_FUNC_REF } from '../../App';
import { GlobalContextInterface, StateContext } from '../../Models/GlobalContextStore';

function equip(store: GlobalContextInterface, inventorySlot: number) {
    let player = store.player;
    let invItem: Equipment | Item = player.inventory.items[inventorySlot];

    if (!(invItem instanceof Equipment)) {
        console.log('Dev error. Trying to equip non-equip: ' + invItem.name);
        return;
    }

    let invItemType: EquipmentType = invItem.equipmentType;
    let equipItem: Item | null = null;

    switch (invItemType) {
        case EquipmentType.WEAPON:
            equipItem = player.equipmentSlots.items[EquipmentSlotMapping.weapon];
            break;
        case EquipmentType.CHESTPLATE:
            equipItem = player.equipmentSlots.items[EquipmentSlotMapping.chestplate];
            break;
        default:
            break;
    }

    // If there is an item, move equipment to inventory
    if (equipItem !== null) {
        player.inventory.items.push(equipItem);
    }

    // Move inventory item to our equipment slots.
    switch (invItemType) {
        case EquipmentType.WEAPON:
            player.equipmentSlots.items[EquipmentSlotMapping.weapon] = invItem;
            break;
        case EquipmentType.CHESTPLATE:
            player.equipmentSlots.items[EquipmentSlotMapping.chestplate] = invItem;
            break;
        default:
            break;
    }

    // Remove inventory item from inventory.
    player.inventory.items.splice(inventorySlot, 1);

    // Do equip effect.
    PlayerAbilityEffectLib.equip(store);

    __GLOBAL_REFRESH_FUNC_REF();
}

function drop(store: GlobalContextInterface, inventorySlot: number) {
    let fighter: Player = store.player;
    fighter.inventory.items.splice(inventorySlot, 1);

    // Do drop effect.
    PlayerAbilityEffectLib.drop(store);

    __GLOBAL_REFRESH_FUNC_REF();
}

function getInventoryMap(store: GlobalContextInterface): JSX.Element[] {
    let player = store.player;

    if (player.inventory.items.length === 0) {
        return [<div key={0}></div>];
    }

    return player.inventory.items.map((v, i) => {
        let useButton = null;
        let equipButton = null;

        if (v.itemType === ItemType.CONSUMABLE) {
            useButton = (
                <button
                    onClick={() => {
                        let func = CONSUMABLE_EFFECT_FUNCTION((v as Consumable).useFunctionId);

                        if (func != null) {
                            func(store, i);
                            __GLOBAL_REFRESH_FUNC_REF();
                        }
                    }}
                >
                    Use
                </button>
            );
        }

        if (v.itemType === ItemType.EQUIPMENT) {
            equipButton = (
                <button
                    onClick={() => {
                        equip(store, i);
                    }}
                >
                    Equip
                </button>
            );
        }

        return (
            <div key={i}>
                <ItemPopup prefix="" item={player.inventory.items[i]} addLootButton={false} />
                {useButton}
                {equipButton}
                <button
                    onClick={() => {
                        drop(store, i);
                    }}
                >
                    Drop
                </button>
            </div>
        );
    });
}

/**
 * Show player inventory. Doesn't support the 'fighter' class objects. Only players.
 */
export default function InventoryComponent(): JSX.Element {
    const [state, setState] = React.useContext(StateContext);
    let inv = state.player.inventory;

    return (
        <div className="window-core">
            <h2>
                {inv.items.length +
                    '/' +
                    G_MAX_INV_SIZE +
                    ' Slots, ' +
                    state.player.getTotalWeight() +
                    ' / ' +
                    state.player.weightMax +
                    ' lb'}
            </h2>
            {getInventoryMap(state)}
        </div>
    );
}
