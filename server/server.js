import express from 'express'
import cors from 'cors'
import { Configuration, OpenAIApi } from 'openai'
import * as dotenv from 'dotenv'
import Filter from 'bad-words'
import { rateLimitMiddleware } from './middlewares/rateLimitMiddleware.js'

const allowedOrigins = ['http://eyucoder.com', 'https://chatgpt.eyucoder.com', 'http://localhost']

const filter = new Filter()

// Load environment variables from .env file
try {
  dotenv.config()
} catch (error) {
  console.error('Error loading environment variables:', error)
  process.exit(1)
}

// Create OpenAI configuration
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})

// Create OpenAI API client
const openai = new OpenAIApi(configuration)

// Create Express app
const app = express()


// Parse JSON in request body
app.use(express.json())

// Enable CORS
app.use(cors())

// ratelimiter middleware function
app.use('/davinci', rateLimitMiddleware)
app.use('/dalle', rateLimitMiddleware)

/**
 * GET /
 * Returns a simple message.
 */
app.get('/', (req, res) => {
  res.status(200).send({
    message: 'Hello World!',
  })
})

/**
 * POST /davinci
 * Returns a response from OpenAI's text completion model.
 */
app.post('/davinci', async (req, res) => {
  // Validate request body
  if (!req.body.prompt) {
    return res.status(400).send({
      error: 'Missing required field "prompt" in request body',
    })
  }

  try {
    // Call OpenAI API
    const { prompt, user } = req.body
    const cleanPrompt = filter.isProfane(prompt) ? filter.clean(prompt) : prompt
    console.log(cleanPrompt)

    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `
I want you to reply to all my questions in markdown format. 
Q: ${cleanPrompt}?.
A: `,
      user: user,
      temperature: 0.5,
      max_tokens: 500,
      top_p: 0.5,
      frequency_penalty: 0.5,
      presence_penalty: 0.2,
    })

    console.log(response.data.choices[0].text)
    console.log(user)
    // Return response from OpenAI API
    res.status(200).send({
      bot: response.data.choices[0].text,
      limit: res.body.limit
    })
  } catch (error) {
    // Log error and return a generic error message
    console.error(error)
    res.status(500).send({
      error: 'Something went wrong',
    })
  }
})

/**
 * POST /dalle
 * Returns a response from OpenAI's image generation model.
 */
app.post('/dalle', async (req, res) => {
  const { prompt, user } = req.body

  try {
    const response = await openai.createImage({
      prompt: `${prompt}`,
      user: user,
      n: 1,
      size: "256x256",
    })

    console.log(response.data.data[0].url)
    res.status(200).send({
      bot: response.data.data[0].url,
      limit: res.body.limit
    })
  } catch (error) {
    // Log error and return a generic error message
    console.error(error)
    res.status(500).send({
      error: 'Something went wrong',
    })
  }
})

// Start server
const port = process.env.PORT || 3001
app.listen(port, () => console.log(`Server listening on port ${port}`))
