const express = require('express');
const app = express();
const http = require('http').createServer(app);

// Initialize Socket.io and allow connections from any website (CORS)
const io = require('socket.io')(http, {
  cors: {
    origin: "*", // Allows your chess game frontend to connect
    methods: ["GET", "POST"]
  }
});

// A simple landing page to check if your server is running
app.get('/', (req, res) => {
  res.send('Chess FPS Server is Running Live!');
});

// Real-time communication gateway
io.on('connection', (socket) => {
  console.log('A player connected:', socket.id);

  // 1. HOST LOBBY
  socket.on('hostRoom', (data) => {
    socket.join(data.roomId);
    console.log(`Lobby created: ${data.roomId} by host ${socket.id}`);
  });

  // 2. JOIN LOBBY
  socket.on('joinRoom', (data) => {
    // Check if the lobby room exists
    const room = io.sockets.adapter.rooms.get(data.roomId);
    
    if (room) {
      socket.join(data.roomId);
      console.log(`Player ${socket.id} joined lobby: ${data.roomId}`);
      
      // Notify the HOST that a player joined
      socket.to(data.roomId).emit('opponentJoined', {
        message: "Your opponent connected!"
      });
      
      // Notify the JOINER that they joined successfully
      socket.emit('joinedSuccessfully', {
        roomId: data.roomId
      });
    } else {
      // Tell the joiner that the room code is invalid
      socket.emit('lobbyNotFound', {
        message: "Lobby code not found. Please double check!"
      });
    }
  });

  // 3. RELAY A CHESS MOVE
  socket.on('sendMove', (data) => {
    // Relays the new board pieces and turn to the opponent in the same room
    socket.to(data.roomId).emit('receiveMove', {
      pieces: data.pieces,
      turn: data.turn
    });
  });

  // 4. RELAY COMBAT START (Triggers FPS overlay for opponent)
  socket.on('startCombat', (data) => {
    socket.to(data.roomId).emit('receiveCombatStart', {
      attacker: data.attacker,
      defender: data.defender,
      attackerPos: data.attackerPos,
      defenderPos: data.defenderPos
    });
  });

  // 5. RELAY COMBAT RESOLUTION (Syncs outcome for both players)
  socket.on('resolveCombatSync', (data) => {
    socket.to(data.roomId).emit('receiveCombatResolution', {
      success: data.success
    });
  });

  // 6. RELAY RESIGNATION
  socket.on('playerResigned', (data) => {
    socket.to(data.roomId).emit('opponentResigned');
  });

  // Handle player disconnects
  socket.on('disconnect', () => {
    console.log('A player disconnected:', socket.id);
  });
});

// Run the server on Port 3000 (or the hosting service's environment port)
const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});