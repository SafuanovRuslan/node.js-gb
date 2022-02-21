const socket = require('socket.io');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = http.createServer((req, res) => {
    const indexPath = path.join(__dirname, 'index.html');
    const readStream = fs.createReadStream(indexPath);
    readStream.pipe(res);
});

const io = socket(server);
const usersMap = {};
io.on('connection', (client) => {
    client.broadcast.emit('changeCount', io.eio.clientsCount);
    client.emit('changeCount', io.eio.clientsCount);

    client.on('client-msg', (data) => {
        const payload = {
            message: usersMap[client.id] + ": " + data.message,
        };

        client.broadcast.emit('server-msg', payload);
        client.emit('server-msg', payload);
    });

    client.on('disconnect', () => {
        const payload = {
            message: `<i>Пользователь ${usersMap[client.id]} вышел из чата</i>`,
        };
        client.broadcast.emit('server-msg', payload);
        client.broadcast.emit('changeCount', io.eio.clientsCount);
        client.emit('changeCount', io.eio.clientsCount);

        delete usersMap[client.id];
    });

    client.on('user-reg', (userName) => {
        usersMap[client.id] = userName;

        const payload = {
            message: `<i>Пользователь ${userName} вошёл в чат</i>`,
        };

        client.broadcast.emit('server-msg', payload);
        client.emit('server-msg', payload);
    })
});

server.listen(3000);