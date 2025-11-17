// 📊 KALSHI-STYLE PORTFOLIO STATS
import React from 'react';

export default function Stats() {
  const stats = [
    {
      label: 'Portfolio Value',
      value: 'KES 125,000',
      change: -15000,
      changePercent: -10.7
    },
    {
      label: 'Active Positions',
      value: '8',
      change: 2,
      changePercent: 33
    },
    {
      label: 'Win Rate',
      value: '58%',
      change: 3,
      changePercent: 5.5
    }
  ];

  return (
    <div className="bg-white rounded-lg border">
      <div className="px-6 py-4 border-b">
        <h2 className="text-lg font-semibold text-gray-900">Performance</h2>
      </div>

      <div className="p-6 space-y-4">
        {stats.map((stat, index) => (
          <div key={index}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-600">{stat.label}</span>
              <div className="flex items-center space-x-2">
                <span className={`text-sm ${
                  stat.change > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change > 0 ? '+' : ''}{stat.changePercent}%
                </span>
              </div>
            </div>
            <div className="text-lg font-bold text-gray-900">
              {stat.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
