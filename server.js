const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('a user connected', socket.id);

    socket.on('ready', (data) => {
        console.log('User is ready with socket ID:', socket.id);
        socket.broadcast.emit('user-ready', { id: socket.id });
    });

    socket.on('signal', (data) => {
        console.log('Relaying signal:', data);
        io.to(data.to).emit('signal', { from: socket.id, signal: data.signal });
    });
});

server.listen(3000, '0.0.0.0', () => {
    console.log('listening on *:3000');
});
