const WebSocket = require('ws');
const express = require('express');
const cors = require('cors')
const http = require('http');
const mongoose = require("mongoose")
const gameRoute = require("./routes/spyfall");
const morgan = require('morgan');
const Locations = require('./models/locationModel')
require('dotenv').config()

const PORT = process.env.PORT || 3001;

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

mongoose.connect(process.env.DATABASE, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Error connecting to MongoDB Atlas', err));

app.use(express.json())
app.use(cors())
app.use(morgan("dev"))

app.use('/api', gameRoute)
let rooms = {};

wss.on('connection', (ws) => {
  console.log(`User is connected`);

  ws.on('message', (message) => {
    const data = JSON.parse(message);
    handleMessage(ws, data);
  });

  ws.on('close', () => {
    handleDisconnect(ws);
    console.log(`User is Disconnected`);
  });
});

const handleMessage = (ws, data) => {
  switch (data.type) {
    case 'JOIN_LOBBY':
      handleJoinLobby(ws, data.data);
      break;
    case 'START_GAME':
      handleStartGame(ws, data.data);
      break;
    case 'VOTE':
      handleVote(ws, data.data);
      break;
    case 'GET_LOBBIES':
      sendLobbies(ws);
      break;
    case 'CHAT_MESSAGE':
      broadcastChatMessage(data.data.roomId, data.data.message, data.data.sender);
      break;
    default:
      break;
  }
};

const handleJoinLobby = (ws, data) => {
  const { roomId, playerName } = data;
  if (!rooms[roomId]) {
    rooms[roomId] = [];
  }

  if (rooms[roomId].find(player => player.name === playerName)) {
    ws.send(JSON.stringify({ type: 'NAME_ALREADY_TAKEN', data: 'Name already taken in this lobby.' }));
  } else {
    rooms[roomId].push({ name: playerName, ws, voted: false, votes: 0 });
    broadcastLobbyState(roomId);
    removeEmptyRooms();
  }
};

const handleStartGame = (ws, data) => {
  const { roomId } = data;
  if (!rooms[roomId]) {
    ws.send(JSON.stringify({ type: 'GAME_NOT_READY', data: 'Room does not exist.' }));
    return;
  }

  if (rooms[roomId].length < 3) {
    ws.send(JSON.stringify({ type: 'GAME_NOT_READY', data: 'Not enough players to start the game.' }));
    return;
  }

  if (gameAlreadyStarted(roomId)) {
    ws.send(JSON.stringify({ type: 'GAME_ALREADY_STARTED', data: 'Game already in progress in this room.' }));
    return;
  }

  Locations.aggregate([{ $sample: { size: 1 } }])
    .then((randomLocations) => {
      if (randomLocations.length > 0) {
        const randomLocation = randomLocations[0];
        let { name: location, roles, imageURL } = randomLocation;
        roles = shuffleArray(roles);

        console.log("[+] Send :", location, roles, imageURL)

        rooms[roomId].forEach((player, index) => {
          const role = roles[index % roles.length];
          player.ws.send(JSON.stringify({ type: 'GAME_STARTED', data: { roomId, location, role, players: rooms[roomId], locationImage: imageURL } }));
          player.ws.send(JSON.stringify({ type: 'VOTING_OPTIONS', data: rooms[roomId].map((p, i) => ({ index: i, name: p.name })) }));
          player.role = role;
        });

        const spyIndex = Math.floor(Math.random() * rooms[roomId].length);
        rooms[roomId][spyIndex].role = 'Spy';
        rooms[roomId][spyIndex].ws.send(JSON.stringify({ type: 'SPY_ROLE' }));

        broadcastLobbyState(roomId);

      } else {
        console.log("[!] No locations found");
      }
    })
    .catch((err) => {
      console.error("[!] Error finding random location:", err);
    });


};

const handleVote = (ws, data) => {
  const { roomId, voterIndex, voteIndex } = data;
  if (!rooms[roomId]) {
    console.log(`[!] Room doesn't exist`)
    return;
  }
  const voter = rooms[roomId].find((player, index) => index === voterIndex);
  const votee = rooms[roomId].find((player, index) => index === voteIndex);

  if (!voter || !votee) {
    console.log(`[!] User already voted`)
    return;
  }

  if (voter.voted || voterIndex === voteIndex) {
    console.log(`[!] User attempting to vote for themself`)
    return;
  }

  voter.voted = true;
  voter.voteIndex = voteIndex;
  votee.votes++;
  broadcastLobbyState(roomId);

  const allVoted = rooms[roomId].every(player => player.voted);
  if (allVoted) {
    handleVoteResults(roomId);
  }
};

const handleVoteResults = (roomId) => {
  let spyVotes = 0;
  let nonSpyVotes = 0;

  rooms[roomId].forEach(player => {
    if (player.voted) {
      const votee = rooms[roomId].find((p, index) => index === player.voteIndex);
      if (votee && votee.role === 'Spy') {
        spyVotes++;
      } else {
        nonSpyVotes++;
      }
    }
  });

  console.log("Spy votes:", spyVotes)
  console.log("Non-Spy votes:", nonSpyVotes)
  let winner;
  if (spyVotes < nonSpyVotes) {
    winner = 'Spy';
  } else if (spyVotes >= nonSpyVotes) {
    winner = 'Non-Spy';
  } else {
    winner = 'Spy'
  }

  broadcastGameEnd(roomId, winner);
};

const broadcastGameEnd = (roomId, winner) => {
  console.log(`[+] The winner is ${winner}`)
  rooms[roomId].forEach(player => {
    player.ws.send(JSON.stringify({ type: 'GAME_END', data: { winner } }));
  });
};

const broadcastLobbyState = (roomId) => {
  if (rooms[roomId]) {
    rooms[roomId].forEach(player => {
      player.ws.send(JSON.stringify({ type: 'UPDATE_LOBBY_STATE', data: rooms[roomId] }));
    });
  }
};

const broadcastChatMessage = (roomId, message, sender) => {
  if (rooms[roomId]) {
    console.log('Room exists:', rooms[roomId]);

    rooms[roomId].forEach(player => {
      console.log('Sending message to player:', player);
      player.ws.send(JSON.stringify({ type: 'CHAT_MESSAGE', data: { sender: sender, message: message } }));
    });

    console.log("Message sent:", message);
  } else {
    console.log('Room does not exist');
  }
};

const handleDisconnect = (ws) => {
  Object.keys(rooms).forEach(roomId => {
    rooms[roomId] = rooms[roomId].filter(player => player.ws !== ws);
    broadcastLobbyState(roomId);
  });
  removeEmptyRooms();
};

const removeEmptyRooms = () => {
  Object.keys(rooms).forEach(roomId => {
    if (rooms[roomId].length === 0) {
      delete rooms[roomId];
      console.log(`Room ${roomId} removed due to zero players.`);
    }
  });
};

const sendLobbies = (ws) => {
  const lobbiesData = Object.keys(rooms).map(roomId => ({
    id: roomId,
    players: rooms[roomId].map(player => player.name),
    gameStarted: gameAlreadyStarted(roomId)
  }));
  ws.send(JSON.stringify({ type: 'LOBBY_LIST', data: lobbiesData }));
};

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const gameAlreadyStarted = (roomId) => {
  return rooms[roomId].some(player => player.role);
};

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
