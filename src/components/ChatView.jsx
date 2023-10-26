import { useState, useRef, useEffect, useContext } from "react";
import Message from "./Message";
import { ChatContext } from "../context/chatContext";
import Thinking from "./Thinking";
import { replaceProfanities } from "no-profanity";
import { completions, regenerate } from "../utils/engine";
import ReactDOM from "react-dom";
import {
  AppBar,
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Send } from "@mui/icons-material";
import { useMemo } from "react";

// const gptModel = ["SciPhi"];
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
  const [initialMessageInjected, setInitialMessageInjected] = useState(false);
  const [ragEnabled, setRagEnabled] = useState(false);

  const initialMessageProcessed = useRef(false);
  const [
    ,
    currentConversation,
    selectConversation,
    addConversation,
    ,
    addMessage,
    ,
    removeLastMessage,
  ] = useContext(ChatContext);

  const messages = useMemo(() => {console.log("currentChanged", currentConversation); return currentConversation ? currentConversation.messages : []}, [currentConversation]);
  
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

    updateMessage(cleanPrompt, false);
    try {
      console.log("messages is", messages)
      const LLMresponse = await completions(
        cleanPrompt,
        messages,
        "emrgnt-cmplxty/Mistral-7b-Phibrarian-32k"
      );

      ReactDOM.unstable_batchedUpdates(() => {
        LLMresponse && updateMessage(LLMresponse, true);
        setThinking(false);
      });
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

    try {
      const LLMResponse = await regenerate(
        messagesCopy,
        "emrgnt-cmplxty/Mistral-7b-Phibrarian-32k"
      );

      ReactDOM.unstable_batchedUpdates(() => {
        LLMResponse && updateMessage(LLMResponse, true);
        setThinking(false);
      });

    } catch (err) {
      setThinking(false);
    }
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

    if (initialMessage && !isInjected) {
      initialMessageProcessed.current = true;
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

  return (
    <>
      <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
        <Box sx={{ height: "96px" }}> </Box>
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "scroll",
            p: 2,
          }}
        >
          {messages.length ? (
            messages.map((message, index) => (
              <Message
                key={index}
                message={{ ...message }}
                regen={(e) => regenerateMessage(e)}
              />
            ))
          ) : (
            <Container maxWidth="md" sx={{ my: 2 }}>
              <Grid container spacing={2}>
                {template.map((item, index) => (
                  <Grid item xs={12} sm={6} md={6} key={index}>
                    <Card
                      variant="outlined"
                      onClick={() => setFormValue(item.prompt)}
                    >
                      <CardActionArea>
                        <CardHeader title={item.title} />
                        <CardContent>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            gutterBottom
                          >
                            {item.prompt}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Container>
          )}

          {thinking && <Thinking />}
          <span ref={messagesEndRef}></span>
          <Box sx={{ height: "96px", marginBottom: "96px" }}> </Box>
        </Box>

        <AppBar
          position="fixed"
          color="primary"
          sx={{
            top: "auto",
            bottom: 0,
            width: { sm: `calc(100% - ${280}px)` },
            ml: { sm: `${280}px` },
            p: 2,
          }}
        >
          <form
            onSubmit={sendMessage}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <TextField
              id="outlined-multiline-static"
              multiline
              inputRef={inputRef}
              value={formValue}
              fullWidth
              onChange={(e) => setFormValue(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {" "}
                    <IconButton onClick={(e) => sendMessage(e)}>
                      <Send />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              onKeyUp={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  sendMessage(e);
                }
              }}
              sx={{ overflow: "scroll", maxHeight: "96px" }}
            />
            <Tooltip placement="top" title="Toggle RAG">
              <Switch
                checked={ragEnabled}
                onChange={(e) => setRagEnabled(e.target.checked)}
              />
            </Tooltip>
          </form>
        </AppBar>
      </Box>
    </>
  );
};

export default ChatView;
