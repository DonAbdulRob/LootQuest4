import { G_getRandomValueBetween } from '../Helper';
import { Equipment } from '../Item/Item';
import { IStatBlock } from '../Shared/IStatBlock';
import { StatusContainer } from './Player/Status/StatusContainer';
import { EquipmentSlots } from './Storage/EquipmentSlots';
import Inventory from './Storage/Inventory';
import { immerable } from 'immer';

export default class Fighter {
    [immerable] = true;
    name: string = '';
    level: number = 0;
    experience: number = 0;
    gold: number = 0;

    statBlock: IStatBlock = {
        healthMin: 0,
        healthMax: 0,
        staminaMin: 0,
        staminaMax: 0,
        manaMin: 0,
        manaMax: 0,
        damageMin: 0,
        damageMax: 0,
        armor: 0,
    };

    inventory: Inventory = new Inventory();
    equipmentSlots: EquipmentSlots = new EquipmentSlots();
    statusContainer: StatusContainer = new StatusContainer();

    /** Reset all properties EXCEPT the 'isPlayer' property. Should be updated as new properties are added. */
    reset() {
        this.name = '';
        this.level = 0;
        this.experience = 0;
        this.gold = 0;
        this.statBlock.healthMin = 0;
        this.statBlock.healthMax = 0;
        this.statBlock.staminaMin = 0;
        this.statBlock.staminaMax = 0;
        this.statBlock.manaMin = 0;
        this.statBlock.manaMax = 0;
        this.statBlock.damageMin = 0;
        this.statBlock.damageMax = 0;
        this.statBlock.armor = 0;
        this.inventory.clear();
        this.equipmentSlots.clear();
        this.statusContainer.clear();
    }

    getDamageRange = (): [a: number, b: number] => {
        let damageMin = this.statBlock.damageMin;
        let damageMax = this.statBlock.damageMax;

        for (const equipment of this.equipmentSlots.items) {
            if (equipment) {
                damageMin += equipment.statBlock.damageMin;
                damageMax += equipment.statBlock.damageMax;
            }
        }

        return [damageMin, damageMax];
    };

    getDamageDisplay = (): string => {
        const r = this.getDamageRange();
        return r[0] + ' - ' + r[1];
    };

    getHealthDisplay = (): string => {
        return this.statBlock.healthMin + '/' + this.getHealthMax();
    };

    getStaminaDisplay = (): string => {
        return this.statBlock.staminaMin + '/' + this.getStaminaMax();
    };

    getManaDisplay = (): string => {
        return this.statBlock.manaMin + '/' + this.getManaMax();
    };

    getRandomDamageValue = () => {
        return G_getRandomValueBetween(...this.getDamageRange());
    };

    getArmor = () => {
        let armor = this.statBlock.armor;
        this.equipmentSlots.items.forEach((v: Equipment | null) => {
            if (v != null) armor += v.statBlock.armor;
        });
        return armor;
    };

    getHealthMax = () => {
        let healthMax = this.statBlock.healthMax;
        this.equipmentSlots.items.forEach((v: Equipment | null) => {
            if (v != null) healthMax += v.statBlock.health;
        });
        return healthMax;
    };

    getStaminaMax = () => {
        let staminaMax = this.statBlock.staminaMax;
        this.equipmentSlots.items.forEach((v: Equipment | null) => {
            if (v != null) staminaMax += v.statBlock.stamina;
        });
        return staminaMax;
    };

    getManaMax = () => {
        let manaMax = this.statBlock.manaMax;
        this.equipmentSlots.items.forEach((v: Equipment | null) => {
            if (v != null) manaMax += v.statBlock.mana;
        });
        return manaMax;
    };

    healHealth = (x: number) => {
        this.statBlock.healthMin += x;
        let maxHealth = this.getHealthMax();

        if (this.statBlock.healthMin > maxHealth) {
            this.statBlock.healthMin = maxHealth;
        }
    };

    getExpToLevel = () => {
        return this.level * 10;
    };

    fullHeal = () => {
        this.statBlock.healthMin = this.getHealthMax();
        this.statBlock.manaMin = this.getManaMax();
        this.statBlock.staminaMin = this.getStaminaMax();
    };
}
