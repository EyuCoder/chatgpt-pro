import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

const fetchTitle = async (messages, gptVersion) => {
  const response = await fetch("/api/title_fetcher", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, gptVersion }),
  });
  console.log("response = ", response);
  console.log("response = ", response);
  const data = await response.json();
  return data.response;
};

const useMessageCollection = () => {
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [firstLoad, setFirstLoad] = useState(false);

  // Load conversations from local storage
  useEffect(() => {
    if (firstLoad) {
      localStorage.setItem("conversations", JSON.stringify(conversations));
    } else {
      const localConversations = JSON.parse(
        localStorage.getItem("conversations")
      );
      if (localConversations && localConversations.length > 0) {
        setConversations(localConversations);
        setCurrentConversation(localConversations[0]);
      } else {
        const newConversation = {
          id: 1,
          title: "Default Conversation",
          context: {},
          uuid: uuidv4(),
          messages: [],
          timestamp: Date.now(),
        };
        setConversations([newConversation]);
        setCurrentConversation(newConversation);
      }
      setFirstLoad(true);
    }
  }, [conversations]);

  // let's generate and update the title of the current conversation if there is at least 2 messages
  useEffect(() => {
    if (
      currentConversation &&
      currentConversation.messages.length > 1 &&
      (currentConversation.title === "New Conversation" ||
        currentConversation.title === "Default Conversation")
    ) {
      console.log("fetching tite...");
      fetchTitle(
        currentConversation.messages,
        "SciPhi/SciPhi-Self-RAG-Mistral-7B-32k"
      ).then((response) => {
        console.log("response = ", response);

        setCurrentConversation((prev) => {
          return { ...prev, title: response };
        });

        setConversations((prev) => {
          return prev.map((conv) => {
            if (conv.uuid === currentConversation.uuid) {
              return { ...conv, title: response };
            } else {
              return conv;
            }
          });
        });
      });
    }
  }, [currentConversation]);

  // Select conversation based on uuid
  const selectConversation = (uuid) => {
    const selectedConversation = conversations.find(
      (conv) => conv.uuid === uuid
    );
    setCurrentConversation(selectedConversation);
  };

  // Add a new conversation
  const addConversation = () => {
    const newConversation = {
      id: conversations.length + 1,
      title: "New Conversation",
      context: {},
      uuid: uuidv4(),
      messages: [],
      timestamp: Date.now(),
    };
    setConversations((prev) => [...prev, newConversation]);

    // important for users that press the add conversation button
    setCurrentConversation(newConversation);
  };

  // Delete conversation based on uuid
  const deleteConversation = (uuid) => {
    setConversations((prev) => prev.filter((conv) => conv.uuid !== uuid));
    if (currentConversation.uuid === uuid) {
      setCurrentConversation(null);
    }

    // if there are no conversations left, create a new one
    if (conversations.length === 1) {
      const newConversation = {
        id: 1,
        title: "Default Conversation",
        context: {},
        uuid: uuidv4(),
        messages: [],
        timestamp: Date.now(),
      };
      setConversations([newConversation]);
      setCurrentConversation(newConversation);
    }
  };

  // Add a message to the current conversation
  const addMessage = (message) => {
    console.log("addMessage, message", message);
    console.log("addMessage, currentConversation", currentConversation);

    console.log("addMessage->currentConversation");
    setConversations((prev) => {
      return prev.map((conv) => {
        if (conv.uuid === currentConversation.uuid) {
          return { ...conv, messages: [...conv.messages, message] };
        } else {
          return conv;
        }
      });
    });

    setCurrentConversation((prev) => {
      return { ...prev, messages: [...prev.messages, message] };
    });
  };

  // Clear all messages in the current conversation
  const clearChat = () => {
    if (currentConversation) {
      setCurrentConversation((prev) => {
        return { ...prev, messages: [] };
      });
    }
  };

  // Remove the last message from the current conversation
  const removeLastMessage = () => {
    if (currentConversation) {
      setCurrentConversation((prev) => {
        return { ...prev, messages: prev.messages.slice(0, -1) };
      });
    }
  };

  return {
    conversations,
    currentConversation,
    selectConversation,
    addConversation,
    deleteConversation,
    addMessage,
    clearChat,
    removeLastMessage,
  };
};

export default useMessageCollection;
