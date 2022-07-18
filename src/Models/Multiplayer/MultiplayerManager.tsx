export class MultiplayerManager {
    socketIoURL = 'http://localhost:8080'; // Value may be something we allow user to customize in the future through UI.
    multiplayerEnabled = true;
    multiplayerConnected = false;

    // Attempt to connect to a multiplayer instance.
    connect(): number {
        // Do some kind of conversation with back-end to attempt to join lobby.
        return 1;
    }

    disconnect() {}
}
