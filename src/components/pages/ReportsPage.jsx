import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { weeklyData } from '../../data/mockData';

const ReportsPage = ({ t }) => {
  return (
    <section className="space-y-4">
      <h2 className="text-base font-semibold">{t.weeklyTrends}</h2>
      <div className="rounded-2xl p-4 bg-white dark:bg-gray-800 shadow-medical h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={weeklyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="pain" stroke="#ef4444" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="fatigue" stroke="#3b82f6" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default ReportsPage;


