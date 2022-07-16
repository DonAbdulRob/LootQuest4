import React from 'react';
import ResourceBar, { ResourceBarProps } from '../../Components/ResourceBar/ResourceBar';
import Fighter from '../../Models/Fighter/Fighter';
import { StateContext } from '../../Models/GlobalContextStore';
import CharacterProps from '../SharedProps/CharacterProps';
import './CharacterComponent.css';

export default function CharacterComponent(props: CharacterProps): JSX.Element {
    const [state, setState] = React.useContext(StateContext);
    let fighter: Fighter = props.usePlayer ? state.player : state.enemy;
    let display;
    let expToLevel = fighter.getExpToLevel();

    let expBar: ResourceBarProps = {
        color: 'rgb(158, 158, 158)',
        val: fighter.experience,
        min: 0,
        max: expToLevel,
    };

    let healthBar: ResourceBarProps = {
        color: 'rgb(213, 103, 103)',
        val: fighter.statBlock.healthMin,
        min: 0,
        max: fighter.getHealthMax(),
    };

    let staminaBar: ResourceBarProps = {
        color: 'rgb(122, 225, 122)',
        val: fighter.statBlock.staminaMin,
        min: 0,
        max: fighter.getStaminaMax(),
    };

    let manaBar: ResourceBarProps = {
        color: 'rgb(84, 105, 227)',
        val: fighter.statBlock.manaMin,
        min: 0,
        max: fighter.getManaMax(),
    };

    if (fighter.name === '') {
        display = (
            <div>
                <p>No enemy yet!</p>
            </div>
        );
    } else {
        display = (
            <div>
                <p className="header-1">{fighter.name}</p>
                <p>{'Lvl: ' + fighter.level}</p>
                <p>Exp: {fighter.experience + '/' + expToLevel}</p>
                <ResourceBar {...expBar} />
                <p>HP: {fighter.getHealthDisplay()}</p>
                <ResourceBar {...healthBar} />
                <p>SP: {fighter.getStaminaDisplay()}</p>
                <ResourceBar {...staminaBar} />
                <p>MP: {fighter.getManaDisplay()}</p>
                <ResourceBar {...manaBar} />
                <p>Gold: {fighter.gold}</p>
                <p>DMG: {fighter.getDamageDisplay()}</p>
                <p>ARMOR: {fighter.getArmor()}</p>
            </div>
        );
    }

    return <div className="window-core">{display}</div>;
}
