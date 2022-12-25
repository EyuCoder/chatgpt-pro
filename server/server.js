import express from 'express';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
try {
  dotenv.config();
} catch (error) {
  console.error('Error loading environment variables:', error);
  process.exit(1);
}

// Create OpenAI configuration
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

// Create OpenAI API client
const openai = new OpenAIApi(configuration);

// Create Express app
const app = express();

// Parse JSON in request body
app.use(express.json());

// Enable CORS
app.use(cors());

/**
 * GET /
 * Returns a simple message.
 */
app.get('/', (req, res) => {
  res.status(200).send({
    message: 'Hello World!',
  });
});

/**
 * POST /
 * Returns a response from OpenAI's text completion model.
 */
app.post('/', async (req, res) => {
  // Validate request body
  if (!req.body.prompt) {
    return res.status(400).send({
      error: 'Missing required field "prompt" in request body',
    });
  }

  try {
    // Call OpenAI API
    const prompt = req.body.prompt;
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `I want you to reply to my questions in a markdown format.
      ${prompt}.`,
      temperature: 0.5,
      max_tokens: 3000,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    });

    // Return response from OpenAI API
    res.status(200).send({
      bot: response.data.choices[0].text,
    });
  } catch (error) {
    // Log error and return a generic error message
    console.error(error);
    res.status(500).send({
      error: 'Something went wrong',
    });
  }
});

// Start server
const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server listening on port ${port}`));
