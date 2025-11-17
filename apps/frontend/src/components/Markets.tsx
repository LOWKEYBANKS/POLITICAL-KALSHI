// 💰 KALSHI-STYLE MARKETS - CLEAN BUT PSYCHOLOGICALLY POTENT
import React, { useState } from 'react';
import { psychologicalSocket } from '../services/socket';

interface Market {
  id: string;
  question: string;
  category: string;
  yourBet?: 'YES' | 'NO';
  yourAmount?: number;
  odds: { yes: number; no: number };
  volume: number;
  timeLeft: string;
  rivalsBetting: number;
  lastBet: { politician: string; amount: number; side: 'YES' | 'NO' };
}

export default function Markets() {
  const [selectedMarket, setSelectedMarket] = useState<Market>();
  const [betAmount, setBetAmount] = useState('10000');
  const [isPlacingBet, setIsPlacingBet] = useState(false);

  const [markets] = useState<Market[]>([
    {
      id: 'debate_performance',
      question: 'Win Nairobi Mayoral Debate?',
      category: 'DEBATES',
      yourBet: 'YES',
      yourAmount: 25000,
      odds: { yes: 0.65, no: 0.35 },
      volume: 525000,
      timeLeft: '2 days',
      rivalsBetting: 3,
      lastBet: {
        politician: 'Rival X',
        amount: 50000,
        side: 'NO'
      }
    },
    {
      id: 'scandal_impact', 
      question: 'Corruption Scandal Major Impact?',
      category: 'SCANDALS',
      odds: { yes: 0.42, no: 0.58 },
      volume: 850000,
      timeLeft: '5 hours',
      rivalsBetting: 7,
      lastBet: {
        politician: 'Opponent Y',
        amount: 75000,
        side: 'YES'
      }
    },
    {
      id: 'rally_turnout',
      question: 'Rally Attendance >10,000?',
      category: 'CAMPAIGNS',
      odds: { yes: 0.38, no: 0.62 },
      volume: 125000,
      timeLeft: '1 day',
      rivalsBetting: 2,
      listBet: {
        politician: 'Competitor Z',
        amount: 15000,
        side: 'YES'
      }
    }
  ]);

  const placeBet = (side: 'YES' | 'NO') => {
    if (!selectedMarket || !betAmount) return;
    
    setIsPlacingBet(true);

    // 💰 PLACE BET THROUGH PSYCHOLOGICAL WARFARE ENGINE
    psychologicalSocket.placeBet(
      selectedMarket.id,
      side,
      parseInt(betAmount),
      +254712345678 // Mock M-Pesa
    );

    // 🧠 INSTANT FEEDBACK - DRIVES COMPETITIVE RESPONSE
    setTimeout(() => {
      setIsPlacingBet(false);
      toast.success(`Bet placed: ${side} KES ${parseInt(betAmount).toLocaleString()}`);
    }, 1000);
  };

  return (
    <div className="space-y-4">
      {/* 🎯 MARKET HEADER */}
      <div className="bg-white rounded-lg border-b">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Markets</h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Search markets..."
                className="text-sm px-3 py-1.5 border rounded-lg w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ⚡ URGENT RIVAL ALERT - TOP BAR */}
      {markets[0].lastBet && (
        <div className="bg-red-50 border border-red-200 px-4 py-3">
          <div className="flex justify-between items-center">
            <div>
              <span className="font-medium text-red-900">{markets[0].lastBet.politician}</span>
              <span className="text-red-700 ml-2">just bet KES {markets[0].lastBet.amount.toLocaleString()} on {markets[0].lastBet.side}</span>
            </div>
            <button 
              onClick={() => setSelectedMarket(markets[0])}
              className="bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-700 transition-all"
            >
              Place Counter Bet
            </button>
          </div>
        </div>
      )}

      {/* 📊 MARKETS LIST - KALSHI STYLE */}
      <div className="space-y-3">
        {markets.map((market) => (
          <div 
            key={market.id}
            onClick={() => setSelectedMarket(market)}
            className={`bg-white border rounded-lg cursor-pointer transition-all ${
              selectedMarket?.id === market.id ? 'border-blue-500 shadow-sm' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {/* 🎯 MARKET HEADER */}
            <div className="px-6 py-4 border-b">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-xs font-medium px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                      {market.category}
                    </span>
                    <span className="text-xs text-gray-500">{market.timeLeft}</span>
                    {market.rivalsBetting > 0 && (
                      <span className="text-xs text-green-600">
                        🔥 {market.rivalsBetting} rivals betting
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-base font-medium text-gray-900 mb-2">
                    {market.question}
                  </h3>
                  
                  {/* 👥 LAST BET SOCIAL PROOF */}
                  {market.lastBet && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">{market.lastBet.politician}</span>
                      <span className="ml-1">bet KES {market.lastBet.amount.toLocaleString()} on {market.lastBet.side}</span>
                      <span className="text-xs text-gray-400 ml-2">Just now</span>
                    </div>
                  )}
                </div>

                {/* 📊 ODDS DISPLAY */}
                <div className="text-right">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">YES</span>
                      <span className="font-medium text-green-600">
                        KES {(market.odds.yes * 10000).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">NO</span>
                      <span className="font-medium text-red-600">
                        KES {(market.odds.no * 10000).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    KES {market.volume.toLocaleString()} volume
                  </div>
                </div>
              </div>
            </div>

            {/* 💰 YOUR BET STATUS */}
            {market.yourBet && (
              <div className="px-6 py-3 border-b bg-blue-50 border-blue-100">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-sm text-blue-900 font-medium">Your Position:</span>
                    <span className="text-sm font-bold text-blue-700 ml-2">
                      {market.yourBet} · KES {market.yourAmount?.toLocaleString()}
                    </span>
                  </div>
                  <button className="text-blue-600 text-sm hover:text-blue-700 font-medium">
                    Add Position
                  </button>
                </div>
              </div>
            )}

            {/* ⚡ ACTION BAR */}
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  {/* 📊 PROGRESS BAR - CLEAN VERSION */}
                  <div className="flex-1">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>YES {Math.round(market.odds.yes * 100)}%</span>
                      <span>NO {Math.round(market.odds.no * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${market.odds.yes * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {/* 💰 KES INPUT */}
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                      KES
                    </span>
                    <input
                      type="number"
                      value={betAmount}
                      onChange={(e) => setBetAmount(e.target.value)}
                      min="5000"
                      step="5000"
                      className="pl-10 pr-3 py-2 border rounded-md text-sm w-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  {/* ⚡ YES/NO BUTTONS - KALSHI STYLE */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => placeBet('YES')}
                      disabled={isPlacingBet}
                      className="bg-green-600 text-white px-6 py-2 rounded-md font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      YES
                    </button>
                    <button
                      onClick={() => placeBet('NO')}
                      disabled={isPlacingBet}
                      className="bg-red-600 text-white px-6 py-2 rounded-md font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                      NO
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
