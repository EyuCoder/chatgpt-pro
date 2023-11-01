import OpenAI from "openai";

export default async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const { messages, gptVersion } = req.body;

  if (!process.env.SCIPHI_API_KEY) {
    return res.status(500).send("The SCIPHI_API_KEY is missing!");
  }

  const openai = new OpenAI({
    apiKey: process.env.SCIPHI_API_KEY,
    baseURL: process.env.SCIPHI_API_URL,
  });

  let conversation =
    "### System:\nYou are a title writing assistant. Summarize the text conversation below with a 3 word title.\n";

  for (const message of messages) {
    if (message.ai) {
      conversation += `### Response:\n\n${message.text}\n`;
    } else {
      conversation += `### Instruction:\n\n${message.text}\n`;
    }
  }
  conversation +=
    "### Instruction:\n\n" +
    "Reminder, summarize the text conversation above with a 3 word title." +
    "\n### Response:\n\n";

  const response = await openai.completions.create({
    prompt: conversation,
    model: gptVersion,
    temperature: 0.1,
    max_tokens: 16_348,
  });

  let response_str = response.choices[0].text;
  response_str = response_str.trim();

  res.status(200).json({ response: response_str });
};
