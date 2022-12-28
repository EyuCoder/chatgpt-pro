import { useState } from 'react'

/**
 * A custom hook for managing the conversation between the user and the AI.
 *
 * @returns {Object} An object containing the `messages` array and the `addMessage` function.
 */
const useMessageCollection = () => {
  const initialMsg = {
    id: 1,
    createdAt: Date.now(),
    text: '**Hello!** *How can I help you today?*',
    ai: true
  }
  const [messages, setMessages] = useState([initialMsg]);

  /**
  * A function for adding a new message to the collection.
  *
  * @param {Object} message - The message to add to the collection.
  */
  const addMessage = (message) => {
    setMessages((prev) => [...prev, message]);
  }

  const clearMessages = () => setMessages([initialMsg])

  return [messages, addMessage, clearMessages];
}

export default useMessageCollection