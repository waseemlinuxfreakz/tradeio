import React from 'react';

const Stats = () => {
  const stats = [
    { value: '45K+', label: 'Active Users', color: 'text-pink-500' },
    { value: '2.5K+', label: 'Daily Signals', color: 'text-purple-500' },
    { value: '92%', label: 'Success Rate', color: 'text-blue-500' },
    { value: '$2.4M', label: 'Daily Volume', color: 'text-emerald-500' }
  ];

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={index} className="bg-slate-800/50 rounded-lg p-6 text-center">
              <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="mt-2 text-sm text-slate-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Stats;