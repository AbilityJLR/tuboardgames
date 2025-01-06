import React from "react";
import { Link } from "react-router-dom";
import Container from "../components/Container";
import ContentContainer from "../components/ContentContainer"
import InContentContainer from "../../shared/components/InContentContainer";
import GameCard from "../../shared/components/GameCard"

const GameBrowse = () => {
  const Games = [{
    game_ID: "1",
    game: "Spyfall",
    gameDetail: "ให้คนหนึ่งเข้าเว็บ spyfall แล้วสร้างกลุ่ม จากนั้นให้ผู้เล่นคนอื่นเข้ามา Join โดยใส่รหัสห้องตามที่ผู้สร้างตั้งไว้ คนครบแล้วกด ‘Start Game’ สำหรับคนที่ไม่ใช่ SPY จะได้รับข้อมูลสถานที่ และบทบาทของตัวเอง เช่น สถานที่ : ริมชายหาด บทบาท : นักท่องเที่ยว ส่วนคนที่เป็น SPY จะไม่มีข้อมูลเหล่านี้ ให้ผู้เล่นทุกคนผลัดกันถาม-ตอบคำถามเพื่อตามหา SPY โดยคำถามต้องจับผิดให้ได้ว่าคนคนนั้นรู้สถานที่และมีบทบาทหรือไม่ แต่ต้องระวังไม่ให้คำถามเจาะจงเกินไป จน SPY รู้ว่าสถานที่นั้นคือที่ไหน (เดี๋ยว SPYจะเนียนได้) ส่วนคนที่เป็น SPY ก็ต้องเนียน ๆ ไป สังเกตคำถามและคำตอบของผู้เล่นคนอื่นเพื่อหาคำตอบว่าสถานที่นั้นคือที่ไหน  เพื่อไม่ให้คนอื่นจับได้ว่าเราเป็น SPY เมื่อถามจนครบกำหนดเวลา ให้ผู้เล่นโหวตว่าใครเป็น SPY หากส่วนใหญ่โหวตถูก SPY จะแพ้ ถ้าส่วนใหญ่โหวตผิด SPY จะเป็นผู้ชนะ",
    gameImage: 'https://www.towertacticgames.com/cdn/shop/products/56_535x.jpg?v=1709297440'
  },
  {
    game_ID: "2",
    game: "Coming soon..."
  },
  {
    game_ID: "3",
    game: "Coming soon..."
  }
  ]

  const queryParameters = new URLSearchParams(window.location.search)
  const username = queryParameters.get("username")

  return (
    <div>
      <Container>
        <ContentContainer>
          <div>
            <InContentContainer><label style={{ fontSize: "6vw" }}><strong>TU Board Games</strong></label></InContentContainer>
            <InContentContainer><label style={{ fontSize: "4vw" }}><strong>ตู้บอร์ดเกมส์</strong></label></InContentContainer>
          </div>
          <div>
            {Games.map((game, index) => (
              <Link to={{ pathname: `/${game.game}/lobby`, search: `?username=${username}` }} style={{ textDecoration: "none" }}>
                <InContentContainer><GameCard key={index} imageUrl={game.gameImage} game={game.game} gameDetail={game.gameDetail} /></InContentContainer>
              </Link>
            ))}
          </div>
        </ContentContainer>
      </Container>
    </div>
  )
}

export default GameBrowse
