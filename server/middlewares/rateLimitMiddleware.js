import Redis from 'ioredis';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
try {
  dotenv.config();
} catch (error) {
  console.error('Error loading environment variables:', error);
  process.exit(1);
}

const client = new Redis({
  host: process.env.REDIS_URL,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASS
});

// Set the rate limit to 20 requests per day
const rateLimit = parseInt(process.env.RATE_LIMIT, 10);
const rateLimitPeriod = 24 * 60 * 60; // 24 hours


export const rateLimitMiddleware = (req, res, next) => {
  // Get the user's email address from the request
  const email = req.body.email;

  // Check the request count for the email address
  client.get(email, (err, count) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error checking rate limit');
    }

    // Calculate the rate usage left
    // const rateUsageLeft = rateLimit - parseInt(count, 10);
    const rateUsageLeft = rateLimit - (count ? parseInt(count, 10) : 0);

    // Set the rate usage left in the response body
    res.body = {};
    res.body.limit = rateUsageLeft - 1;

    console.log(rateUsageLeft)

    // If the request count is above the rate limit, return an error
    if (count && rateUsageLeft <= 0) {
      res.body.limit = 0
      return res.status(429).send(res.body);
    }

    // Increment the request count for the email address
    client.incr(email);
    // Set the key to expire after the rate limit period
    client.expire(email, rateLimitPeriod);

    // Call the next middleware function
    next();
  });
};
