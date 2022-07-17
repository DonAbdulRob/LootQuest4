import { Monster } from './Monster/Monster';

export class MonsterManager {
    monsterList: Monster[] = [];

    constructor() {
        // Always add main player by default.
        this.monsterList.push(new Monster());
    }

    getMainMonster() {
        return this.monsterList[0];
    }
}
