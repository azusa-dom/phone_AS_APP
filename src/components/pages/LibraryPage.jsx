import React from 'react';
import { educationContent } from '../../data/mockData';

const LibraryPage = ({ t }) => {
  return (
    <section className="space-y-3">
      <h2 className="text-base font-semibold">{t.library}</h2>
      {educationContent.map(item => (
        <div key={item.id} className="p-4 rounded-2xl bg-white dark:bg-gray-800 shadow-medical flex items-center justify-between">
          <div>
            <div className="font-medium">{item.icon} {item.title.zh}</div>
            <div className="text-xs text-gray-500">{item.category.zh} · {item.duration.zh}</div>
          </div>
          {item.completed ? (
            <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700">Done</span>
          ) : (
            <button className="px-3 py-1.5 text-sm rounded-lg bg-as-blue-600 text-white">Start</button>
          )}
        </div>
      ))}
    </section>
  );
};

export default LibraryPage;


