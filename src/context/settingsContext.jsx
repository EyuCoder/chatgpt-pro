import PropTypes from 'prop-types';
import { createContext, useCallback, useState } from 'react';
import { fetchOllamaTags } from '../utils/ollama';

const DEFAULT_BASE_URL = 'http://localhost:11434';
const DEFAULT_MODEL = 'llama3.1';
const DEFAULT_IMAGE_MODEL = 'x/z-image-turbo:fp8';
const DEFAULT_IMAGE_SIZE = '1024x1024';
const DEFAULT_THINKING_MODE = 'auto';
const DEFAULT_IMAGE_ENABLED = true;

const SettingsContext = createContext({
  baseUrl: DEFAULT_BASE_URL,
  model: DEFAULT_MODEL,
  imageModel: DEFAULT_IMAGE_MODEL,
  imageSize: DEFAULT_IMAGE_SIZE,
  thinkingMode: DEFAULT_THINKING_MODE,
  imageEnabled: DEFAULT_IMAGE_ENABLED,
  availableModels: [],
});

const SettingsContextProvider = ({ children }) => {
  const [baseUrl, setBaseUrlState] = useState(() => {
    return window.localStorage.getItem('ollama-base-url') || DEFAULT_BASE_URL;
  });
  const [model, setModelState] = useState(() => {
    return window.localStorage.getItem('ollama-model') || DEFAULT_MODEL;
  });
  const [imageModel, setImageModelState] = useState(() => {
    return (
      window.localStorage.getItem('ollama-image-model') ||
      DEFAULT_IMAGE_MODEL
    );
  });
  const [imageSize, setImageSizeState] = useState(() => {
    return (
      window.localStorage.getItem('ollama-image-size') || DEFAULT_IMAGE_SIZE
    );
  });
  const [thinkingMode, setThinkingModeState] = useState(() => {
    return (
      window.localStorage.getItem('ollama-thinking-mode') ||
      DEFAULT_THINKING_MODE
    );
  });
  const [imageEnabled, setImageEnabledState] = useState(() => {
    const stored = window.localStorage.getItem('ollama-image-enabled');
    if (stored === null) return DEFAULT_IMAGE_ENABLED;
    return stored === 'true';
  });
  const [availableModels, setAvailableModels] = useState([]);

  const setBaseUrl = (nextBaseUrl) => {
    setBaseUrlState(nextBaseUrl);
    window.localStorage.setItem('ollama-base-url', nextBaseUrl);
  };

  const setModel = (nextModel) => {
    setModelState(nextModel);
    window.localStorage.setItem('ollama-model', nextModel);
  };

  const setImageModel = (nextModel) => {
    setImageModelState(nextModel);
    window.localStorage.setItem('ollama-image-model', nextModel);
  };

  const setImageSize = (nextSize) => {
    setImageSizeState(nextSize);
    window.localStorage.setItem('ollama-image-size', nextSize);
  };

  const setThinkingMode = (nextMode) => {
    setThinkingModeState(nextMode);
    window.localStorage.setItem('ollama-thinking-mode', nextMode);
  };

  const setImageEnabled = (nextEnabled) => {
    setImageEnabledState(nextEnabled);
    window.localStorage.setItem('ollama-image-enabled', String(nextEnabled));
  };

  const refreshModels = useCallback(
    async (targetUrl = baseUrl, currentModel = model) => {
      const models = await fetchOllamaTags(targetUrl);
      setAvailableModels(models);
      if (models.length && !models.includes(currentModel)) {
        setModel(models[0]);
      }
      if (models.length && !models.includes(imageModel)) {
        setImageModel(models[0]);
      }
      return models;
    },
    [baseUrl, model, imageModel]
  );

  return (
    <SettingsContext.Provider
      value={{
        baseUrl,
        setBaseUrl,
        model,
        setModel,
        imageModel,
        setImageModel,
        imageSize,
        setImageSize,
        thinkingMode,
        setThinkingMode,
        imageEnabled,
        setImageEnabled,
        availableModels,
        refreshModels,
        defaults: {
          baseUrl: DEFAULT_BASE_URL,
          model: DEFAULT_MODEL,
          imageModel: DEFAULT_IMAGE_MODEL,
          imageSize: DEFAULT_IMAGE_SIZE,
          thinkingMode: DEFAULT_THINKING_MODE,
          imageEnabled: DEFAULT_IMAGE_ENABLED,
        },
      }}>
      {children}
    </SettingsContext.Provider>
  );
};

SettingsContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { SettingsContext, SettingsContextProvider };
