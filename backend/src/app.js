// Express defaults.
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

// Routes.
var connection = require('./routes/connection.js');
app.use('/connection', connection);

let connections = 0;

// Socket.io listener.
io.on('connection', (socket) => {
    console.log('a user connected: ' + connections);
    connections++;
    // sockets.add(socket);

    socket.on('disconnect', () => {
        console.log('a user disconnected: ' + connections);
        connections--;
    });

    socket.on('ping', (msg) => {
        console.log('Ping with message recieved: ' + msg);
        io.emit('pong', 'Ping recieved on ' + new Date().toUTCString());
        io.emit('pong', 'Ping recieved on ' + new Date().toUTCString() + ' with connections: ' + connections);
    });
});

server.listen(8080, () => {
    console.log('listening on *:8080');
});
