import React from 'react'

const ChatMessage = (props) => {
  const { id, date, text } = props
  return (
    <div className="p-5 m-5">
      <div>{date}</div>
      <div>{text}</div>
    </div>
  )
}

export default ChatMessage