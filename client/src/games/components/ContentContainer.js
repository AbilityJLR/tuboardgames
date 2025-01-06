import React from "react";
import "./ContentContainer.css"

const Content_container = ({ children }) => {
  return (
    <div className="content-container">
      {children}
    </div>
  )
}

export default Content_container
