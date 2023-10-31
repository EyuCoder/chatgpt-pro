import axios from 'axios';

import { AppData } from "./constants";

export const completions = async (prompt, messages, gptVersion = AppData.model) => {

  // print the fetch request as CURL:
  // console.log(`curl -X POST -H "Content-Type: application/json" -d '{"prompt": "${prompt}", "messages": ${JSON.stringify(messages)}, "gptVersion": "${gptVersion}"}' ${AppData.baseURL}`);

  try {
    let stringed = JSON.stringify({
      prompt: prompt,
      messages: messages?.map(message => ({
        id: message.id,
        createdAt: message.createdAt,
        text: message.text,
        ai: message.ai,
      })) || [],
      gptVersion: gptVersion
    })

    console.log("stringed = ", stringed);

    const response = await axios.post("https://chat.sciphi.ai/api/completions", stringed);
    console.log("response = ", response);

    // const response = await fetch(AppData.baseURL, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json; charset=utf-8',
    //   },
    //   body: stringed,
    // });
    // console.log("response = ", response);


    // const responseJson = await response.json();
    // return responseJson?.response.trim();
  }
  catch (error) {
    console.error(error);
  }
}

// this function generates a title based on the messages array, and returns the title
export const generateTitle = async (messages, gptVersion = AppData.model) => {

  let messageSet = "You are a title writing assistant. Summarize the text conversation below with a 3 word title.\n";

  console.log("messages = ", messages);
  console.log("messageSet = ", messageSet);

  for (const message of messages) {
    // console.log(message);
    if (message.ai) {
      messageSet += `AI: ${message.text}\n`;
    } else {
      messageSet += `User: ${message.text}\n`;
    }
  }

  // console.log("Fetching completion with conversation = ", conversation);

  const response = await completions(messageSet, [], gptVersion);

  console.log("response_str = ", response);

  return response;
}