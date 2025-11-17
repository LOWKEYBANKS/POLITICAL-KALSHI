// 📈 CAMPAIGN EVENT TICKER - CAMPAIGN SPIKE + BREAKING NEWS PRESSURE
import React, { useState, useEffect } from 'react'
import { psychologicalSocket } from '../services/socket'

export default function AlertTicker({ socket }: {socket: any}) {
  const [campaignEvents, setCampaignEvents] = useState([
    {
      id: 1,
      type: 'campaign_spike',
      title: 'Breaking: Nairobi Rally Confirmed',
      message: '10,000+ expected attendees - markets volatile',
      timestamp: '2 minutes ago',
      urgency: 'high',
      quickAction: 'BET ON OUTCOME'
    },
    {
      id: 2, 
      type: 'breaking_news',
      title: 'Media Coverage Surge',
      message: 'Social media mentions up 300% in last hour',
      timestamp: '8 minutes ago',
      urgency: 'medium',
      quickAction: 'VIEW IMPACT'
    },
    {
      id: 3,
      type: 'opposition_activity', 
      title: 'Opponent Campaign Activity Detected',
      message: 'Private fundraiser scheduled - unknown impact',
      timestamp: '15 minutes ago',
      urgency: 'medium',
      quickAction: 'MONITOR'
    }
  ])
  const [liveConnectionStatus, setLiveConnectionStatus] = useState('connected')

  useEffect(() => {
    if (socket) {
      // 🎭 CAMPAIGN FOMO GENERATORS
      socket.on('campaign_event', (data) => {
        const newEvent = {
          id: Date.now(),
          type: data.type || 'campaign_spike',
          title: data.title || 'Political Event Detected',
          message: data.message,
          timestamp: 'Just now',
          urgency: data.urgency || 'high',
          quickAction: 'PLACE BET'
        }
        
        setCampaignEvents(prev => [newEvent, ...prev.slice(0, 4)]) // Keep latest 5 events
      })

      // ⚡ LIVE STATUS UPDATES
      socket.on('connection_status', (status) => {
        setLiveConnectionStatus(status)
      })
    }
  }, [socket])

  const getUrgencyColor = (urgency: string) => {
    switch(urgency) {
      case 'high': return 'bg-red-50 text-red-900 border-red-200'
      case 'medium': return 'bg-yellow-50 text-yellow-900 border-yellow-200'
      default: return 'bg-blue-50 text-blue-900 border-blue-200'
    }
  }

  const getUrgencyDot = (urgency: string) => {
    switch(urgency) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      default: return 'bg-blue-500'
    }
  }

  const handleQuickAction = (event: any) => {
    // 🎯 TRIGGER IMMEDIATE BETTING FLOW
    if (event.quickAction === 'PLACE BET' && socket) {
      socket.requestRivalActivity()
      socket.requestLeaderboard()
    }
  }

  return (
    <div className="bg-white rounded-lg border">
      {/* 🎯 HEADER */}
      <div className="px-6 py-4 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Campaign Intelligence</h2>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full animate-pulse ${
              liveConnectionStatus === 'connected' ? 'bg-green-500' : 'bg-yellow-500'
            }`}></div>
            <span className="text-sm text-gray-600">
              {liveConnectionStatus === 'connected' ? 'Live' : 'Connecting...'}
            </span>
          </div>
        </div>
      </div>

      {/* 📊 EVENT FEED */}
      <div className="p-6 space-y-3 max-h-96 overflow-y-auto">
        {campaignEvents.map((event) => (
          <div 
            key={event.id}
            className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${getUrgencyColor(event.urgency)}`}
            onClick={() => handleQuickAction(event)}
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${getUrgencyDot(event.urgency)}`}></div>
                <h3 className="font-medium text-sm">{event.title}</h3>
                <span className={`text-xs px-2 py-0.5 rounded ${
                  event.urgency === 'high' ? 'bg-red-100 text-red-700' :
                  event.urgency === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {event.urgency.toUpperCase()}
                </span>
              </div>
              <button className="text-xs font-medium hover:underline">
                {event.quickAction}
              </button>
            </div>
            
            <p className="text-sm mb-2">{event.message}</p>
            
            <div className="flex justify-between items-center">
              <span className="text-xs opacity-75">{event.timestamp}</span>
              <div className="flex space-x-2">
                <button className="text-xs font-medium hover:underline">View Impact</button>
                <button className="text-xs font-medium hover:underline">Place Bet</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 🎯 FOOTER - URGENT ACTION BAR */}
      <div className="px-6 py-4 bg-gray-50 border-t">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Campaign events create betting opportunities - act fast for best odds
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-all">
            View All Events
          </button>
        </div>
      </div>
    </div>
  )
}
