// 🧠 POLITICAL ANXIETY DASHBOARD - MAIN WARFARE INTERFACE
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import Leaderboard from '../components/Leaderboard';
import RivalActivity from '../components/RivalActivity'; 
import BoostTimers from '../components/BoostTimers';
import BettingInterface from '../components/BettingInterface';
import AlertTicker from '../components/AlertTicker';
import { toast } from 'react-hot-toast';

interface PsychologicalPressure {
  type: 'rival_bet' | 'decay_warning' | 'leaderboard_shift' | 'match_result';
  message: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  quickActions: string[];
  data: any;
}

export default function Dashboard() {
  const [socket, setSocket] = useState<any>(null);
  const [politicianData, setPoliticianData] = useState({
    currentPosition: 7,
    traction: 42.3,
    activeBoosts: 2,
    availableKes: 150000
  });

  useEffect(() => {
    // 🧠 Connect to psychological warfare engine
    const newSocket = io('http://localhost:3001');
    
    newSocket.emit('authenticate_politician', {
      politicianId: 'current_politician_123',
      token: 'jwt_token_here'
    });

    // ⚡ Real-time psychological pressure delivery
    newSocket.on('rival_activity_update', (data) => {
      // IMMEDIATE RIVAL ANXIETY
      toast.error(data.message, {
        duration: 8000,
        position: 'top-center',
        style: { backgroundColor: '#ef4444', color: 'white' }
      });
    });

    newSocket.on('boost_decay_alert', (data) => {
      // DECAY URGENCY TRIGGER
      toast.warning(data.message, {
        duration: 6000,
        position: 'top-center',
        style: { backgroundColor: '#f59e0b', color: 'white' }
      });
    });

    newSocket.on('leaderboard_pressure', (data) => {
      // STATUS ANXIETY TRIGGER
      toast.error(data.message, {
        duration: 7000,
        position: 'top-center',
        style: { backgroundColor: '#dc2626', color: 'white' }
      });
    });

    newSocket.on('campaign_event', (data) => {
      // FOMO GENERATION
      toast.success(data.message, {
        duration: 5000,
        position: 'bottom-center',
        style: { backgroundColor: '#10b981', color: 'white' }
      });
    });

    setSocket(newSocket);
    
    return () => newSocket.close();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-purple-900 to-blue-900">
      {/* 🎯 URGENT PSYCHOLOGICAL PRESSURE BAR */}
      <div className="bg-red-600 text-white p-2 text-center font-bold animate-pulse">
        ⚠️ CRITICAL UPDATE: Your main rival just spent KES 75,000! Respond NOW!
      </div>

      <div className="container mx-auto p-4">
        {/* 💰 TOP STATUS BAR - POLITICAL ANXIETY METRICS */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-black/50 text-white p-4 rounded-lg border border-red-500">
            <h3 className="text-red-400 text-sm">YOUR POSITION</h3>
            <div className="text-3xl font-bold text-red-500">#{politicianData.currentPosition}</div>
            <div className="text-red-400 text-sm">↓ 2 positions today</div>
          </div>
          
          <div className="bg-black/50 text-white p-4 rounded-lg border border-yellow-500">
            <h3 className="text-yellow-400 text-sm">GEN-Z TRACTION</h3>
            <div className="text-3xl font-bold text-yellow-500">{politicianData.traction}%</div>
            <div className="text-yellow-400 text-sm">-1.2% trending down</div>
          </div>
          
          <div className="bg-black/50 text-white p-4 rounded-lg border border-green-500">
            <h3 className="text-green-400 text-sm">ACTIVE BOOSTS</h3>
            <div className="text-3xl font-bold text-green-500">{politicianData.activeBoosts}</div>
            <div className="text-green-400 text-sm">1 expiring soon!</div>
          </div>
          
          <div className="bg-black/50 text-white p-4 rounded-lg border border-blue-500">
            <h3 className="text-blue-400 text-sm">KES AVAILABLE</h3>
            <div className="text-3xl font-bold text-blue-500">KES {politicianData.availableKes.toLocaleString()}</div>
            <div className="text-blue-400 text-sm">Ready to spend!</div>
          </div>
        </div>

        {/* 📊 MAIN CONTENT GRID - PSYCHOLOGICAL WARFARE LAYOUT */}
        <div className="grid grid-cols-3 gap-6">
          {/* 🎭 LEFT COLUMN - COMPETITIVE ANXIETY */}
          <div className="space-y-6">
            <Leaderboard socket={socket} />
            <BoostTimers socket={socket} />
          </div>

          {/* 💰 CENTER COLUMN - ACTIVE BETTING */}
          <div className="space-y-6">
            <BettingInterface socket={socket} />
            <AlertTicker socket={socket} />
          </div>

          {/* ⚡ RIGHT COLUMN - RIVAL PRESSURE */}
          <div className="space-y-6">
            <RivalActivity socket={socket} />
          </div>
        </div>
      </div>
    </div>
  );
}
