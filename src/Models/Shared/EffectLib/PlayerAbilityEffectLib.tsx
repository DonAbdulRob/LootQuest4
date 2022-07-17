/**
 * This file contains all of the 'Core Effect' functions for the game.
 * Core effects are data interactions that are usually triggered by the player making us of an item or ability.
 * However, this may be expanded to encapsulate other effects, like resting at an inn to heal, granting 'blessings' or literally anything else.
 *
 * Note: Don't do percentage increases/decreases for now because we don't have seperate 'buffStatBlock' to uncalculate % buffs yet.
 */
import { __GLOBAL_REFRESH_FUNC_REF } from '../../../App';
import { RpgConsole } from '../../Singles/RpgConsole';
import { Player } from '../../Fighter/Player/Player';
import Fighter from '../../Fighter/Fighter';
import { G_HIDDEN_SKIP_TURN_STATUS, Status } from '../../Fighter/Player/Status/Status';
import { activateHealthHealItem } from './EffectLIbHelpers';
import { G_getRandomValueUpTo } from '../../Helper';
import { IGlobalContext } from '../../GlobalContextStore';

const STR_COMBAT_ONLY = 'This ability can only be used in combat.';
const STR_NOT_ENOUGH_RESOURCE = `You can't afford to use this ability.`;

export interface IPlayerItemEffectFunction {
    (store: IGlobalContext, index: number): void;
}

export interface IAbilityEffectFunction {
    (store: IGlobalContext): void;
}

export interface INonCombatAction {
    (store: IGlobalContext, message: string): void;
}

function canCast_CombatOnlyCheck(store: IGlobalContext, staminaCost: number, manaCost: number): boolean {
    // Prevent use of ability outside of combat.
    if (!store.playerManager.getMainPlayer().isFighting()) {
        store.rpgConsole.add(STR_COMBAT_ONLY);
        __GLOBAL_REFRESH_FUNC_REF();
        return false;
    }

    // Check other conditions.
    return canCast_AnywhereCheck(store.playerManager.getMainPlayer(), staminaCost, manaCost, store.rpgConsole);
}

/**
 * Is used to check required fields to be able to use abilities.
 * For instance, ability cost and, for the future, status checks (like silence).
 */
function canCast_AnywhereCheck(player: Player, staminaCost: number, manaCost: number, rpgConsole: RpgConsole): boolean {
    // Make sure player can pay skill cost.
    let canAfford = player.statBlock.staminaMin >= staminaCost && player.statBlock.manaMin >= manaCost;

    if (canAfford) {
        player.statBlock.staminaMin -= staminaCost;
        player.statBlock.manaMin -= manaCost;
    } else {
        rpgConsole.add(STR_NOT_ENOUGH_RESOURCE);
        __GLOBAL_REFRESH_FUNC_REF();
        return false;
    }

    return true;
}

// Core effects can be used by either players or monsters.
export class CoreEffects {
    static oran_herb = (user: Fighter, index: number, rpgConsole: RpgConsole) => {
        activateHealthHealItem(
            user,
            index,
            rpgConsole,
            1,
            'You apply the Oran Herb and feel slightly healthier. (+1 Healing).',
        );
    };

    static ryla_herb = (user: Fighter, index: number, rpgConsole: RpgConsole) => {
        activateHealthHealItem(
            user,
            index,
            rpgConsole,
            2,
            'You apply the Oran Herb and feel a tad healthier. (+2 Healing).',
        );
    };
    static moro_herb = (user: Fighter, index: number, rpgConsole: RpgConsole) => {
        activateHealthHealItem(user, index, rpgConsole, 3, 'You apply the Moro Herb and feel healthier. (+3 Healing).');
    };

    static tal_herb = (user: Fighter, index: number, rpgConsole: RpgConsole) => {
        activateHealthHealItem(
            user,
            index,
            rpgConsole,
            5,
            'You apply the Tal Herb and feel much healthier. (+5 Healing).',
        );
    };
}

// Items can be used by players or monsters (WIP). This is for players.
export class PlayerItemEffectLib {
    static handleCombatSkip(store: IGlobalContext) {
        // If fighting, add skip turn status and handle combat round.
        if (store.playerManager.getMainPlayer().isFighting()) {
            PlayerAbilityEffectLib.addSkipTurnStatusToPlayer(store.playerManager.getMainPlayer());
            store.combatState.processCombatRound(store);
        }
    }

    static oran_herb: IPlayerItemEffectFunction = (store: IGlobalContext, index: number) => {
        // Intentionally use seperated store elements since core_effects can apply to any kind of fighter.
        CoreEffects.oran_herb(store.playerManager.getMainPlayer(), index, store.rpgConsole);
        PlayerItemEffectLib.handleCombatSkip(store);
    };

    static ryla_herb: IPlayerItemEffectFunction = (store: IGlobalContext, index: number) => {
        CoreEffects.ryla_herb(store.playerManager.getMainPlayer(), index, store.rpgConsole);
        PlayerItemEffectLib.handleCombatSkip(store);
    };

    static moro_herb: IPlayerItemEffectFunction = (store: IGlobalContext, index: number) => {
        CoreEffects.moro_herb(store.playerManager.getMainPlayer(), index, store.rpgConsole);
        PlayerItemEffectLib.handleCombatSkip(store);
    };

