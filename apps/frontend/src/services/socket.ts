// 🧠 SOCKET.IO PSYCHOLOGICAL WARFARE SERVICE
// Real-time anxiety delivery to politicians
import { io } from 'socket.io-client'
import toast from 'react-hot-toast'

interface PsychologicalEvent {
  type: 'rival_bet' | 'decay_warning' | 'leaderboard_shift' | 'match_result' | 'campaign_spike'
  message: string
  urgency: 'low' | 'medium' | 'high' | 'critical'
  quickActions: string[]
  data: any
}

interface PoliticianProfile {
  id: string
  name: string
  position: string
  availableKes: number
}

class PsychologicalWarfareSocket {
  private socket: any
  private politicianId: string = ''
  private isConnected: boolean = false
  private reconnectAttempts: number = 0
  private maxReconnectAttempts: number = 5

  constructor() {
    this.initializeConnection()
  }

  private initializeConnection() {
    try {
      // 🧠 CONNECT TO PSYCHOLOGICAL WARFARE ENGINE
      this.socket = io(process.env.
                    
                        ƒ
                        VITE SERVER URL
                    
                 || 'http://localhost:3001', {
        transports: ['websocket', 'polling'],
        timeout: 10000,
        forceNew: true
      })

      this.setupEventListeners()
      this.setupPsychologicalEventHandlers()
      
    } catch (error) {
      console.error('Socket connection failed:', error)
      this.handleReconnection()
    }
  }

  private setupEventListeners() {
    // 🔌 CONNECTION LIFECYCLE
    this.socket.on('connect', () => {
      console.log('💰 Connected to psychological warfare engine')
      this.isConnected = true
      this.reconnectAttempts = 0
      
      toast('Psychological warfare engine connected', {
        icon: '🧠',
        style: { backgroundColor: '#10b981' }
      })
    })

    this.socket.on('disconnect', () => {
      console.log('❌ Lost connection - revenue extraction paused')
      this.isConnected = false
      
      toast.error('Connection lost - attempting recovery...', {
        style: { backgroundColor: '#ef4444' }
      })
      
      this.handleReconnection()
    })

    this.socket.on('connect_error', (error: any) => {
      console.error('Connection error:', error)
      this.handleReconnection()
    })
  }

  private setupPsychologicalEventHandlers() {
    // ⚡ IMMEDIATE RIVAL ANXIETY TRIGGERS
    this.socket.on('rival_activity_update', (data) => {
      console.log('🔥 RIVAL ACTIVITY ALERT:', data)
      
      toast.error(data.message, {
        duration: 8000,
        position: 'top-center',
        style: { 
          backgroundColor: '#7f1d1d', 
          color: '#fff',
          border: '1px solid #ef4444',
          fontSize: '16px',
        }
      })
    })

    // ⏰ DECAY URGENCY TRIGGERS
    this.socket.on('boost_decay_alert', (data) => {
      console.log('⏰ BOOST DECAY WARNING:', data)
      
      toast.warning(data.message, {
        duration: 6000,
        position: 'top-center',
        style: { 
          backgroundColor: '#92400e', 
          color: '#fff',
          border: '1px solid #f59e0b'
        },
        icon: '⏰'
      })
    })

    // 📊 LEADERBOARD STATUS ANXIETY
    this.socket.on('leaderboard_pressure', (data) => {
      console.log('📊 STATUS PRESSURE TRIGGER:', data)
      
      toast.error(data.message, {
        duration: 7000,
        position: 'top-center',
        style: { 
          backgroundColor: '#7f1d1d', 
          color: '#fff',
          border: '1px solid #dc2626'
        },
        icon: '📉'
      })
    })

    // 🎭 CAMPAIGN EVENT FOMO GENERATION
    this.socket.on('campaign_event', (data) => {
      console.log('🎭 CAMPAIGN FOMO TRIGGER:', data)
      
      toast.success(data.message, {
        duration: 5000,
        position: 'bottom-center',
        style: { 
          backgroundColor: '#064e3b', 
          color: '#fff',
          border: '1px solid #10b981'
        },
        icon: '🔥'
      })
    })

    // 💰 BET RESULT NOTIFICATIONS - INSTANT GRATIFICATION/ANXIETY
    this.socket.on('bet_result', (data) => {
      console.log('💰 BET RESULT TRIGGER:', data)
      
      if (data.won) {
        toast.success(`🎉 BET WON! KES ${data.winnings} credited to your account!`, {
          duration: 10000,
          position: 'top-center',
          style: { 
            backgroundColor: '#065f46', 
            color: '#fff',
            border: '1px solid #10b981',
            fontSize: '18px'
          },
          icon: '🎯'
        })
      } else {
        toast.error(`💸 BET LOST! KES ${data.loss} - Rivals gaining ground!`, {
          duration: 8000,
          position: 'top-center',
          style: { 
            backgroundColor: '#7f1d1d', 
            color: '#fff',
            border: '1px solid #ef4444',
            fontSize: '16px'
          },
          icon: '😤'
        })
      }
    })

    // 🎯 CONNECTION CONFIRMATION
    this.socket.on('connection_confirmed', (data) => {
      console.log('✅ Psychological warfare access confirmed:', data)
      
      toast.success('Political anxiety dashboard fully activated!', {
        position: 'bottom-center',
        style: { backgroundColor: '#064e3b' },
        icon: '🧠'
      })
      
      // 🚀 REQUEST INITIAL PSYCHOLOGICAL PRESSURE DATA
      this.requestInitialData()
    })
  }

