// ⏰ DECAY ANXIETY ENGINE - COUNTDOWN URGENCY SYSTEM
import React, { useState, useEffect } from 'react';
import { differenceInSeconds, format } from 'date-fns';

interface BoostTimer {
  id: string;
  name: string;
  currentValue: string;
  expiryTime: Date;
  decayRate: number;
  PsychologicalTactic: string;
}

export default function BoostTimers({ socket }: {socket: any}) {
  const [boosts, setBoosts] = useState<BoostTimer[]>([
    {
      id: '1',
      name: 'Nairobi Region Boost',
      currentValue: '+15%',
      expiryTime: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours
      decayRate: 5,
      PsychologicalTactic: 'scarcity_anxiety'
    },
    {
      id: '2', 
      name: 'Policy Focus Boost',
      currentValue: '+8%',
      expiryTime: new Date(Date.now() + 1.2 * 60 * 60 * 1000), // 1.2 hours
      decayRate: 10,
      PsychologicalTactic: 'decay_anxiety'
    }
  ]);

  const [timeUntilExpiry, setTimeUntilExpiry] = useState<{[key: string]: string}>({});

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimes: {[key: string]: string} = {};
      
      boosts.forEach(boost => {
        const secondsLeft = differenceInSeconds(boost.expiryTime, new Date());
        
        if (secondsLeft <= 0) {
          newTimes[boost.id] = 'EXPIRED';
        } else if (secondsLeft < 3600) { // Less than 1 hour
          newTimes[boost.id] = `${Math.floor(secondsLeft / 60)}m ${secondsLeft % 60}s`;
        } else {
          newTimes[boost.id] = `${Math.floor(secondsLeft / 3600)}h ${Math.floor((secondsLeft % 3600) / 60)}m`;
        }
      });
      
      setTimeUntilExpiry(newTimes);
    }, 1000); // Update every second for maximum anxiety

    return () => clearInterval(timer);
  }, [boosts]);

  useEffect(() => {
    if (socket) {
      socket.on('boost_timer_update', (data) => {
        // INSTANT DECAY ANXIETY TRIGGER
        console.log('Boost decay pressure:', data);
      });

      socket.emit('check_boost_timer', 'current_politician_123');
    }
  }, [socket]);

  const getTimeColor = (timeLeft: string, boostId: string) => {
    if (timeLeft === 'EXPIRED') return 'text-red-600';
    if (!timeLeft.includes('h')) return 'text-red-500'; // Less than 1 hour
    
    const hours = parseInt(timeLeft.split('h')[0]);
    if (hours <= 2) return 'text-orange-500';
    return 'text-green-500';
  };

  const getProgressBarColor = (timeLeft: string) => {
    if (timeLeft === 'EXPIRED') return 'bg-red-600';
    if (!timeLeft.includes('h')) return 'bg-red-500';
    if (timeLeft.includes('1h')) return 'bg-orange-500';
    return 'bg-green-500';
  };

  return (
    <div className="bg-black/60 text-white p-4 rounded-lg border border-yellow-500">
      <h2 className="text-xl font-bold text-yellow-400 mb-4 flex items-center">
        ⏰ BOOST DECAY MONITOR
        <span className="ml-2 text-xs animate-pulse bg-yellow-600 px-2 py-1 rounded">CRITICAL</span>
      </h2>

      {/* ⚠️ URGENT WARNING */}
      {timeUntilExpiry['2'] && !timeUntilExpiry['2'].includes('h') && (
        <div className="mb-4 p-3 bg-red-600/30 border border-red-500 rounded-lg animate-pulse">
          <div className="flex items-center space-x-2">
            <span className="text-red-500 text-xl">⚠️</span>
            <div>
              <div className="font-bold text-red-400">IMMEDIATE EXPIRY WARNING</div>
              <div className="text-sm">Policy Focus Boost expires in {timeUntilExpiry['2']}</div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {boosts.map((boost) => {
          const timeLeft = timeUntilExpiry[boost.id] || 'Calculating...';
          const isExpired = timeLeft === 'EXPIRED';
          const isCritical = !isExpired && !timeLeft.includes('h');
          
          return (
            <div 
              key={boost.id}
              className={`p-4 rounded-lg border ${
                isExpired ? 'bg-red-900/40 border-red-600' : 
                isCritical ? 'bg-orange-900/40 border-orange-600' : 
                'bg-black/40 border-gray-700'
              } ${isCritical && !isExpired ? 'animate-pulse' : ''}`}
            >
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h3 className="font-bold text-lg">{boost.name}</h3>
                  <div className="text-xl font-bold text-yellow-400">
                    {boost.currentValue}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`text-xl font-bold ${getTimeColor(timeLeft, boost.id)}`}>
                    {timeLeft}
                  </div>
                  <div className="text-xs text-gray-400">
                    until expiry
                  </div>
                </div>
              </div>

              {/* ⏱️ PROGRESS BAR - VISUAL ANXIETY */}
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Time Remaining</span>
                  <span>{isCritical && !isExpired ? 'CRITICAL' : ''}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-1000 ${getProgressBarColor(timeLeft)}`}
                    style={{ 
                      width: isExpired ? '0%' : 
                        timeLeft.includes('h') ? 
                          `${parseInt(timeLeft.split('h')[0]) * 25}%` : '10%'
                    }}
                  ></div>
                </div>
              </div>

              {/* ⚠️ DECAY WARNING */}
              <div className="text-xs text-gray-400 mb-3">
                Decay Rate: {boost.decayRate}% per hour after expiry
              </div>

              {/* 💰 PRESSURE BUTTONS */}
              {!isExpired && isCritical && (
                <div className="flex space-x-2">
                  <button className="flex-1 bg-red-600 px-3 py-2 rounded text-sm hover:bg-red-700 transition-all">
                    EXTEND IMMEDIATELY
                  </button>
                  <button className="flex-1 bg-yellow-600 px-3 py-2 rounded text-sm hover:bg-yellow-700 transition-all">
                    BUY NEW BOOST
                  </button>
                </div>
              )}

              {isExpired && (
                <div className="p-3 bg-red-600/30 rounded-lg">
                  <div className="font-bold text-red-400">BOOST EXPIRED</div>
                  <div className="text-sm mb-2">Your rivals are capitalizing on your weakness!</div>
                  <button className="w-full bg-red-600 px-3 py-2 rounded text-sm hover:bg-red-700 transition-all">
                    URGENT REACTIVATION REQUIRED
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 💎 PREMIUM BOOST PROMPT */}
      <div className="mt-4 p-3 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-500 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-bold text-yellow-400">PREMIUM BOOST PACKAGE</div>
            <div className="text-sm text-gray-300">+50% traction for 24-hours</div>
          </div>
          <button className="bg-yellow-600 px-4 py-2 rounded text-sm font-bold hover:bg-yellow-700 transition-all">
            KES 25,000
          </button>
        </div>
      </div>
    </div>
  );
}
