export class MultiplayerManager {
    multiplayerEnabled = true;
    multiplayerConnected = false;

    // Attempt to connect to a multiplayer instance.
    connect(): number {
        // Do some kind of conversation with back-end to attempt to join lobby.
        return 1;
    }

    disconnect() {}
}
