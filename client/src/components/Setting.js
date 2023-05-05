import React, { useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { checkApiKey } from '../utils/checkKeys';

const Setting = ({ modalOpen, setModalOpen }) => {
  const [apiKey, setApikey] = useLocalStorage('api-key');
  const [loading, setLoading] = useLocalStorage(false);
  const [errorMsg, setErrorMsg] = useLocalStorage('');
  const [input, setInput] = useLocalStorage('');

  const saveKey = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    const keys = input;

    await checkApiKey(keys)
      .then(() => {
        console.log('works');
        setModalOpen(false);
      })
      .catch(() => {
        console.log('doesnt work');
        setErrorMsg('error: incorrect keys');
      });

    setApikey(keys);
    setLoading(false);
  };

  useEffect(() => {
    if (modalOpen) {
      setInput(apiKey);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalOpen]);

  return (
    <form
      onSubmit={saveKey}
      className='flex flex-col items-center justify-center gap-2'>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        type='password'
        className='w-full max-w-xs input input-bordered'
      />
      <button disabled={loading} className='w-full max-w-xs btn btn-outline'>
        {loading ? <span className='loading' /> : 'save to localStorage'}
      </button>
      <p>{errorMsg}</p>
    </form>
  );
};

export default Setting;
