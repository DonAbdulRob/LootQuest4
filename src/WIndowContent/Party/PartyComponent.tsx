import React from 'react';
import io from 'socket.io-client';
import { __GLOBAL_REFRESH_FUNC_REF } from '../../App';

export default function PartyComponent() {
    // Global socket io variable.
    const socket = io('http://localhost:8080');

    const [isConnected, setIsConnected] = React.useState(socket.connected);
    const [lastPong, setLastPong] = React.useState(null);

    React.useEffect(() => {
        socket.on('connect', () => {
            setIsConnected(true);
        });

        socket.on('disconnect', () => {
            setIsConnected(false);
        });

        socket.on('pong', (msg) => {
            setLastPong(msg);
            // new Date().toISOString()
            // __GLOBAL_REFRESH_FUNC_REF();
        });

        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('pong');
        };
    }, []);

    const sendPing = () => {
        socket.emit('p', 'sup');
    };

    return (
        <div>
            <h1>Players 1/100</h1>
            <p>You: Currently Exploring Woods</p>
            <p>Nate (P2): Fighting Adorable Rat</p>
            <div>
                <p>Connected: {'' + isConnected}</p>
                <p>Last pong: {lastPong || '-'}</p>
                <button onClick={sendPing}>Send ping</button>
            </div>
        </div>
    );
}
