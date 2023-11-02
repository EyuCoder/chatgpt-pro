import OpenAI from "openai";

export default async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const { prompt, messages, gptVersion } = req.body;

  if (!process.env.SCIPHI_API_KEY) {
    return res.status(500).send("The SCIPHI_API_KEY is missing!");
  }

  const openai = new OpenAI({
    apiKey: process.env.SCIPHI_API_KEY,
    baseURL: process.env.SCIPHI_API_URL,
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
    temperature: 0.2,
    max_tokens: 16_348,
  });
  res
    .status(200)
    .json({ response: response.completion, context: response.context });
};
