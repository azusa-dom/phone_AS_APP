import React, { useState } from 'react';
import { painEmojis, fatigueEmojis, triggers } from '../../data/mockData';

const TrackPage = ({ t }) => {
  const [pain, setPain] = useState(3);
  const [fatigue, setFatigue] = useState(2);
  const [stiffness, setStiffness] = useState(30);
  const [selected, setSelected] = useState([]);

  const toggle = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl p-4 bg-white dark:bg-gray-800 shadow-medical">
        <div className="mb-3 text-sm font-medium">{t.painLevel}</div>
        <input className="w-full slider" type="range" min="0" max="10" value={pain} onChange={e=>setPain(Number(e.target.value))} />
        <div className="mt-2 text-2xl">{painEmojis[pain]}</div>
      </div>
      <div className="rounded-2xl p-4 bg-white dark:bg-gray-800 shadow-medical">
        <div className="mb-3 text-sm font-medium">{t.fatigue}</div>
        <input className="w-full slider" type="range" min="0" max="10" value={fatigue} onChange={e=>setFatigue(Number(e.target.value))} />
        <div className="mt-2 text-2xl">{fatigueEmojis[fatigue]}</div>
      </div>
      <div className="rounded-2xl p-4 bg-white dark:bg-gray-800 shadow-medical">
        <div className="mb-3 text-sm font-medium">{t.morningStiffness}</div>
        <input className="w-full slider" type="range" min="0" max="120" step="5" value={stiffness} onChange={e=>setStiffness(Number(e.target.value))} />
        <div className="mt-2 text-xs text-gray-500">{stiffness} {t.minutes}</div>
      </div>
      <div className="rounded-2xl p-4 bg-white dark:bg-gray-800 shadow-medical">
        <div className="mb-3 text-sm font-medium">{t.triggers}</div>
        <div className="flex flex-wrap gap-2">
          {triggers.map(tr => (
            <button key={tr.id} onClick={()=>toggle(tr.id)} className={`px-3 py-1.5 rounded-full text-sm border ${selected.includes(tr.id) ? 'bg-as-blue-600 text-white border-as-blue-600' : 'border-gray-300 dark:border-gray-600'}`}>
              <span className="mr-1">{tr.icon}</span>{tr.label.zh}
            </button>
          ))}
        </div>
      </div>
      <button className="w-full py-3 rounded-xl bg-as-blue-600 text-white success-pulse">{t.saveRecord}</button>
    </div>
  );
};

export default TrackPage;


