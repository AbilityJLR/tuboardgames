import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "./Spyfall.css";

const Spyfall = () => {
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
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState([]);
  const queryParameters = new URLSearchParams(window.location.search)
  const username = queryParameters.get("username")

  useEffect(() => {
    const queryParameters = new URLSearchParams(window.location.search)
    const username = queryParameters.get("username");
    const room = queryParameters.get("room");
    setPlayerName(username);
    setRoomId(room);

    const WEBSOCKET = process.env.REACT_APP_SOCKET
    const newWs = new WebSocket(`${WEBSOCKET}`);

    newWs.onopen = () => {
      newWs.send(JSON.stringify({ type: 'JOIN_LOBBY', data: { roomId: room, playerName: username } }));
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
    console.log("Data type :", data.type)
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
        setLocationImage(data.data.locationImage);
        setRole(data.data.role);
        setVotingOptions(data.data.players.filter(player => player.name !== playerName));
        break;
      case 'SPY_ROLE':
        setRole('Spy');
        break;
      case 'VOTING_OPTIONS':
        setVotingOptions(data.data);
        break;
      case 'GAME_END':
        setGameStarted(false);
        setWinner(data.data.winner);
        break;
      case 'CHAT_MESSAGE':
        console.log('Updating messages state:', [...messages, data.data]);
        setMessages(prevMessages => [...prevMessages, data.data]);
        break;
      default:
        console.log("Out of case.")
        break;
    }
  };

  const startGame = () => {
    if (ws) {
      ws.send(JSON.stringify({ type: 'START_GAME', data: { roomId } }));
    }
  };

  const handleVote = (index) => {
    if (ws) {
      ws.send(JSON.stringify({ type: 'VOTE', data: { roomId, voterIndex: lobbyPlayers.findIndex(player => player.name === playerName), voteIndex: index } }));
      setVoted(true);
    }
  };

  const sendMessage = () => {
    if (ws && messageInput.trim() !== '') {
      ws.send(JSON.stringify({ type: 'CHAT_MESSAGE', data: { roomId, sender: playerName, message: messageInput } }));
      setMessageInput('');
      console.log("send data to server:", roomId, playerName, messageInput)
    }
  };

  return (
    <div>
      {(!gameStarted && !winner) ? (
        <div>
          {!lobbyReady ? (
            <div className='in-lobby-container'>
              <div className='in-lobby-text'>
                <h2>Players</h2>
                <div className='startgame-button'>
                  <button onClick={startGame}>Start Game</button>
                </div>
              </div>
              <ul>
                {lobbyPlayers.map((player, index) => (
                  <div className='playername-style' key={index}>
                    <li>{player.name}</li>
                    <span className='waiting-status'></span>
                  </div>
                ))}
              </ul>

            </div>
          ) : (
            <p>Waiting for other players...</p>
          )}
        </div>
      ) : (
        <div>
          {!winner && (
            <div className="spyfall-container">
              {!role || role !== 'Spy' ? (
                <div className='role-container'>
                  <img src={locationImage} alt={location} width="250vw" />
                  <div className='role-content'>
                    <h2><strong>Your Location: </strong></h2><h4 style={{ marginLeft: "1rem" }}>{location}</h4>
                  </div>
                  <div className='role-content'>
                    <h2><strong>Your Role: </strong></h2><h4 style={{ marginLeft: "1rem" }}>{role}</h4>
                  </div>
                </div>
              ) : (
                <div className='role-container'>
                  <div className='role-content'>
                    <h2>You are the Spy!</h2>
                  </div>
                  <div className='role-content'>
                    <h2>Your Role: {role}</h2>
                  </div>
                </div>
              )}

              {!voted && (
                <div className='vote-container'>
                  <h2>Voting Options</h2>
                  <ul>
                    {votingOptions.map((player, index) => (
                      player.name !== playerName && (
                        <li key={index}>
                          <button onClick={() => handleVote(index)}>{player.name}</button>
                        </li>
                      )
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      {winner && (
        <div className='victory-container'>
          <div className='in-victory-container'>
            <div className='victory-content'>
              <div className='victory-text'>
                <h2>Game Over</h2>
              </div>
              <div className='victory-text'>
                <p>{(role === 'Spy' && winner === 'Spy') ? 'Congratulations! You win!' : (role !== 'Spy' && winner !== 'Spy') ? 'Congratulations! You win!' : `The ${role === 'Spy' ? 'Non-Spy' : 'Spy'} wins!`}</p>
              </div>
              <div className='victory-text'>
                <Link to={{ pathname: `/Spyfall/lobby`, search: `?username=${username}` }} style={{ textDecoration: "none" }}>
                  <button>
                    QUIT
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="chat-container">
        <div className="chat-messages">
          <div>
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type your message..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>
          <ul>
            {messages.map((message, index) => (
              <li key={index}>
                <strong>{message.sender === playerName ? 'Me' : message.sender}: </strong> {message.message}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Spyfall;
