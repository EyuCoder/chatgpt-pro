import OpenAI from "openai";

export const completions = async (prompt, messages, gptVersion) => {
  const openai = new OpenAI({
    apiKey: "",
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

  // console.log("Fetching completion with conversation = ", conversation);
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

// this function removes the last message from messages array, and resends the messages to the engine, the response is then returned
export const regenerate = async (messages, gptVersion) => {
  const openai = new OpenAI({
    apiKey: "",
    baseURL: "https://api.sciphi.ai/v1",
    dangerouslyAllowBrowser: true,
  });
  // console.log("messages = ", messages);

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

  // console.log("Fetching completion with conversation = ", conversation);

  const response = await openai.completions.create({
    prompt: conversation,
    model: gptVersion,
    temperature: 0.1,
    max_tokens: 16_348,
    // stream: true,
  });

  let response_str = response.choices[0].text;
  response_str = response_str.trim();
  console.log("response_str = ", response_str);

  return response_str;
}

// this function generates a title based on the messages array, and returns the title
export const generateTitle = async (messages, gptVersion) => {
  const openai = new OpenAI({
    apiKey: "",
    baseURL: "https://api.sciphi.ai/v1",
    dangerouslyAllowBrowser: true,
  });
  // console.log("messages = ", messages);

  let conversation =
    "### System:\n\You are a title writing assistant.\n";


  for (const message of messages) {
    // console.log(message);
    if (message.ai) {
      conversation += `### Response:\n\n${message.text}\n`;
    } else {
      conversation += `### Instruction:\n\n${message.text}\n`;
    }
  }
  conversation += "### Instruction:\n\n Summarize the text conversation above with a 3 word title.\n### Response:\n\n";

  // console.log("Fetching completion with conversation = ", conversation);

  const response = await openai.completions.create({
    prompt: conversation,
    model: gptVersion,
    temperature: 0.1,
    max_tokens: 16_348,
    // stream: true,
  });

  let response_str = response.choices[0].text;
  response_str = response_str.trim();
  console.log("response_str = ", response_str);

  return response_str;
}