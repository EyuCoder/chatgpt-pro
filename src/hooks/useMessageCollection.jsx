import { useState } from 'react'

const useMessageCollection = () => {
  const [messages, setMessages] = useState([]);

  function addMessage(message) {
    setMessages((prev) => [...prev, message]);
  }

  return { messages, addMessage };
}

export default useMessageCollection