/**
 * Authentication Service
 * 
 * Handles user registration, login, JWT tokens, and KYC verification
 */

import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import winston from 'winston';

const logger = winston.getLogger();

// ============================================================================
// TYPES
// ============================================================================

export enum KYCStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED'
}

export enum UserRole {
  CITIZEN = 'CITIZEN',
  POLITICIAN = 'POLITICIAN',
  ANALYST = 'ANALYST',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  phoneNumber: string;
  email?: string;
  name: string;
  passwordHash: string;
  role: UserRole;
  kycStatus: KYCStatus;
  kycDocument?: string;
  kycVerifiedAt?: Date;
  isPolitician: boolean;
  politicianPosition?: string;
  politicianParty?: string;
  balanceKES: number;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  isActive: boolean;
}

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface JWTPayload {
  userId: string;
  phoneNumber: string;
  role: UserRole;
  iat: number;
  exp: number;
}

// ============================================================================
// AUTH SERVICE
// ============================================================================

export class AuthService {
  private users: Map<string, User> = new Map();
  private refreshTokens: Map<string, { userId: string; expiresAt: Date }> = new Map();
  private jwtSecret: string;
  private refreshSecret: string;
  private accessTokenExpiry: number = 3600; // 1 hour
  private refreshTokenExpiry: number = 604800; // 7 days

  constructor(jwtSecret?: string, refreshSecret?: string) {
    this.jwtSecret = jwtSecret || process.env.JWT_SECRET || 'dev-secret-key-change-in-production';
    this.refreshSecret = refreshSecret || process.env.REFRESH_SECRET || 'dev-refresh-secret-change-in-production';
  }

  /**
   * Register a new user
   */
  async register(params: {
    phoneNumber: string;
    password: string;
    name: string;
    email?: string;
    isPolitician?: boolean;
    politicianPosition?: string;
    politicianParty?: string;
  }): Promise<{ user: User; tokens: AuthToken }> {
    // Validation
    if (!params.phoneNumber || !params.password || !params.name) {
      throw new Error('Phone number, password, and name are required');
    }

    if (params.password.length < 8) {
      throw new Error('Password must be at least 8 characters');
    }

    // Check if user already exists
    const existingUser = Array.from(this.users.values()).find(
      u => u.phoneNumber === params.phoneNumber
    );
    if (existingUser) {
      throw new Error('User with this phone number already exists');
    }

    // Hash password
    const passwordHash = await bcryptjs.hash(params.password, 10);

    // Create user
    const user: User = {
      id: `USR-${uuidv4()}`,
      phoneNumber: params.phoneNumber,
      email: params.email,
      name: params.name,
      passwordHash,
      role: params.isPolitician ? UserRole.POLITICIAN : UserRole.CITIZEN,
      kycStatus: KYCStatus.PENDING,
      isPolitician: params.isPolitician || false,
      politicianPosition: params.politicianPosition,
      politicianParty: params.politicianParty,
      balanceKES: 0, // Start with 0, user must deposit
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    };

    // Store user
    this.users.set(user.id, user);

    logger.info('User registered', {
      userId: user.id,
      phoneNumber: params.phoneNumber,
      role: user.role
    });

    // Generate tokens
    const tokens = this.generateTokens(user);

    return { user, tokens };
  }

  /**
   * Login user
   */
  async login(phoneNumber: string, password: string): Promise<{ user: User; tokens: AuthToken }> {
    // Find user
    const user = Array.from(this.users.values()).find(u => u.phoneNumber === phoneNumber);
    if (!user) {
      throw new Error('Invalid phone number or password');
    }

    // Check password
    const isPasswordValid = await bcryptjs.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error('Invalid phone number or password');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new Error('User account is inactive');
    }

    // Update last login
    user.lastLoginAt = new Date();
    user.updatedAt = new Date();

    logger.info('User logged in', {
      userId: user.id,
      phoneNumber: user.phoneNumber
    });

    // Generate tokens
    const tokens = this.generateTokens(user);

