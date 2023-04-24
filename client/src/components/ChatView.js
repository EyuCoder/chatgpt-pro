import React, { useState, useRef, useEffect, useContext } from 'react'
import ChatMessage from './ChatMessage'
import { ChatContext } from '../context/chatContext'
import { auth } from '../firebase'
import Thinking from './Thinking'
import { MdSend } from 'react-icons/md'
import promptBuilder from '../utils/promptBuilder'
import Filter from 'bad-words'

/**
 * A chat view component that displays a list of messages and a form for sending new messages.
 */
const ChatView = () => {
  const messagesEndRef = useRef()
  const inputRef = useRef()
  const [formValue, setFormValue] = useState('')
  const [thinking, setThinking] = useState(false)
  const options = ['ChatGPT', 'DALL·E']
  const [selected, setSelected] = useState(options[0])
  const [messages, addMessage, , , setLimit] = useContext(ChatContext)
  const user = auth.currentUser.uid
  const picUrl = auth.currentUser.photoURL || '../../public/favicon.ico'

  /**
   * Scrolls the chat area to the bottom.
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  /**
   * Adds a new message to the chat.
   *
   * @param {string} newValue - The text of the new message.
   * @param {boolean} [ai=false] - Whether the message was sent by an AI or the user.
   */
  const updateMessage = (newValue, ai = false, selected) => {
    const filter = new Filter()
    const cleanPrompt = filter.isProfane(newValue)
      ? filter.clean(newValue)
      : newValue

    console.log('CLEAN', cleanPrompt)

    const id = Date.now() + Math.floor(Math.random() * 1000000)
    const newMsg = {
      id: id,
      createdAt: Date.now(),
      text: cleanPrompt,
      ai: ai,
      selected: `${selected}`,
    }

    addMessage(newMsg)
    const systemRole = {
      role: 'system',
      content: `you're an a AI assistant that replies to all my questions in markdown format.`,
    }

    // console.log('CLEAN', [...messages, newMsg])
    return promptBuilder([...messages, newMsg], systemRole)
  }

  /**
   * Sends our prompt to our API and get response to our request from openai.
   *
   * @param {Event} e - The submit event of the form.
   */
  const sendMessage = async (e) => {
    e.preventDefault()

    const newMsg = formValue
    const aiModel = selected

    const BASE_URL = process.env.REACT_APP_BASE_URL
    const PATH = aiModel === options[0] ? 'davinci' : 'dalle'
    const POST_URL = BASE_URL + PATH

    setThinking(true)
    setFormValue('')
    let prompt = updateMessage(newMsg, false, aiModel)

    console.log(prompt)

    const response = await fetch(POST_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt,
        user: user,
      }),
    })

    const data = await response.json()
    setLimit(data.limit)

    console.log(response.status)
    if (response.ok) {
      // The request was successful
      data.bot && updateMessage(data.bot, true, aiModel)
    } else if (response.status === 429) {
      setThinking(false)
    } else {
      // The request failed
      window.alert(`openAI is returning an error: ${
        response.status + response.statusText
      } 
      please try again later`)
      console.log(`Request failed with status code ${response.status}`)
      setThinking(false)
    }

    setThinking(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (e.target.value) sendMessage(e)
    }
  }

  /**
   * Scrolls the chat area to the bottom when the messages array is updated.
   */
  useEffect(() => {
    scrollToBottom()
  }, [messages, thinking])

  /**
   * Focuses the TextArea input to when the component is first rendered.
   */
  useEffect(() => {
    inputRef.current.focus()
  }, [])

  return (
    <div className="chatview">
      <main className="chatview__chatarea">
        {messages.map((message, index) => (
          <ChatMessage key={index} message={{ ...message, picUrl }} />
        ))}

        {thinking && <Thinking />}

        <span ref={messagesEndRef}></span>
      </main>
      <form className="form" onSubmit={sendMessage}>
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="dropdown">
          <option>{options[0]}</option>
          <option>{options[1]}</option>
        </select>
        <div className="flex items-stretch w-full justify-between">
          <textarea
            maxLength={1000}
            ref={inputRef}
            className="chatview__textarea-message"
            value={formValue}
            onKeyDown={handleKeyDown}
            onChange={(e) => setFormValue(e.target.value)}
          />
          <button
            type="submit"
            className="chatview__btn-send"
            disabled={!formValue}>
            <MdSend size={30} />
          </button>
        </div>
      </form>
    </div>
  )
}

export default ChatView
