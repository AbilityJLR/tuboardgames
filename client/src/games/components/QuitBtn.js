import React from "react";
import "./QuitBtn.css"

const QuitBtn = ({ children }) => {
  return (
    <div className="quit-btn">
      {children}
    </div>
  )
}

export default QuitBtn
