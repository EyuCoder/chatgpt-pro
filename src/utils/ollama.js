const normalizeBaseUrl = (baseUrl) => baseUrl.replace(/\/+$/, '');

export const fetchOllamaTags = async (baseUrl) => {
  const safeBaseUrl = normalizeBaseUrl(baseUrl);
  const response = await fetch(`${safeBaseUrl}/api/tags`);
  if (!response.ok) {
    throw new Error('Failed to fetch Ollama models.');
  }
  const data = await response.json();
  if (!data?.models) {
    return [];
  }
  return data.models.map((model) => model.name).filter(Boolean);
};

export const streamOllamaChat = async ({
  baseUrl,
  model,
  messages,
  onToken,
  onThinking,
  onDone,
  think,
}) => {
  const safeBaseUrl = normalizeBaseUrl(baseUrl);
  const response = await fetch(`${safeBaseUrl}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages,
      stream: true,
      think,
    }),
  });

  if (!response.ok || !response.body) {
    let errorMessage = 'Ollama server did not respond.';
    try {
      const errorBody = await response.json();
      if (errorBody?.error) {
        errorMessage = errorBody.error;
      }
    } catch (error) {
      // Ignore JSON parse errors
    }
    throw new Error(errorMessage);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  let done = false;
  while (!done) {
    const result = await reader.read();
    done = result.done;
    if (done) break;
    const { value } = result;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (!line.trim()) continue;
      let payload;
      try {
        payload = JSON.parse(line);
      } catch (error) {
        continue;
      }

      if (payload?.message?.content) {
        onToken(payload.message.content);
      }
      if (payload?.message?.thinking && onThinking) {
        onThinking(payload.message.thinking);
      }

      if (payload?.done) {
        if (onDone) onDone();
        return;
      }
    }
  }

  if (buffer.trim()) {
    try {
      const payload = JSON.parse(buffer);
      if (payload?.message?.content) {
        onToken(payload.message.content);
      }
      if (payload?.message?.thinking && onThinking) {
        onThinking(payload.message.thinking);
      }
    } catch (error) {
      // Ignore trailing buffer parse errors.
    }
  }
};

export const generateOllamaImage = async ({
  baseUrl,
  model,
  prompt,
  size = '1024x1024',
}) => {
  const safeBaseUrl = normalizeBaseUrl(baseUrl);
  const response = await fetch(`${safeBaseUrl}/v1/images/generations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      prompt,
      size,
      response_format: 'b64_json',
    }),
  });

  if (!response.ok) {
    let errorMessage = 'Ollama image generation failed.';
    try {
      const errorBody = await response.json();
      if (errorBody?.error?.message) {
        errorMessage = errorBody.error.message;
      } else if (errorBody?.error) {
        errorMessage = errorBody.error;
      }
    } catch (error) {
      // Ignore JSON parse errors
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();
  const base64 = data?.data?.[0]?.b64_json;
  if (!base64) {
    throw new Error('No image returned by Ollama.');
  }
  return `data:image/png;base64,${base64}`;
};
