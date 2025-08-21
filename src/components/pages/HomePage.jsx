import React from 'react';
import { weeklyData } from '../../data/mockData';

const HomePage = ({ t }) => {
  const avgPain = (weeklyData.reduce((a, b) => a + b.pain, 0) / weeklyData.length).toFixed(1);
  return (
    <section className="space-y-4">
      <div className="medical-card rounded-2xl p-4">
        <h2 className="text-base font-semibold mb-2">{t.todayOverview}</h2>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800">
            <div className="text-2xl">{avgPain}</div>
            <div className="text-xs text-gray-500">{t.avgPain}</div>
          </div>
          <div className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800">
            <div className="text-2xl">{weeklyData.length}</div>
            <div className="text-xs text-gray-500">{t.checkInDays}</div>
          </div>
          <div className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800">
            <div className="text-2xl">2</div>
            <div className="text-xs text-gray-500">{t.flareCount}</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomePage;


