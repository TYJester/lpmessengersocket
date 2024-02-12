import sendMessage from './message';
import io from 'socket.io'

const express = require('express');

const SOCKET_URL = 'https://lsm-socket.lsmessenger.com'

const socket = io(server);

io.on('connection', () => {
  // Handling client's request to join a room
  socket.on('joinRoom', (roomName) => {
    socket.join(roomName);
  });

  // Handling client's request to leave a room
  socket.on('leaveRoom', (roomName, userDetails) => {
    socket.leave(roomName);
  });

  // Handling messages sent to a room
  socket.on('sendMessage', ({roomName, message, userDetails}) => {
    // Broadcast the message to all sockets in the specified room
    sendMessage(roomName, userDetails['groupID'], userDetails['userID'], message)
    io.to(roomName).emit('newMessage', message);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const port = 8081;
server.listen(port, () => console.log(`Listening on port ${port}`));