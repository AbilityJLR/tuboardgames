// App.js
import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [ws, setWs] = useState(null);
  const [roomId, setRoomId] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [lobbyPlayers, setLobbyPlayers] = useState([]);
  const [lobbyReady, setLobbyReady] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [location, setLocation] = useState('');
  const [locationImage, setLocationImage] = useState('');
  const [role, setRole] = useState('');
  const [votingOptions, setVotingOptions] = useState([]);
  const [voted, setVoted] = useState(false);
  const [winner, setWinner] = useState('');

  useEffect(() => {
    const newWs = new WebSocket('ws://localhost:3001');

    newWs.onopen = () => {
      console.log('Connected to server');
    };

    newWs.onmessage = (message) => {
      const data = JSON.parse(message.data);
      handleMessage(data);
    };

    setWs(newWs);

    return () => {
      newWs.close();
    };
  }, []);

  const handleMessage = (data) => {
    switch (data.type) {
      case 'UPDATE_LOBBY_STATE':
        setLobbyPlayers(data.data);
        break;
      case 'GAME_NOT_READY':
        alert(data.data);
        break;
      case 'GAME_ALREADY_STARTED':
        alert(data.data);
        break;
      case 'NAME_ALREADY_TAKEN':
        alert(data.data);
        break;
      case 'GAME_STARTED':
        setGameStarted(true);
        setLocation(data.data.location);
        setLocationImage(data.data.locationImage); // Set location image
        setRole(data.data.role);
        setVotingOptions(data.data.players.filter(player => player.name !== playerName));
        break;
      case 'SPY_ROLE':
        // Update role to spy
        setRole('Spy');
        break;
      case 'VOTING_OPTIONS':
        setVotingOptions(data.data);
        break;
      case 'GAME_END':
        setGameStarted(false);
        setWinner(data.data.winner);
        break;
      // Handle other message types
      default:
        break;
    }
  };

  const joinLobby = () => {
    ws.send(JSON.stringify({ type: 'JOIN_LOBBY', data: { roomId, playerName } }));
  };

  const startGame = () => {
    ws.send(JSON.stringify({ type: 'START_GAME', data: { roomId } }));
  };

  const handleVote = (index) => {
    ws.send(JSON.stringify({ type: 'VOTE', data: { roomId, voterIndex: lobbyPlayers.findIndex(player => player.name === playerName), voteIndex: index } }));
    setVoted(true);
  };

  return (
    <div className="App">
      {!gameStarted ? (
        <div>
          {!lobbyReady ? (
            <div>
              <input
                type="text"
                placeholder="Room ID"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
              />
              <input
                type="text"
                placeholder="Your Name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
              />
              <button onClick={joinLobby}>Join Lobby</button>
              <h2>Lobby Players:</h2>
              <ul>
                {lobbyPlayers.map((player, index) => (
                  <li key={index}>{player.name}</li>
                ))}
              </ul>
              <button onClick={startGame}>Start Game</button>
            </div>
          ) : (
            <p>Waiting for other players...</p>
          )}
        </div>
      ) : (
        <div>
          <h2>Location: {location}</h2>
          <img src={locationImage} alt={location} /> {/* Display location image */}
          <h2>Your Role: {role}</h2>
          <h2>Voting Options:</h2>
          <ul>
            {votingOptions.map((player, index) => (
              <li key={index}>
                {player.name}{' '}
                {!voted && (
                  <button onClick={() => handleVote(index)}>Vote</button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      {winner && (
        <div>
          <h2>Game Over</h2>
          <p>{(role === 'Spy' && winner === 'Spy') ? 'Congratulations! You win!' : (role !== 'Spy' && winner !== 'Spy') ? 'Congratulations! You win!' : `The ${role === 'Spy' ? 'Non-Spy' : 'Spy'} wins!`}</p>
        </div>
      )}
    </div>
  );
};

export default App;