  private handleReconnection() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      
      console.log(`🔄 Reconnection attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`)
      
      setTimeout(() => {
        this.initializeConnection()
      }, Math.pow(2, this.reconnectAttempts) * 1000) // Exponential backoff
    } else {
      console.error('❌ Max reconnection attempts reached')
      toast.error('Unable to connect to political warfare engine', {
        style: { backgroundColor: '#7f1d1d' }
      })
    }
  }

  // 🎯 POLITICIAN AUTHENTICATION
  authenticatePolitician(politicianId: string, token: string) {
    this.politicianId = politicianId
    
    this.socket.emit('authenticate_politician', {
      politicianId,
      token
    })
  }

  // 🚀 REQUEST INITIAL PSYCHOLOGICAL DATA
  private requestInitialData() {
    // Request rival activity to start competitive anxiety
    this.socket.emit('request_rival_activity', this.politicianId)
    
    // Check boost timers to initiate decay anxiety
    this.socket.emit('check_boost_timer', this.politicianId)
  }

  // 💰 PLACE BET - REVENUE EXTRACTION
  placeBet(marketId: string, outcome: 'YES' | 'NO', amount: number, mPesaNumber: string) {
    this.socket.emit('place_bet', {
      marketId,
      outcome,
      amount,
      mPesaNumber,
      politicianId: this.politicianId
    })
  }

  // ⚡ REQUEST RIVAL ACTIVITY - DRIVE COMPETITIVE SPENDING
  requestRivalActivity() {
    this.socket.emit('request_rival_activity', this.politicianId)
  }

  // 📈 REQUEST LEADERBOARD DATA - STATUS ANXIETY
  requestLeaderboard() {
    this.socket.emit('request_leaderboard', {
      politicianId: this.politicianId
    })
  }

  // ⏰ CHECK BOOST TIMERS - DECAY URGENCY
  checkBoostTimers() {
    this.socket.emit('check_boost_timer', this.politicianId)
  }

  // 💎 PURCHASE BOOST PACKAGE - INSTANT KES SPENDING
  purchaseBoost(boostType: string, amount: number) {
    this.socket.emit('purchase_boost', {
      boostType,
      amount,
      politicianId: this.politicianId
    })
  }

  // ⚡ REAL-TIME EVENT SUBSCRIPTIONS
  subscribeToPoliticianUpdates(politicianId: string) {
    this.socket.emit('subscribe_to_updates', { politicianId })
  }

  // 🔌 CONNECTION STATUS
  isSocketConnected(): boolean {
    return this.isConnected
  }

  // 🎯 CLEANUP
  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.isConnected = false
    }
  }
}

// 🧠 GLOBAL PSYCHOLOGICAL WARFARE INSTANCE
export const psychologicalSocket = new PsychologicalWarfareSocket()

// 🚀 EXPORT SOCKET INSTANCE FOR COMPONENT USE
export default psychologicalSocket
