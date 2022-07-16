/**
 * Our cheat component allows developers and testers to make unrestricted game state modifications.
 */
import React from 'react';
import { Equipment, EquipmentType } from '../../Models/Item/Item';
import { __GLOBAL_REFRESH_FUNC_REF } from '../../App';
import { Player } from '../../Models/Fighter/Player';
import { WiseManEncounter } from '../../Story/RandomEncounters/WiseManEncounter';
import { IG_Wood } from '../../Models/Item/Resources/IG_Wood';
import { IG_Herb } from '../../Models/Item/Consumables/IG_Herb';
import { IG_Alloy } from '../../Models/Item/Resources/IG_Alloy';
import { GlobalContextInterface, StateContext } from '../../Models/GlobalContextStore';

function addGodSword(store: GlobalContextInterface) {
    let item = new Equipment('God Sword', 'A cheat god sword.', 50, 999, EquipmentType.WEAPON);

    item.statBlock.damageMin = 99;
    item.statBlock.damageMax = 99;
    item.statBlock.health = 99;
    item.statBlock.stamina = 99;
    item.statBlock.mana = 99;
    item.statBlock.armor = 99;

    if (!store.player.inventory.addItem(store.player, item)) {
        store.rpgConsole.addItemFail(item.name);
    }

    __GLOBAL_REFRESH_FUNC_REF();
}

function startWiseManEncounter(store: GlobalContextInterface) {
    // Start the wise man encounter.
    store.gameStateManager.wiseManEncounter = new WiseManEncounter(store);
    __GLOBAL_REFRESH_FUNC_REF();
}

function autoPlayOneRound(store: GlobalContextInterface) {
    let player: Player = store.player;

    // Create monster if player is idle.
    if (player.isIdle()) {
        store.combatState.startFight(store);
        __GLOBAL_REFRESH_FUNC_REF();
        return;
    }

    while (player.isFighting()) {
        store.combatState.processCombatRound(store);
        __GLOBAL_REFRESH_FUNC_REF();
        return;
    }

    if (player.isLooting()) {
        player.setCombatOver();
        __GLOBAL_REFRESH_FUNC_REF();
        return;
    }
}

function autoPlayTwo(store: GlobalContextInterface) {
    for (let i = 0; i < 10000; i++) {
        autoPlayOneRound(store);
    }
}

function autoPlayThree(store: GlobalContextInterface) {
    for (let i = 0; i < 1000000; i++) {
        autoPlayOneRound(store);
    }
}

export default function CheatComponent(): JSX.Element {
    const [store, setState] = React.useContext(StateContext);
    let player = store.player;

    return (
        <div className="window-core">
            <button
                onClick={() => {
                    addGodSword(store);
                }}
            >
                Add God Sword
            </button>
            <button
                onClick={() => {
                    store.player.inventory.addItem(store.player, IG_Wood.oak());
                    __GLOBAL_REFRESH_FUNC_REF();
                }}
            >
                Add Oak Log
            </button>
            <button
                onClick={() => {
                    store.player.inventory.addItem(store.player, IG_Alloy.bronze());
                    __GLOBAL_REFRESH_FUNC_REF();
                }}
            >
                Add Bronze Ingot
            </button>
            <button
                onClick={() => {
                    store.player.inventory.addItem(store.player, IG_Alloy.iron());
                    __GLOBAL_REFRESH_FUNC_REF();
                }}
            >
                Add Iron Ingot
            </button>
            <button
                onClick={() => {
                    store.player.inventory.addItem(store.player, IG_Herb.tal());
                    __GLOBAL_REFRESH_FUNC_REF();
                }}
            >
                Add Tal Herb
            </button>
            <button
                onClick={() => {
                    player.fullHeal();
                    __GLOBAL_REFRESH_FUNC_REF();
                }}
            >
                Heal
            </button>
            <button
                onClick={() => {
                    player.gold = 999999;
                    __GLOBAL_REFRESH_FUNC_REF();
                }}
            >
                Big Money
            </button>
            <button
                onClick={() => {
                    autoPlayOneRound(store);
                }}
            >
                Autoplay 1
            </button>
            <button
                onClick={() => {
                    autoPlayTwo(store);
                }}
            >
                Autoplay 10,000
            </button>
            <button
                onClick={() => {
                    autoPlayThree(store);
                }}
            >
                Autoplay 1,000,000
            </button>

            <button
                onClick={() => {
                    startWiseManEncounter(store);
                }}
            >
                Start Wise Man Encounter
            </button>
        </div>
    );
}
