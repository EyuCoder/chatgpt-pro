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

export const completions = async (prompt, messages, gptVersion) => {
  const openai = new OpenAI({
    apiKey: "",
    baseURL: "https://api.sciphi.ai/v1",
    dangerouslyAllowBrowser: true,
  });
  // console.log("messages = ", messages);
  // let prompt = ""
  // for message in messages:
  //   if message.ai {

  //   }
  let conversation =
    "### System:\n\nYou are a helpful assistant which thinks step by step to answer user questions.\n";

  for (const message of messages) {
    // console.log(message);
    if (message.ai) {
      conversation += `### Response:\n\n${message.ai}\n`;
    } else {
      conversation += `### Instruction:\n\n${message.human}\n`;
    }
  }
  conversation += "### Instruction:\n\n" + prompt + "\n### Response:\n\n";

  console.log("Fetching completion with conversation = ", conversation);
  const response = await openai.completions.create({
    prompt: conversation,
    model: gptVersion,
    temperature: 0.1,
    max_tokens: 16_348,
    // stream: true,
  });
  // for await (const completion of response) {
  //   // handle each completion here, for example, display it to the user
  //   console.log(completion);
  // }

  // console.log("response = ", response);
  let response_str = response.choices[0].text;
  response_str = response_str.trim();
  console.log("response_str = ", response_str);

  // console.log("response_str/ =", response_str);
  return response_str;
};
