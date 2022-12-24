import React, { useState, useRef, useEffect } from 'react'
import ChatMessage from './ChatMessage';

const ChatView = () => {
  const messagesEndRef = useRef();
  const messages = [
    { id: 1, date: '4 min ago', text: 'hello world' },
    { id: 2, date: '4 min ago', text: 'hello world' },
    { id: 3, date: '4 min ago', text: 'hello world' },
    { id: 4, date: '4 min ago', text: 'hello world' },
    { id: 5, date: '4 min ago', text: 'hello world' },
    { id: 6, date: '4 min ago', text: 'hello world' },
    { id: 7, date: '4 min ago', text: 'hello world' },
    { id: 8, date: '4 min ago', text: 'hello world' },
    { id: 9, date: '4 min ago', text: 'hello world' },
  ]
  const [formValue, setFormValue] = useState('');
  const scrollToBottom = () => {
    // messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    messagesEndRef.current?.scrollIntoView()
  }
  const sendMessage = async (e) => {
    messages.push(`{
      id: ${messages[messages.length - 1].id + 1}, date: 'now', text: '${formValue}'
    }`)
    // setFormValue('');
    scrollToBottom();
    console.log(messages)
  }

  // useEffect(() => {
  //   scrollToBottom()
  // }, [messages]);

  return (
    <div className="chatview">
      <main className='chatview__chatarea'>

        {messages && messages.map(msg =>
          <ChatMessage key={msg.id} date={msg.date} text={msg.text} />
        )}

        <span ref={messagesEndRef}></span>

      </main>
      <form onSubmit={sendMessage}>

        <textarea className='chatview__textarea-message' value={formValue} onChange={(e) => setFormValue(e.target.value)} />

        <button type="submit" className='chatview__btn-send' disabled={!formValue}>Send</button>

      </form>
    </div>
  )
}

export default ChatView