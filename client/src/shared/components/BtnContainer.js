import React from "react";
import "./BtnContainer.css"

const BtnContainer = ({ children }) => {
  return (
    <div className="btn-container">
      {children}
    </div>
  )
}

export default BtnContainer
