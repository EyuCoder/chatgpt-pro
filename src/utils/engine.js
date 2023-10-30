// import OpenAI from "openai";

export const completions = async(prompt, messages, gptVersion = "SciPhi/SciPhi-Self-RAG-Mistral-7B-32k" ) => {
const response = await fetch('https://chat.sciphi.ai/api/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    prompt: prompt,
    messages: messages.map(message => ({
      id: message.id,
      createdAt: message.createdAt,
      text: message.text,
      ai: message.ai,
    })),
    gptVersion: gptVersion
  }),
});

const responseJson = await response.json();
return responseJson?.response.trim();
}

// this function removes the last message from messages array, and resends the messages to the engine, the response is then returned
// export const regenerate = async (messages, gptVersion) => {
//   const openai = new OpenAI({
//     apiKey: "",
//     baseURL: "https://api.sciphi.ai/v1",
//     dangerouslyAllowBrowser: true,
//   });
//   // console.log("messages = ", messages);

//   let conversation =
//     "### System:\n\nYou are a helpful assistant which thinks step by step to answer user questions.\n";


//   for (const message of messages) {
//     // console.log(message);
//     if (message.ai) {
//       conversation += `### Response:\n\n${message.text}\n`;
//     } else {
//       conversation += `### Instruction:\n\n${message.text}\n`;
//     }
//   }

//   // console.log("Fetching completion with conversation = ", conversation);

//   const response = await openai.completions.create({
//     prompt: conversation,
//     model: gptVersion,
//     temperature: 0.1,
//     max_tokens: 16_348,
//     // stream: true,
//   });

//   let response_str = response.choices[0].text;
//   response_str = response_str.trim();
//   console.log("response_str = ", response_str);

//   return response_str;
// }

// this function generates a title based on the messages array, and returns the title
export const generateTitle = async (messages, gptVersion = "SciPhi/SciPhi-Self-RAG-Mistral-7B-32k") => {

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