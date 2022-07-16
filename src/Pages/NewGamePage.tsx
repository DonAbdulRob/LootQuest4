/**
 * The New Game page is where the player chooses their character and game settings.
 */

import { mdiCheck, mdiSkull, mdiSword } from '@mdi/js';
import Icon from '@mdi/react';
import * as React from 'react';
import { __GLOBAL_REFRESH_FUNC_REF } from '../App';
import IconButton from '../Components/IconButton/IconButton';
import { Player } from '../Models/Fighter/Player';
import { iconSizeStr, StateContext } from '../Models/GlobalContextStore';
import { DifficultyEnum } from '../Models/Singles/GameDifficulty';
import GameStateManager from '../Models/Singles/GameStateManager';
import { PageContainer } from './Enums/PageContainer';
import './NewGamePage.css';

function getDifficultyButton(gameStateManager: GameStateManager, names: string[], i: number) {
    let icons = [];
    let icon = i < 2 ? mdiSword : mdiSkull;

    for (let l = 0; l < (i % 2) + 1; l++) {
        icons.push(<Icon className={'button-with-icon'} path={icon} size={iconSizeStr} />);
    }

    return (
        <button
            className={'button-with-icon'}
            onClick={() => {
                gameStateManager.gameDifficulty.difficulty = i;
                __GLOBAL_REFRESH_FUNC_REF();
            }}
        >
            {icons[0]}
            {icons.length >= 2 && icons[1]}
            <div className="pad-left-and-right-5">{names[i]}</div>
            {icons[0]}
            {icons.length >= 2 && icons[1]}
        </button>
    );
}

export default function NewGamePage() {
    const [state, setState] = React.useContext(StateContext);
    let player: Player = state.player;
    let gameStateManager: GameStateManager = state.gameStateManager;

    let [name, setName] = React.useState(player.name);
    let keys = Object.keys(DifficultyEnum);
    let difficulty = gameStateManager.gameDifficulty.difficulty;
    let desc = gameStateManager.gameDifficulty.getDifficultyData().description;
    let names = [];

    for (let i = keys.length * 0.5; i < keys.length; i++) {
        names.push(keys[i]);
    }

    let difficultyStr = names[difficulty];
    let canFinish = player.name !== '';

    return (
        <div>
            <h1>Character Creation</h1>
            <hr />

            <div className="new-game-section">
                <h1>Name</h1>
                <input
                    type="text"
                    value={player.name}
                    onChange={(e: any) => {
                        let input = e.target.value;

                        if (input.length > 16) {
                            input = input.substring(0, 16);
                        }

                        setName(input);
                        player.name = input;
                    }}
                ></input>
                <p style={{ color: 'grey' }}>Enter a name to continue</p>
            </div>

            <div className="new-game-section">
                <h1>Difficulty - {difficultyStr}</h1>
                <h2>{desc}</h2>
                <div style={{ display: 'flex' }}>
                    {getDifficultyButton(gameStateManager, names, 0)}
                    {getDifficultyButton(gameStateManager, names, 1)}
                    {getDifficultyButton(gameStateManager, names, 2)}
                    {getDifficultyButton(gameStateManager, names, 3)}
                </div>
            </div>

            <div className="new-game-section">
                {canFinish && (
                    <IconButton
                        onClick={() => {
                            // TODO FIX
                            state.page = PageContainer.Play;
                            __GLOBAL_REFRESH_FUNC_REF();
                        }}
                        path={mdiCheck}
                        text="Finish"
                    />
                )}
            </div>

            <div className="new-game-section">
                <p>... What? You wanted more?</p>
                <p>Too bad! No freebies. Earn your class, abilities and traits in-game!</p>
            </div>
        </div>
    );
}
