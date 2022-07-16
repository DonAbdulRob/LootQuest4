import React from 'react';
import { Consumable, Equipment, EquipmentType, Item, ItemType } from '../../Models/Item/Item';
import { G_removeElement } from '../../Models/Helper';
import { __GLOBAL_REFRESH_FUNC_REF } from '../../App';
import './ItemPopup.css';
import { EquipmentSlotMapping } from '../../Models/Fighter/Storage/EquipmentSlots';
import { Player } from '../../Models/Fighter/Player';
import { RpgConsole } from '../../Models/Singles/RpgConsole';
import { StateContext } from '../../Models/GlobalContextStore';

interface IItemPopupProps {
    prefix: string;
    item: Item | null;
    addLootButton: boolean;
}

function capitalizeFirstLetter(str: string) {
    const arr = str.split('');
    arr[0] = arr[0].toLocaleUpperCase();
    return arr.join('');
}

function getDiffPrefix(diff: number): JSX.Element {
    if (diff < 0) {
        return <span className="red">{diff}</span>;
    } else if (diff > 0) {
        return <span className="green">{'+' + diff}</span>;
    } else {
        return <span>{diff}</span>;
    }
}

function getDiff(fighter: Player, item: Item, field: string) {
    // Only allow items.
    if (item.itemType !== ItemType.EQUIPMENT) {
        return 0;
    }

    let itemAsEquipment: Equipment = item as Equipment;
    let equipmentItem: Equipment | null = null;

    if (itemAsEquipment.equipmentType === EquipmentType.WEAPON) {
        equipmentItem = fighter.equipmentSlots.items[EquipmentSlotMapping.weapon];
    } else if (itemAsEquipment.equipmentType === EquipmentType.CHESTPLATE) {
        equipmentItem = fighter.equipmentSlots.items[EquipmentSlotMapping.chestplate];
    } else {
        console.log('NO DEFINED ITEM TYPE!');
        return 0;
    }

    if (equipmentItem !== null && equipmentItem !== undefined) {
        let equipmentStatBlock: any = equipmentItem.statBlock;
        let equipmentVal: any = equipmentStatBlock[field];
        let itemStatBlock: any = itemAsEquipment.statBlock;
        let itemVal = itemStatBlock[field];

        // If we are getting NaN, undefined, etc. here, double check that field names are correct below.
        // Because, I spell out 'damageMin' and other EquipmentStatBlock fields manually.
        return itemVal - equipmentVal;
    }

    return 0;
}

function getFieldDisplay(fighter: Player, item: Equipment, field: any) {
    let diff = getDiff(fighter, item, field);
    let diffDisplay = null;

    if (diff !== 0) {
        diffDisplay = (
            <span>
                {', ['}
                {getDiffPrefix(diff)}
                {']'}
            </span>
        );
    }

    let statBlock: any = item.statBlock;

    return statBlock[field] !== 0 || diff !== 0 ? (
        <p className="item-description">
            Bonus {capitalizeFirstLetter(field)}: {statBlock[field]}
            {diffDisplay}
        </p>
    ) : null;
}

function getDamageDisplay(fighter: Player, item: Equipment) {
    let diff1 = getDiff(fighter, item, 'damageMin');
    let diff2 = getDiff(fighter, item, 'damageMax');
    let diffDisplay = null;

    if (diff1 !== 0 || diff2 !== 0) {
        diffDisplay = (
            <span>
                {', ['}
                {getDiffPrefix(diff1)}
                {' / '}
                {getDiffPrefix(diff2)}
                {']'}
            </span>
        );
    }

    let statBlock = item.statBlock;

    return statBlock.damageMin !== 0 || statBlock.damageMax !== 0 || diffDisplay !== null ? (
        <p className="item-description">
            Bonus Damage: {statBlock.damageMin} - {statBlock.damageMax}
            {diffDisplay}
        </p>
    ) : null;
}

export default function ItemPopup(props: IItemPopupProps) {
    const [state, setState] = React.useContext(StateContext);
    let player: Player = state.player;
    let combatState = state.combatState;
    let rpgConsole: RpgConsole = state.rpgConsole;
    let lootButton = null;

    if (props.addLootButton) {
        lootButton = (
            <button
                onClick={() => {
                    // TOOO - change interfaces to make this unnecessary.
                    if (props.item == null) {
                        return;
                    }

                    let res = player.inventory.addItem(player, props.item);

                    if (res) {
                        combatState.loot = G_removeElement(combatState.loot, props.item);

                        // If no loot left, end looting.
                        if (combatState.loot.length === 0) {
                            combatState.endLooting(state);
                            rpgConsole.add('You loot all items and contine your adventure.');
                        }
                    } else {
                        rpgConsole.addItemFail(props.item.name);
                    }

                    __GLOBAL_REFRESH_FUNC_REF();
                }}
            >
                Loot
            </button>
        );
    }

    let item = props.item;
    let statDisplay = null;

    if (item instanceof Equipment) {
        statDisplay = (
            <span>
                {getDamageDisplay(player, item)}
                {getFieldDisplay(player, item, 'health')}
                {getFieldDisplay(player, item, 'stamina')}
                {getFieldDisplay(player, item, 'mana')}
                {getFieldDisplay(player, item, 'armor')}
            </span>
        );
    }

    if (item === null || item === undefined) {
        return (
            <div className="tooltip">
                <p>{props.prefix + ' '}None</p>
            </div>
        );
    } else {
        let uses = -1;

        if (item instanceof Consumable) {
            uses = item.useCount;
        }

        return (
            <div className="tooltip">
                <div>
                    {props.prefix + item.name} {lootButton}
                </div>
                <span className="tooltiptext">
                    <p className="item-name">{item.name + ' (' + item.weight + ' lb)'}</p>
                    <p className="item-description">{item.description}</p>
                    {uses !== -1 && <p>Uses Remaining: {uses}</p>}
                    {statDisplay}
                </span>
            </div>
        );
    }
}
