/**
 * Market Routes
 * 
 * Handles market creation, listing, and management
 */

import { Router, Request, Response, NextFunction } from 'express';
import { MarketEngine, MarketCategory, MarketStatus } from '../services/marketEngine';
import { AuthService } from '../services/authService';
import winston from 'winston';

const logger = winston.getLogger();
const router = Router();

// Initialize services
const authService = new AuthService();
const marketEngine = new MarketEngine();

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
 * Create new market
 * POST /api/markets
 */
router.post('/', verifyToken, (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { question, description, category, resolutionDate, imageUrl, tags } = req.body;

    // Validation
    if (!question || !category || !resolutionDate) {
      return res.status(400).json({ error: 'Question, category, and resolution date are required' });
    }

    // Create market
    const market = marketEngine.createMarket({
      question,
      description,
      category: category as MarketCategory,
      creatorId: userId,
      resolutionDate: new Date(resolutionDate),
      imageUrl,
      tags
    });

    logger.info('Market created', {
      marketId: market.id,
      creator: userId,
      question
    });

    res.status(201).json({
      id: market.id,
      question: market.question,
      description: market.description,
      category: market.category,
      status: market.status,
      yesOdds: market.yesOdds,
      noOdds: market.noOdds,
      resolutionDate: market.resolutionDate,
      createdAt: market.createdAt
    });
  } catch (error: any) {
    logger.error('Market creation failed', { error: error.message });
    res.status(400).json({ error: error.message });
  }
});

/**
 * Get all markets
 * GET /api/markets
 */
router.get('/', (req: Request, res: Response) => {
  try {
    const { status, category, search } = req.query;

    let markets = marketEngine.getAllMarkets({
      status: status as MarketStatus,
      category: category as MarketCategory
    });

    // Search if provided
    if (search) {
      markets = marketEngine.searchMarkets(search as string);
    }

    res.json({
      markets: markets.map(m => ({
        id: m.id,
        question: m.question,
        description: m.description,
        category: m.category,
        status: m.status,
        yesOdds: m.yesOdds,
        noOdds: m.noOdds,
        totalVolume: m.totalVolume,
        resolutionDate: m.resolutionDate,
        createdAt: m.createdAt,
        imageUrl: m.imageUrl
      }))
    });
  } catch (error: any) {
    logger.error('Failed to get markets', { error: error.message });
    res.status(500).json({ error: 'Failed to get markets' });
  }
});

/**
 * Get market by ID
 * GET /api/markets/:marketId
 */
router.get('/:marketId', (req: Request, res: Response) => {
  try {
    const { marketId } = req.params;

    const market = marketEngine.getMarket(marketId);

    if (!market) {
      return res.status(404).json({ error: 'Market not found' });
    }

    res.json({
      id: market.id,
      question: market.question,
      description: market.description,
      category: market.category,
      status: market.status,
      creatorId: market.creatorId,
      yesOdds: market.yesOdds,
      noOdds: market.noOdds,
      totalVolume: market.totalVolume,
      yesVolume: market.yesVolume,
      noVolume: market.noVolume,
      resolutionDate: market.resolutionDate,
      outcome: market.outcome,
      createdAt: market.createdAt,
      resolvedAt: market.resolvedAt,
      imageUrl: market.imageUrl,
      tags: market.tags
    });
  } catch (error: any) {
    logger.error('Failed to get market', { error: error.message });
    res.status(500).json({ error: 'Failed to get market' });
  }
});

/**
 * Get trending markets
 * GET /api/markets/trending
 */
router.get('/trending/markets', (req: Request, res: Response) => {
  try {
    const { limit } = req.query;
    const markets = marketEngine.getTrendingMarkets(parseInt(limit as string) || 10);

    res.json({
      markets: markets.map(m => ({
        id: m.id,
        question: m.question,
        category: m.category,
        status: m.status,
        yesOdds: m.yesOdds,
        noOdds: m.noOdds,
        totalVolume: m.totalVolume,
        resolutionDate: m.resolutionDate,
        imageUrl: m.imageUrl
      }))
    });
  } catch (error: any) {
    logger.error('Failed to get trending markets', { error: error.message });
    res.status(500).json({ error: 'Failed to get trending markets' });
  }
});

/**
 * Get markets closing soon
 * GET /api/markets/closing
 */
router.get('/closing/markets', (req: Request, res: Response) => {
  try {
    const { hours } = req.query;
    const markets = marketEngine.getClosingMarkets(parseInt(hours as string) || 24);

    res.json({
      markets: markets.map(m => ({
        id: m.id,
        question: m.question,
        category: m.category,
        yesOdds: m.yesOdds,
        noOdds: m.noOdds,
        resolutionDate: m.resolutionDate,
        hoursUntilClose: Math.round((m.resolutionDate.getTime() - Date.now()) / 3600000)
      }))
    });
  } catch (error: any) {
    logger.error('Failed to get closing markets', { error: error.message });
    res.status(500).json({ error: 'Failed to get closing markets' });
  }
});

/**
 * Get markets by category
 * GET /api/markets/category/:category
 */
router.get('/category/:category', (req: Request, res: Response) => {
  try {
    const { category } = req.params;
    const markets = marketEngine.getMarketsByCategory(category as MarketCategory);

    res.json({
      markets: markets.map(m => ({
        id: m.id,
        question: m.question,
        status: m.status,
        yesOdds: m.yesOdds,
        noOdds: m.noOdds,
        totalVolume: m.totalVolume,
        resolutionDate: m.resolutionDate,
        imageUrl: m.imageUrl
      }))
    });
  } catch (error: any) {
    logger.error('Failed to get markets by category', { error: error.message });
    res.status(500).json({ error: 'Failed to get markets by category' });
  }
});

/**
 * Get user's created markets
 * GET /api/markets/user/:userId
 */
router.get('/user/:userId', (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const markets = marketEngine.getMarketsByCreator(userId);

    res.json({
      markets: markets.map(m => ({
        id: m.id,
        question: m.question,
        status: m.status,
        yesOdds: m.yesOdds,
        noOdds: m.noOdds,
        totalVolume: m.totalVolume,
        resolutionDate: m.resolutionDate
      }))
    });
  } catch (error: any) {
    logger.error('Failed to get user markets', { error: error.message });
    res.status(500).json({ error: 'Failed to get user markets' });
  }
});

export default router;
