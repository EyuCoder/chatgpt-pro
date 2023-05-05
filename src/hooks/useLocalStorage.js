import { useState } from 'react';

/**
 * A custom hook for managing state that is persisted in the local storage.
 *
 * @param {string} key - The key in the local storage where the state should be stored.
 * @param {any} initialValue - The initial value of the state.
 *
 * @returns {Array} An array containing the current value of the state
 * and a function to update it.
 */
const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;

      setStoredValue(valueToStore);

      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };

  const removeValue = (value) => {
    window.localStorage.removeItem(value);
  };
  return [storedValue, setValue, removeValue];
};

export default useLocalStorage;
