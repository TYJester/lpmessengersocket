const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const API_URL = 'https://lsm-api.lsmessenger.com';

async function sendMessage(eventID, groupID, userID, message) {
    const payload = {
        "eventID" : eventID,
        "groupID": groupID,
        "author": userID,
        "message": message
    };

    try {
        const response = await fetch(`${API_URL}/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error('Network response was not ok');
        const jsonRes = await response.json();
        console.log(jsonRes);
    } catch (err) {
        console.log(`Attempt ${attempt}: Failed to send message -`, err);
        if (attempt < maxAttempts) {
            console.log(`Retrying in ${retryDelay}ms...`);
            setTimeout(() => sendMessageWithRetry(data, attempt + 1), retryDelay);
        } else {
            console.log('Max retry attempts reached. Giving up.');
        }
    }
}

io.on('connection', (socket) => {
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

const port = 4000;
server.listen(port, () => console.log(`Listening on port ${port}`));