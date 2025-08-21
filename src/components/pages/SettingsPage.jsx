import React from 'react';

const SettingsPage = ({ t, theme, onToggleTheme, lang, onToggleLang }) => {
  return (
    <section className="space-y-4">
      <h2 className="text-base font-semibold">{t.settings}</h2>
      <div className="rounded-2xl p-4 bg-white dark:bg-gray-800 shadow-medical">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">{t.darkMode}</div>
          </div>
          <button className="px-3 py-1.5 text-sm rounded-lg bg-gray-100 dark:bg-gray-700" onClick={onToggleTheme}>{theme}</button>
        </div>
      </div>
      <div className="rounded-2xl p-4 bg-white dark:bg-gray-800 shadow-medical">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">{t.language}</div>
          </div>
          <button className="px-3 py-1.5 text-sm rounded-lg bg-gray-100 dark:bg-gray-700" onClick={onToggleLang}>{lang.toUpperCase()}</button>
        </div>
      </div>
    </section>
  );
};

export default SettingsPage;


