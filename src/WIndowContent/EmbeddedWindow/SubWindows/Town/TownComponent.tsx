/**
 * The 'Town Component' displays generic towns.
 */
import React from 'react';
import { __GLOBAL_REFRESH_FUNC_REF } from '../../../../App';
import { TownDescription } from '../../../../Models/Area/TownDescription';
import { IGlobalContext, StateContext } from '../../../../Models/GlobalContextStore';
import { IG_Herb } from '../../../../Models/Item/Consumables/IG_Herb';
import { IG_Chestplate } from '../../../../Models/Item/Equipment/IG_Chestplate';
import { IG_Sword } from '../../../../Models/Item/Equipment/IG_Sword';
import { Item } from '../../../../Models/Item/Item';
import { IG_Alloy } from '../../../../Models/Item/Resources/IG_Alloy';
import { IG_Wood } from '../../../../Models/Item/Resources/IG_Wood';
import { EViews } from './EViews';
import './TownComponent.css';

function setView(store: IGlobalContext, view: EViews) {
    store.playerManager.getMainPlayer().currentTownView = view;
    __GLOBAL_REFRESH_FUNC_REF();
}

function getRootView(store: IGlobalContext) {
    let player = store.playerManager.getMainPlayer();

    return (
        <div>
            <p>{player.currentArea.descriptions.root}</p>
            <button
                onClick={() => {
                    setView(store, EViews.Inn);
                }}
            >
                Inn
            </button>
            <button
                onClick={() => {
                    setView(store, EViews.Shop);
                }}
            >
                Shop
            </button>
            <button
                onClick={() => {
                    setView(store, EViews.Forge);
                }}
            >
                Forge
            </button>
            {/* 
            TODO:
            <button
                onClick={() => {
                    setView(store, EViews.Guild);
                }}
            >
                Visit Local Guild
            </button>
            */}
        </div>
    );
}

export function useTownInn(store: IGlobalContext) {
    // Allow player to rest if they have the 2 gp. Else, deny.
    let result = store.playerManager.getMainPlayer().useInn();

    if (result) {
        store.playerManager.getMainPlayer().fullHeal();
        store.rpgConsole.add('You rest for a while and heal up to perfect condition.');
    } else {
        store.rpgConsole.add('You are too poor to rest here.');
    }

    __GLOBAL_REFRESH_FUNC_REF();
}

function getInnView(store: IGlobalContext) {
    let d = store.playerManager.getMainPlayer().currentArea.descriptions as TownDescription;

    return (
        <div>
            <h1>Inn</h1>
            <p>{d.inn}</p>
            <button
                onClick={() => {
                    useTownInn(store);
                }}
            >
                Rest (2 GP)
            </button>
            <button
                onClick={() => {
                    // Buy drinks and unlock knowledge about Erin.
                    if (store.playerManager.getMainPlayer().gold >= 2) {
                        store.playerManager.getMainPlayer().gold -= 2;
                        if (store.playerManager.getMainPlayer().knowsErin === false) {
                            store.rpgConsole.add(
                                'You buy a round of drinks for the bar. As they celebrate, a man tells you about a Mage named Erin that he once knew.',
                            );
                            store.playerManager.getMainPlayer().knowsErin = true;
                        } else {
                            store.rpgConsole.add(
                                'You buy a round of drinks at the bar and have a merry time with the other patrons.',
                            );
                        }
                    } else {
                        store.rpgConsole.add('You are too poor to buy drinks.');
                    }

                    __GLOBAL_REFRESH_FUNC_REF();
                }}
            >
                Buy A Round (2 GP)
            </button>
            <br />
            {getBackButton(store)}
        </div>
    );
}

function getBuyButton(store: IGlobalContext, itemGenFunction: Function, cost: number) {
    // Create an instance of the item that will be used to show in the component.
    let item = itemGenFunction();

    return (
        <button
            onClick={() => {
                if (store.playerManager.getMainPlayer().gold < cost) {
                    store.rpgConsole.add('You are too poor to buy one ' + item.name + '.');
                    __GLOBAL_REFRESH_FUNC_REF();
                    return false;
                }
                if (
                    !store.playerManager.getMainPlayer().inventory.canAdd(store.playerManager.getMainPlayer(), [item])
                ) {
                    store.rpgConsole.addItemFail(item.name);
                    __GLOBAL_REFRESH_FUNC_REF();
                    return false;
                }

                // Take gold and give the player a new instance of the item.
                store.playerManager.getMainPlayer().gold -= cost;
                store.playerManager
                    .getMainPlayer()
                    .inventory.addItem(store.playerManager.getMainPlayer(), itemGenFunction());
                store.rpgConsole.add('You successfully buy one ' + item.name + '.');
                __GLOBAL_REFRESH_FUNC_REF();
            }}
        >
            {item.name + ' (' + cost + ' gp)'}
        </button>
    );
}

