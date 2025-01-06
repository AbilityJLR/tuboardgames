import React from "react";
import BtnContainer from "./BtnContainer"
import "./Btn.css"

const Btn = ({ children }) => {
  return (
    <div>
      <BtnContainer>
        <div className="btn">
          {children}
        </div>
      </BtnContainer>
    </div>
  )
}

export default Btn