    static tal_herb: IPlayerItemEffectFunction = (store: IGlobalContext, index: number) => {
        CoreEffects.tal_herb(store.playerManager.getMainPlayer(), index, store.rpgConsole);
        PlayerItemEffectLib.handleCombatSkip(store);
    };
}

export class PlayerAbilityEffectLib {
    static addSkipTurnStatusToPlayer = (player: Player) => {
        player.statusContainer.addStatus(new Status(G_HIDDEN_SKIP_TURN_STATUS, 1, null, null, false));
    };

    static doNonCombatAction: INonCombatAction = (store: IGlobalContext, actionMessage: string) => {
        // Give player skip_turn status.
        PlayerAbilityEffectLib.addSkipTurnStatusToPlayer(store.playerManager.getMainPlayer());

        // Process combat round.
        store.combatState.processCombatRound(store, {
            insertDamage: false,
            str1: actionMessage,
        });
    };

    static flee: IAbilityEffectFunction = (store: IGlobalContext) => {
        // Attempt to flee. On success, return, else, continue combat. (25%)
        let fleeRes = G_getRandomValueUpTo(3);

        if (fleeRes === 0) {
            store.rpgConsole.add('You successfully flee from combat.');
            store.playerManager.getMainPlayer().setCombatOver();
            __GLOBAL_REFRESH_FUNC_REF();
            return;
        }

        // Give player skip_turn status.
        PlayerAbilityEffectLib.addSkipTurnStatusToPlayer(store.playerManager.getMainPlayer());

        // Process combat round.
        store.combatState.processCombatRound(store, {
            insertDamage: false,
            str1: 'Your attempt to flee fails.',
        });
    };

    static defend: IAbilityEffectFunction = (store: IGlobalContext) => {
        // Player can always defend.
        let player = store.playerManager.getMainPlayer();

        // Add defense buff status to player.
        let armorMod = 2;

        player.statusContainer.addStatus(
            new Status(
                'Defend',
                1,
                () => {
                    player.statBlock.armor += armorMod;
                },
                () => {
                    player.statBlock.armor -= armorMod;
                },
                true,
            ),
        );

        // Add skip turn status.
        PlayerAbilityEffectLib.addSkipTurnStatusToPlayer(player);

        // Perform an attack with a custom damage message format.
        store.combatState.processCombatRound(store, {
            insertDamage: false,
            str1: 'You take a defensive stance and gain +2 armor for the round.',
        });
    };

    static equip: IAbilityEffectFunction = (store: IGlobalContext) => {
        let player = store.playerManager.getMainPlayer();

        if (player.isFighting()) {
            // Add skip turn status.
            PlayerAbilityEffectLib.addSkipTurnStatusToPlayer(player);

            // Perform an attack with a custom damage message format.
            store.combatState.processCombatRound(store, {
                insertDamage: false,
                str1: 'You spend some time switching your equipment.',
            });
        }
    };

    static drop: IAbilityEffectFunction = (store: IGlobalContext) => {
        let player = store.playerManager.getMainPlayer();

        if (player.isFighting()) {
            // Add skip turn status.
            PlayerAbilityEffectLib.addSkipTurnStatusToPlayer(player);

            // Perform an attack with a custom damage message format.
            store.combatState.processCombatRound(store, {
                insertDamage: false,
                str1: 'You spend some time dropping an item.',
            });
        }
    };

    static power_strike: IAbilityEffectFunction = (store: IGlobalContext) => {
        let player = store.playerManager.getMainPlayer();

        // Check that player can cast via standard check function.
        if (!canCast_CombatOnlyCheck(store, 1, 0)) {
            return;
        }

        // Add damage buff status to player.
        let damageMod = 2;

        player.statusContainer.addStatus(
            new Status(
                'Power Strike',
                1,
                () => {
                    player.statBlock.damageMin += damageMod;
                    player.statBlock.damageMax += damageMod;
                },
                () => {
                    player.statBlock.damageMin -= damageMod;
                    player.statBlock.damageMax -= damageMod;
                },
                true,
            ),
        );

        // Perform an attack with a custom damage message format.
        store.combatState.processCombatRound(store, {
            insertDamage: true,
            str1: 'You activate Power Strike and attack for ',
            str2: ' damage!',
        });
    };

    static lesser_heal: IAbilityEffectFunction = (store: IGlobalContext) => {
        let player = store.playerManager.getMainPlayer();
        let rpgConsole = store.rpgConsole;

        // Check that player can cast via standard check function.
        if (!canCast_AnywhereCheck(player, 0, 5, rpgConsole)) {
            return;
        }

        // Message str..
        let str = 'You cast Lesser Heal. (+1 Health)';

        // Heal player.
        player.healHealth(1);

        // Add skip turn status to player.
        PlayerAbilityEffectLib.addSkipTurnStatusToPlayer(player);

        // If in combat, perfrom a combat turn.
        if (player.isFighting()) {
            store.combatState.processCombatRound(store, {
                insertDamage: false,
                str1: str,
            });
        } else {
            rpgConsole.add(str);
            __GLOBAL_REFRESH_FUNC_REF();
        }
    };
}
