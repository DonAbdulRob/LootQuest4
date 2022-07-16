import React from 'react';
import EPlayerActivity from '../../../Models/Fighter/EPlayerActivity';
import LootTransitionComponent from './LootTransitionComponent';
import { PlayerAbilityEffectLib } from '../../../Models/Shared/EffectLib/PlayerAbilityEffectLib';
import { MG_Erin } from '../../../Models/Fighter/Monster/MonsterGenerators/Humanoids/MG_Erin';
import { StateContext } from '../../../Models/GlobalContextStore';

export default function CombatComponent(): JSX.Element {
    const [store, setState] = React.useContext(StateContext);
    let player = store.player;
    let enemy = store.enemy;
    let display;
    let mg = enemy.monsterGenerator;
    let enemyName = '';
    let enemyDescription = '';

    if (player.knowsErin && mg.knownName === MG_Erin.knownName) {
        enemyName = mg.knownName;
        enemyDescription = mg.knownDescription;
    } else {
        enemyName = mg.unknownName;
        enemyDescription = mg.unknownDescription;
    }

    switch (player.activity) {
        case EPlayerActivity.IN_COMBAT_FIGHTING:
            display = (
                <div>
                    <h1>
                        {player.name} vs. {enemyName}
                    </h1>
                    <p>{enemyDescription}</p>
                    <p>
                        {player.statBlock.healthMin} vs. {enemy.statBlock.healthMin}
                    </p>
                    <button
                        onClick={() => {
                            store.combatState.processCombatRound(store);
                        }}
                    >
                        Attack
                    </button>
                    <button
                        onClick={() => {
                            // Use 'defense ability'.
                            PlayerAbilityEffectLib.defend(store);
                        }}
                    >
                        Defend
                    </button>
                    <button
                        onClick={() => {
                            PlayerAbilityEffectLib.flee(store);
                        }}
                    >
                        Flee
                    </button>
                </div>
            );
            break;
        case EPlayerActivity.IN_COMBAT_LOOTING:
            display = <LootTransitionComponent />;
            break;
        default:
            display = <div></div>;
    }

    return <div className="combat-window">{display}</div>;
}
