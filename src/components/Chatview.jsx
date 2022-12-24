import React, { useState, useRef, useEffect, useMemo } from 'react'
import ChatMessage from './ChatMessage';
import axios from 'axios';

const ChatView = () => {
  const messagesEndRef = useRef();
  const data = [
    {
      id: 1, date: '4 min ago', text: `
      To update the components when the messages object is updated, you can wrap the parent component in a React.memo higher-order component, 
    which will prevent the component from re-rendering if the props have not changed.
    Here's an example of how you can do this:
    `, ai: true
    },
    { id: 2, date: '4 min ago', text: 'hello world', ai: false },
    { id: 3, date: '4 min ago', text: 'hello world', ai: true },
    { id: 4, date: '4 min ago', text: 'hello world', ai: false },
    { id: 5, date: '4 min ago', text: 'hello world', ai: true },
    { id: 6, date: '4 min ago', text: 'hello world', ai: false },
    { id: 7, date: '4 min ago', text: 'hello world', ai: true },
    { id: 8, date: '4 min ago', text: 'hello world', ai: false },
    { id: 9, date: '4 min ago', text: 'hello world', ai: true },
    { id: 10, date: '4 min ago', text: 'test', ai: true },
  ]
  const [messages, setMessages] = useState(data)

  const [formValue, setFormValue] = useState('');
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const sendMessage = async (e) => {
    e.preventDefault();
    const id = messages.length > 0 ? messages[messages.length - 1].id + 1 : 1;

    setMessages([...messages, {
      id: id,
      date: 'now',
      text: formValue,
      ai: false
    }]);

    const response = await fetch('http://localhost/3001', {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    setMessages([...messages, {
      id: id,
      date: 'now',
      text: data,
      ai: false
    }]);

    setFormValue('');
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages]);

  return (
    <div className="chatview">
      <main className='chatview__chatarea'>

        {Object.entries(messages).map(([key, value]) =>
          <ChatMessage key={key} message={value} />
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