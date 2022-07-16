/**
 * This Help component provides the user with information on how to play the game.
 */

import * as React from 'react';

import './Modal.css';

export default function HelpModal() {
    let marginTopClassName = 'margin-top-10';

    return (
        <div className="modal-container">
            <h1 className="modal-header-background">Game Manual & Help</h1>
            <p style={{ marginTop: '20px' }}>
                This page is designed to help you, the reader, play the game to the best of your ability.
            </p>
            <hr />
            <h1>About Loot Quest</h1>
            <p className={marginTopClassName}>
                Loot Quest is a turn-based roleplaying game that lets you fight monsters for experience, loot and, most
                importantly, fun! The game can be played however one likes. Though, the over-arching plot is to become
                the strongest being in existance.
            </p>
            <hr />
            <h1>Before You Play</h1>
            <p className={marginTopClassName}>
                I strongly recommend that you modify your game window's zoom if you intend to seriously play the game
                for a while. The default zoom is quite large for aethestics and can and really should be shrunk down for
                efficiency if you're serious about playing the game for a while. 80-90% is probably good enough for
                most. Though, your settings may vary depending on your hardware and system configurations.
            </p>
            <hr />
            <h1>How to Play?</h1>
            <p className={marginTopClassName}>
                The game can be played by hitting the 'Start A New Adventure' button from the Main Menu, choosing a name
                and difficulty on the next page, or using the defaults, then clicking the 'Finish' button. This puts you
                onto the main play screen where you can engage with all of the game's various features through the
                various different interfaces visible to you.
            </p>
            <p className={marginTopClassName}>
                By default, you start within Greenvale, a friendly town where you can rest at the inn and take advantage
                of other features. Once you're ready to leave, you can use the Area Selection window to go to the
                Greevale Border area next and begin to fight monsters for loot, experience and items.
            </p>
            {/*
                Feature in progress.s
                <p>
                    Once you've killed OR fled from 5 monsters in the area, the next area will unlock for you to explore.
                    And, you can then choose to stay in the Forest Outskirts, travel to the next location, or return back to
                    the city.
                </p>
            */}
            <hr />
            <h1>The Travel System</h1>
            <p className={marginTopClassName}>
                Loot Quest utilizes a virtual map system where areas, visible within the Area Window, lead backwards and
                forwards to one or more areas. Advancing to a new area requires moving to a connected area. Though, you
                may instantly travel to areas at a much lower level than yourself.
                {/* Add comment about 5 kills / being in much lower level to use global travel later when implemented */}
            </p>
            <hr />
            <h1>Combat</h1>
            <p className={marginTopClassName}>
                Loot Quest is a turn-based game, meaning that you take your turn and then the enemy takes theirs. The
                combat display tells you the monster name, a description of the enemy based on your knowledge of the
                enemy, your health versus the monster's health and three button options to execute a generic attack,
                defend or flee.
            </p>
            <p className={marginTopClassName}>
                Attacking deals damage based on the damage range visible in the Player window, defending will give you
                +2 armor for the turn (reducing the damage you take by 2 for the turn) and fleeing has a chance of
                ending combat. You may also change equipment, interact with your inventory and use abilities in combat,
                though be mindful that many features that you execute in combat will expend a turn to complete.
            </p>
            <p className={marginTopClassName}>
                Killing monsters may reward gold, experience and loot depending on your level difference compared to the
                monster, the monster type, the area you're in and various other game conditions. Being reduced to zero
                health means death. And, as an additional note, monsters substantially weaker than you will award
                reduced experience.
            </p>
            <hr />
            <h1>Tips</h1>
            <p className={marginTopClassName}>
                Windows can be dragged and dropped by clicking their titlebars and moving them around. You can reset
                closed windows and window positions by using the 'Reset Windows' setting in 'Settings'. And, themes can
                be changed and customized from the Settings menu too. Theme import/export is a WIP feature for the
                future. For now, it is recommended to use the theme presets.
            </p>
        </div>
    );
}