    return { user, tokens };
  }

  /**
   * Verify JWT token
   */
  verifyToken(token: string): JWTPayload {
    try {
      const payload = jwt.verify(token, this.jwtSecret) as JWTPayload;
      return payload;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  /**
   * Refresh access token
   */
  refreshAccessToken(refreshToken: string): AuthToken {
    try {
      // Verify refresh token
      const payload = jwt.verify(refreshToken, this.refreshSecret) as JWTPayload;

      // Check if refresh token is still valid
      const tokenData = this.refreshTokens.get(refreshToken);
      if (!tokenData || tokenData.expiresAt < new Date()) {
        throw new Error('Refresh token expired');
      }

      // Get user
      const user = this.users.get(payload.userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Generate new tokens
      return this.generateTokens(user);
    } catch (error) {
      throw new Error('Failed to refresh token');
    }
  }

  /**
   * Generate JWT tokens
   */
  private generateTokens(user: User): AuthToken {
    const now = Math.floor(Date.now() / 1000);

    // Access token
    const accessPayload: JWTPayload = {
      userId: user.id,
      phoneNumber: user.phoneNumber,
      role: user.role,
      iat: now,
      exp: now + this.accessTokenExpiry
    };
    const accessToken = jwt.sign(accessPayload, this.jwtSecret);

    // Refresh token
    const refreshPayload: JWTPayload = {
      userId: user.id,
      phoneNumber: user.phoneNumber,
      role: user.role,
      iat: now,
      exp: now + this.refreshTokenExpiry
    };
    const refreshToken = jwt.sign(refreshPayload, this.refreshSecret);

    // Store refresh token
    this.refreshTokens.set(refreshToken, {
      userId: user.id,
      expiresAt: new Date(now * 1000 + this.refreshTokenExpiry * 1000)
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: this.accessTokenExpiry
    };
  }

  /**
   * Get user by ID
   */
  getUser(userId: string): User | undefined {
    return this.users.get(userId);
  }

  /**
   * Get user by phone number
   */
  getUserByPhone(phoneNumber: string): User | undefined {
    return Array.from(this.users.values()).find(u => u.phoneNumber === phoneNumber);
  }

  /**
   * Submit KYC verification
   */
  async submitKYC(userId: string, documentUrl: string): Promise<User> {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error('User not found');
    }

    user.kycDocument = documentUrl;
    user.kycStatus = KYCStatus.PENDING;
    user.updatedAt = new Date();

    logger.info('KYC submitted', { userId, documentUrl });

    return user;
  }

  /**
   * Verify KYC (admin only)
   */
  async verifyKYC(userId: string, approved: boolean): Promise<User> {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error('User not found');
    }

    user.kycStatus = approved ? KYCStatus.VERIFIED : KYCStatus.REJECTED;
    user.kycVerifiedAt = new Date();
    user.updatedAt = new Date();

    logger.info('KYC verified', { userId, approved });

    return user;
  }

  /**
   * Change password
   */
  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Verify old password
    const isPasswordValid = await bcryptjs.compare(oldPassword, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    // Hash new password
    user.passwordHash = await bcryptjs.hash(newPassword, 10);
    user.updatedAt = new Date();

    logger.info('Password changed', { userId });
  }

  /**
   * Logout (invalidate refresh token)
   */
  logout(refreshToken: string): void {
    this.refreshTokens.delete(refreshToken);
    logger.info('User logged out');
  }

  /**
   * Get all users (admin)
   */
  getAllUsers(): User[] {
    return Array.from(this.users.values());
  }

  /**
   * Get users by role
   */
  getUsersByRole(role: UserRole): User[] {
    return Array.from(this.users.values()).filter(u => u.role === role);
  }

  /**
   * Update user balance
   */
  updateBalance(userId: string, amount: number): User {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error('User not found');
    }

    user.balanceKES += amount;
    user.updatedAt = new Date();

    return user;
  }

  /**
   * Deactivate user account
   */
  deactivateUser(userId: string): User {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error('User not found');
    }

    user.isActive = false;
    user.updatedAt = new Date();

    logger.info('User deactivated', { userId });

    return user;
  }
}

export default AuthService;
