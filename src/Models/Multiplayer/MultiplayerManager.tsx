import produce, { immerable } from 'immer';
import { __GLOBAL_REFRESH_FUNC_REF } from '../../App';
import { socket } from '../../AppDataLayer';
import { __G_REFRESH_PLAY_PAGE } from '../../Pages/PlayPage';
import { IGlobalContext } from '../GlobalContextStore';

export class MultiplayerManager {
    [immerable] = true;
    logging: false;
    socketIoURL = 'http://localhost:8080'; // Value may be something we allow user to customize in the future through UI.
    multiplayerEnabled = true;
    isConnectingMultiplayer = false;
    multiplayerConnected = false;
    socket: any;
    lastPong = '';

    sendPing = () => {
        this.log('Sending ping.');
        socket.emit('ping', 'this is a ping test');
    };

    setupSockets(setState) {
        // todo, investigate in seperate app whether it is good or bad that sockets get created/destroyed so frequently.
        this.log('Setting up sockets.');

        socket.on('connect', () => {
            this.log('connect');
        });

        socket.on('disconnect', () => {
            this.log('disconnect');
        });

        socket.on('pong', (msg) => {
            this.log('pong: ' + msg);

            setState(
                produce((draft: IGlobalContext) => {
                    draft.multiplayerManager.lastPong = msg;
                }),
            );
        });
    }

    cleanupSockets() {
        this.log('Cleaning up sockets.');
        socket.off('connect');
        socket.off('disconnect');
        socket.off('pong');
    }

    log(msg: string) {
        if (this.logging) {
            console.log(msg);
        }
    }
}
