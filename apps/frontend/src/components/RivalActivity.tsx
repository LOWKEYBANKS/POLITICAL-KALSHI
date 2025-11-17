// ⚡ RIVAL COMPETITIVE ANXIETY - LIVE SPENDING FEED
import React, { useState, useEffect } from 'react';

export default function RivalActivity({ socket }: {socket: any}) {
  const [rivalActivities, setRivalActivities] = useState([
    {
      rivalName: "Rival Candidate X",
      action: "Placed KES 75,000 YES bet on debate performance",
      timeAgo: "8 minutes ago",
      urgency: "critical",
      psychologicalImpact: "rival_dominance"
    },
    {
      rivalName: "Opposition Leader Y", 
      action: "Bought 30% boost package - gaining traction",
      timeAgo: "1 hour ago",
      urgency: "high",
      psychologicalImpact: "boost_pressure"
    },
    {
      rivalName: "Competitor Z",
      action: "Market created: 'Who will win the Nairobi debate?'",
      timeAgo: "2 hours ago", 
      urgency: "medium",
      psychologicalImpact: "market_creation"
    }
  ]);

  useEffect(() => {
    if (socket) {
      socket.on('rival_activity_feed', (data) => {
        // IMMEDIATE COMPETITIVE ANXIETY
        setRivalActivities(prev => [data.activities[0], ...prev.slice(0, 2)]);
      });

      socket.on('request_rival_activity', () => {
        socket.emit('request_rival_activity', 'current_politician_123');
      });
    }
  }, [socket]);

  const getUrgencyColor = (urgency: string) => {
    switch(urgency) {
      case 'critical': return 'text-red-500 bg-red-500/20 border-red-500';
      case 'high': return 'text-orange-500 bg-orange-500/20 border-orange-500';
      case 'medium': return 'text-yellow-500 bg-yellow-500/20 border-yellow-500';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500';
    }
  };

  return (
    <div className="bg-black/60 text-white p-4 rounded-lg border border-orange-500">
      <h2 className="text-xl font-bold text-orange-400 mb-4 flex items-center">
        ⚡ RIVAL ACTIVITY FEED
        <button 
          onClick={() => socket?.emit('request_rival_activity', 'current_politician_123')}
          className="ml-auto text-xs bg-orange-600 px-3 py-1 rounded hover:bg-orange-700 transition-all"
        >
          REFRESH
        </button>
      </h2>

      <div className="space-y-3">
        {rivalActivities.map((activity, index) => (
          <div 
            key={index}
            className={`p-3 rounded-lg border ${getUrgencyColor(activity.urgency)} ${
              activity.urgency === 'critical' ? 'animate-pulse' : ''
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="font-bold text-lg">{activity.rivalName}</div>
                <div className="text-sm mt-1">{activity.action}</div>
                <div className="text-xs opacity-70 mt-2">{activity.timeAgo}</div>
              </div>
              
              {activity.urgency === 'critical' && (
                <div className="text-red-500">
                  <button className="bg-red-600 px-3 py-1 rounded text-sm hover:bg-red-700 transition-all">
                    COUNTER BET
                  </button>
                </div>
              )}
            </div>

            {/* 🧠 PSYCHOLOGICAL TRIGGER BUTTONS */}
            <div className="mt-3 flex space-x-2">
              <button className="flex-1 bg-blue-600 px-2 py-1 rounded text-xs hover:bg-blue-700 transition-all">
                Place Counter Bet
              </button>
              <button className="flex-1 bg-green-600 px-2 py-1 rounded text-xs hover:bg-green-700 transition-all">
                Buy Boost Package
              </button>
              <button className="flex-1 bg-gray-600 px-2 py-1 rounded text-xs hover:bg-gray-700 transition-all">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 🚨 CRITICAL ALERT SECTION */}
      <div className="mt-4 p-3 bg-red-600/30 border border-red-500 rounded-lg">
        <div className="flex items-center space-x-2">
          <span className="text-red-500 text-xl">🚨</span>
          <div>
            <div className="font-bold text-red-400">CRITICAL RIVAL ACTIVITY DETECTED</div>
            <div className="text-sm">Your main opponent increased spending by 200% this week</div>
            <button className="mt-2 bg-red-600 px-4 py-1 rounded text-sm hover:bg-red-700 transition-all w-full">
              IMMEDIATE RESPONSE REQUIRED
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
