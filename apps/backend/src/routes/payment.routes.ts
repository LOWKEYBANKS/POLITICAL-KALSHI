/**
 * Payment Routes
 * 
 * Handles M-Pesa deposits, withdrawals, and callbacks
 */

import { Router, Request, Response, NextFunction } from 'express';
import { MPesaService, PaymentType } from '../services/mpesaService';
import { AuthService } from '../services/authService';
import winston from 'winston';

const logger = winston.getLogger();
const router = Router();

// Initialize services
const authService = new AuthService();
const mpesaService = new MPesaService({
  consumerKey: process.env.MPESA_CONSUMER_KEY || '',
  consumerSecret: process.env.MPESA_CONSUMER_SECRET || '',
  shortCode: process.env.MPESA_SHORTCODE || '',
  passkey: process.env.MPESA_PASSKEY || '',
  environment: (process.env.MPESA_ENV || 'sandbox') as 'sandbox' | 'production'
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
 * Initiate M-Pesa deposit
 * POST /api/payments/deposit
 */
router.post('/deposit', verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { phoneNumber, amount } = req.body;

    // Validation
    if (!phoneNumber || !amount) {
      return res.status(400).json({ error: 'Phone number and amount are required' });
    }

    if (amount < 10) {
      return res.status(400).json({ error: 'Minimum deposit amount is KES 10' });
    }

    if (amount > 150000) {
      return res.status(400).json({ error: 'Maximum deposit amount is KES 150,000' });
    }

    // Initiate STK push
    const payment = await mpesaService.initiateSTKPush({
      userId,
      phoneNumber,
      amount,
      type: PaymentType.DEPOSIT
    });

    logger.info('Deposit initiated', {
      paymentId: payment.id,
      userId,
      amount
    });

    res.json({
      paymentId: payment.id,
      status: payment.status,
      message: 'M-Pesa prompt sent to your phone. Please enter your PIN to complete the transaction.',
      amount
    });
  } catch (error: any) {
    logger.error('Deposit initiation failed', { error: error.message });
    res.status(400).json({ error: error.message });
  }
});

/**
 * M-Pesa callback handler
 * POST /api/payments/callback
 */
router.post('/callback', async (req: Request, res: Response) => {
  try {
    logger.debug('M-Pesa callback received', { body: req.body });

    // Handle callback
    const payment = await mpesaService.handleCallback(req.body);

    // Update user balance if deposit was successful
    if (payment.type === PaymentType.DEPOSIT && payment.status === 'COMPLETED') {
      const user = authService.getUser(payment.userId);
      if (user) {
        authService.updateBalance(payment.userId, payment.amount);
        logger.info('User balance updated', {
          userId: payment.userId,
          amount: payment.amount,
          newBalance: user.balanceKES + payment.amount
        });
      }
    }

    // Return success to M-Pesa
    res.json({
      ResultCode: 0,
      ResultDesc: 'Callback processed successfully'
    });
  } catch (error: any) {
    logger.error('Callback processing failed', { error: error.message });
    res.status(400).json({
      ResultCode: 1,
      ResultDesc: 'Callback processing failed'
    });
  }
});

/**
 * Get payment status
 * GET /api/payments/:paymentId
 */
router.get('/:paymentId', verifyToken, (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { paymentId } = req.params;

    const payment = mpesaService.getPayment(paymentId);

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    // Verify user owns this payment
    if (payment.userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.json({
      id: payment.id,
      status: payment.status,
      type: payment.type,
      amount: payment.amount,
      phoneNumber: payment.phoneNumber,
      mpesaReceiptNumber: payment.mpesaReceiptNumber,
      createdAt: payment.createdAt,
      completedAt: payment.completedAt
    });
  } catch (error: any) {
    logger.error('Failed to get payment status', { error: error.message });
    res.status(500).json({ error: 'Failed to get payment status' });
  }
});

/**
 * Get user's payments
 * GET /api/payments
 */
router.get('/', verifyToken, (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { type, status } = req.query;

    let payments = mpesaService.getUserPayments(userId);

    // Filter by type if provided
    if (type) {
      payments = payments.filter(p => p.type === type);
    }

    // Filter by status if provided
    if (status) {
      payments = payments.filter(p => p.status === status);
    }

    res.json({
      payments: payments.map(p => ({
        id: p.id,
        status: p.status,
        type: p.type,
        amount: p.amount,
        mpesaReceiptNumber: p.mpesaReceiptNumber,
        createdAt: p.createdAt,
        completedAt: p.completedAt
      }))
    });
  } catch (error: any) {
    logger.error('Failed to get payments', { error: error.message });
    res.status(500).json({ error: 'Failed to get payments' });
  }
});

/**
 * Initiate withdrawal
 * POST /api/payments/withdraw
 */
router.post('/withdraw', verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { phoneNumber, amount } = req.body;

    // Validation
    if (!phoneNumber || !amount) {
      return res.status(400).json({ error: 'Phone number and amount are required' });
    }

    // Check user balance
    const user = authService.getUser(userId);
    if (!user || user.balanceKES < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Initiate withdrawal
    const payment = await mpesaService.initiateWithdrawal({
      userId,
      phoneNumber,
      amount
    });

    // Deduct from balance
    authService.updateBalance(userId, -amount);

    logger.info('Withdrawal initiated', {
      paymentId: payment.id,
      userId,
      amount
    });

    res.json({
      paymentId: payment.id,
      status: payment.status,
      message: 'Withdrawal initiated. You will receive the funds shortly.',
      amount
    });
  } catch (error: any) {
    logger.error('Withdrawal initiation failed', { error: error.message });
    res.status(400).json({ error: error.message });
  }
});

/**
 * Get transaction summary (admin)
 * GET /api/payments/summary
 */
router.get('/admin/summary', verifyToken, (req: Request, res: Response) => {
  try {
    // TODO: Verify user is admin
    const summary = mpesaService.getTransactionSummary();

    res.json(summary);
  } catch (error: any) {
    logger.error('Failed to get transaction summary', { error: error.message });
    res.status(500).json({ error: 'Failed to get transaction summary' });
  }
});

export default router;
