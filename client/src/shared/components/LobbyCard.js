import React from "react";
import "./LobbyCard.css"

const LobbyCard = (props) => {
  return (
    <div className="lobbycard-container">
      <div className="in-lobbycard-container">
        <div className="lobbycard">
          <div className="top">
            <div className="content-top">
              Room {props.room}
            </div>
            <div className="mid">
              <div className="text">
                <div className="gamestatus">
                  <div style={{ marginRight: "3rem" }}>
                    <label>Game Status</label>
                  </div>
                  <div>
                    {(props.status === "started") && (
                      <span className="already-started-status"></span>
                    )}
                    {(props.status === "not") && (
                      <span className="waiting-status"></span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bot">{props.players}</div>
        </div>
      </div>
    </div>
  )
}

export default LobbyCard
