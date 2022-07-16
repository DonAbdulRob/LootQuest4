/**
 * Represents the main character being played by the real-life player interacting with the game.
 */
import { PlayerAbilityContainer } from './Ability/PlayerAbilityContainer';
import { immerable } from 'immer';
import { __GLOBAL_REFRESH_FUNC_REF } from '../../App';
import Area from '../Area/Area';
import { G_AREA_GREENVALE } from '../Area/AreaContainer';
import Fighter from './Fighter';
import EPlayerActivity from './EPlayerActivity';
import { Item } from '../Item/Item';
import { G_getFixedLengthNumber } from '../Helper';
import { EViews } from '../../WIndowContent/EmbeddedWindow/SubWindows/Town/EViews';
import { GlobalContextInterface } from '../GlobalContextStore';

export class Player extends Fighter {
    [immerable] = true;
    abilities: PlayerAbilityContainer = new PlayerAbilityContainer();
    currentArea: Area = G_AREA_GREENVALE;
    activity: EPlayerActivity = EPlayerActivity.IDLE;
    knowsErin: boolean = false;
    currentTownView: EViews = EViews.Root;

    constructor() {
        super();
        this.generatePlayer();
    }

    generatePlayer = () => {
        this.name = 'Joe';
        this.level = 1;
        this.experience = 0;
        this.gold = 0;
        this.statBlock.healthMin = 10;
        this.statBlock.healthMax = 10;
        this.statBlock.staminaMin = 5;
        this.statBlock.staminaMax = 5;
        this.statBlock.manaMin = 5;
        this.statBlock.manaMax = 5;
        this.statBlock.damageMin = 1;
        this.statBlock.damageMax = 2;
    };

    giveExperience = (state: GlobalContextInterface) => {
        // Calculate experience to aware. If the enemy is 4 levels weaker than the player, grant -25% experience per level lower it is.
        let awardExp = state.enemy.experience;
        let levelDiff = this.level - state.enemy.level;

        if (levelDiff > 3) {
            awardExp *= 1 - (levelDiff - 2) * 0.25;

            if (awardExp < 0) {
                awardExp = 0;
            }
        }

        let expToLevel = this.getExpToLevel();
        this.experience += awardExp;

        if (this.experience >= expToLevel) {
            this.experience -= expToLevel;
            this.level += 1;

            // Increase resources.
            this.statBlock.healthMax += 2;
            this.statBlock.manaMax += 1;
            this.statBlock.staminaMax += 1;

            // Heal.
            this.fullHeal();

            // Every 2 levels gain 1 armor and +1/1 damage. (Start at level 1, so check at 3, 5, 7, etc.).
            if (this.level % 3 === 0 || (this.level > 3 && this.level % 2 === 1)) {
                this.statBlock.armor += 1;
                this.statBlock.damageMin += 1;
                this.statBlock.damageMax += 1;
            }

            state.rpgConsole.add('You have leveled up to ' + this.level + '!');
            __GLOBAL_REFRESH_FUNC_REF();
        }
    };

    /**
     * Weight management functions.
     */

    weightMax: number = 120;

    /**
     *
     * @param newWeight Takes a new weight to calculate based off of.
     * @returns {boolean} true/false
     */
    canCarry(newWeight: number): boolean {
        return this.getTotalWeight() + newWeight <= this.weightMax;
    }

    /**
     * Checks to see if inventory can support the weight of several item weights at once.
     * We reduce the weights to get a total weight value, then call canCarry to see if the inventory can support the weight.
     */
    canCarryAll(itemArr: Item[]): boolean {
        return this.canCarry(itemArr.map((v) => v.weight).reduce((a, b) => a + b));
    }

    getTotalWeight(): number {
        let finalWeight = 0;

        for (let x of this.inventory.items) {
            finalWeight += x.weight;
        }

        for (let x of this.equipmentSlots.items) {
            if (x !== null) {
                finalWeight += x.weight;
            }
        }

        return G_getFixedLengthNumber(finalWeight);
    }

    /**
     * Activity related section.
     */
    setCombatStart = () => {
        this.activity = EPlayerActivity.IN_COMBAT_FIGHTING;
    };

    setLooting = () => {
        this.activity = EPlayerActivity.IN_COMBAT_LOOTING;
    };

    setCombatOver = () => {
        this.activity = EPlayerActivity.IDLE;
    };

    isFighting = () => {
        return this.activity === EPlayerActivity.IN_COMBAT_FIGHTING;
    };

    isIdle = () => {
        return this.activity === EPlayerActivity.IDLE;
    };

    isLooting = () => {
        return this.activity === EPlayerActivity.IN_COMBAT_LOOTING;
    };

    inCombat = () => {
        return (
            this.activity === EPlayerActivity.IN_COMBAT_FIGHTING || this.activity === EPlayerActivity.IN_COMBAT_LOOTING
        );
    };

    /**
     * Processes gold transaction for using the inn, of subtracting 'inn_cost' gold.
     * @returns
     */
    useInn: () => boolean = () => {
        let inn_cost = 2;

        if (this.gold >= inn_cost) {
            this.gold -= inn_cost;
            return true;
        }

        return false;
    };
}
