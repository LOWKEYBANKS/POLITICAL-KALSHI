// 📊 COMPETITIVE STATUS ANXIETY - RANKING PRESSURE ENGINE
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Leaderboard({ socket }: {socket: any}) {
  const [leaderboardData, setLeaderboardData] = useState([
    { rank: 1, name: "Rival Candidate X", traction: 68.4, trend: "up", recentBet: "KES 100,000" },
    { rank: 2, name: "Opponent Y", traction: 52.1, trend: "up", recentBet: "KES 75,000" },
    { rank: 7, name: "YOU", traction: 42.3, trend: "down", highlight: true },
    { rank: 8, name: "Weaker Rival", traction: 38.2, trend: "down", recentBet: null },
  ]);

  const [chartData, setChartData] = useState([
    { time: '00:00', yourPosition: 5, rivalPosition: 1 },
    { time: '04:00', yourPosition: 6, rivalPosition: 1 },
    { time: '08:00', yourPosition: 7, rivalPosition: 2 },
    { time: '12:00', yourPosition: 7, rivalPosition: 2 },
    { time: 'NOW', yourPosition: 7, rivalPosition: 1 },
  ]);

  useEffect(() => {
    if (socket) {
      socket.on('leaderboard_shift', (data) => {
        // IMMEDIATE STATUS ANXIETY UPDATE
        setLeaderboardData(prev => prev.map((politician, index) => 
          index === 2 ? { ...politician, rank: politician.rank + (data.positionChange || 0) } : politician
        ));
      });
    }
  }, [socket]);

  return (
    <div className="bg-black/60 text-white p-4 rounded-lg border border-red-500">
      <h2 className="text-xl font-bold text-red-400 mb-4 flex items-center">
        📊 LIVE POLITICAL RANKINGS
        <span className="ml-2 text-xs animate-pulse bg-red-600 px-2 py-1 rounded">LIVE</span>
      </h2>

      {/* 📈 TREND CHART - PSYCHOLOGICAL PRESSURE */}
      <div className="mb-4">
        <h3 className="text-sm text-red-400 mb-2">24-Hour Position Battle</h3>
        <ResponsiveContainer width="100%" height={100}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ef4444" />
            <XAxis dataKey="time" stroke="#f87171" />
            <YAxis stroke="#f87171" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #ef4444' }} 
              labelStyle={{ color: '#f87171' }}
            />
            <Line type="monotone" dataKey="yourPosition" stroke="#ef4444" strokeWidth={2} />
            <Line type="monotone" dataKey="rivalPosition" stroke="#fbbf24" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 🔥 RANKING LIST - COMPETITIVE ANXIETY */}
      <div className="space-y-2">
        {leaderboardData.map((politician) => (
          <div 
            key={politician.name}
            className={`p-3 rounded-lg border ${
              politician.highlight 
                ? 'bg-red-600/30 border-red-500 animate-pulse' 
                : 'bg-black/40 border-gray-700'
            }`}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <span className={`text-2xl font-bold ${
                  politician.highlight ? 'text-red-400' : 'text-gray-400'
                }`}>#{politician.rank}</span>
                <div>
                  <div className={`font-bold ${politician.highlight ? 'text-red-400' : 'text-white'}`}>
                    {politician.name}
                  </div>
                  <div className="text-xs text-gray-400">
                    {politician.recentBet && `Recent: ${politician.recentBet}`}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-xl font-bold text-yellow-400">{politician.traction}%</div>
                <div className={`flex items-center text-xs ${
                  politician.trend === 'up' ? 'text-green-400' : 'text-red-500'
                }`}>
                  {politician.trend === 'up' ? '↗️' : '↘️'} 
                  {politician.trend === 'up' ? 'gaining' : 'falling'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
