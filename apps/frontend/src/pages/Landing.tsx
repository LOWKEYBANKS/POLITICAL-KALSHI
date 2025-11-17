// 💎 POLYMARKET-STYLE PUBLIC MARKET VIEW
// Clean data, subtle hooks, requires login to bet
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Landing({ onLogin }: {onLogin: any}) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });

  // 📊 PUBLIC MARKET DATA (POLITICIANS CAN SEE WITHOUT LOGIN)
  const publicMarkets = [
    {
      question: 'Win Nairobi Mayoral Debate?',
      category: 'DEBATES',  
      description: 'Based on polling data, debate preparation, and campaign momentum',
      stats: {
        volume: 'KES 525K',
        participants: 47,
        lastUpdated: '2 minutes ago',
        trend: 'YES gaining (+12%)'
      },
      currentOdds: { yes: 0.65, no: 0.35 }
    },
    {
      question: 'Corruption Scandal Major Impact?',
      category: 'POLITICAL RISK',
      description: 'Monitors legal developments, media coverage, and public sentiment',
      stats: {
        volume: 'KES 850K', 
        participants: 89,
        lastUpdated: '5 minutes ago',
        trend: 'NO gaining (+8%)'
      },
      currentOdds: { yes: 0.42, no: 0.58 }
    },
    {
      question: 'Campaign Fundraising >KES 10M?',
      category: 'FINANCIALS',
      description: 'Tracks donor contributions, fundraising events, and financial disclosures',
      stats: {
        volume: 'KES 320K',
        participants: 28,
        lastUpdated: '15 minutes ago',
        trend: 'YES stable (+2%)'
      },
      currentOdds: { yes: 0.38, no: 0.62 }
    },
    {
      question: 'Rally Attendance >10,000?',
      category: 'CAMPAIGNS',
      description: 'Analyzes social media buzz, advance ticket sales, and event logistics',
      stats: {
        volume: 'KES 125K',
        participants: 15,
        lastUpdated: '8 minutes ago',
        trend: 'NO holding (-5%)'
      },
      currentOdds: { yes: 0.35, no: 0.65 }
    }
  ];

  // 👥 PUBLIC LEADERBOARD (SOCIAL PROOF WITHOUT INTIMIDATION)
  const publicLeaderboard = [
    { rank: 1, name: 'Rival Candidate X', portfolio: 425000, positions: 12, successRate: 62 },
    { rank: 2, name: 'Opposition Leader Y', portfolio: 385000, positions: 8, successRate: 71 },
    { rank: 3, name: 'Coalition Member Z', portfolio: 195000, positions: 5, successRate: 58 },
    { rank: 4, name: 'Regional Leader A', portfolio: 145000, positions: 7, successRate: 64 },
  ];

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 🎯 MOCK AUTHENTICATION
    if (loginData.email && loginData.password) {
      const politicianData = {
        id: 'politician_123',
        name: loginData.email.includes('@') ? loginData.email.split('@')[0].replace('.', ' ').toUpperCase() : 'Politician User',
        position: 'Mayoral Candidate',
        availableKes: 150000
      };
      
      onLogin(politicianData);
      setShowLoginModal(false);
      
      toast.success('Welcome to Political Kalshi', {
        style: { backgroundColor: '#10b981' }
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 🎯 TOP BAR - PUBLIC VIEW */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold text-gray-900">Political Kalshi</h1>
              <nav className="hidden md:flex space-x-6 text-sm">
                <button className="text-gray-900 font-medium">Markets</button>
                <button className="text-gray-500 hover:text-gray-700">Leaderboard</button>
                <button className="text-gray-500 hover:text-gray-700">About</button>
                <button className="text-gray-500 hover:text-gray-700">API</button>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="text-gray-500 hover:text-gray-700 text-sm">Learn More</button>
              <button 
                onClick={() => setShowLoginModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-all"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 📊 HERO SECTION - DATA-FOCUSED BAIT */}
      <div className="bg-gradient-to-b from-gray-50 to-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Political Prediction Markets
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Real-time prediction markets for political events. Track trends, 
              analyze sentiment, and make informed decisions about political outcomes.
            </p>
            
            {/* 📈 PLATFORM STATS - PUBLIC TRANSPARENCY */}
            <div className="grid grid-cols-4 gap-6 mt-8">
              <div className="bg-white p-4 rounded-lg border">
                <div className="text-2xl font-bold text-blue-600">KES 1.2M+</div>
                <div className="text-sm text-gray-600">Total Volume</div>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <div className="text-2xl font-bold text-green-600">156</div>
                <div className="text-sm text-gray-600">Active Users</div>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <div className="text-2xl font-bold text-purple-600">24/7</div>
                <div className="text-sm text-gray-600">Market Hours</div>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <div className="text-2xl font-bold text-orange-600">92%</div>
                <div className="text-sm text-gray-600">Resolution Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🎭 FEATURED MARKETS - PUBLIC VIEW WITH HOOKS */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Trending Markets</h3>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            View All Markets
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {publicMarkets.map((market, index) => (
            <div key={index} className="bg-white border rounded-lg hover:shadow-lg transition-shadow">
              {/* 🎯 MARKET HEADER */}
              <div className="p-6 border-b">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                    {market.category}
                  </span>
                  <span className="text-xs text-gray-500">
                    Updated {market.stats.lastUpdated}
                  </span>
                  {market.stats.trend.includes('+') && (
                    <span className="text-xs text-green-600 font-medium">
                      📈 {market.stats.trend}
                    </span>
                  )}
                </div>
                
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  {market.question}
                </h4>
                <p className="text-sm text-gray-600">
                  {market.description}
                </p>
              </div>

              {/* 📊 MARKET DATA - TRANSPARENT BUT TEMPTING */}
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-sm text-gray-600 mb-1">YES</div>
                    <div className="text-2xl font-bold text-green-600">
                      KES {(market.currentOdds.yes * 10000).toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">Payout per KES 10k</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-600 mb-1">NO</div>
                    <div className="text-2xl font-bold text-red-600">
                      KES {(market.currentOdds.no * 10000).toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">Payout per KES 10k</div>
                  </div>
                </div>

                {/* 🎯 PROGRESS BAR - VISUAL HOOK */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-2">
                    <span>YES {(market.currentOdds.yes * 100).toFixed(0)}%</span>
                    <span>NO {(market.currentOdds.no * 100).toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                      style={{ width: `${market.currentOdds.yes * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* 👥 SOCIAL PROOF */}
                <div className="flex justify-between text-sm text-gray-600 mb-4">
                  <span>KES {market.stats.volume} volume</span>
                  <span>{market.stats.participants} participants</span>
                </div>

                {/* 🎯 SUBTLE HOOK - NOT URGENCY, BUT ACCESS */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <div className="text-sm">
                      <span className="text-blue-900 font-medium">Real-time trading available</span>
                      <div className="text-blue-700 text-xs">Sign in to participate</div>
                    </div>
                    <button 
                      onClick={() => setShowLoginModal(true)}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-all text-sm"
                    >
                      Sign In
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 👥 PUBLIC LEADERBOARD - SUBTLE COMPETITION HOOK */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white border rounded-lg">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Market Leaders</h3>
            <p className="text-sm text-gray-600 mt-1">
              Top performers across all prediction markets (public view)
            </p>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {publicLeaderboard.map((leader) => (
                <div key={leader.rank} className="flex items-center justify-between border-b pb-4 last:border-b-0 last:pb-0">
                  <div className="flex items-center space-x-4">
                    <div className="text-lg font-bold text-gray-600 w-4">
                      {leader.rank}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{leader.name}</div>
                      <div className="text-sm text-gray-600">
                        {leader.positions} positions • {leader.successRate}% success rate
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg text-gray-900">
                      KES {leader.portfolio.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 🎯 FEATURES SECTION - PROFESSIONAL FRAMING */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Professional Prediction Markets
            </h3>
            <p className="text-lg text-gray-600">
              Data-driven insights and transparent market mechanics
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl mb-4">📊</div>
              <h4 className="font-semibold text-gray-900 mb-2">Real-Time Data</h4>
              <p className="text-sm text-gray-600">
                Live market prices based on crowd intelligence and professional insights
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-4">🔍</div>
              <h4 className="font-semibold text-gray-900 mb-2">Market Transparency</h4>
              <p className="text-sm text-gray-600">
                Complete visibility into volume, participants, and price movements
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-4">💎</div>
              <h4 className="font-semibold text-gray-900 mb-2">Professional Analytics</h4>
              <p class="text-sm text-gray-600">
                Detailed performance tracking and market trend analysis
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 🔐 LOGIN MODAL - GENTLE ONBOARDING */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Sign In</h2>
            
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="politician@example.com"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                  required
                />
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-4 h-4 border border-gray-400 rounded"></div>
                <span>Remember me</span>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowLoginModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
                >
                  Sign In
                </button>
              </div>
            </form>
            
            <div className="mt-6 pt-6 border-t text-center">
              <p className="text-sm text-gray-600">
                Don't have an account? 
                <span className="text-blue-600 hover:text-blue-700 font-medium ml-1">
                  Request Access
                </span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 🎯 FOOTER */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <div>Markets</div>
                <div>Analytics</div>
                <div>API</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <div>About</div>
                <div>Contact</div>
                <div>Careers</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <div>Documentation</div>
                <div>Market Rules</div>
                <div>Support</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <div>Terms of Service</div>
                <div>Privacy Policy</div>
                <div>Market Regulations</div>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
            <p>© 2025 Political Kalshi. Professional prediction markets for political events.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
