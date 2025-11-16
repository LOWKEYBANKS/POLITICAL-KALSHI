// apps/backend/src/app/routes/market.routes.ts
import { Router } from 'express';
import { PoliticalMarketEngine } from '../services/marketEngine';
import { OrderMatcher } from '../services/orderMatcher';
import { MarketResolver } from '../services/marketResolver';
import { DataSimulator } from '../services/dataSimulator';

const router = Router();
const marketEngine = new PoliticalMarketEngine();
const orderMatcher = new OrderMatcher();
const marketResolver = new MarketResolver();
const dataSimulator = new DataSimulator();

// POST - Create political prediction market (campaign events only)
router.post('/markets', async (req, res) => {
  const { question, resolutionDate, contractSize, politicianId } = req.body;
  
  // Validate politician access (must be paying customer)
  if (!await isValidPolitician(politicianId)) {
    return res.status(403).json({ error: "Entry fee required" });
  }
  
  const market = marketEngine.createMarket({
    question, 
    resolutionDate: new Date(resolutionDate),
    contractSize,
    creatorId: politicianId
  });
  
  // Trigger rival notification: "New market created by rival!"
  notifyRivalsOfNewMarket(market, politicianId);
  
  res.status(201).json(market);
});

// GET - All active political markets (for politician FOMO)
router.get('/markets', async (req, res) => {
  const politicianId = req.query.politicianId;
  const markets = await getAllActiveMarkets();
  
  // Inject rivalry urgency
  const marketsWithRivalry = markets.map(market => ({
    ...market,
    rivalActivityCount: await getRivalBetsInMarket(market.id, politicianId),
    urgencyScore: calculateMarketUrgency(market.resolutionDate),
    hotAlerts: checkForUrgencyTriggers(market.id)
  }));
  
  res.json(sortedByUrgency(marketsWithRivalry));
});

// POST - Place KES stake on political outcome (psychological hook here)
router.post('/markets/:marketId/bet', async (req, res) => {
  const { marketId } = req.params;
  const { politicianId, outcome, stakeAmount, mpesaNumber } = req.body;
  
  // Validate minimum stake (KES 5,000) and politician limits
  if (stakeAmount < 5000) {
    return res.status(400).json({ error: "Minimum KES 5,000 required" });
  }
  
  const houseFee = stakeAmount * 0.15;
  const netStake = stakeAmount - houseFee;
  
  // Process M-Pesa payment through webhook
  const paymentResult = await processPaymentViaMpesa(stakeAmount, politicianId, marketId);
  if (!paymentResult.success) {
    return res.status(402).json({ error: "Payment failed" });
  }
  
  // Place the bet (immediate matching for psychological urgency)
  const betResult = orderMatcher.placeOrder(marketId, politicianId, outcome, netStake);
  
  // Critical: Trigger instant rival alert
  await triggerRivalAlert(marketId, politicianId, stakeAmount);
  
  // Check for immediate match (instant gratification)
  if (betResult.status === "immediately_matched") {
    await sendMatchNotification(politicianId, marketId, "immediate");
  }
  
  res.status(201).json({
    ...betResult,
    houseFee,
    potentialPayout: netStake * 2,
    rivalAlertSent: true
  });
});

// GET - Politician's current positions (creates status anxiety)
router.get('/politicians/:politicianId/positions', async (req, res) => {
  const { politicianId } = req.params;
  
  const positions = orderMatcher.getPoliticianPositions(politicianId);
  
  // Add psychological pressure data
  const enrichedPositions = await Promise.all(positions.map(async pos => {
    return {
      ...pos,
      rival_positions_count: await countRivalPositions(pos.marketId, politicianId),
      market_urgency: calculateMarketUrgency(pos.marketId),
      time_to_resolution: getTimeUntilResolution(pos.marketId),
      urgent_alert: shouldTriggerUrgencyAlert(pos)
    };
  }));
  
  res.json(enrichedPositions);
});

// GET - Market odds with psychological pricing
router.get('/markets/:marketId/odds', async (req, res) => {
  const { marketId } = req.params;
  const odds = orderMatcher.getMarketOdds(marketId);
  
  // Add urgency multiplier as elections approach
  const urgencyMultiplier = getCampaignUrgencyMultiplier();
  const adjustedOdds = {
    ...odds,
    yesOdds: parseFloat(odds.yesOdds) * urgencyMultiplier,
    noOdds: parseFloat(odds.noOdds) * urgencyMultiplier,
    urgency_level: getUrgencyLevel(),
    remaining_time: getTimeUntilResolution(marketId)
  };
  
  res.json(adjustedOdds);
});

// Rival Alert Triggers (CRITICAL PSYCHOLOGICAL WARFARE)
const triggerRivalAlert = async (marketId: string, bettorId: string, amount: number) => {
  const rivals = await getCompetingPoliticians(marketId, bettorId);
  
  for (const rival of rivals) {
    await sendRivalUrgencyNotification(rival, {
      message: `Opponent just placed KES ${amount} on ${marketId}`,
      urgency: amount > 50000 ? "critical" : "medium",
      quick_actions: ["counter_bet", "view_market", "ignore_at_risk"]
    });
  }
};

// Urgency Multipliers (CAMPAIGN SENSITIVITY ENGINE)
const getCampaignUrgencyMultiplier = (): number => {
  const weeksToElection = getWeeksToElection();
  if (weeksToElection < 4) return 2.0;      // Last month: double urgency
  if (weeksToElection < 12) return 1.5;     // Campaign season
  return 1.0;                                // Normal
};
