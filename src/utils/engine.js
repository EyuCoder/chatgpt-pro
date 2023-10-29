import OpenAI from "openai";
import { ConversationChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";
import {
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
  MessagesPlaceholder,
} from "langchain/prompts";
import { BufferMemory } from "langchain/memory";

const memory = new BufferMemory({
  returnMessages: true,
  memoryKey: "history",
});

console.log("process.env.SCIPHI_API_KEY = ", process.env.SCIPHI_API_KEY);

export const completions = async (prompt, messages, gptVersion) => {
  const openai = new OpenAI({
    apiKey: process.env.SCIPHI_API_KEY,
    baseURL: "https://api.sciphi.ai/v1",
    dangerouslyAllowBrowser: true,
  });

  let conversation =
    "### System:\n\nYou are a helpful assistant which thinks step by step to answer user questions.\n";

  for (const message of messages) {
    // console.log(message);
    if (message.ai) {
      conversation += `### Response:\n\n${message.text}\n`;
    } else {
      conversation += `### Instruction:\n\n${message.text}\n`;
    }
  }
  conversation += "### Instruction:\n\n" + prompt + "\n### Response:\n\n";

  const response = await openai.completions.create({
    prompt: conversation,
    model: gptVersion,
    temperature: 0.1,
    max_tokens: 16_348,
  });

  let response_str = response.choices[0].text;
  response_str = response_str.trim();

  return response_str;
};
