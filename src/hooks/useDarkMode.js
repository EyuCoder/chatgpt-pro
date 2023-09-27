import { useEffect } from 'react';
import useLocalStorage from './useLocalStorage';

/**
 * Hook to manage dark mode
 * @returns {Array} [theme, setTheme]
 */
const useDarkMode = () => {
  const [theme, setTheme] = useLocalStorage('theme', 'dark');

  useEffect(() => {
    const html = window.document.documentElement;
    html.setAttribute('data-theme', theme);
  }, [theme]);

  return [theme, setTheme];
};

export default useDarkMode;
