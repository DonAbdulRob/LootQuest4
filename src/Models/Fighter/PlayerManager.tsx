import { Player } from './Player/Player';

export class PlayerManager {
    static MAX_PLAYERS = 4;
    playerList: Player[] = Array(4).fill(null); // First index is always the host.

    constructor() {
        // Always add main player by default.
        this.addPlayer(new Player());
    }

    /**
     * Returns the main player whom the entire game state is centered around.
     */
    getMainPlayer() {
        return this.playerList[0];
    }

    /**
     * Attempt to add a player to the game.
     */
    addPlayer(p: Player) {
        // Otherwise, we find first empty player spot and add player there.
        for (var i = 0; i < PlayerManager.MAX_PLAYERS; i++) {
            if (this.playerList[i] === null) {
                this.playerList[i] = p;
                return true;
            }
        }

        // Else, no room to add player. (Lobby full, for ex.)
        return false;
    }

    /**
     * Removes player from the game.
     * If it's the main player, attempt to set the main player to somebody else.
     */
    removePlayer(p: Player) {
        let ele: Player;

        for (var i = 0; i < PlayerManager.MAX_PLAYERS; i++) {
            ele = this.playerList[i];

            if (ele === p) {
                if (i === 0) {
                    // TODO - No more host, close the game for other players.
                } else {
                    this.playerList[i] = null;
                }

                return;
            }
        }

        return;
    }
}
