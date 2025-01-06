import React from "react";
import "./LobbyList.css"

const LobbyList = (props) => {
  return (<h1>{props.items.map(game => game.game)}</h1>)
}

export default LobbyList
