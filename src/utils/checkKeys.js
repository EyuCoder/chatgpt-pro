import { Configuration, OpenAIApi } from 'openai';
export const checkApiKey = async (keys) => {
  const configuration = new Configuration({
    apiKey: keys,
  });

  const openai = new OpenAIApi(configuration);

  return openai.listModels();
};
