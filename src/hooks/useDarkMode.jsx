import { useEffect } from 'react';
import useLocalStorage from './useLocalStorage';

/**
 * A custom hook for handling dark mode toggle in a React component.
 * It stores the dark mode toggle state in the local storage, so that the
 * toggle state persists across page reloads.
 *
 * @returns {Array} An array containing the current dark mode toggle state
 * and a function to update it.
 */

const useDarkMode = () => {
  const [enabled, setEnabled] = useLocalStorage('dark-theme');
  const isEnabled = typeof enabledState === 'undefined' && enabled;

  useEffect(() => {
    const className = 'dark';
    const bodyClass = window.document.body.classList;

    isEnabled ? bodyClass.add(className) : bodyClass.remove(className);
  }, [enabled, isEnabled]);

  return [enabled, setEnabled];
}

export default useDarkMode