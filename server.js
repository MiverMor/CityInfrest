const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));

let energyLevel = 0; // 0–100, определяет, какой уровень города показать

io.on('connection', (socket) => {
  console.log('A user connected');

  // При подключении отправляем текущее состояние
  socket.emit('energyUpdate', energyLevel);

  // Когда пользователь "даёт энергию"
  socket.on('giveEnergy', () => {
    energyLevel++;
    if (energyLevel > 200) energyLevel = 200;
    io.emit('energyUpdate', energyLevel);
    console.log(`Energy increased: ${energyLevel}`);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
