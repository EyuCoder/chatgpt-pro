import { useState, useEffect } from "react";

/**
 * A custom hook for managing the conversation between the user and the AI.
 *
 * @returns {Object} An object containing the `messages` array, the `addMessage` function, the `clearMessages` function, and the `loadMessage` function.
 */
const useMessageCollection = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const storedMessages = JSON.parse(localStorage.getItem("messages"));
    if (storedMessages && messages == []) {
      setMessages(storedMessages);
    }
  }, []);

  useEffect(() => {
    const getInitialMessage = () => {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get("initialMessage");
    };
    const isInjected =
      sessionStorage.getItem("initialMessageInjected") ||
      initialMessageInjected;

    const initialMessage = getInitialMessage();
    if (
      initialMessage &&
      !isInjected &&
      !messages.some((msg) => msg.text === initialMessage)
    ) {
      const initialMsgObj = {
        id: Date.now(),
        createdAt: Date.now(),
        text: initialMessage,
        ai: false,
      };
      setMessages((prev) => [...prev, initialMsgObj]);
    }
  }, [messages]);

  useEffect(() => {
    if (messages.length) {
      localStorage.setItem("messages", JSON.stringify(messages));
    }
  }, [messages]);

  /**
   * A function for clearing all messages in the collection and resetting to the initial message.
   */
  const clearChat = () => {
    localStorage.setItem("messages", JSON.stringify([]));
    setMessages([]);
  };
  /**
   * A function for adding a new message to the collection.
   *
   * @param {Object} message - The message to add to the collection.
   */
  const addMessage = (message) => {
    setMessages((prev) => [...prev, message]);
  };

  return { messages, addMessage, clearChat };
};

export default useMessageCollection;
