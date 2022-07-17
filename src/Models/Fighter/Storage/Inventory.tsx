/**
 * An Inventory is a collection of items.
 */
import { IG_Herb } from '../../Item/Consumables/IG_Herb';
import { Item, EquipmentType, Equipment, Consumable, Resource } from '../../Item/Item';
import { Player } from '../Player/Player';

export const G_MAX_INV_SIZE = 20;

export default class Inventory {
    items: Array<Item | Equipment | Consumable | Resource> = [];

    constructor() {
        this.addStarterItems();
    }

    /**
     * Returns if user has 'count' number of item by comparing names of the new item and existing inventory items.
     */
    public has_nameMatch(item: Item, count: number): boolean {
        let iName = item.name;
        let currentAmount = 0;

        for (let i of this.items) {
            if (i.name === iName) {
                currentAmount++;

                if (currentAmount === count) {
                    return true;
                }
            }
        }

        return false;
    }

    public remove_nameMatch(item: Item, amountToRemove: number) {
        // First, store indexes of all items to remove. (Avoid concurrent modification)
        let iName = item.name;
        let removeIndexArr = [];
        let removeCount = 0;

        if (amountToRemove === 0) {
            return;
        }

        // Iterate in reverse order so that when we remove, subsequent splices aren't effected by previous ones.
        for (let i = this.items.length - 1; i > -1; i--) {
            if (this.items[i].name === iName) {
                removeIndexArr.push(i);
                removeCount++;
                if (removeCount === amountToRemove) {
                    break;
                }
            }
        }

        // Remove items.
        for (const removeIndex of removeIndexArr) {
            this.items.splice(removeIndex, 1);
        }
    }

    /**
     * A method to return whether or not an array of items can be added to the inventory based on
     * slot and weight restraints.
     */
    canAdd(player: Player, items: Item[]): boolean {
        let numberOfItems = items.length;

        if (!this.canFit(numberOfItems)) {
            return false;
        }

        if (!player.canCarryAll(items)) {
            return false;
        }

        return true;
    }

    addItem(player: Player, item: Item): boolean {
        if (!this.canFit(1)) {
            return false;
        }

        if (!player.canCarry(item.weight)) {
            return false;
        }

        this.items.push(item);
        return true;
    }

    addItems(player: Player, items: Item[]): boolean {
        if (!this.canAdd(player, items)) {
            return false;
        }

        for (let item of items) {
            this.items.push(item);
        }

        return true;
    }

    private canFit(numberOfItems: number) {
        return this.items.length + numberOfItems <= G_MAX_INV_SIZE;
    }

    clear() {
        this.items = [];
    }

    addStarterItems() {
        let starter1 = new Equipment(
            'Moldy Sword',
            'An old and moldy sword. Is that wood beneath the mold? Or, something else? Who knows...',
            1,
            1,
            EquipmentType.WEAPON,
        );
        starter1.statBlock.damageMin = 1;
        starter1.statBlock.damageMax = 1;

        let starter2 = new Equipment(
            'Rusty Sword',
            `A rusted sword. Seems a bit better than the moldy sword, but is it really?`,
            1.5,
            1,
            EquipmentType.WEAPON,
        );
        starter2.statBlock.damageMin = 1;
        starter2.statBlock.damageMax = 2;

        let starter3 = new Equipment(
            'Paper Chestplate',
            `A chestplate made from discarded nespaper. It might have been useful if crafted into thick layers by a skilled artison. Unfortunately, it wasn't. Pray that it doesn't rain.`,
            3,
            1,
            EquipmentType.CHESTPLATE,
        );
        starter3.statBlock.health = 3;

        let starter4 = new Equipment(
            'Cardboard Chestplate',
            `A chestplate made from torn cardboard boxes. Does offer 'some' protection, but makes you uncomfortable, stiff and a bit itchy. You also smell... urine?`,
            5,
            1,
            EquipmentType.CHESTPLATE,
        );
        starter4.statBlock.armor = 1;

        this.items.push(starter1, starter2, starter3, starter4, IG_Herb.oran());
    }
}
