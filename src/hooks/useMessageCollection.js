import { useEffect, useMemo, useState } from 'react';

/**
 * A custom hook for managing the conversation between the user and the AI.
 *
 * @returns {Object} An object containing the `messages` array, the `addMessage` function, the `updateMessage` function, and the `clearChat` function.
 */
const STORAGE_KEY = 'ollama-chats';
const CURRENT_CHAT_KEY = 'ollama-current-chat-id';

const createChat = (title = 'New chat') => ({
  id: Date.now() + Math.floor(Math.random() * 1000000),
  title,
  messages: [],
  createdAt: Date.now(),
  updatedAt: Date.now(),
});

const coerceChats = (value) => {
  if (!Array.isArray(value)) return [];
  return value.filter(Boolean);
};

const buildTitle = (text) => {
  const trimmed = text.replace(/\s+/g, ' ').trim();
  if (!trimmed) return 'New chat';
  return trimmed.length > 48 ? `${trimmed.slice(0, 48)}...` : trimmed;
};

const useMessageCollection = () => {
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);

  useEffect(() => {
    const storedChats = coerceChats(
      JSON.parse(localStorage.getItem(STORAGE_KEY))
    );
    if (storedChats.length) {
      setChats(storedChats);
      const storedCurrentId = localStorage.getItem(CURRENT_CHAT_KEY);
      const hasStoredId = storedChats.some(
        (chat) => String(chat.id) === String(storedCurrentId)
      );
      setCurrentChatId(
        hasStoredId ? storedCurrentId : String(storedChats[0].id)
      );
      return;
    }

    const legacyMessages = JSON.parse(localStorage.getItem('messages'));
    const chat = createChat('Chat 1');
    chat.messages = Array.isArray(legacyMessages) ? legacyMessages : [];
    setChats([chat]);
    setCurrentChatId(String(chat.id));
  }, []);

  useEffect(() => {
    if (!chats.length) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    if (currentChatId) {
      localStorage.setItem(CURRENT_CHAT_KEY, String(currentChatId));
    }
  }, [currentChatId]);

  const currentChat = useMemo(
    () => chats.find((chat) => String(chat.id) === String(currentChatId)),
    [chats, currentChatId]
  );

  const messages = currentChat?.messages ?? [];

  /**
   * A function for adding a new message to the collection.
   *
   * @param {Object} message - The message to add to the collection.
   */
  const addMessage = (message) => {
    if (!currentChatId) {
      const newChat = createChat();
      newChat.messages = [message];
      setChats((prev) => [newChat, ...prev]);
      setCurrentChatId(String(newChat.id));
      return;
    }

    setChats((prev) =>
      prev.map((chat) => {
        if (String(chat.id) !== String(currentChatId)) return chat;
        const nextMessages = [...(chat.messages || []), message];
        const nextTitle =
          !message.ai && (!chat.title || chat.title === 'New chat')
            ? buildTitle(message.text || '')
            : chat.title;
        return {
          ...chat,
          title: nextTitle,
          messages: nextMessages,
          updatedAt: Date.now(),
        };
      })
    );
  };

  /**
   * Update an existing message by id.
   *
   * @param {number} id - The id of the message to update.
   * @param {Object} updates - The updates to apply to the message.
   */
  const updateMessage = (id, updates) => {
    if (!currentChatId) return;
    setChats((prev) =>
      prev.map((chat) => {
        if (String(chat.id) !== String(currentChatId)) return chat;
        return {
          ...chat,
          messages: (chat.messages || []).map((message) =>
            message.id === id ? { ...message, ...updates } : message
          ),
          updatedAt: Date.now(),
        };
      })
    );
  };

  /**
   * A function for clearing all messages in the collection and resetting to the initial message.
   */
  const clearChat = () => {
    if (!currentChatId) return;
    setChats((prev) =>
      prev.map((chat) =>
        String(chat.id) === String(currentChatId)
          ? { ...chat, messages: [], updatedAt: Date.now() }
          : chat
      )
    );
  };

  const createNewChat = () => {
    const chat = createChat();
    setChats((prev) => [chat, ...prev]);
    setCurrentChatId(String(chat.id));
  };

  const selectChat = (id) => {
    if (!id) return;
    setCurrentChatId(String(id));
  };

  const deleteChat = (id) => {
    if (!id) return;
    setChats((prev) => {
      const remaining = prev.filter((chat) => String(chat.id) !== String(id));
      const wasCurrent = String(id) === String(currentChatId);
      if (!remaining.length) {
        const newChat = createChat();
        if (wasCurrent || !currentChatId) {
          setCurrentChatId(String(newChat.id));
        }
        return [newChat];
      }
      if (wasCurrent) {
        setCurrentChatId(String(remaining[0].id));
      }
      return remaining;
    });
  };

  return {
    chats,
    currentChatId,
    messages,
    addMessage,
    updateMessage,
    clearChat,
    createNewChat,
    selectChat,
    deleteChat,
  };
};

export default useMessageCollection;
