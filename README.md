# Political Kalshi - PRIVATE REPO

## Project Overview
Political prediction marketplace targeting Kenyan 2027 elections. 
Politician-only platform using M-Pesa payment integration and Kalshi-style YES/NO prediction contracts.

⚠️ **CONFIDENTIAL** - Do not share outside core team

## Core Architecture
- Platform Type: Binary prediction market (YES/NO contracts)  
- User Base: Politicians only (pay-to-play access via M-Pesa)
- Monetization: Entry fees (KES 50,000) + boost credits + prediction pools
- Timeline: 18-month campaign season cash machine (Early 2026 - Dec 2027)
- Data: Simulated/anonymized (no real user scraping liability)

## Tech Stack
- Backend: Node.js + TypeScript + Express + Socket.IO
- Database: PostgreSQL + Redis  
- Frontend: React + Vite + Tailwind CSS
- Payment: M-Pesa API integration + webhook verification
- Deployment: Docker + Docker Compose

## Revenue Model
1. **Entry Fee**: KES 50,000 for politician platform access
2. **Boost Credits**: KES 1K/5K/10K packages (24-72hr duration, auto-decay)
3. **Prediction Pools**: 15% house edge on all YES/NO contracts
4. **Rival Data Unlocks**: KES 2,000 per competitor analysis
5. **Anti-Decay Protection**: KES 50,000/month subscription

## Psychological Design Features
- **Decay Mechanics**: Boosts expire constantly → repeat purchases
- **Rival Alerts**: Realtime notifications when competitors spend
- **Leaderboard Pressure**: Visual ranking triggers status anxiety  
- **Campaign Sensitivity**: Auto-adjusts decay/alerts/fees as elections approach
- **Addiction Loops**: Dashboard designed for compulsive checking

## Security & Compliance
- Environment variables only (never commit secrets)
- All payments via M-Pesa webhooks with transaction logging
- Immutable audit logs for regulatory questions
- Politician KYC verification required before platform access
- Rate limiting + fraud detection on payment flows

## Development Commands

```bash
# Development setup
docker-compose up -d                # Start DB + Redis
cd apps/backend && npm run dev       # Backend on :3001
cd apps/frontend && npm run dev      # Frontend on :3000

# Database
npm run migrate                      # Run schema migrations
npm run seed:politicians            # Create test politician data
npm run seed:markets                # Generate prediction markets

# Testing
npm run test                         # Unit tests
npm run test:e2e                    # End-to-end payment simulation
