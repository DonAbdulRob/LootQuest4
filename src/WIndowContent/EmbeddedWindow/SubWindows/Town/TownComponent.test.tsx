import React from 'react';
import renderer from 'react-test-renderer';
import { GlobalContextInterface } from '../../../../Models/GlobalContextStore';
import { TownComponent } from './TownComponent';

it('town component renders', () => {
    // Verify component renders.
    const component = renderer.create(<TownComponent></TownComponent>);
    let tree: any = component.toJSON();
    expect(tree).toMatchSnapshot();
});

/**
 * 
function getPlayerGold(store: GlobalContextInterface) {
    return store.player.gold;
}

it('using the inn costs 2 gold (0 gold start, +5 gold cheat, -2 gold)', () => {
    // Get a new store.
    let store: any = create(createRootSlice);
    let newGold = 5;
    let finalExpectedGold = newGold - 2;

    // Player should start with 0 gold.
    expect(getPlayerGold(store)).toBe(0);

    // Give player 5 gold.
    let player = store.getState().player;
    player.gold = newGold;

    // Expect player to have 5 gold.
    expect(getPlayerGold(store)).toBe(newGold);

    // Use the inn.
    player.useInn();

    // Expect gold to be 3 now, because inn costs 2 gold.
    expect(getPlayerGold(store)).toBe(finalExpectedGold);
});

it('state reset test > using the inn costs 2 gold again (0 gold start, +10 gold cheat, -2 gold)', () => {
    // Get a new store.
    let store: any = create(createRootSlice);
    let newGold = 10;
    let finalExpectedGold = newGold - 2;

    // Player should start with 0 gold.
    expect(getPlayerGold(store)).toBe(0);

    // Give player 5 gold.
    let player = store.getState().player;
    player.gold = newGold;

    // Expect player to have 5 gold.
    expect(getPlayerGold(store)).toBe(newGold);

    // Use the inn.
    player.useInn();

    // Expect gold to be 3 now, because inn costs 2 gold.
    expect(getPlayerGold(store)).toBe(finalExpectedGold);
});
 */
