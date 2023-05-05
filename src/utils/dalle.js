import { openai } from './openAi';

export const dalle = async (prompt) => {
  const response = await openai.createImage({
    prompt: `${prompt}`,
    n: 1,
    size: '512x512',
  });

  return response;
};
