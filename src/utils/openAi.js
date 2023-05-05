import { Configuration, OpenAIApi } from 'openai';

const openaiApiKey = window.localStorage.getItem('api-key');
console.log(openaiApiKey);

const configuration = new Configuration({
  apiKey: openaiApiKey,
});

export const openai = new OpenAIApi(configuration);
