// 🎯 KALSHI-STYLE MINIMALIST POLITICAL DASHBOARD
// Clean interface, maximum psychological pressure
import React, { useEffect, useState } from 'react';
import Leaderboard from '../components/Leaderboard';
import Markets from '../components/Markets';
import Activity from '../components/Activity';
import Stats from '../components/Stats';
import { psychologicalSocket } from '../services/socket';
import toast from 'react-hot-toast';

export default function Dashboard({ politicianProfile }: {politicianProfile: any}) {
  const [activeMarkets, setActiveMarkets] = useState([
    {
      id: 'debate_nairobi',
      question: 'Win Nairobi Debate?',
      yourBet: 'YES',
      amount: 25000,
      odds: '65%',
      timeLeft: '2 days'
    }
  ]);

  useEffect(() => {
    // 🧠 CONNECT TO PSYCHOLOGICAL WARFARE ENGINE
    psychologicalSocket.authenticatePolitician(
      politicianProfile.id, 
      'mock_token'
    );
    
    return () => psychologicalSocket.disconnect();
  }, [politicianProfile.id]);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* 🎯 TOP BAR - SIMPLE STATUS */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-6">
              <span className="text-xl font-bold text-gray-900">Political Kalshi</span>
              <nav className="flex space-x-6 text-sm">
                <button className="text-blue-600 font-medium">Markets</button>
                <button className="text-gray-500 hover:text-gray-700">Portfolio</button>
                <button className="text-gray-500 hover:text-gray-700">Activity</button>
              </nav>
            </div>
            
            <div className="flex items-center place-x-6 text-sm">
              <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full">
                ✓ Active
              </div>
              <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                KES {politicianProfile.availableKes.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 📊 MAIN CONTENT GRID - KALSHI LAYOUT */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-3 gap-6">
          
          {/* 📈 LEFT COLUMN - PORTFOLIO ANXIETY */}
          <div className="space-y-4">
            <Stats />
            <Activity />
          </div>

          {/* 💰 CENTER COLUMN - BETTING INTERFACE */}
          <div>
            <Markets />
          </div>

          {/* 🎯 RIGHT COLUMN - RIVAL COMPETITION */}
          <div className="space-y-4">
            <Leaderboard />
          </div>
        </div>
      </div>
    </div>
  );
}
