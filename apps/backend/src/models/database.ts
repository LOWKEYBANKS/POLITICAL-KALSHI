/**
 * Database Models and Schema
 * 
 * PostgreSQL schema definitions for all entities
 */

// ============================================================================
// SQL SCHEMA
// ============================================================================

export const DATABASE_SCHEMA = `
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  phone_number VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'CITIZEN',
  kyc_status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
  kyc_document VARCHAR(500),
  kyc_verified_at TIMESTAMP,
  is_politician BOOLEAN DEFAULT FALSE,
  politician_position VARCHAR(255),
  politician_party VARCHAR(255),
  balance_kes DECIMAL(15, 2) DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_login_at TIMESTAMP,
  INDEX idx_phone_number (phone_number),
  INDEX idx_role (role),
  INDEX idx_kyc_status (kyc_status),
  INDEX idx_is_politician (is_politician)
);

-- Markets table
CREATE TABLE IF NOT EXISTS markets (
  id VARCHAR(36) PRIMARY KEY,
  question VARCHAR(500) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'OPEN',
  creator_id VARCHAR(36) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  resolution_date TIMESTAMP NOT NULL,
  resolved_at TIMESTAMP,
  outcome VARCHAR(10),
  yes_odds DECIMAL(5, 4) DEFAULT 0.5,
  no_odds DECIMAL(5, 4) DEFAULT 0.5,
  total_volume DECIMAL(15, 2) DEFAULT 0,
  yes_volume DECIMAL(15, 2) DEFAULT 0,
  no_volume DECIMAL(15, 2) DEFAULT 0,
  image_url VARCHAR(500),
  liquidity DECIMAL(15, 2) DEFAULT 0,
  FOREIGN KEY (creator_id) REFERENCES users(id),
  INDEX idx_status (status),
  INDEX idx_category (category),
  INDEX idx_creator_id (creator_id),
  INDEX idx_resolution_date (resolution_date)
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  market_id VARCHAR(36) NOT NULL,
  side VARCHAR(10) NOT NULL,
  quantity DECIMAL(15, 2) NOT NULL,
  limit_price DECIMAL(5, 4) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
  filled_quantity DECIMAL(15, 2) DEFAULT 0,
  average_price DECIMAL(5, 4) DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (market_id) REFERENCES markets(id),
  INDEX idx_user_id (user_id),
  INDEX idx_market_id (market_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
);

-- Trades table
CREATE TABLE IF NOT EXISTS trades (
  id VARCHAR(36) PRIMARY KEY,
  market_id VARCHAR(36) NOT NULL,
  buy_order_id VARCHAR(36) NOT NULL,
  sell_order_id VARCHAR(36) NOT NULL,
  buyer_id VARCHAR(36) NOT NULL,
  seller_id VARCHAR(36) NOT NULL,
  quantity DECIMAL(15, 2) NOT NULL,
  price DECIMAL(5, 4) NOT NULL,
  fee DECIMAL(15, 2) DEFAULT 0,
  timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (market_id) REFERENCES markets(id),
  FOREIGN KEY (buy_order_id) REFERENCES orders(id),
  FOREIGN KEY (sell_order_id) REFERENCES orders(id),
  FOREIGN KEY (buyer_id) REFERENCES users(id),
  FOREIGN KEY (seller_id) REFERENCES users(id),
  INDEX idx_market_id (market_id),
  INDEX idx_buyer_id (buyer_id),
  INDEX idx_seller_id (seller_id),
  INDEX idx_timestamp (timestamp)
);

-- Positions table
CREATE TABLE IF NOT EXISTS positions (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  market_id VARCHAR(36) NOT NULL,
  yes_quantity DECIMAL(15, 2) DEFAULT 0,
  no_quantity DECIMAL(15, 2) DEFAULT 0,
  average_yes_price DECIMAL(5, 4) DEFAULT 0,
  average_no_price DECIMAL(5, 4) DEFAULT 0,
  unrealized_pnl DECIMAL(15, 2) DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (market_id) REFERENCES markets(id),
  UNIQUE KEY unique_user_market (user_id, market_id),
  INDEX idx_user_id (user_id),
  INDEX idx_market_id (market_id)
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  type VARCHAR(20) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'INITIATED',
  mpesa_transaction_id VARCHAR(100),
  mpesa_receipt_number VARCHAR(100),
  checkout_request_id VARCHAR(255),
  result_code VARCHAR(10),
  result_desc VARCHAR(500),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_user_id (user_id),
  INDEX idx_status (status),
  INDEX idx_type (type),
  INDEX idx_created_at (created_at)
);

-- Audit log table
CREATE TABLE IF NOT EXISTS audit_logs (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id VARCHAR(36),
  changes JSON,
  ip_address VARCHAR(45),
  user_agent VARCHAR(500),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_user_id (user_id),
  INDEX idx_action (action),
  INDEX idx_created_at (created_at)
);

-- Create indexes for performance
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_markets_created_at ON markets(created_at);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_trades_timestamp ON trades(timestamp);
CREATE INDEX idx_payments_created_at ON payments(created_at);
`;

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface UserRow {
  id: string;
  phone_number: string;
  email?: string;
  name: string;
  password_hash: string;
  role: string;
  kyc_status: string;
  kyc_document?: string;
  kyc_verified_at?: Date;
  is_politician: boolean;
  politician_position?: string;
  politician_party?: string;
  balance_kes: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  last_login_at?: Date;
}

export interface MarketRow {
  id: string;
  question: string;
  description?: string;
  category: string;
  status: string;
  creator_id: string;
  created_at: Date;
  resolution_date: Date;
  resolved_at?: Date;
  outcome?: string;
  yes_odds: number;
  no_odds: number;
  total_volume: number;
  yes_volume: number;
  no_volume: number;
  image_url?: string;
  liquidity: number;
}

export interface OrderRow {
  id: string;
  user_id: string;
  market_id: string;
  side: string;
  quantity: number;
  limit_price: number;
  status: string;
  filled_quantity: number;
  average_price: number;
  created_at: Date;
  updated_at: Date;
  expires_at: Date;
}

export interface TradeRow {
  id: string;
  market_id: string;
  buy_order_id: string;
  sell_order_id: string;
  buyer_id: string;
  seller_id: string;
  quantity: number;
  price: number;
  fee: number;
  timestamp: Date;
}

export interface PositionRow {
  id: string;
  user_id: string;
  market_id: string;
  yes_quantity: number;
  no_quantity: number;
  average_yes_price: number;
  average_no_price: number;
  unrealized_pnl: number;
  created_at: Date;
  updated_at: Date;
}

export interface PaymentRow {
  id: string;
  user_id: string;
  phone_number: string;
  amount: number;
  type: string;
  status: string;
  mpesa_transaction_id?: string;
  mpesa_receipt_number?: string;
  checkout_request_id?: string;
  result_code?: string;
  result_desc?: string;
  created_at: Date;
  completed_at?: Date;
}

export interface AuditLogRow {
  id: string;
  user_id?: string;
  action: string;
  entity_type?: string;
  entity_id?: string;
  changes?: any;
  ip_address?: string;
  user_agent?: string;
  created_at: Date;
}
