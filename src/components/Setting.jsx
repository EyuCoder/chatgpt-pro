import { useEffect, useState, useContext, useCallback } from 'react';
import PropTypes from 'prop-types';
import { SettingsContext } from '../context/settingsContext';

const Setting = ({ modalOpen, setModalOpen }) => {
  const {
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
    defaults,
    availableModels,
    refreshModels,
  } = useContext(SettingsContext);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [localBaseUrl, setLocalBaseUrl] = useState(baseUrl);
  const [localModel, setLocalModel] = useState(model);
  const [localImageModel, setLocalImageModel] = useState(imageModel);
  const [localImageSize, setLocalImageSize] = useState(imageSize);
  const [localThinkingMode, setLocalThinkingMode] = useState(thinkingMode);
  const [localImageEnabled, setLocalImageEnabled] = useState(imageEnabled);

  const loadModels = useCallback(async (
    targetUrl = localBaseUrl,
    currentModel = localModel
  ) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const models = await refreshModels(targetUrl, currentModel);
      if (models.length && !models.includes(currentModel)) {
        setLocalModel(models[0]);
      }
      if (models.length && !models.includes(localImageModel)) {
        setLocalImageModel(models[0]);
      }
    } catch (error) {
      setErrorMsg(
        'Unable to connect to Ollama. Make sure it is running locally.'
      );
    } finally {
      setLoading(false);
    }
  }, [localBaseUrl, localModel, localImageModel, refreshModels]);

  const saveSettings = (e) => {
    e.preventDefault();
    setBaseUrl(localBaseUrl.trim());
    setModel(localModel.trim());
    setImageModel(localImageModel.trim());
    setImageSize(localImageSize.trim());
    setThinkingMode(localThinkingMode);
    setImageEnabled(localImageEnabled);
    setModalOpen(false);
  };

  const resetDefaults = () => {
    setLocalBaseUrl(defaults.baseUrl);
    setLocalModel(defaults.model);
    setLocalImageModel(defaults.imageModel);
    setLocalImageSize(defaults.imageSize);
    setLocalThinkingMode(defaults.thinkingMode);
    setLocalImageEnabled(defaults.imageEnabled);
  };

  useEffect(() => {
    if (modalOpen) {
      setLocalBaseUrl(baseUrl);
      setLocalModel(model);
      setLocalImageModel(imageModel);
      setLocalImageSize(imageSize);
      setLocalThinkingMode(thinkingMode);
      setLocalImageEnabled(imageEnabled);
      loadModels(baseUrl, model);
    }
  }, [
    modalOpen,
    baseUrl,
    model,
    imageModel,
    imageSize,
    thinkingMode,
    imageEnabled,
    loadModels,
  ]);

  return (
    <form
      onSubmit={saveSettings}
      className='flex flex-col items-center justify-center gap-3'>
      <p className='text-lg font-semibold'>Ollama Settings</p>
      <p className='text-sm text-slate-500'>
        This app connects to your local Ollama server only.
      </p>
      <label className='w-full'>
        <span className='text-xs font-semibold uppercase text-slate-500'>
          Ollama Base URL
        </span>
        <input
          value={localBaseUrl}
          onChange={(e) => setLocalBaseUrl(e.target.value)}
          type='text'
          className='w-full mt-1 input input-bordered'
          placeholder='http://localhost:11434'
        />
      </label>
      <label className='w-full'>
        <span className='text-xs font-semibold uppercase text-slate-500'>
          Default Model
        </span>
        <select
          value={localModel}
          onChange={(e) => setLocalModel(e.target.value)}
          className='w-full mt-1 select select-bordered'
          disabled={!availableModels.length}>
          {availableModels.length ? (
            availableModels.map((modelName) => (
              <option key={modelName} value={modelName}>
                {modelName}
              </option>
            ))
          ) : (
            <option value=''>No models found</option>
          )}
        </select>
      </label>
      <label className='w-full'>
        <span className='text-xs font-semibold uppercase text-slate-500'>
          Image Model (Experimental)
        </span>
        <select
          value={localImageModel}
          onChange={(e) => setLocalImageModel(e.target.value)}
          className='w-full mt-1 select select-bordered'
          disabled={!availableModels.length}>
          {availableModels.length ? (
            availableModels.map((modelName) => (
              <option key={modelName} value={modelName}>
                {modelName}
              </option>
            ))
          ) : (
            <option value=''>No models found</option>
          )}
        </select>
        <p className='text-xs text-slate-500 mt-1'>
          Ollama image generation is experimental and currently supports macOS
          only.
        </p>
      </label>
      <label className='w-full'>
        <span className='text-xs font-semibold uppercase text-slate-500'>
          Image Generation
        </span>
        <div className='flex items-center justify-between mt-2'>
          <span className='text-sm text-slate-400'>
            Enable image generation tags
          </span>
          <input
            type='checkbox'
            className='toggle toggle-sm'
            checked={localImageEnabled}
            onChange={(e) => setLocalImageEnabled(e.target.checked)}
          />
        </div>
      </label>
      <label className='w-full'>
        <span className='text-xs font-semibold uppercase text-slate-500'>
          Image Size
        </span>
        <select
          value={localImageSize}
          onChange={(e) => setLocalImageSize(e.target.value)}
          className='w-full mt-1 select select-bordered'>
          {['512x512', '768x768', '1024x1024'].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </label>
      <label className='w-full'>
        <span className='text-xs font-semibold uppercase text-slate-500'>
          GPT-OSS Thinking
        </span>
        <select
          value={localThinkingMode}
          onChange={(e) => setLocalThinkingMode(e.target.value)}
          className='w-full mt-1 select select-bordered'>
          {[
            { value: 'auto', label: 'Auto (recommended)' },
            { value: 'off', label: 'Off' },
            { value: 'on', label: 'On' },
            { value: 'low', label: 'Low' },
            { value: 'medium', label: 'Medium' },
            { value: 'high', label: 'High' },
          ].map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <p className='text-xs text-slate-500 mt-1'>
          GPT-OSS models support low/medium/high. Auto maps to medium.
        </p>
      </label>
      <div className='flex items-center gap-2 w-full'>
        <button
          type='button'
          onClick={() => loadModels(localBaseUrl, localModel)}
          className='btn btn-outline w-full'
          disabled={loading}>
          {loading ? 'Checking Ollama...' : 'Refresh Models'}
        </button>
        <button
          type='button'
          onClick={resetDefaults}
          className='btn btn-ghost w-full'>
          Reset
        </button>
      </div>
      <button disabled={loading} className='w-full btn btn-primary'>
        Save Settings
      </button>
      {errorMsg && <p className='text-sm text-red-500'>{errorMsg}</p>}
    </form>
  );
};

export default Setting;

Setting.propTypes = {
  modalOpen: PropTypes.bool.isRequired,
  setModalOpen: PropTypes.func.isRequired,
};
