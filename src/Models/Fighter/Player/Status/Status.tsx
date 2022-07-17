/**
 * This file defines status effects that can be given to Fighters.
 * Statuses are generally temporary buffs or debuffs that affect the fighter in some manner over their duration.
 */

// Special 'skip turn' status for when player/monster uses ability.
export const G_HIDDEN_SKIP_TURN_STATUS = 'HIDDEN_SKIP_TURN_STATUS';

export class Status {
    name: string;
    remainingTurns: number;
    doFunc: Function | null;
    endFunc: Function | null;
    isBeneficial: boolean;

    constructor(
        name: string,
        remainingTurns: number,
        applyEffect: Function | null,
        endEffect: Function | null,
        isBeneficial: boolean,
    ) {
        this.name = name;
        this.remainingTurns = remainingTurns;
        this.doFunc = applyEffect;
        this.endFunc = endEffect;
        this.isBeneficial = isBeneficial;
    }
}
