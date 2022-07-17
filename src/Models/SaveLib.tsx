import { __GLOBAL_REFRESH_FUNC_REF } from '../App';
import { Player } from './Fighter/Player/Player';
import { IGlobalContext } from './GlobalContextStore';
import { G_MONTHS_ARR, G_getPaddedToTwoDigits, G_getPaddedToThreeDigits } from './Helper';
import { Item } from './Item/Item';

export class SaveLib {
    saveFileName: string = '';

    constructor() {
        this.updateSaveFileName();
    }

    updateSaveFileName() {
        this.saveFileName = 'Loot_Quest_' + SaveLib.getNowStr() + '.txt';
    }

    private static getNowStr() {
        let now = new Date();

        return (
            G_MONTHS_ARR[now.getMonth()] +
            '_' +
            G_getPaddedToTwoDigits(now.getDate()) +
            '_' +
            now.getFullYear() +
            '_' +
            G_getPaddedToTwoDigits(now.getHours()) +
            '_' +
            G_getPaddedToTwoDigits(now.getMinutes()) +
            '_' +
            G_getPaddedToTwoDigits(now.getSeconds()) +
            '_' +
            G_getPaddedToThreeDigits(now.getMilliseconds())
        );
    }

    static getSaveData(store: IGlobalContext) {
        let player = store.playerManager.getMainPlayer();

        // TODO - save statuses.
        // statusContainer: player.statusContainer.getSaveData(),

        let saveObject = {
            player: {
                name: player.name,
                level: player.level,
                experience: player.experience,
                gold: player.gold,
                statBlock: player.statBlock,
                inventory: JSON.stringify(player.inventory),
                equipmentSlots: JSON.stringify(player.equipmentSlots),
                abilities: JSON.stringify(player.abilities),
            },
        };

        return JSON.stringify(saveObject);
    }

    // Protected level method.
    static loadStateFromSave(store: IGlobalContext, str: string) {
        let obj = JSON.parse(str);
        let objPlayer = obj.player;
        let player = new Player();
        let item1;
        let ele;

        player.name = objPlayer.name;
        player.level = objPlayer.level;
        player.experience = objPlayer.experience;
        player.gold = objPlayer.gold;
        player.statBlock = objPlayer.statBlock;

        player.inventory.items = [];
        let itemsFromJSON = JSON.parse(objPlayer.inventory);
        let inventoryItems = itemsFromJSON.items;

        for (item1 of inventoryItems) {
            player.inventory.items.push(Item.getFromJSON(item1));
        }

        player.equipmentSlots.items = [];
        let equipmentSlotsFromJSON = JSON.parse(objPlayer.equipmentSlots);
        let equipmentItems = equipmentSlotsFromJSON.items;

        for (let i = 0; i < equipmentItems.length; i++) {
            ele = equipmentItems[i];

            if (ele !== null) {
                player.equipmentSlots.items.push(Item.getFromJSON(ele));
            } else {
                player.equipmentSlots.items.push(null);
            }
        }

        // Set main player to the player loaded.
        store.playerManager.playerList[0] = player;
        __GLOBAL_REFRESH_FUNC_REF();
    }
}
