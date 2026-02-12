/**
 * M-Pesa Payment Service
 * 
 * Handles M-Pesa STK push, payment verification, and settlement
 */

import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import winston from 'winston';

const logger = winston.getLogger();

// ============================================================================
// TYPES
// ============================================================================

export enum PaymentStatus {
  INITIATED = 'INITIATED',
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED'
}

export enum PaymentType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL'
}

export interface Payment {
  id: string;
  userId: string;
  phoneNumber: string;
  amount: number;
  type: PaymentType;
  status: PaymentStatus;
  mpesaTransactionId?: string;
  mpesaReceiptNumber?: string;
  createdAt: Date;
  completedAt?: Date;
  metadata?: {
    checkoutRequestId?: string;
    resultCode?: string;
    resultDesc?: string;
  };
}

export interface MPesaConfig {
  consumerKey: string;
  consumerSecret: string;
  shortCode: string;
  passkey: string;
  environment: 'sandbox' | 'production';
}

// ============================================================================
// M-PESA SERVICE
// ============================================================================

export class MPesaService {
  private config: MPesaConfig;
  private payments: Map<string, Payment> = new Map();
  private accessToken?: string;
  private tokenExpiry?: Date;
  private baseUrl: string;

  constructor(config: MPesaConfig) {
    this.config = config;
    this.baseUrl = config.environment === 'sandbox'
      ? 'https://sandbox.safaricom.co.ke'
      : 'https://api.safaricom.co.ke';
  }

  /**
   * Get access token from M-Pesa
   */
  private async getAccessToken(): Promise<string> {
    // Return cached token if still valid
    if (this.accessToken && this.tokenExpiry && this.tokenExpiry > new Date()) {
      return this.accessToken;
    }

    try {
      const auth = Buffer.from(
        `${this.config.consumerKey}:${this.config.consumerSecret}`
      ).toString('base64');

      const response = await axios.get(
        `${this.baseUrl}/oauth/v1/generate?grant_type=client_credentials`,
        {
          headers: {
            Authorization: `Basic ${auth}`
          }
        }
      );

      this.accessToken = response.data.access_token;
      // Token expires in 3600 seconds, refresh after 3500 seconds
      this.tokenExpiry = new Date(Date.now() + 3500 * 1000);

      logger.debug('M-Pesa access token obtained');
      return this.accessToken;
    } catch (error) {
      logger.error('Failed to get M-Pesa access token', { error });
      throw new Error('Failed to authenticate with M-Pesa');
    }
  }