function getShopView(store: IGlobalContext) {
    let d = store.playerManager.getMainPlayer().currentArea.descriptions as TownDescription;

    return (
        <div>
            <h1>Shop</h1>
            <p>{d.shop}</p>
            <h2>Buy List</h2>
            {getBuyButton(store, IG_Herb.oran, 1)}
            {getBuyButton(store, IG_Herb.ryla, 5)}
            {getBuyButton(store, IG_Herb.moro, 25)}
            {getBuyButton(store, IG_Herb.tal, 200)}
            <br />
            {getBackButton(store)}
        </div>
    );
}

function getForgeElement(
    store: IGlobalContext,
    itemGenFunction: Function,
    desc: string,
    goldCost: number,
    resourceCost: Item,
    resourceCostAmount: number,
) {
    let player = store.playerManager.getMainPlayer();
    let r = __GLOBAL_REFRESH_FUNC_REF; // short and cute reference
    let itemTemplate = itemGenFunction();

    return (
        <div className="town-forge-element">
            <p>{itemTemplate.name}</p>
            <p>{desc}</p>
            <button
                onClick={() => {
                    // Precheck for gold, then logs, then success.
                    if (player.gold < goldCost) {
                        store.rpgConsole.add('You are too poor to craft this item.');
                        r();
                        return;
                    }

                    // Precheck logs.
                    if (!player.inventory.has_nameMatch(resourceCost, resourceCostAmount)) {
                        store.rpgConsole.add('You need more ' + resourceCost.name + 's to craft this item.');
                        r();
                        return;
                    }

                    // Remove required items.
                    player.inventory.remove_nameMatch(resourceCost, resourceCostAmount);
                    player.gold -= goldCost;

                    // Create Item and provide success.
                    player.inventory.addItem(player, itemGenFunction());
                    store.rpgConsole.add('You successfully craft one ' + itemTemplate.name + '!');
                    r();
                }}
            >
                Craft
            </button>
        </div>
    );
}

function getForgeView(store: IGlobalContext) {
    let description = store.playerManager.getMainPlayer().currentArea.descriptions as TownDescription;

    return (
        <div className="town-forge">
            <h1>Forge</h1>
            <p>{description.forge}</p>
            <div className="town-forge-elements">
                {getForgeElement(store, IG_Sword.oak, '3x Oak Log, 5 GP', 5, IG_Wood.oak(), 3)}
                {getForgeElement(store, IG_Sword.bronze, '3x Bronze Ingot, 12 GP', 12, IG_Alloy.bronze(), 3)}
                {getForgeElement(store, IG_Sword.iron, '3x Iron Ingot, 25 GP', 25, IG_Alloy.iron(), 3)}
                {getForgeElement(store, IG_Chestplate.bronze, '5x Bronze Ingot, 25 GP', 25, IG_Alloy.bronze(), 5)}
                {getForgeElement(store, IG_Chestplate.iron, '5x Iron Ingot, 50 GP', 50, IG_Alloy.iron(), 5)}
            </div>
            {getBackButton(store)}
        </div>
    );
}

/** TODO
function getGuildView(store: GlobalContextInterface) {
    return (
        <div>
            <h1>Guild</h1>
            <p>{store.playerManager.getMainPlayer().currentArea.descriptions.guild}</p>
            {getBackButton(store)}
        </div>
    );
}
 */

function getBackButton(store: IGlobalContext) {
    return (
        <button
            onClick={() => {
                setView(store, EViews.Root);
            }}
        >
            Exit
        </button>
    );
}
export function TownComponent() {
    const [store, setState] = React.useContext(StateContext);
    let view = store.playerManager.getMainPlayer().currentTownView;
    let content: any;

    if (view === EViews.Root) {
        content = getRootView(store);
    } else if (view === EViews.Shop) {
        content = getShopView(store);
    } else if (view === EViews.Inn) {
        content = getInnView(store);
    } else if (view === EViews.Forge) {
        content = getForgeView(store);
    }

    /** TODO
     * else if (view === EViews.Guild) {
        content = getGuildView(store);
    } */

    return (
        <div>
            <h1>{store.playerManager.getMainPlayer().currentArea.getDisplay()}</h1>
            {content}
        </div>
    );
}
