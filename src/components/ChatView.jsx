import { useState, useRef, useEffect, useContext } from 'react';
import Message from './Message';
import { ChatContext } from '../context/chatContext';
import Thinking from './Thinking';
import { MdSend } from 'react-icons/md';
import { replaceProfanities } from 'no-profanity';
import { generateOllamaImage, streamOllamaChat } from '../utils/ollama';
import ThoughtSidebar from './ThoughtSidebar';
import { SettingsContext } from '../context/settingsContext';

const template = [
  {
    title: 'Plan a trip',
    prompt: 'I want to plan a trip to New York City.',
  },
  {
    title: 'how to make a cake',
    prompt: 'How to make a cake with chocolate and strawberries?',
  },
  {
    title: 'Business ideas',
    prompt: 'Generate 5 business ideas for a new startup company.',
  },
  {
    title: 'What is recursion?',
    prompt: 'What is recursion? show me an example in python.',
  },
];

const THINK_OPEN = '<think>';
const THINK_CLOSE = '</think>';
const THINK_TAG_MAX = THINK_CLOSE.length;
const IMAGE_TAG_REGEX = /<image\b[^>]*>/gi;
const IMAGE_TOKEN_PREFIX = '[[image-token-';

/**
 * A chat view component that displays a list of messages and a form for sending new messages.
 */
