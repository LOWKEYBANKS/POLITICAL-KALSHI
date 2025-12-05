// 🧠 POLITICAL KALSHI - PSYCHOLOGICAL WARFARE WEBSOCKET ENGINE
// Real-time anxiety delivery system for maximum political exploitation

import express from 'express';
import { Server as SocketIOServer } from 'socket.io';
import { createServer } from 'http';
import cors from 'cors';
import { DataSimulator } from './services/dataSimulator';
import { OrderMatcher } from './services/orderMatcher';
import { MarketResolver } from './services/marketResolver';

// Add these imports to the top of apps/backend/src/server.ts
import eliteRoutes from './app/routes/elite.routes';
import underdogRoutes from './app/routes/underdog.routes';

// Then AFTER app.use(cors()) and BEFORE the health check endpoint, add:

// ✅ ELITE PROFILING APIs - Zero signup for established politicians
app.use('/api/elite', eliteRoutes);

// ✅ UNDERDOG REGISTRATION APIs - Signups for aspiring politicians  
app.use('/api/underdog', underdogRoutes);

// Test routes
app.get('/api/elite/test', (req, res) => {
  res.json({ status: 'Elite profiling API ready', message: 'Zero signup experience operational' });
});

app.get('/api/underdog/test', (req, res) => {
  res.json({ status: 'Underdog registration API ready', message: 'Growth-focused signup operational' });
});

interface PoliticianSession {
  id: string;
  politicianId: string;
  connectionTime: Date;
  lastActivity: Date;
  isConnected: boolean;
  psychologicalProfile: {
    anxietyLevel: number; // 1-10 scale
    rivalSensitivity: number; // How quickly they respond to rival activity
    decayPanic: number; // How they react to boost decay
  };
}

interface PsychologicalEvent {
  type: 'rival_bet' | 'decay_warning' | 'leaderboard_shift' | 'match_result' | 'campaign_spike';
  targetPolitician: string;
  message: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  quickActions: string[];
  data: any;
}

class PsychologicalWarfareServer {
  private io: SocketIOServer;
  private connectedPoliticians: Map<string, PoliticianSession> = new Map();
  private pressureQueue: PsychologicalEvent[] = [];
  private activeCampaignIntensity = 1.0;
  
  // Integration with existing services
  private dataSimulator = new DataSimulator();
  private orderMatcher = new OrderMatcher();
  private marketResolver = new MarketResolver();

