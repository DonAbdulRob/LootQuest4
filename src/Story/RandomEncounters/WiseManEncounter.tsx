import React from 'react';
import { AbstractEncounter } from '../AbstractEncounter';
import { StoryPrompt } from '../StoryPrompt';
import { __GLOBAL_REFRESH_FUNC_REF } from '../../App';
import { BaseEncounter } from '../BaseEncounter';
import { MG_Erin } from '../../Models/Fighter/Monster/MonsterGenerators/Humanoids/MG_Erin';
import { IG_Herb } from '../../Models/Item/Consumables/IG_Herb';
import { IGlobalContext } from '../../Models/GlobalContextStore';

export class WiseManEncounter extends BaseEncounter implements AbstractEncounter {
    toldWizardTruth = true;

    constructor(store: IGlobalContext) {
        // Require super called to pass up state.
        super(store);

        // Must always update the prompt. (Can't pass to constructor, so do as next line.)
        this.nextPrompt = this.prompt1;
    }

    getFleeButton() {
        return (
            <button
                onClick={() => {
                    this.store.rpgConsole.add(
                        `You attempt to flee from the Mage. And, you succeed, easily, as the Mage doesn't try to stop you at all.`,
                    );
                    this.isOver = true;
                    __GLOBAL_REFRESH_FUNC_REF();
                }}
            >
                Flee
            </button>
        );
    }

    getAttackButton() {
        return (
            <button
                onClick={() => {
                    this.store.rpgConsole.add('Good! Good! I needed a fresh corpse for my upcoming experiments!');
                    this.isOver = true;
                    this.store.combatState.startFight(
                        this.store,
                        new MG_Erin(
                            this.store.monsterManager.getMainMonster().statBlock,
                            -1,
                            this.store.gameStateManager.gameDifficulty,
                        ),
                    );
                    __GLOBAL_REFRESH_FUNC_REF();
                }}
            >
                Attack
            </button>
        );
    }

    prompt1: StoryPrompt = new StoryPrompt(
        'You are walking through through the woods along the road when you spot a man approaching you. ' +
            'He wears Blue Robes typical of a Mage. And, given the excellent condition and quality of his outfit, you assume he must be reasonably powerful. ' +
            'How do you react?',
        [
            <button
                onClick={() => {
                    this.introLines = [
                        'You raise your arm and wave toward the man while yelling, "Hello there!"',
                        'Hearing this, the man responds, "Greetings fellow traveler!" and approaches closer.',
                    ];

                    this.goToPrompt(this.prompt2);
                    __GLOBAL_REFRESH_FUNC_REF();
                }}
            >
                Greet & Approach
            </button>,
            <button
                onClick={() => {
                    this.introLines = [
                        'You remain completely still and allow the man to approach.',
                        'This allows the man to come closer and greet, "Greetings fellow traveler!"',
                    ];
                    this.goToPrompt(this.prompt2);
                    __GLOBAL_REFRESH_FUNC_REF();
                }}
            >
                Stand Still & Wait
            </button>,
            this.getAttackButton(),
            this.getFleeButton(),
        ],
    );

    prompt2: StoryPrompt = new StoryPrompt(
        `As the Mage nears, his physical features become clearer. He's an old man that appears to be in his seventies. ` +
            `Yet, he stands upright and moves forward steadily with purpose. What do you do?`,
        [
            <button
                onClick={() => {
                    this.introLines = [
                        'Greetings Mage. How be your travels?',
                        `My travels have been great. Thank you for asking. Though, actually, I'm heading toward Greenvale and seem to be a bit lost. ` +
                            `Can you point me in its direction?`,
                    ];
                    this.goToPrompt(this.prompt3);
                    __GLOBAL_REFRESH_FUNC_REF();
                }}
            >
                Ask About His Travels
            </button>,
            <button
                onClick={() => {
                    this.introLines = [
                        'You choose to remain silent.',
                        `The quiet type, eh? No worries. Actually, I don't need you to say much. I'm coming from Atom and heading toward Greenvale ` +
                            `and was hoping that you could point me in its direction.`,
                    ];

                    this.goToPrompt(this.prompt3);
                    __GLOBAL_REFRESH_FUNC_REF();
                }}
            >
                Stand Still & Wait
            </button>,
            this.getAttackButton(),
            this.getFleeButton(),
        ],
    );

    prompt3: StoryPrompt = new StoryPrompt('', [
        <button
            onClick={() => {
                this.introLines = ["Yes. Continue down this road and you'll be there before nightfall."];
                this.toldWizardTruth = true;
                this.goToPrompt(this.prompt4);
                __GLOBAL_REFRESH_FUNC_REF();
            }}
        >
            Tell Wizard He's Heading in the Right Direction
        </button>,
        <button
            onClick={() => {
                this.introLines = [
                    'Sure. The route to Greevale was actually changed recently due to flooding, ' +
                        `so you'll need to cut through the woods to make it there. Try heading that way," you say while pointing in a random direction.`,
                ];

                this.toldWizardTruth = false;
                this.goToPrompt(this.prompt4);
                __GLOBAL_REFRESH_FUNC_REF();
            }}
        >
            Lie About the Direction.
        </button>,
        this.getAttackButton(),
        this.getFleeButton(),
    ]);

    prompt4: StoryPrompt = new StoryPrompt(
        `Thank you so much for that information! I'll make sure to put it to good use. And, please, take this Moro Herb as my thanks. Now, if you'll excuse me, I must be on my way."`,
        [
            <button
                onClick={() => {
                    this.store.rpgConsole.add('You allow the Mage to leave then continue on your journey.');
                    this.isOver = true;
                    __GLOBAL_REFRESH_FUNC_REF();
                }}
            >
                Continue My Journey
            </button>,
            this.getAttackButton(),
        ],
        () => {
            this.store.playerManager
                .getMainPlayer()
                .inventory.addItem(this.store.playerManager.getMainPlayer(), IG_Herb.moro());
        },
    );
}