const ChatView = () => {
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const assistantTextRef = useRef('');
  const imageBaseTextRef = useRef('');
  const parserRef = useRef({ mode: 'normal', pending: '' });
  const activeThoughtIdRef = useRef(null);
  const streamStartedRef = useRef(false);
  const [formValue, setFormValue] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamStarted, setStreamStarted] = useState(false);
  const [thoughts, setThoughts] = useState([]);
  const [showThoughts, setShowThoughts] = useState(true);

  const { messages, addMessage, updateMessage, currentChatId } =
    useContext(ChatContext);
  const {
    baseUrl,
    model,
    setModel,
    imageModel,
    imageSize,
    imageEnabled,
    thinkingMode,
    availableModels,
    refreshModels,
  } = useContext(SettingsContext);
  const [modelsLoading, setModelsLoading] = useState(false);
  const [modelsError, setModelsError] = useState('');
  const isImageLikeModel = /image|z-image|diffusion|sd|stable/i.test(model);

  /**
   * Scrolls the chat area to the bottom.
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  /**
   * Adds a new message to the chat.
   *
   * @param {string} newValue - The text of the new message.
   * @param {boolean} [ai=false] - Whether the message was sent by an AI or the user.
   */
  const addChatMessage = (newValue, ai = false) => {
    const id = Date.now() + Math.floor(Math.random() * 1000000);
    const newMsg = {
      id: id,
      createdAt: Date.now(),
      text: newValue,
      ai: ai,
      selected: model,
      role: ai ? 'assistant' : 'user',
    };

    addMessage(newMsg);
    return id;
  };

  const ensureThought = (messageId) => {
    if (activeThoughtIdRef.current) {
      return activeThoughtIdRef.current;
    }
    const thoughtId = Date.now() + Math.floor(Math.random() * 1000000);
    activeThoughtIdRef.current = thoughtId;
    setThoughts((prev) => [
      ...prev,
      { id: thoughtId, messageId, content: '', done: false },
    ]);
    return thoughtId;
  };

  const appendAssistantText = (messageId, chunk) => {
    if (!chunk) return;
    assistantTextRef.current += chunk;
    updateMessage(messageId, {
      text: assistantTextRef.current,
      renderedText: assistantTextRef.current,
    });
  };

  const appendThoughtText = (messageId, chunk) => {
    if (!chunk) return;
    const thoughtId = ensureThought(messageId);
    setThoughts((prev) =>
      prev.map((thought) =>
        thought.id === thoughtId
          ? { ...thought, content: thought.content + chunk }
          : thought
      )
    );
  };

  const markThoughtDone = () => {
    if (!activeThoughtIdRef.current) return;
    const thoughtId = activeThoughtIdRef.current;
    setThoughts((prev) =>
      prev.map((thought) =>
        thought.id === thoughtId ? { ...thought, done: true } : thought
      )
    );
    activeThoughtIdRef.current = null;
  };

  const processText = (messageId, text) => {
    let remaining = text;
    while (remaining.length) {
      if (parserRef.current.mode === 'normal') {
        const openIndex = remaining.indexOf(THINK_OPEN);
        if (openIndex === -1) {
          appendAssistantText(messageId, remaining);
          remaining = '';
        } else {
          if (openIndex > 0) {
            appendAssistantText(messageId, remaining.slice(0, openIndex));
          }
          remaining = remaining.slice(openIndex + THINK_OPEN.length);
          parserRef.current.mode = 'think';
          ensureThought(messageId);
        }
      } else {
        const closeIndex = remaining.indexOf(THINK_CLOSE);
        if (closeIndex === -1) {
          appendThoughtText(messageId, remaining);
          remaining = '';
        } else {
          if (closeIndex > 0) {
            appendThoughtText(messageId, remaining.slice(0, closeIndex));
          }
          remaining = remaining.slice(closeIndex + THINK_CLOSE.length);
          parserRef.current.mode = 'normal';
          markThoughtDone();
        }
      }
    }
  };

  const getHoldbackLength = (text) => {
    const max = Math.min(text.length, THINK_TAG_MAX - 1);
    for (let i = max; i > 0; i -= 1) {
      const suffix = text.slice(-i);
      if (THINK_OPEN.startsWith(suffix) || THINK_CLOSE.startsWith(suffix)) {
        return i;
      }
    }
    return 0;
  };

  const processChunk = (messageId, chunk) => {
    parserRef.current.pending += chunk;
    const holdback = getHoldbackLength(parserRef.current.pending);
    const processLength = parserRef.current.pending.length - holdback;
    if (processLength <= 0) return;
    const toProcess = parserRef.current.pending.slice(0, processLength);
    parserRef.current.pending = parserRef.current.pending.slice(processLength);
    processText(messageId, toProcess);
  };

  const flushParser = (messageId) => {
    if (parserRef.current.pending) {
      processText(messageId, parserRef.current.pending);
      parserRef.current.pending = '';
    }
    if (parserRef.current.mode === 'think') {
      markThoughtDone();
      parserRef.current.mode = 'normal';
    }
  };

  const resetStreamState = () => {
    assistantTextRef.current = '';
    imageBaseTextRef.current = '';
    parserRef.current = { mode: 'normal', pending: '' };
    activeThoughtIdRef.current = null;
    streamStartedRef.current = false;
  };

  const buildImagePlaceholders = (source) => {
    let index = 0;
    let cursor = 0;
    let baseText = '';
    let historyText = '';
    const tasks = [];

    for (const match of source.matchAll(IMAGE_TAG_REGEX)) {
      const start = match.index ?? 0;
      const end = start + match[0].length;
      const tag = match[0];
      const promptMatch = tag.match(/prompt\s*=\s*["']([^"']+)["']/i);
      const sizeMatch = tag.match(/size\s*=\s*["']([^"']+)["']/i);
      const modelMatch = tag.match(/model\s*=\s*["']([^"']+)["']/i);
      const prompt = promptMatch?.[1]?.trim();
      if (!prompt) continue;
      const size = sizeMatch?.[1]?.trim() || imageSize;
      const modelOverride = modelMatch?.[1]?.trim() || imageModel;
      const token = `${IMAGE_TOKEN_PREFIX}${index}]]`;

      baseText += source.slice(cursor, start) + `\n\n${token}\n\n`;
      historyText +=
        source.slice(cursor, start) + `\n\n[Image: ${prompt}]\n\n`;
      tasks.push({ id: index, prompt, size, model: modelOverride });
      cursor = end;
      index += 1;
    }

    baseText += source.slice(cursor);
    historyText += source.slice(cursor);
    return { baseText, historyText, tasks };
  };

  const renderImagesInText = (baseText, tasks, results) => {
    let output = baseText;
    tasks.forEach((task) => {
      const token = `${IMAGE_TOKEN_PREFIX}${task.id}]]`;
      if (results[task.id]?.status === 'done') {
        output = output.replace(
          token,
          `![${task.prompt}](${results[task.id].url})`
        );
      } else if (results[task.id]?.status === 'error') {
        output = output.replace(
          token,
          `> Image failed: ${results[task.id].error}`
        );
      } else {
        output = output.replace(
          token,
          `> Generating image: ${task.prompt}`
        );
      }
    });
    return output;
  };

  const resolveImagesForMessage = async (messageId, text) => {
    const { baseText, historyText, tasks } = buildImagePlaceholders(text);
    if (!tasks.length) {
      updateMessage(messageId, { text, renderedText: text });
      return;
    }

    imageBaseTextRef.current = baseText;
    updateMessage(messageId, {
      text: historyText,
      renderedText: renderImagesInText(baseText, tasks, {}),
    });

    const results = {};
    for (const task of tasks) {
      try {
        const url = await generateOllamaImage({
          baseUrl,
          model: task.model,
          prompt: task.prompt,
          size: task.size,
        });
        results[task.id] = { status: 'done', url };
      } catch (error) {
        results[task.id] = {
          status: 'error',
          error: error?.message || 'Unable to generate image.',
        };
      }
      updateMessage(messageId, {
        renderedText: renderImagesInText(baseText, tasks, results),
      });
    }
  };

  const buildConversation = (prompt) => {
    const history = messages.map((message) => ({
      role: message.role || (message.ai ? 'assistant' : 'user'),
      content: message.text || '',
    }));

    const useSystemPrompt = model ? !model.includes('-max') : true;
    const conversation = [
      ...history,
      { role: 'user', content: prompt },
    ];

    if (!useSystemPrompt) {
      return conversation;
    }

    return [
      {
        role: 'system',
        content:
          'You are a helpful assistant. Respond in Markdown. If you are unsure, say so. To request an image, use the tag: <image prompt="...">. You may include optional size="1024x1024" and model="x/z-image-turbo:fp8".',
      },
      ...conversation,
    ];
  };

  const resolveThinkValue = () => {
    const isGptOss = model.toLowerCase().includes('gpt-oss');
    if (isGptOss) {
      if (['low', 'medium', 'high'].includes(thinkingMode)) {
        return thinkingMode;
      }
      if (thinkingMode === 'off') {
        return 'low';
      }
      if (thinkingMode === 'on') {
        return 'medium';
      }
      return 'medium';
    }
    if (thinkingMode === 'off') return false;
    if (thinkingMode === 'on') return true;
    return true;
  };

  /**
   * Sends our prompt to Ollama and streams the response.
   *
   * @param {Event} e - The submit event of the form.
   */
  const sendMessage = async (e) => {
    e.preventDefault();

    const cleaned = replaceProfanities(formValue.trim());
    if (!cleaned) return;

    addChatMessage(cleaned, false);
    const assistantMessageId = addChatMessage('', true);

    setFormValue('');
    setIsStreaming(true);
    setStreamStarted(false);
    resetStreamState();

    let usedThinkFallback = false;
    const runStream = async (thinkValue) => {
      await streamOllamaChat({
        baseUrl,
        model,
        messages: buildConversation(cleaned),
        think: thinkValue,
        onToken: (token) => {
          if (!token) return;
          if (!streamStartedRef.current) {
            streamStartedRef.current = true;
            setStreamStarted(true);
          }
          processChunk(assistantMessageId, token);
        },
        onThinking: (token) => {
          if (!token) return;
          if (!streamStartedRef.current) {
            streamStartedRef.current = true;
            setStreamStarted(true);
          }
          appendThoughtText(assistantMessageId, token);
        },
        onDone: () => {
          markThoughtDone();
        },
      });
    };

    try {
      if (!model) {
        throw new Error('No model selected. Set one in Ollama Settings.');
      }
      if (isImageLikeModel) {
        throw new Error(
          'Selected model looks like an image model. Choose a chat model for responses.'
        );
      }
      const thinkValue = resolveThinkValue();
      try {
        await runStream(thinkValue);
      } catch (error) {
        const message = error?.message?.toLowerCase() || '';
        if (message.includes('think') || message.includes('unsupported')) {
          usedThinkFallback = true;
          await runStream(false);
        } else {
          throw error;
        }
      }
      flushParser(assistantMessageId);
      if (usedThinkFallback) {
        assistantTextRef.current = `**Note:** This model does not support thinking output.\n\n${assistantTextRef.current}`;
      }
      if (imageEnabled) {
        await resolveImagesForMessage(
          assistantMessageId,
          assistantTextRef.current
        );
      } else {
        const { historyText } = buildImagePlaceholders(
          assistantTextRef.current
        );
        updateMessage(assistantMessageId, {
          text: historyText,
          renderedText: historyText,
        });
      }
    } catch (err) {
      const message =
        err?.message ||
        'Unable to reach Ollama. Make sure it is running on your machine.';
      updateMessage(assistantMessageId, {
        text: `**Error**: ${message}`,
        renderedText: `**Error**: ${message}`,
      });
      markThoughtDone();
    } finally {
      setIsStreaming(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e);
    }
  };

  /**
   * Scrolls the chat area to the bottom when the messages array is updated.
   */
  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming]);

  /**
   * Focuses the TextArea input to when the component is first rendered.
   */
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    let active = true;
    const loadModels = async () => {
      setModelsLoading(true);
      setModelsError('');
      try {
        await refreshModels(baseUrl, model);
      } catch (error) {
        if (active) {
          setModelsError('Unable to load models from Ollama.');
        }
      } finally {
        if (active) setModelsLoading(false);
      }
    };

    loadModels();
    return () => {
      active = false;
    };
  }, [baseUrl, model, refreshModels]);

  useEffect(() => {
    if (!messages.length) {
      setThoughts([]);
    }
  }, [messages.length]);

  useEffect(() => {
    if (!thoughts.length) {
      setShowThoughts(true);
    }
  }, [thoughts.length]);

  useEffect(() => {
    setThoughts([]);
    setShowThoughts(true);
    activeThoughtIdRef.current = null;
  }, [currentChatId]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [currentChatId]);

  const hasThoughtContent = thoughts.some((thought) =>
    Boolean(thought.content && thought.content.trim())
  );
  const shouldShowThoughts = showThoughts && hasThoughtContent;

  return (
    <main className='relative flex h-screen w-full flex-1 min-w-0 overflow-hidden p-1 dark:bg-light-grey'>
      <div className='flex w-full min-h-0 px-3 md:px-6'>
        <div
          className={`grid h-full w-full min-h-0 gap-4 ${
            shouldShowThoughts
              ? 'md:grid-cols-[minmax(0,1fr)_20rem]'
              : 'grid-cols-1'
          }`}>
          <div className='flex min-h-0 flex-col min-w-0'>
            <div className='flex min-h-0 w-full flex-1 flex-col'>
              <div className='flex flex-col items-center justify-center gap-2 my-4'>
                <div className='flex items-center gap-2 flex-wrap justify-center'>
                  <span className='badge badge-outline'>Ollama</span>
                  <select
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className='select select-bordered select-sm min-w-[12rem]'
                    disabled={modelsLoading || !availableModels.length}>
                    {availableModels.length ? (
                      availableModels.map((modelName) => (
                        <option key={modelName} value={modelName}>
                          {modelName}
                        </option>
                      ))
                    ) : (
                      <option value=''>
                        {modelsLoading ? 'Loading models...' : 'No models found'}
                      </option>
                    )}
                  </select>
                  <span className='badge badge-ghost'>
                    History: {messages.length}
                  </span>
                </div>
                <div className='flex items-center gap-2 text-xs text-slate-500'>
                  <span className='hidden md:inline'>{baseUrl}</span>
                  {modelsError && (
                    <span className='text-red-500'>{modelsError}</span>
                  )}
                </div>
                {isImageLikeModel && (
                  <div className='text-xs text-amber-600 text-center'>
                    This looks like an image model. Pick a chat model for
                    responses.
                  </div>
                )}
              </div>

              <section
                className={`flex w-full min-h-0 flex-1 flex-col overflow-y-auto ${
                  messages.length ? '' : 'justify-center'
                }`}>
                {messages.length ? (
                  messages.map((message, index) => (
                    <Message key={index} message={{ ...message }} />
                  ))
                ) : (
                  <div className='flex w-full justify-center py-4'>
                    <div className='w-full max-w-3xl overflow-hidden'>
                      <ul className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        {template.map((item, index) => (
                          <li
                            onClick={() => {
                              setFormValue(item.prompt);
                              inputRef.current?.focus();
                            }}
                            key={index}
                            className='p-6 border rounded-lg border-slate-300 hover:border-slate-500'>
                            <p className='text-base font-semibold'>
                              {item.title}
                            </p>
                            <p className='text-sm'>{item.prompt}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {isStreaming && !streamStarted && <Thinking />}

                <span ref={messagesEndRef}></span>
              </section>
              <form
                className='flex w-full flex-col join sm:flex-row'
                onSubmit={sendMessage}>
                <div className='flex items-stretch justify-between w-full'>
                  <textarea
                    ref={inputRef}
                    className='w-full grow input input-bordered join-item max-h-[20rem] min-h-[3rem]'
                    value={formValue}
                    onKeyDown={handleKeyDown}
                    onChange={(e) => setFormValue(e.target.value)}
                    placeholder='Send a message... (Shift+Enter for a new line)'
                    disabled={isStreaming}
                  />
                  <button
                    type='submit'
                    className='join-item btn'
                    disabled={!formValue || isStreaming || isImageLikeModel}>
                    <MdSend size={30} />
                  </button>
                </div>
              </form>
            </div>
          </div>
          {shouldShowThoughts ? (
            <ThoughtSidebar
              thoughts={thoughts}
              onClose={() => setShowThoughts(false)}
            />
          ) : null}
        </div>
      </div>
    </main>
  );
};

export default ChatView;
