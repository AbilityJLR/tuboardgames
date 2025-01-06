import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Container from "../components/Container";
import ContentContainer from "../components/ContentContainer.js"
import ImgCon from "../components/ImgCon.js"
import LocationCon from "../components/LocationCon"
import BottomCon from "../components/BottomCon";
import QuitBtn from "../components/QuitBtn";
import VoteBtn from "../components/VoteBtn";
import RoleCon from "../components/RoleCon";
import { socket } from "../socket"
import "./Spyfall.css"

const Spyfall = () => {
  const [users, setUsers] = useState([])
  const [playerInformation, setPlayerInformation] = useState({
    name: "",
    place: "",
    role: ""
  })
  const queryParameters = new URLSearchParams(window.location.search)
  const username = queryParameters.get("username")

  useEffect(() => {
    socket.connect()
    socket.emit("getUsername", username)

    socket.on("showUser", (user) => {
      console.log("connect users:", user)
      setUsers(user)
    })

    socket.on("getName", (playerName) => {
      setPlayerInformation({
        ...playerInformation,
        name: playerName
      })
    })

    socket.on("getPlace", (place) => {
      setPlayerInformation({
        ...playerInformation,
        place: place
      })
    })

    socket.on("getRole", (role) => {
      setPlayerInformation({
        ...playerInformation,
        role: role
      })
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  const ifSpy = (role) => {
    if (role === "spy") {
      return
    } else {
      return (
        <LocationCon>
          <h3>Location: {playerInformation.place}</h3>
        </LocationCon>
      )
    }
  }

  return (
    <div>
      <Container>
        <ContentContainer>
          <h4>Users</h4>
          <ul>
            {users.map((user) => (
              <li key={user.id}>{user.username}</li>
            ))}
          </ul>
          <ImgCon>
            <h1>Image</h1>
          </ImgCon>
          {ifSpy(playerInformation.role)}
          <RoleCon>
            <h3>Role: {playerInformation.role}</h3>
          </RoleCon>
          <BottomCon>
            <Link to="/lobby" className="link">
              <QuitBtn>
                <h3>Quit</h3>
              </QuitBtn>
            </Link>
            <VoteBtn>
              <h3 htmlFor="voteNames">Vote</h3>
              <form>
                <select name="voteNames" id="voteNames">
                  <button></button>
                  {users.map((user) => (
                    <option key={user.id}>{user.username}</option>
                  ))}
                </select>
              </form>
            </VoteBtn>
          </BottomCon>
        </ContentContainer>
      </Container>
    </div>
  )
}

export default Spyfall
