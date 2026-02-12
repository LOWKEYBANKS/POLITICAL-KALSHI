/**
 * Political-Kalshi Backend Server
 * 
 * Enterprise-grade prediction market API with real-time trading,
 * M-Pesa payments, and transparent order matching.
 * 
 * Designed for 30M+ daily users with 99.99% uptime.
 */

import express, { Express, Request, Response, NextFunction } from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import winston from 'winston';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/auth.routes';
import marketRoutes from './routes/market.routes';
import paymentRoutes from './routes/payment.routes';

// Load environment variables
dotenv.config();

// ============================================================================
// LOGGER SETUP
// ============================================================================

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'political-kalshi-api' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
          return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''}`;
        })
      )
    })
  ]
});

// ============================================================================
// RATE LIMITING
// ============================================================================

const rateLimiter = new RateLimiterMemory({
  points: 100, // 100 requests
  duration: 60 // per 60 seconds
});

const authRateLimiter = new RateLimiterMemory({
  points: 5, // 5 attempts
  duration: 900 // per 15 minutes
});

// ============================================================================
// EXPRESS APP SETUP
// ============================================================================

const app: Express = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['websocket', 'polling']
});

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ limit: '10kb', extended: true }));

// Request logging
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.path}`, {
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip
    });
  });
  next();
});

// Rate limiting middleware
app.use(async (req: Request, res: Response, next: NextFunction) => {
  try {
    await rateLimiter.consume(req.ip!);
    next();
  } catch (err) {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({ error: 'Too many requests, please try again later' });
  }
});

// ============================================================================
// HEALTH CHECK & VERSION
// ============================================================================

app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/api/version', (req: Request, res: Response) => {
  res.json({
    version: '1.0.0',
    api: 'v1',
    timestamp: new Date().toISOString()
  });
});

// ============================================================================
// REGISTER ROUTES
// ============================================================================

app.use('/api/auth', authRoutes);
app.use('/api/markets', marketRoutes);
app.use('/api/payments', paymentRoutes);

// ============================================================================
// WEBSOCKET SETUP
// ============================================================================

io.on('connection', (socket) => {
  logger.info(`User connected: ${socket.id}`);

  // Subscribe to market updates
  socket.on('subscribe_market', (data: { market_id: string }) => {
    socket.join(`market:${data.market_id}`);
    logger.debug(`User subscribed to market: ${data.market_id}`);
  });

  // Unsubscribe from market
  socket.on('unsubscribe_market', (data: { market_id: string }) => {
    socket.leave(`market:${data.market_id}`);
  });

  // Place order
  socket.on('place_order', (data: any) => {
    logger.debug('Order placement requested', { data });
  });

  // Cancel order
  socket.on('cancel_order', (data: { order_id: string }) => {
    logger.debug('Order cancellation requested', { data });
  });

  // Disconnect
  socket.on('disconnect', () => {
    logger.info(`User disconnected: ${socket.id}`);
  });
});

// ============================================================================
// ERROR HANDLING
// ============================================================================

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    path: req.path,
    method: req.method
  });
});

// Global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal Server Error' 
      : err.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

// ============================================================================
// SERVER STARTUP
// ============================================================================

const PORT = parseInt(process.env.PORT || '3001', 10);
const HOST = process.env.HOST || '0.0.0.0';

httpServer.listen(PORT, HOST, () => {
  logger.info(`🚀 Political-Kalshi API Server running`, {
    port: PORT,
    host: HOST,
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  httpServer.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  httpServer.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

export { app, httpServer, io, logger };
