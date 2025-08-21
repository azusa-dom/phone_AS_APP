import React from 'react';
import { Moon, Sun } from 'lucide-react';

const Header = ({ title, lang, onToggleLang, theme, onToggleTheme }) => {
  return (
    <header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-semibold">{title}</h1>
        <div className="flex items-center gap-2">
          <button className="px-2 text-sm rounded-md bg-gray-100 dark:bg-gray-700" onClick={onToggleLang}>{lang.toUpperCase()}</button>
          <button aria-label="toggle-theme" className="p-2 rounded-md bg-gray-100 dark:bg-gray-700" onClick={onToggleTheme}>
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;


