import React from "react";
import "./VoteBtn.css"

const VoteBtn = ({ children }) => {
  return (
    <div className="vote-btn">
      {children}
    </div>
  )
}

export default VoteBtn
