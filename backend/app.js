// Express defaults.
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

// Routes.
var connection = require('./src/routes/connection.js');
app.use('/connection', connection);

// Socket.io listener.
io.on('connect', (socket) => {
    console.log('a user connected');

    socket.on('p', (msg) => {
        console.log('Ping with message recieved: ' + msg);
        socket.broadcast.emit('pong', 'Ping recieved on ' + new Date().toUTCString());
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(8080, () => {
    console.log('listening on *:8080');
});
