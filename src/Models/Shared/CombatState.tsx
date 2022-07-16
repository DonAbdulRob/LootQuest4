import { __GLOBAL_REFRESH_FUNC_REF } from '../../App';
import { RpgConsole } from '../Singles/RpgConsole';
import { IMonsterEffectFunction } from '../Fighter/Ability/MonsterAbilityContainer';
import { G_getRandomElement, G_getRandomValueBetween, G_getRandomValueUpTo } from '../Helper';
import { Item } from '../Item/Item';
import { ICustomDamageMessage } from './ICustomDamageMessage';
import { Monster } from '../Fighter/Monster/Monster';
import { MonsterGenerator } from '../Fighter/Monster/MonsterGenerator';
import { Player } from '../Fighter/Player';
import GameStateManager from '../Singles/GameStateManager';
import { IG_Herb } from '../Item/Consumables/IG_Herb';
import { IG_Sword } from '../Item/Equipment/IG_Sword';
import { IG_Chestplate } from '../Item/Equipment/IG_Chestplate';
import { GlobalContextInterface } from '../GlobalContextStore';

export default class CombatState {
    round: number = 0;
    loot: Array<Item> = [];
    generateLootLock: boolean = false;

    /**
     * Starts a fight with a specific monster type if a MonsterGenerator is supplied. Otherwise, starts a fight with a random monster.
     * @param store global game store
     * @param monsterGenerator a possible monster generator
     */
    startFight(store: GlobalContextInterface, monsterGenerator?: MonsterGenerator) {
        let player: Player = store.player;
        let enemy: Monster = store.enemy;
        let rpgConsole: RpgConsole = store.rpgConsole;
        let gameStateManager: GameStateManager = store.gameStateManager;
        let monsterLevel = G_getRandomValueBetween(player.currentArea.levelMin, player.currentArea.levelMax);

        if (monsterGenerator !== undefined) {
            enemy.generateMonsterSpecific(monsterGenerator);
        } else {
            enemy.generateMonsterRandom(monsterLevel, gameStateManager.gameDifficulty);
        }

        // TODO support known/unknown description.
        rpgConsole.add(enemy.monsterGenerator.unknownDescription);

        player.setCombatStart();
        __GLOBAL_REFRESH_FUNC_REF();
    }

    generateNewLoot(level: number) {
        this.loot = [];
        let lootRolls = G_getRandomValueUpTo(100);
        let lootAmount = 0;

        if (lootRolls >= 50) {
            lootAmount = 1;
        } else if (lootRolls >= 75) {
            lootRolls = 2;
        } else if (lootRolls >= 90) {
            lootRolls = 3;
        }

        let type;

        for (let i = 0; i < lootAmount; i++) {
            type = G_getRandomValueUpTo(3);

            if (type === 0) {
                let ig = new IG_Sword();
                let ele = G_getRandomElement(ig.getResource(0, level));
                this.loot.push(ele);
            } else if (type === 1) {
                let ig = new IG_Chestplate();
                let ele = G_getRandomElement(ig.getResource(0, level));
                this.loot.push(ele);
            } else if (type === 2) {
                let ig = new IG_Herb();
                let ele = G_getRandomElement(ig.getResource(0, level));
                this.loot.push(ele);
            }
        }
    }

    private getCustomDamageMessage(customDamageMessage: ICustomDamageMessage, damage: number) {
        return customDamageMessage.str1 + damage + customDamageMessage.str2;
    }

    private displayBasicAttackMessage(damage: number, rpgConsole: RpgConsole) {
        rpgConsole.add('You perform a basic attack for ' + damage + ' damage.');
    }

    private displayMessage(damage: number, rpgConsole: RpgConsole, customMessage: ICustomDamageMessage) {
        let finalMsg = '';

        if (customMessage.insertDamage) {
            finalMsg = this.getCustomDamageMessage(customMessage, damage);
        } else {
            finalMsg = customMessage.str1;
        }

        rpgConsole.add(finalMsg);
    }

    processCombatRound(store: GlobalContextInterface, customMessage?: ICustomDamageMessage | null) {
        let player = store.player;
        let enemy = store.enemy;
        let rpgConsole = store.rpgConsole;
        let combatState = store.combatState;
        let playerDead = false;
        let enemyDead = false;

        /**
         * Damage Calcs
         */

        let playerDamage = player.getRandomDamageValue() - enemy.getArmor();
        let enemyDamage = enemy.getRandomDamageValue() - player.getArmor();

        // Cap damage to 0 minimum.
        if (playerDamage < 0) {
            playerDamage = 0;
        }

        if (enemyDamage < 0) {
            enemyDamage = 0;
        }

        /**
         * Execute Player attack.
         */

        // If player has skip turn status, skip over damage portion entirely.
        if (!player.statusContainer.hasSkipTurnStatus()) {
            enemy.statBlock.healthMin -= playerDamage;
            this.displayBasicAttackMessage(playerDamage, rpgConsole);
        } else {
            if (customMessage !== undefined && customMessage !== null) {
                this.displayMessage(playerDamage, rpgConsole, customMessage);
            } else {
                console.warn(
                    `Warning: No description for the combat turn provided. This is not necessarily an error and may be intentional, assuming a message is expected then provided or isn't expected then isn't provided.`,
                );
            }
        }

        // If enemy died, then handle enemy death.
        if (enemy.statBlock.healthMin <= 0) {
            enemyDead = true;
            rpgConsole.add('Enemy died.');
            player.gold += enemy.gold;
            player.giveExperience(store);
            player.setLooting();

            // Generate loot.
            combatState.generateNewLoot(enemy.level);

            // End combat if no loot, else show loot screen.
            if (combatState.loot.length === 0) {
                player.setCombatOver();
            } else {
                player.setLooting();
            }
        }

        // If the enemy isn't dead, handle monster attack.
        if (!enemyDead) {
            // If there are any abilities, roll 25% chance to use it.
            let enemyAbilities: Array<IMonsterEffectFunction> = enemy.abilities.abilityArray;
            let usedAbility = false;

            if (enemyAbilities.length > 0) {
                let abilityUseChance = G_getRandomValueUpTo(4); // 20% chance.

                if (abilityUseChance === 0) {
                    usedAbility = true;
                    let doAbility: IMonsterEffectFunction = G_getRandomElement(enemyAbilities);

                    // Do the ability.
                    doAbility(store);
                }
            }

            // Otherwise, do basic attack.
            if (!usedAbility) {
                player.statBlock.healthMin -= enemyDamage;
                rpgConsole.add(enemy.name + ' hits you for ' + enemyDamage + ' damage.');
            }
        }

        // If Player died, handle player death.
        if (player.statBlock.healthMin <= 0) {
            playerDead = true;

            rpgConsole.add('You died! Fortunately, a passing Cleric revives you to full life. (Nice!)');

            // Heal and clear statuses.
            player.statBlock.healthMin = player.statBlock.healthMax;
            player.statusContainer.clear();

            // Reset combat state.
            player.setCombatOver();
        }

        // Process status effects.
        if (!playerDead) {
            player.statusContainer.reduceStatusTurns();
        }

        if (!enemyDead) {
            enemy.statusContainer.reduceStatusTurns();
        }

        // Refresh!
        __GLOBAL_REFRESH_FUNC_REF();
    }

    endLooting(store: GlobalContextInterface) {
        // Clear loot in combat state.
        store.combatState.loot = [];

        // Advance combat to next phase (out of combat)
        store.player.setCombatOver();

        // Refresh screen.
        __GLOBAL_REFRESH_FUNC_REF();
    }
}
