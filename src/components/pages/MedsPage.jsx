import React from 'react';
import { medicationsData } from '../../data/mockData';

const MedsPage = ({ t }) => {
  return (
    <section className="space-y-3">
      <h2 className="text-base font-semibold">{t.meds}</h2>
      {medicationsData.map(m => (
        <div key={m.id} className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-gray-800 shadow-medical">
          <div>
            <div className="font-medium">{m.name}</div>
            <div className="text-xs text-gray-500">{m.dosage} · {m.frequency}</div>
          </div>
          <button className="px-3 py-1.5 text-sm rounded-lg bg-as-blue-600 text-white">{t.takeMed}</button>
        </div>
      ))}
    </section>
  );
};

export default MedsPage;


