/**
 * Authentication Routes
 * 
 * Handles user registration, login, KYC, and token management
 */

import { Router, Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import winston from 'winston';

const logger = winston.getLogger();
const router = Router();

// Initialize auth service
const authService = new AuthService();

// Rate limiters
const loginLimiter = new RateLimiterMemory({
  points: 5,
  duration: 900 // 15 minutes
});

// ============================================================================
// MIDDLEWARE
// ============================================================================

// Verify JWT token
const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const payload = authService.verifyToken(token);
    (req as any).user = payload;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// ============================================================================
// ROUTES
// ============================================================================

/**
 * Register new user
 * POST /api/auth/register
 */
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { phoneNumber, password, name, email, isPolitician, politicianPosition, politicianParty } = req.body;

    // Validation
    if (!phoneNumber || !password || !name) {
      return res.status(400).json({ error: 'Phone number, password, and name are required' });
    }

    // Register user
    const { user, tokens } = await authService.register({
      phoneNumber,
      password,
      name,
      email,
      isPolitician,
      politicianPosition,
      politicianParty
    });

    logger.info('User registered successfully', { userId: user.id });

    res.status(201).json({
      user: {
        id: user.id,
        phoneNumber: user.phoneNumber,
        name: user.name,
        role: user.role,
        kycStatus: user.kycStatus,
        balanceKES: user.balanceKES
      },
      tokens
    });
  } catch (error: any) {
    logger.error('Registration failed', { error: error.message });
    res.status(400).json({ error: error.message });
  }
});

/**
 * Login user
 * POST /api/auth/login
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { phoneNumber, password } = req.body;
    const ip = req.ip;

    // Rate limiting
    try {
      await loginLimiter.consume(ip!);
    } catch (error) {
      logger.warn('Login rate limit exceeded', { ip });
      return res.status(429).json({ error: 'Too many login attempts. Please try again later.' });
    }

    // Validation
    if (!phoneNumber || !password) {
      return res.status(400).json({ error: 'Phone number and password are required' });
    }

    // Login user
    const { user, tokens } = await authService.login(phoneNumber, password);

    logger.info('User logged in successfully', { userId: user.id });

    res.json({
      user: {
        id: user.id,
        phoneNumber: user.phoneNumber,
        name: user.name,
        role: user.role,
        kycStatus: user.kycStatus,
        isPolitician: user.isPolitician,
        balanceKES: user.balanceKES
      },
      tokens
    });
  } catch (error: any) {
    logger.warn('Login failed', { error: error.message });
    res.status(401).json({ error: error.message });
  }
});

/**
 * Refresh access token
 * POST /api/auth/refresh
 */
router.post('/refresh', (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token is required' });
    }

    const tokens = authService.refreshAccessToken(refreshToken);

    res.json({ tokens });
  } catch (error: any) {
    logger.warn('Token refresh failed', { error: error.message });
    res.status(401).json({ error: error.message });
  }
});

/**
 * Get user profile
 * GET /api/auth/profile
 */
router.get('/profile', verifyToken, (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const user = authService.getUser(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      phoneNumber: user.phoneNumber,
      email: user.email,
      name: user.name,
      role: user.role,
      kycStatus: user.kycStatus,
      isPolitician: user.isPolitician,
      politicianPosition: user.politicianPosition,
      politicianParty: user.politicianParty,
      balanceKES: user.balanceKES,
      createdAt: user.createdAt
    });
  } catch (error: any) {
    logger.error('Failed to get profile', { error: error.message });
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

/**
 * Submit KYC verification
 * POST /api/auth/kyc
 */
router.post('/kyc', verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { documentUrl } = req.body;

    if (!documentUrl) {
      return res.status(400).json({ error: 'Document URL is required' });
    }

    const user = await authService.submitKYC(userId, documentUrl);

    logger.info('KYC submitted', { userId });

    res.json({
      message: 'KYC submitted successfully. Please wait for verification.',
      kycStatus: user.kycStatus
    });
  } catch (error: any) {
    logger.error('KYC submission failed', { error: error.message });
    res.status(400).json({ error: error.message });
  }
});

/**
 * Change password
 * POST /api/auth/change-password
 */
router.post('/change-password', verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: 'Old and new passwords are required' });
    }

    await authService.changePassword(userId, oldPassword, newPassword);

    logger.info('Password changed', { userId });

    res.json({ message: 'Password changed successfully' });
  } catch (error: any) {
    logger.error('Password change failed', { error: error.message });
    res.status(400).json({ error: error.message });
  }
});

/**
 * Logout
 * POST /api/auth/logout
 */
router.post('/logout', verifyToken, (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      authService.logout(refreshToken);
    }

    logger.info('User logged out');

    res.json({ message: 'Logged out successfully' });
  } catch (error: any) {
    logger.error('Logout failed', { error: error.message });
    res.status(400).json({ error: error.message });
  }
});

export default router;
