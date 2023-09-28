import { ConversationChain } from 'langchain/chains';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { ChatPromptTemplate, MessagesPlaceholder } from 'langchain/prompts';
import { BufferMemory } from 'langchain/memory';

const memory = new BufferMemory({
  returnMessages: true,
  memoryKey: 'history',
  inputKey: 'input',
});

export const davinci = async (prompt, key) => {
  const chatPrompt = ChatPromptTemplate.fromMessages([
    [
      'system',
      'The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context and always responds in markdown format. If the AI does not know the answer to a question, it truthfully says it does not know.',
    ],
    new MessagesPlaceholder('history'),
    ['human', '{input}'],
  ]);
  const model = new ChatOpenAI({
    openAIApiKey: key,
    model: 'gpt-3.5-turbo',
    temperature: 0.3,
  });
  console.log(await memory.loadMemoryVariables({}));

  const chain = new ConversationChain({
    memory: memory,
    prompt: chatPrompt,
    llm: model,
  });

  const response = await chain.call({ input: prompt });
  console.log(response);

  return response.response;
};
