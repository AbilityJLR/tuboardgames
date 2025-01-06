import React from "react";
import Container from "../components/Container";
import ContentContainer from "../components/ContentContainer"
import { useState } from "react";
import { Link } from "react-router-dom";
import Btn from "../../shared/components/Btn"
import Input from "../../shared/components/Input"
import InputContainer from "../../shared/components/InputContainer"
import Content from "../../shared/components/Content";
import InContentContainer from "../../shared/components/InContentContainer"

const Login = () => {
  const [message, setMessage] = useState('')
  return (
    <div>
      <img src="https://tupine.engr.tu.ac.th/assets/front/img/logo/Logotupine.png" width="250vw" style={{ padding: "2rem 0 0 2rem", margin: "0", position: "absolute" }} />
      <Container>
        <ContentContainer>
          <Content>
            <InContentContainer><label><strong>TU Board Games</strong></label></InContentContainer>
            <InContentContainer><label><strong>ตู้บอร์ดเกมส์</strong></label></InContentContainer>
            <Btn>
              <Input>
                <input type="text" placeholder="who are you?" name="userInput" onChange={(event) => { setMessage(event.target.value) }} />
              </Input>
              {(message.length == 0) && (
                <InputContainer><label>กรอกชื่อก่อนจ้า</label></InputContainer>
              )}
              {!(message.length == 0) && (
                <InputContainer>
                  <Link to={{ pathname: '/gamesbrowse', search: `?username=${message}` }}><lebel>เข้าสู่ระบบ</lebel></Link>
                </InputContainer>
              )}
            </Btn>
            <hr style={{ color: "grey", height: "1px" }}></hr>
            <InContentContainer><label style={{ fontSize: "1vw", paddingTop: "2rem" }}>Create by Kokkoi & Co.</label></InContentContainer>
          </Content>
          <InContentContainer><label style={{ fontSize: "1vw", paddingTop: "2rem" }}>Project about network. This project using ReactJS for front-end NodeJS for backend and socket to communication</label></InContentContainer>
        </ContentContainer>
      </Container>
    </div>
  )
}

export default Login
