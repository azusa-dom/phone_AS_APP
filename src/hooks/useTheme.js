import { useEffect, useState } from 'react';

export const useTheme = (initialTheme = 'light') => {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return initialTheme;
    return window.localStorage.getItem('theme') || initialTheme;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      window.localStorage.setItem('theme', theme);
    } catch {}
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));

  return { theme, setTheme, toggleTheme };
};


