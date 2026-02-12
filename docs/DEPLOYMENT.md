# Political-Kalshi Deployment Guide

Complete guide for deploying Political-Kalshi to production with M-Pesa integration, database setup, and real-time features.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Database Setup](#database-setup)
4. [M-Pesa Configuration](#mpesa-configuration)
5. [Docker Deployment](#docker-deployment)
6. [Production Deployment](#production-deployment)
7. [Monitoring & Maintenance](#monitoring--maintenance)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software
- Node.js 20+ and npm 10+
- Docker & Docker Compose
- PostgreSQL 15+ (or use Docker)
- Redis 7+ (or use Docker)
- Git

### Required Accounts
- Safaricom M-Pesa Business Account
- AWS/GCP/DigitalOcean account (for production)
- GitHub account (for CI/CD)

---

## Local Development Setup

### 1. Clone Repository
```bash
git clone https://github.com/LOWKEYBANKS/POLITICAL-KALSHI.git
cd POLITICAL-KALSHI
```

### 2. Install Dependencies
```bash
npm install
# or
pnpm install
```

### 3. Create Environment Files

**Backend (.env in root or apps/backend):**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
```
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://kalshi:password@localhost:5432/political_kalshi
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-secret-key-here
MPESA_CONSUMER_KEY=your-key
MPESA_CONSUMER_SECRET=your-secret
MPESA_SHORTCODE=123456
MPESA_PASSKEY=your-passkey
MPESA_ENV=sandbox
```

**Frontend (.env in apps/frontend):**
```
VITE_API_URL=http://localhost:3001
VITE_WS_URL=http://localhost:3001
```

### 4. Start Services with Docker
```bash
docker-compose up -d
```

This starts:
- PostgreSQL on port 5432
- Redis on port 6379
- Backend API on port 3001
- Frontend on port 5173

### 5. Run Database Migrations
```bash
npm run migrate
```

### 6. Seed Test Data (Optional)
```bash
npm run seed
```

### 7. Start Development Servers
```bash
npm run dev
```

Access the application:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001
- API Docs: http://localhost:3001/api/version

---

## Database Setup

### PostgreSQL Schema

The database schema is automatically created when migrations run. Key tables:

- **users** - User accounts with KYC status
- **markets** - Prediction markets
- **orders** - Buy/sell orders
- **trades** - Executed trades
- **positions** - User positions
- **payments** - M-Pesa transactions
- **audit_logs** - Audit trail

### Running Migrations

```bash
# Run all pending migrations
npm run migrate

# Create new migration
npm run migrate:create -- --name add_new_feature

# Rollback last migration
npm run migrate:rollback
```

### Backup Database

```bash
# Backup PostgreSQL
pg_dump political_kalshi > backup.sql

# Restore from backup
psql political_kalshi < backup.sql
```

---

## M-Pesa Configuration

### 1. Get Safaricom Credentials

Contact Safaricom Business Support to get:
- Consumer Key
- Consumer Secret
- Short Code (till number)
- Passkey

### 2. Configure Environment

Add to `.env.local`:
```
MPESA_CONSUMER_KEY=your-consumer-key
MPESA_CONSUMER_SECRET=your-consumer-secret
MPESA_SHORTCODE=123456
MPESA_PASSKEY=your-passkey
MPESA_ENV=sandbox  # Change to 'production' for live
MPESA_CALLBACK_URL=https://your-domain.com/api/payments/callback
```

### 3. Test M-Pesa Integration

```bash
# Test STK push
curl -X POST http://localhost:3001/api/payments/deposit \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+254712345678",
    "amount": 100
  }'
```

### 4. Configure Webhook

In Safaricom portal:
1. Set callback URL: `https://your-domain.com/api/payments/callback`
2. Ensure endpoint is publicly accessible
3. Test webhook delivery

---

## Docker Deployment

### Build Docker Images

```bash
# Build all images
docker-compose build

# Build specific service
docker-compose build backend
```

### Run with Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down

# Remove volumes (careful!)
docker-compose down -v
```

### Docker Environment Variables

Create `.env` file in project root:
```
NODE_ENV=production
DB_USER=kalshi
DB_PASSWORD=secure-password-here
MPESA_CONSUMER_KEY=your-key
MPESA_CONSUMER_SECRET=your-secret
```

---

## Production Deployment

### Option 1: AWS EC2

```bash
# 1. Launch EC2 instance (Ubuntu 22.04)
# 2. Install Docker & Docker Compose
sudo apt-get update
sudo apt-get install docker.io docker-compose

# 3. Clone repository
git clone https://github.com/LOWKEYBANKS/POLITICAL-KALSHI.git
cd POLITICAL-KALSHI

# 4. Create production .env
nano .env.production

# 5. Start services
docker-compose -f docker-compose.yml up -d

# 6. Set up SSL with Let's Encrypt
sudo apt-get install certbot python3-certbot-nginx
sudo certbot certonly --standalone -d your-domain.com
```

### Option 2: Heroku

```bash
# 1. Install Heroku CLI
curl https://cli.heroku.com/install.sh | sh

# 2. Login to Heroku
heroku login

# 3. Create app
heroku create political-kalshi-prod

# 4. Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-secret
heroku config:set DATABASE_URL=your-db-url
heroku config:set REDIS_URL=your-redis-url

# 5. Deploy
git push heroku main
```

### Option 3: DigitalOcean App Platform

1. Connect GitHub repository
2. Create new app
3. Configure environment variables
4. Deploy

### SSL/TLS Certificate

```bash
# Using Let's Encrypt
sudo certbot certonly --standalone -d your-domain.com

# Add to nginx/reverse proxy
ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
```

### Nginx Reverse Proxy

```nginx
upstream backend {
  server localhost:3001;
}

upstream frontend {
  server localhost:5173;
}

server {
  listen 443 ssl http2;
  server_name your-domain.com;

  ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

  # Frontend
  location / {
    proxy_pass http://frontend;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }

  # API
  location /api {
    proxy_pass http://backend;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }

  # WebSocket
  location /socket.io {
    proxy_pass http://backend;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
  }
}
```

---

## Monitoring & Maintenance

### Health Checks

```bash
# API health
curl http://localhost:3001/health

# Database connection
curl http://localhost:3001/api/version
```

### Logs

View logs in real-time:
```bash
# Docker logs
docker-compose logs -f backend

# Application logs
tail -f logs/combined.log
```

### Performance Monitoring

```bash
# Monitor CPU/Memory
docker stats

# Check database performance
psql political_kalshi
SELECT * FROM pg_stat_statements;
```

### Backup Strategy

```bash
# Daily database backup
0 2 * * * pg_dump political_kalshi > /backups/backup-$(date +\%Y\%m\%d).sql

# Upload to S3
aws s3 cp /backups/backup-*.sql s3://your-bucket/backups/
```

---

## Troubleshooting

### Database Connection Issues

```bash
# Test PostgreSQL connection
psql -h localhost -U kalshi -d political_kalshi

# Check connection string
echo $DATABASE_URL

# Restart PostgreSQL
docker-compose restart postgres
```

### M-Pesa Integration Issues

```bash
# Check M-Pesa credentials
curl -X GET https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials \
  -H "Authorization: Basic $(echo -n 'key:secret' | base64)"

# Test callback endpoint
curl -X POST http://localhost:3001/api/payments/callback \
  -H "Content-Type: application/json" \
  -d '{"Body": {"stkCallback": {"CheckoutRequestID": "test", "ResultCode": 0}}}'
```

### Redis Connection Issues

```bash
# Test Redis connection
redis-cli ping

# Flush cache (careful!)
redis-cli FLUSHALL

# Restart Redis
docker-compose restart redis
```

### High Memory Usage

```bash
# Check memory usage
docker stats

# Increase container memory limits
# Edit docker-compose.yml:
# services:
#   backend:
#     mem_limit: 2g
```

### SSL Certificate Renewal

```bash
# Renew certificate
sudo certbot renew

# Auto-renewal (runs daily)
sudo systemctl enable certbot.timer
```

---

## Performance Optimization

### Database Indexes
```sql
CREATE INDEX idx_users_kyc_status ON users(kyc_status);
CREATE INDEX idx_markets_status ON markets(status);
CREATE INDEX idx_orders_user_market ON orders(user_id, market_id);
CREATE INDEX idx_trades_timestamp ON trades(timestamp DESC);
```

### Redis Caching
```javascript
// Cache market data
await redis.setex(`market:${marketId}`, 300, JSON.stringify(market));
```

### Connection Pooling
```javascript
// PostgreSQL connection pool
const pool = new Pool({
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

---

## Security Checklist

- [ ] Change all default passwords
- [ ] Enable HTTPS/SSL
- [ ] Configure firewall rules
- [ ] Set up rate limiting
- [ ] Enable database encryption
- [ ] Configure backups
- [ ] Set up monitoring alerts
- [ ] Review audit logs regularly
- [ ] Update dependencies monthly
- [ ] Conduct security audit

---

## Support

For issues or questions:
- Email: support@political-kalshi.ke
- GitHub Issues: https://github.com/LOWKEYBANKS/POLITICAL-KALSHI/issues
- Documentation: https://docs.political-kalshi.ke

---

**Last Updated:** February 2026
**Version:** 1.0.0
