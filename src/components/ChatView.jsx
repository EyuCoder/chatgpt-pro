import OpenAI from "openai";

import { useState, useRef, useEffect, useContext } from "react";
import Message from "./Message";
import { ChatContext } from "../context/chatContext";
import Thinking from "./Thinking";
import { replaceProfanities } from "no-profanity";
import ReactDOM from "react-dom";
import {
  AppBar,
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { Close, Send } from "@mui/icons-material";
import { useMemo } from "react";

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
  const [initialMessageInjected, setInitialMessageInjected] = useState(false);
  const [modalContext, setModalContext] = useState(null);
  const [visibleContext, setVisibleContext] = useState(false);

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

  const messages = useMemo(() => {
    console.log("currentChanged", currentConversation);
    return currentConversation ? currentConversation.messages : [];
  }, [currentConversation]);

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
      const LLMresponse = await fetchCompletion(
        cleanPrompt,
        messages,
        "SciPhi/SciPhi-Self-RAG-Mistral-7B-32k"
      );

      console.log("LLMresponse is", LLMresponse);

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
      const LLMResponse = await completions(
        messagesCopy[messagesCopy.length - 1].text,
        messagesCopy
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
   * Sets the modal context to the message id when the user clicks on a message.
   * @param {number} id - The id of the message.
   */
  const setModalContextHandler = (id) => {
    setModalContext(id);
  };

  /**
   * Sets the modal context to null when the user clicks outside of the modal.
   */
  const setModalContextNull = () => {
    setModalContext(null);
  };

  useEffect(() => {
    if (modalContext !== null) {
      setVisibleContext(true);
    } else {
      setVisibleContext(false);
    }
  }, [modalContext]);

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
  const ContextItem = [
    [
      {
        id: 12333661,
        title: "Hine E Hine",
        text: 'Hine E Hine "" is a Māori lullaby written by Princess Te Rangi Pai (Fanny Rose Howie née Porter) (1868–1916) in 1907. An instrumental version of "" was used from 1979 to 1994 as the New Zealand TV Channel 2\'s "closing-down song", which accompanied a cartoon featuring the Goodnight Kiwi. It was the opening song on Kiri Te Kanawa\'s 1999 album "Maori Songs". Hayley Westenra sang the song on her 2003 album "Pure". The song features on the José Carreras album "The José Carreras Collection". The Phoenix Foundation performed the song in the 2010 film "Boy". Alternative words were supplied',
      },
      {
        id: 20753222,
        title: "Myrtle K. Hilo",
        text: "Myrtle K. Hilo Myrtle K. Hilo (May 17, 1929 - October 3, 2009) was a native Hawaiian taxicab driver, radio personality, ukulele player and singer. Her signature album \"The Singing Cab Driver\" was released in 1967 on Makaha Records. She was born in Hauʻula, Hawaii on the island of O'ahu. In 1998 she received the Lifetime Achievement Award from the Hawai'i Academy of Recording Arts. Myrtle Kahea Hilo was born of Hawaiian ancestry in Hauʻula on the island of O'ahu, in the Territory of Hawaii. In 1948, she married heavy equipment operator George Hilo. They became the parents of one",
      },
      {
        id: 7799829,
        title: "Hi (kana)",
        text: 'Hi (kana) ひ, in hiragana, or ヒ in katakana, is one of the Japanese kana, which each represent one mora. Both can be written in two strokes, sometimes one for hiragana, and both are phonemically although for phonological reasons, the actual pronunciation is , the sound would be nearer to be transcribed "hyi" in ro-maji. The pronunciation of the voiceless palatal fricative [ç] is similar to that of the English word hue [çuː] for some speakers. In the Sakhalin dialect of the Ainu language, ヒ can be written as small ㇶ to represent a final h sound after an "i"',
      },
      {
        id: 936417,
        title: "Hina (goddess)",
        text: 'book, "The Legend of Te Tuna". Also, in his popular book "The Seven Daughters of Eve", Bryan Sykes used Hina\'s name, (spelled therein "Ina") to denote the clan matriarch of mtDNA haplogroup B. David Lee Roth recorded a song called "Hina", contained on the hard rock album "Skyscraper", released in 1988. Hina (goddess) Hina is the Eastern Polynesian variant for the given name Sina. Hina/Sina is the name assigned to a number of Polynesian goddesses and queens. Among the Iwi of New Zealand, Hina is usually considered to be either the elder sister or the wife of Maui. The most',
      },
      {
        id: 936475,
        title: "Hiʻiaka",
        text: 'Hiʻiaka In Hawaiian mythology, Hiʻiaka is a daughter of Haumea and Kāne. Hiiaka, or the youngest Hiiaka, was the patron goddess of Hawaii, hula dancers, chant, sorcery and medicine. Owls were her messengers and were sacred to her. Her common and family name means "carried egg" - "hii", to hold or carry in the arms (as a child), and "aka", meaning embryo - referring to the story of how she was brought to Hawaii by her sister Pele. Her family line is called Hiiaka, and they take on the task of bearing the clouds, providing rain, thunder and lightning variously,',
      },
    ],
  ];

  return (
    <>
      <Dialog
        open={visibleContext}
        onClose={setModalContextNull}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Context</DialogTitle>
        <DialogActions>
          <IconButton
            onClick={setModalContextNull}
            sx={{ position: "absolute", right: "8px", top: "8px" }}
          >
            <Close />
          </IconButton>
        </DialogActions>

        <DialogContent dividers>
          {ContextItem.map((item, index) => (
            <Grid container spacing={2} key={index}>
              {item.map((item, index) => (
                <Grid item xs={12} sm={6} md={6} key={index}>
                  <Card variant="outlined">
                    <CardActionArea>
                      <CardHeader title={item.title} />
                      <CardContent>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          gutterBottom
                        >
                          {item.text}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ))}
        </DialogContent>
      </Dialog>
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
                viewModal={(id) => {
                  setModalContextHandler(id);
                }}
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
        <Box sx={{ height: "96px", marginBottom:"96px"}}> </Box>
      </Box>
      
      <AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0, width: { sm: `calc(100% - ${280}px)` }, ml: { sm: `${280}px` }, p: 2}}>
      <form
        onSubmit={sendMessage}
        disabled={true}
      >
        <TextField
          id="outlined-multiline-static"
          multiline
          inputRef={inputRef}
          value={formValue}
          fullWidth
          onChange={(e) => setFormValue(e.target.value)}
          InputProps={{
            endAdornment:<InputAdornment position="end"> <IconButton onClick={(e) => sendMessage(e)}><Send /></IconButton></InputAdornment>,
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
            {/* <Tooltip placement="top" title="Toggle RAG">
              <Switch
                checked={ragEnabled}
                onChange={(e) => setRagEnabled(e.target.checked)}
              />
            </Tooltip> */}
          </form>
        </AppBar>
      </Box>
    </>
  );
};

export default ChatView;
