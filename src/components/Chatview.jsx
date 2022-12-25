import React, { useState, useRef, useEffect } from 'react'
import ChatMessage from './ChatMessage';
import useMessageCollection from '../hooks/useMessageCollection';

const ChatView = () => {
  const messagesEndRef = useRef();
  const [formValue, setFormValue] = useState('');
  const { messages, addMessage } = useMessageCollection([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const updateMessage = (newValue, ai = false) => {
    const id = Date.now() + Math.floor(Math.random() * 1000000)
    const newMsg = {
      id: id,
      createdAt: Date.now(),
      text: newValue,
      ai: ai
    }

    addMessage(newMsg);
  }

  const sendMessage = async (e) => {
    e.preventDefault();

    const newMsg = formValue
    setFormValue('')
    updateMessage(newMsg)

    const response = await fetch('http://localhost:3001/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: newMsg
      })
    });

    const data = await response.json();
    if (response.ok) {
      // The request was successful
      data.bot && updateMessage(data.bot, true);
    } else {
      // The request failed
      window.alert(`openAI is returning an error: ${response.status, response.statusText} 
      please try again later`);
      console.log(`Request failed with status code ${response.status}`);
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages]);

  return (
    <div className="chatview">
      <main className='chatview__chatarea'>
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}

        <span ref={messagesEndRef}></span>
      </main>
      <form className='form' onSubmit={sendMessage}>
        <textarea className='chatview__textarea-message' value={formValue} onChange={(e) => setFormValue(e.target.value)} />
        <button type="submit" className='chatview__btn-send' disabled={!formValue}>Send</button>
      </form>
    </div>
  )
}

export default ChatView