  constructor(server: any) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: ["http://localhost:3000", "https://your-political-platform.com"],
        methods: ["GET", "POST"]
      }
    });

    this.initializePsychologicalEngines();
  }

  // 🔥 CORE PSYCHOLOGICAL WARFARE SYSTEMS
  private initializePsychologicalEngines() {
    console.log('🧠 Initializing Political Anxiety Engine...');
    
    this.io.on('connection', (socket) => {
      console.log('💰 Politician connected:', socket.id);
      this.handlePoliticianConnection(socket);
    });

    // Schedule psychological triggers
    this.startDecayTimerPressure();
    this.startLeaderboardMonitoring();
    this.startCampaignEventTriggers();
  }

  // 🎯 POLITICIAN CONNECTION HANDLING
  private handlePoliticianConnection(socket: any) {
    // Politician authentication will happen here
    socket.on('authenticate_politician', (data: {politicianId: string, token: string}) => {
      const politicianSession: PoliticianSession = {
        id: socket.id,
        politicianId: data.politicianId,
        connectionTime: new Date(),
        lastActivity: new Date(),
        isConnected: true,
        psychologicalProfile: this.generatePsychologicalProfile(data.politicianId)
      };

      this.connectedPoliticians.set(socket.id, politicianSession);
      
      console.log(`🎯 Politician ${data.politicianId} authenticated and ready for psychological targeting`);
      
      // Send immediate psychological pressure
      this.sendImmediatePoliticalPressure(socket.id, data.politicianId);
      
      socket.emit('connection_confirmed', {
        status: 'ready_for_anxiety',
        politicianId: data.politicianId,
        sessionId: socket.id
      });
    });

    // Handle politician disconnection
    socket.on('disconnect', () => {
      console.log('❌ Politician disconnected - lost revenue source');
      this.connectedPoliticians.delete(socket.id);
    });

    // Handle psychological event requests (politicians asking for more anxiety)
    socket.on('request_rival_activity', (politicianId: string) => {
      this.sendLatestRivalActivity(socket.id, politicianId);
    });

    socket.on('check_boost_timer', (politicianId: string) => {
      this.sendBoostDecayPressure(socket.id, politicianId);
    });
  }

  // 🧠 PSYCHOLOGICAL PROFILING SYSTEM
  private generatePsychologicalProfile(politicianId: string): PoliticianSession['psychologicalProfile'] {
    // Generate realistic but fake psychological traits for targeted anxiety
    return {
      anxietyLevel: Math.floor(Math.random() * 5) + 6, // 6-10 (high anxiety)
      rivalSensitivity: Math.floor(Math.random() * 4) + 7, // 7-10 (very sensitive to rivals)
      decayPanic: Math.floor(Math.random() * 3) + 8  // 8-10 (panics about decay)
    };
  }

  // 🔥 IMMEDIATE POLITICAL PRESSURE DELIVERY
  private sendImmediatePoliticalPressure(socketId: string, politicianId: string) {
    const session = this.connectedPoliticians.get(socketId);
    if (!session) return;

    const io = this.io;
    const socket = io.sockets.sockets.get(socketId);
    
    // 1. Send rival activity status
    socket.emit('rival_activity_update', {
      message: '💼 Your main rival just placed a KES 50,000 bet against you',
      urgency: 'high',
      quickActions: ['place_counter_bet', 'view_rival_details', 'ignore_with_cost'],
      data: {
        rivalId: 'rival_politician_123', 
        betAmount: 50000,
        timeAgo: '2 minutes ago',
        psychologicalImpact: 'critical'
      }
    });

    // 2. Send boost decay warning
    socket.emit('boost_decay_alert', {
      message: '⏰ Your boost expires in 4 hours - rivals are gaining!',
      urgency: 'medium',
      quickActions: ['extend_boost', 'purchase_new_boost', 'accept_decay'],
      data: {
        hoursRemaining: 4.2,
        currentBoost: '+15%',
        decayRate: '5% per hour after expiry',
        psychologicalPressure: 'decay_anxiety'
      }
    });

    // 3. Send leaderboard shift warning
    socket.emit('leaderboard_pressure', {
      message: '📉 You dropped 2 positions in past hour - rivals are active!',
      urgency: 'high',
      quickActions: ['analyze_losses', 'place_big_bet', 'buy_boost_package'],
      data: {
        currentPosition: 7,
        dropCount: 2,
        rivalsAboveCount: 6,
        timeFrame: 'last_hour',
        psychologicalTactic: 'status_anxiety'
      }
    });
  }

  // ⚡ RIVAL ACTIVITY MONITORING
  private sendLatestRivalActivity(socketId: string, politicianId: string) {
    const socket = this.io.sockets.sockets.get(socketId);
    if (!socket) return;

    // Simulate recent rival activity (in production, come from databases)
    const rivalActivities = [
      {
        rivalName: 'Opponent Candidate X',
        action: 'Placed KES 75,000 YES bet on debate performance',
        urgency: 'critical',
        timeAgo: '8 minutes ago',
        psychologicalImpact: 'rival_dominance'
      },
      {
        rivalName: 'Competitor Y', 
        action: 'Bought 30% boost - gaining traction',
        urgency: 'high',
        timeAgo: '1 hour ago', 
        psychologicalImpact: 'boost_pressure'
      }
    ];

    socket.emit('rival_activity_feed', {
      activities: rivalActivities,
      message: '🔥 Rivals are actively spending - are you watching?',
      urgency: 'high')
  }

  // ⏱️ BOOST DECAY PRESSURE SYSTEM
  private sendBoostDecayPressure(socketId: string, politicianId: string) {
    const socket = this.io.sockets.sockets.get(socketId);
    if (!socket) return;

    socket.emit('boost_timer_update', {
      message: '⚠️ Your boosts are expiring - political relevance at risk!',
      boostDetails: {
        primaryBoost: {
          expiryHours: 3.8,
          currentValue: '+12%',
          decayRate: 5
        },
        secondaryBoost: {
          expiryHours: 1.2, 
          currentValue: '+5%',
          decayRate: 10
        }
      },
      urgency: 'medium',
      psychologicalTactic: 'scarcity_anxiety'
    });
  }

  // 🚀 DECAY TIMER PRESSURE SYSTEM
  private startDecayTimerPressure() {
    // Every minute, send decay pressure to all connected politicians
    setInterval(() => {
      this.connectedPoliticians.forEach((session, socketId) => {
        if (session.psychologicalProfile.decayPanic > 8) {
          const socket = this.io.sockets.sockets.get(socketId);
          if (socket) {
            socket.emit('decay_pressure', {
              message: '⏰ Your traction is decaying - rivals see your weakness!',
              urgency: 'medium',
              psychologicalImpact: 'decay_anxiety',
              data: {
                decayPercentage: Math.random() * 2 + 1, // 1-3% decay
                timeUntilExpiry: Math.floor(Math.random() * 6) + 2, // 2-8 hours
                rivalsGaining: Math.floor(Math.random() * 3) + 1
              }
            });
          }
        }
      });
    }, 60000); // Every minute = maximum anxiety frequency
  }

  // 📊 LEADERBOARD MONITORING SYSTEM
  private startLeaderboardMonitoring() {
    // Every 30 seconds, simulate leaderboard changes to create psychological pressure
    setInterval(() => {
      const positionChange = Math.floor(Math.random() * 5) - 2; // -2 to +2 positions
      const affectedPolitician = Array.from(this.connectedPoliticians.keys())[
        Math.floor(Math.random() * this.connectedPoliticians.size)
      ];

      if (affectedPolitician && positionChange !== 0) {
        const socket = this.io.sockets.sockets.get(affectedPolitician);
        if (socket) {
          socket.emit('leaderboard_shift', {
            message: positionChange > 0 ? 
              '📈 You gained traction - rivals will respond!' :
              '📉 You lost traction - opponents are capitalizing!',
            positionChange,
            newPosition: 'Unknown', // Would come from leaderboard service
            urgency: positionChange < -1 ? 'high' : 'medium',
            psychologicalTactic: 'status_anxiety'
          });
        }
      }
    }, 30000); // Every 30 seconds = optimal psychological pressure frequency
  }

  // 🎭 CAMPAIGN EVENT TRIGGERS
  private startCampaignEventTriggers() {
    // Simulate political events that create betting opportunities
    setInterval(() => {
      const eventTypes = [
        { type: 'debate_announced', message: '🎭 Debate announced - markets NOW OPEN!', urgency: 'high' },
        { type: 'scandal_breaking', message: '🔥 Breaking scandal - instant volatility!', urgency: 'critical' },
        { type: 'rally_planned', message: '📢 Rally tomorrow - traction boost available!', urgency: 'medium' }
      ];

      const randomEvent = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      
      // Send to all connected politicians
      this.connectedPoliticians.forEach((session, socketId) => {
        const socket = this.io.sockets.sockets.get(socketId);
        if (socket) {
          socket.emit('campaign_event', {
            ...randomEvent,
            quickActions: ['place_bet_on_event', 'buy_boost_early', 'ignore_opportunity'],
            psychologicalTactic: 'fear_of_missing_out'
          });
        }
      });
    }, 300000); // Every 5 minutes = steady campaign pressure
  }
}

// 🚀 EXPRESS SERVER SETUP
const app = express();
app.use(cors());
app.use(express.json());

const server = createServer(app);
const io = new SocketIOServer(server);

// Initialize psychological warfare engine
const psychologicalEngine = new PsychologicalWarfareServer(server);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'Psychological Warfare Engine Operational',
    politicianCount: psychologicalEngine['connectedPoliticians'].size,
    anxietyLevel: 'Maximum',
    revenueExtraction: 'Active'
  });
});

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🧠 Political Kalshi Psychological Warfare Server running on port ${PORT}`);
  console.log(`🎯 Ready to extract maximum political revenue and anxiety`);
});

export default psychologicalEngine;
