import React from "react";
import "./GameCard.css";

const GameCard = (props) => {
  return (
    <div className="gamecard">
      <div className="gamecard-container" style={{ backgroundImage: `url("${props.imageUrl}")` }}>
        <div className="gamename">
          <div className="text">{props.game}</div>
        </div>
      </div>
      <div className="gamedetail">{props.gameDetail}</div>
    </div>
  );
};

export default GameCard;