  /**
   * Initiate STK push for payment
   */
  async initiateSTKPush(params: {
    userId: string;
    phoneNumber: string;
    amount: number;
    type: PaymentType;
  }): Promise<Payment> {
    try {
      // Normalize phone number (remove +, add 254)
      const normalizedPhone = params.phoneNumber
        .replace(/^\+/, '')
        .replace(/^0/, '254');

      if (!normalizedPhone.startsWith('254')) {
        throw new Error('Invalid Kenyan phone number');
      }

      // Create payment record
      const payment: Payment = {
        id: `PAY-${Date.now()}-${uuidv4().substring(0, 8)}`.toUpperCase(),
        userId: params.userId,
        phoneNumber: normalizedPhone,
        amount: params.amount,
        type: params.type,
        status: PaymentStatus.INITIATED,
        createdAt: new Date(),
        metadata: {}
      };

      // Get access token
      const accessToken = await this.getAccessToken();

      // Prepare timestamp
      const timestamp = new Date()
        .toISOString()
        .replace(/[:-]/g, '')
        .substring(0, 14);

      // Generate password (Base64 encoded: shortcode + passkey + timestamp)
      const password = Buffer.from(
        `${this.config.shortCode}${this.config.passkey}${timestamp}`
      ).toString('base64');

      // Call M-Pesa API
      const response = await axios.post(
        `${this.baseUrl}/mpesa/stkpush/v1/processrequest`,
        {
          BusinessShortCode: this.config.shortCode,
          Password: password,
          Timestamp: timestamp,
          TransactionType: 'CustomerPayBillOnline',
          Amount: Math.floor(params.amount),
          PartyA: normalizedPhone,
          PartyB: this.config.shortCode,
          PhoneNumber: normalizedPhone,
          CallBackURL: `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/payments/callback`,
          AccountReference: payment.id,
          TransactionDesc: `Political-Kalshi ${params.type.toLowerCase()}`
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      // Store payment
      payment.metadata!.checkoutRequestId = response.data.CheckoutRequestID;
      payment.status = PaymentStatus.PENDING;
      this.payments.set(payment.id, payment);

      logger.info('STK push initiated', {
        paymentId: payment.id,
        userId: params.userId,
        amount: params.amount,
        checkoutRequestId: response.data.CheckoutRequestID
      });

      return payment;
    } catch (error) {
      logger.error('Failed to initiate STK push', { error, params });
      throw error;
    }
  }

  /**
   * Handle M-Pesa callback
   */
  async handleCallback(callbackData: any): Promise<Payment> {
    try {
      const result = callbackData.Body.stkCallback;
      const checkoutRequestId = result.CheckoutRequestID;
      const resultCode = result.ResultCode;
      const resultDesc = result.ResultDesc;

      // Find payment by checkout request ID
      let payment = Array.from(this.payments.values()).find(
        p => p.metadata?.checkoutRequestId === checkoutRequestId
      );

      if (!payment) {
        throw new Error(`Payment not found for checkout request: ${checkoutRequestId}`);
      }

      payment.metadata!.resultCode = resultCode.toString();
      payment.metadata!.resultDesc = resultDesc;

      if (resultCode === 0) {
        // Payment successful
        const callbackMetadata = result.CallbackMetadata.Item;
        const mpesaData: any = {};

        callbackMetadata.forEach((item: any) => {
          mpesaData[item.Name] = item.Value;
        });

        payment.status = PaymentStatus.COMPLETED;
        payment.mpesaTransactionId = mpesaData.MpesaReceiptNumber;
        payment.mpesaReceiptNumber = mpesaData.MpesaReceiptNumber;
        payment.completedAt = new Date();

        logger.info('Payment completed', {
          paymentId: payment.id,
          mpesaReceiptNumber: payment.mpesaReceiptNumber,
          amount: payment.amount
        });
      } else {
        // Payment failed
        payment.status = PaymentStatus.FAILED;
        logger.warn('Payment failed', {
          paymentId: payment.id,
          resultCode,
          resultDesc
        });
      }

      this.payments.set(payment.id, payment);
      return payment;
    } catch (error) {
      logger.error('Failed to handle M-Pesa callback', { error, callbackData });
      throw error;
    }
  }

  /**
   * Get payment status
   */
  getPayment(paymentId: string): Payment | undefined {
    return this.payments.get(paymentId);
  }

  /**
   * Get user's payments
   */
  getUserPayments(userId: string): Payment[] {
    return Array.from(this.payments.values())
      .filter(p => p.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  /**
   * Get payments by status
   */
  getPaymentsByStatus(status: PaymentStatus): Payment[] {
    return Array.from(this.payments.values())
      .filter(p => p.status === status)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  /**
   * Initiate withdrawal (reverse flow)
   */
  async initiateWithdrawal(params: {
    userId: string;
    phoneNumber: string;
    amount: number;
  }): Promise<Payment> {
    try {
      // Validate amount
      if (params.amount < 10) {
        throw new Error('Minimum withdrawal amount is KES 10');
      }

      if (params.amount > 150000) {
        throw new Error('Maximum withdrawal amount is KES 150,000');
      }

      // Create payment record
      const payment: Payment = {
        id: `WTH-${Date.now()}-${uuidv4().substring(0, 8)}`.toUpperCase(),
        userId: params.userId,
        phoneNumber: params.phoneNumber,
        amount: params.amount,
        type: PaymentType.WITHDRAWAL,
        status: PaymentStatus.INITIATED,
        createdAt: new Date()
      };

      this.payments.set(payment.id, payment);

      logger.info('Withdrawal initiated', {
        paymentId: payment.id,
        userId: params.userId,
        amount: params.amount
      });

      // TODO: Implement B2C API call to send money to user
      // For now, mark as completed
      payment.status = PaymentStatus.COMPLETED;
      payment.completedAt = new Date();

      return payment;
    } catch (error) {
      logger.error('Failed to initiate withdrawal', { error, params });
      throw error;
    }
  }

  /**
   * Get transaction summary
   */
  getTransactionSummary(): {
    totalDeposits: number;
    totalWithdrawals: number;
    pendingPayments: number;
    completedPayments: number;
  } {
    const payments = Array.from(this.payments.values());

    return {
      totalDeposits: payments
        .filter(p => p.type === PaymentType.DEPOSIT && p.status === PaymentStatus.COMPLETED)
        .reduce((sum, p) => sum + p.amount, 0),
      totalWithdrawals: payments
        .filter(p => p.type === PaymentType.WITHDRAWAL && p.status === PaymentStatus.COMPLETED)
        .reduce((sum, p) => sum + p.amount, 0),
      pendingPayments: payments.filter(p => p.status === PaymentStatus.PENDING).length,
      completedPayments: payments.filter(p => p.status === PaymentStatus.COMPLETED).length
    };
  }
}

export default MPesaService;
