import OpenAI from "openai";

import { useState, useRef, useEffect, useContext } from "react";
import Message from "./Message";
import { ChatContext } from "../context/chatContext";
import Thinking from "./Thinking";
import { MdSend } from "react-icons/md";
import { replaceProfanities } from "no-profanity";
import ReactDOM from "react-dom";
import { Box, Toolbar } from "@mui/material";

const fetchCompletion = async (prompt, messages, gptVersion) => {
  const response = await fetch("/api/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, messages, gptVersion }),
  });
  const data = await response.json();
  return data.response;
};

const gptModel = ["SciPhi"];
const template = [
  {
    title: "Plan a trip",
    prompt: "I want to plan a trip to New York City.",
  },
  {
    title: "How to make a cake",
    prompt: "How to make a cake with chocolate and strawberries?",
  },
  {
    title: "Business ideas",
    prompt: "Generate 5 business ideas for a new startup company.",
  },
  {
    title: "What is recursion?",
    prompt: "What is recursion? Show me an example in Python.",
  },
];

/**
 * A chat view component that displays a list of messages and a form for sending new messages.
 */
const ChatView = () => {
  const messagesEndRef = useRef();
  const inputRef = useRef();
  const [formValue, setFormValue] = useState("");
  const [thinking, setThinking] = useState(false);
  const [gpt, setGpt] = useState(gptModel[0]);
  const [messages, addMessage, clearChat, removeLastMessage] = useContext(ChatContext);
  const [initialMessageInjected, setInitialMessageInjected] = useState(false);

  const initialMessageProcessed = useRef(false);
  console.log("messages = ", messages);
  /**
   * Scrolls the chat area to the bottom.
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  /**
   * Adds a new message to the chat.
   *
   * @param {string} newValue - The text of the new message.
   * @param {boolean} [ai=false] - Whether the message was sent by an AI or the user.
   */
  const updateMessage = (newValue, ai = false) => {
    const id = Date.now() + Math.floor(Math.random() * 1000000);
    const newMsg = {
      id: id,
      createdAt: Date.now(),
      text: newValue,
      ai: ai,
    };
    console.log("Adding message: ", newMsg); // Debug log
    addMessage(newMsg);
  };



  /**
   * Sends our prompt to our API and get response to our request from openai.
   *
   * @param {Event} e - The submit event of the form.
   */
  const sendMessage = async (e, initialMessage = null) => {
    e?.preventDefault(); // e will be undefined when called programmatically

    const messageToSend = initialMessage || formValue;
    const cleanPrompt = replaceProfanities(messageToSend);

    setThinking(true);
    setFormValue("");
    console.log("updating w/ cleanPrompt = ", cleanPrompt);
    console.log("messages  = ", messages);
    updateMessage(cleanPrompt, false);
    try {
      const LLMresponse = await fetchCompletion(
        cleanPrompt,
        messages,
        "SciPhi/SciPhi-Self-RAG-Mistral-7B-32k"
      );

      ReactDOM.unstable_batchedUpdates(() => {
        LLMresponse && updateMessage(LLMresponse, true);
        setThinking(false);
      });
      console.log("messages  = ", messages);
    } catch (err) {
      window.alert(`Error: ${err} please try again later`);
      setThinking(false);
    }

    setThinking(false);
  };

  const regenerateMessage = async (e) => {
    e?.preventDefault(); // e will be undefined when called programmatically

    // start thinking process
    setThinking(true);
    // do we want to reset user input?
    setFormValue("");

    const messagesCopy = [...messages];
    messagesCopy.pop();

    // remove last message
    removeLastMessage();

    try{
    const LLMResponse = await regenerate(messagesCopy, "emrgnt-cmplxty/Mistral-7b-Phibrarian-32k")

    ReactDOM.unstable_batchedUpdates(() => {
      LLMResponse && updateMessage(LLMResponse, true);
      setThinking(false);
    });

      console.log("messages  = ", messages);
    } catch (err) {
      window.alert(`Error: ${err} please try again later`);
      setThinking(false);
    }

    // end thinking process
    setThinking(false);
  };

  
  useEffect(() => {
    const getInitialMessage = () => {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get("initialMessage");
    };

    const initialMessage = getInitialMessage();

    // Check sessionStorage and state
    const isInjected =
      sessionStorage.getItem("initialMessageInjected") ||
      initialMessageInjected;
    console.log("isInjected = ", isInjected);

    if (initialMessage && !isInjected) {
      initialMessageProcessed.current = true;
      console.log("calling send message");
      sendMessage(null, initialMessage);
      // Mark as injected in both sessionStorage and local state
      sessionStorage.setItem("initialMessageInjected", "true");
      setInitialMessageInjected(true);
    }
  }, []);
  /**
   * Scrolls the chat area to the bottom when the messages array is updated.
   */
  useEffect(() => {
    scrollToBottom();
  }, [messages, thinking]);

  /**
   * Focuses the TextArea input to when the component is first rendered.
   */
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (<>
  <Box sx={{ height:'100vh', display:'flex', flexDirection:'column' }}>
    <Box sx={{ height: "96px"}}> </Box>
    {/*<div className="mx-auto my-4 tabs tabs-boxed w-fit">
        <a
          onClick={() => setGpt(gptModel[0])}
          className={`${gpt == gptModel[0] && "tab-active"} tab`}
        >
          SciPhi
        </a>
      </div> */}

      <section className="flex flex-col flex-grow w-full px-4 overflow-y-scroll sm:px-10 md:px-32 ">
        {messages.length ? (
          messages.map((message, index) => (
            <Message key={index} message={{ ...message }} regen={(e) => regenerateMessage(e)} />
          ))
        ) : (
          <div className="flex my-2">
            <div className="w-screen overflow-hidden">
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mx-10">
                {template.map((item, index) => (
                  <li
                    onClick={() => setFormValue(item.prompt)}
                    key={index}
                    className="p-6 border rounded-lg border-slate-300 hover:border-slate-500 cursor-pointer"
                  >
                    <p className="text-base font-semibold">{item.title}</p>
                    <p className="text-sm">{item.prompt}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {thinking && <Thinking />}

        <span ref={messagesEndRef}></span>
      </section>

      <form
        className="flex flex-col px-10 mb-2 md:px-32 join sm:flex-row"
        onSubmit={sendMessage}
        disabled={true}
      >
        <div className="flex items-stretch justify-between w-full relative">
          <input
            ref={inputRef}
            className="w-full grow pl-3 pr-10 h-12" // Padding right to prevent text going under the button
            value={formValue}
            onChange={(e) => setFormValue(e.target.value)}
          />

          <button
            type="submit"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 btn btn-primary"
            disabled={!formValue}
            style={{ zIndex: 10 }} // optional, to ensure the button is above the input
          >
            <MdSend size={30} />
          </button>
        </div>
      </form>
    </Box>
    </>
  );
};

export default ChatView;
