import React, { useState } from 'react';
import { Activity, Calendar, Pill, LineChart as LineChartIcon, Library as LibraryIcon, Settings as SettingsIcon } from 'lucide-react';
import { translations } from '../utils/translations';
import Header from './common/Header';
import NavBar from './common/NavBar';
import HomePage from './pages/HomePage';
import TrackPage from './pages/TrackPage';
import MedsPage from './pages/MedsPage';
import ReportsPage from './pages/ReportsPage';
import LibraryPage from './pages/LibraryPage';
import SettingsPage from './pages/SettingsPage';
import { useTheme } from '../hooks/useTheme';

const ASApp = () => {
  const [lang, setLang] = useState('zh');
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState('home');
  const { theme, toggleTheme } = useTheme('light');

  const tabs = [
    { key: 'home', icon: Activity, label: t.home },
    { key: 'track', icon: Calendar, label: t.track },
    { key: 'meds', icon: Pill, label: t.meds },
    { key: 'reports', icon: LineChartIcon, label: t.reports },
    { key: 'library', icon: LibraryIcon, label: t.library },
    { key: 'settings', icon: SettingsIcon, label: t.settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 pb-16">
      <Header title="AS App" lang={lang} onToggleLang={() => setLang(lang === 'zh' ? 'en' : 'zh')} theme={theme} onToggleTheme={toggleTheme} />

      <main className="max-w-3xl mx-auto px-4 py-4">
        {activeTab === 'home' && <HomePage t={t} />}
        {activeTab === 'track' && <TrackPage t={t} />}
        {activeTab === 'meds' && <MedsPage t={t} />}
        {activeTab === 'reports' && <ReportsPage t={t} />}
        {activeTab === 'library' && <LibraryPage t={t} />}
        {activeTab === 'settings' && (
          <SettingsPage t={t} theme={theme} onToggleTheme={toggleTheme} lang={lang} onToggleLang={() => setLang(lang === 'zh' ? 'en' : 'zh')} />
        )}
      </main>

      <NavBar items={tabs} active={activeTab} onChange={setActiveTab} />
    </div>
  );
};

export default ASApp;


