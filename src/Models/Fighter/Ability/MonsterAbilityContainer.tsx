/**
 * Monster ability container can hold direct function references since it doesn't need serialized.
 */

import { RpgConsole } from '../../Singles/RpgConsole';
import { Player } from '../Player/Player';
import { Monster } from '../Monster/Monster';
import { IGlobalContext } from '../../GlobalContextStore';

export interface IMonsterEffectFunction {
    (store: IGlobalContext): void;
}

export class MonsterAbilityContainer {
    abilityArray: Array<IMonsterEffectFunction> = [];

    constructor() {
        this.abilityArray.push(MonsterEffectLib.power_strike);
    }

    clear() {
        this.abilityArray = [];
    }
}

// Monster specific effects.
export class MonsterEffectLib {
    static power_strike: IMonsterEffectFunction = (store: IGlobalContext) => {
        let player: Player = store.playerManager.getMainPlayer();
        let monster: Monster = store.monsterManager.getMainMonster();
        let rpgConsole: RpgConsole = store.rpgConsole;

        let abilityDamage = 2;

        // TODO: Move 'dealt damage' calc into fighter class, same for combat class.
        let damage = monster.getRandomDamageValue() + abilityDamage - player.getArmor();

        if (damage < 0) {
            damage = 0;
        }

        player.statBlock.healthMin -= damage;
        rpgConsole.add(monster.name + ' uses Feral Strike and deals ' + damage + ' damage to you.');
    };
}
