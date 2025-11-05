const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

let energyLevel = 0;

io.on('connection', (socket) => {
  console.log('A user connected');

  // Отправляем текущее состояние городу на экране
  socket.emit('energyUpdate', energyLevel);

  // При получении клика
  socket.on('giveEnergy', () => {
    energyLevel++;
    io.emit('energyUpdate', energyLevel);
    console.log(`Energy increased: ${energyLevel}`);
  });

  socket.on('disconnect', () => console.log('A user disconnected'));
});

const PORT = 3000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));