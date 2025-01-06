import React, { useState, useEffect } from 'react';
import './Lobby.css'
import { Link } from 'react-router-dom';
import LobbyCard from '../../shared/components/LobbyCard'

const Lobby = () => {
  const [ws, setWs] = useState(null);
  const [lobbies, setLobbies] = useState([]);
  const [roomId, setRoomId] = useState('')
  const queryParameters = new URLSearchParams(window.location.search)
  const username = queryParameters.get("username")

  useEffect(() => {
    const WEBSOCKET = process.env.REACT_APP_SOCKET
    const newWs = new WebSocket(`${WEBSOCKET}`);
    setWs(newWs);

    return () => {
      newWs.close();
    };
  }, []);

  useEffect(() => {
    if (ws) {
      ws.onopen = () => {
        ws.send(JSON.stringify({ type: 'GET_LOBBIES' }));
      };

      ws.onmessage = (message) => {
        const data = JSON.parse(message.data);
        if (data.type === 'LOBBY_LIST') {
          setLobbies(data.data);
        } else if (data.type === 'UPDATE_LOBBY') {
          const updatedLobby = data.data;
          setLobbies(prevLobbies =>
            prevLobbies.map(lobby =>
              lobby.id === updatedLobby.id ? updatedLobby : lobby
            )
          );
        }
      };
    }
  }, [ws]);

  return (
    <div className='lobby-style'>
      <div className='header'>
        <h1>Spyfall Lobby</h1>
        <div className='join-form'>
          <div className='join-form-input'>
            <input
              required
              type="text"
              placeholder="Create room or Enter room"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
            />
          </div>
          {!(roomId.length === 0) && (
            <Link style={{ textDecoration: "none", color: "white" }} to={{ pathname: `/spyfall`, search: `?username=${username}&room=${roomId}` }} >
              <div className='input-room-button'>
                <strong>Let's Go</strong>
              </div>
            </Link>
          )}
        </div>
      </div>
      {(lobbies.length === 0) && (
        <div className='pcr-container'>
          <label>Please</label><br />
          <label>Create</label><br />
          <label>Room</label>
        </div>
      )}
      <ul>
        {lobbies.map((lobby, index) => (
          <li key={index}>
            {/*Lobby {lobby.id}: {lobby.players.join(', ')} - {lobby.gameStarted ? "Game Started" : "Waiting for players to start the game"}*/}
            <Link style={{ textDecoration: "none", color: "white" }} to={{ pathname: '/spyfall', search: `?username=${username}&room=${lobby.id}` }}>
              <LobbyCard room={lobby.id} players={lobby.players.join(" ")} status={lobby.gameStarted ? "started" : "not"} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Lobby;
