// apps/backend/src/services/orderMatcher.ts

export interface BetOrder {
  id: string;
  marketId: string;
  politicianId: string;
  outcome: "YES" | "NO";
  stakeAmount: number;  // KES amount
  timestamp: Date;
  status: "pending" | "matched" | "resolved";
  contractId: string;
}

export interface MatchedPair {
  yesOrder: BetOrder;
  noOrder: BetOrder;
  matchedAmount: number;
  houseFee: number;
  contractId: string;
}

export class OrderMatcher {
  
  private pendingOrders: Map<string, BetOrder> = new Map();
  private matchedPairs: Map<string, MatchedPair> = new Map();
  
  // Politician places KES stake on YES/NO outcome
  placeOrder(marketId: string, politicianId: string, outcome: "YES" | "NO", stakeAmount: number): {
    orderId: string;
    status: "pending" | "immediately_matched";
    houseFee: number;
    potentialPayout: number;
  } {
    // Validate stake amount (minimum KES 5000, maximum based on politician spending)
    if (stakeAmount < 5000) {
      throw new Error("Minimum stake is KES 5,000");
    }
    
    const orderId = `ord_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const houseFee = stakeAmount * 0.15; // 15% instantly deducted
    const netStake = stakeAmount - houseFee;
    
    const newOrder: BetOrder = {
      id: orderId,
      marketId,
      politicianId,
      outcome,
      stakeAmount: netStake,
      timestamp: new Date(),
      status: "pending",
      contractId: `contr_${orderId}`
    };
    
    // Store pending order
    this.pendingOrders.set(orderId, newOrder);
    
    // Attempt immediate matching
    const match = this.attemptMatching(newOrder);
    
    if (match) {
      return {
        orderId,
        status: "immediately_matched",
        houseFee,
        potentialPayout: netStake * 2 // Double or nothing
      };
    }
    
    return {
      orderId,
      status: "pending",
      houseFee,
      potentialPayout: netStake * 2
    };
  }
  
  // Attempt to pair opposing orders
  private attemptMatching(newOrder: BetOrder): MatchedPair | null {
    // Find opposing orders in same market
    for (const [orderId, existingOrder] of this.pendingOrders.entries()) {
      if (orderId === newOrder.id) continue;
      
      if (existingOrder.marketId === newOrder.marketId && 
          existingOrder.outcome !== newOrder.outcome &&
          existingOrder.status === "pending") {
        
        // Calculate match amount (smaller of two stakes)
        const matchAmount = Math.min(newOrder.stakeAmount, existingOrder.stakeAmount);
        const houseFee = matchAmount * 2 * 0.15; // House fee on total pool
        
        // Create matched pair
        const matchedPair: MatchedPair = {
          yesOrder: newOrder.outcome === "YES" ? newOrder : existingOrder,
          noOrder: newOrder.outcome === "NO" ? newOrder : existingOrder,
          matchedAmount: matchAmount,
          houseFee,
          contractId: `matched_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        };
        
        this.matchedPairs.set(matchedPair.contractId, matchedPair);
        
        // Update order statuses
        newOrder.status = "matched";
        existingOrder.status = "matched";
        
        return matchedPair;
      }
    }
    
    return null; // No match available yet
  }
  
  // Get politician's current positions
  getPoliticianPositions(politicianId: string): Array<{
    marketId: string;
    outcome: "YES" | "NO";
    amount: number;
    status: string;
    potentialPayout: number;
  }> {
    const positions: Array<any> = [];
    
    // Check pending orders
    for (const order of this.pendingOrders.values()) {
      if (order.politicianId === politicianId) {
        positions.push({
          marketId: order.marketId,
          outcome: order.outcome,
          amount: order.stakeAmount,
          status: order.status,
          potentialPayout: order.stakeAmount * 2
        });
      }
    }
    
    return positions;
  }
  
  // Alert when politician's match happens (psychological hook)
  getPendingMatchAlerts(politicianId: string): Array<{
    message: string;
    urgency: "low" | "medium" | "high";
    rivalId?: string;
  }> {
    const alerts: Array<any> = [];
    
    // Check for recent matches involving this politician
    for (const pair of this.matchedPairs.values()) {
      if (pair.yesOrder.politicianId === politicianId) {
        alerts.push({
          message: `Your YES bet has been matched with a rival's NO position`,
          urgency: "high",
          rivalId: pair.noOrder.politicianId
        });
      } else if (pair.noOrder.politicianId === politicianId) {
        alerts.push({
          message: `Your NO position has been challenged - rival took the YES side`,
          urgency: "high", 
          rivalId: pair.yesOrder.politicianId
        });
      }
    }
    
    return alerts;
  }
  
  // Calculate real-time market odds
  getMarketOdds(marketId: string): {
    yesOdds: string;
    noOdds: string;
    totalVolume: number;
    houseEdge: number;
  } {
    let yesVolume = 0;
    let noVolume = 0;
    
    for (const order of this.pendingOrders.values()) {
      if (order.marketId === marketId && order.status === "pending") {
        if (order.outcome === "YES") yesVolume += order.stakeAmount;
        else noVolume += order.stakeAmount;
      }
    }
    
    const totalVolume = yesVolume + noVolume;
    const yesOdds = totalVolume > 0 ? (noVolume / (yesVolume + 0.01)).toFixed(2) : "1.00";
    const noOdds = totalVolume > 0 ? (yesVolume / (noVolume + 0.01)).toFixed(2) : "1.00";
    
    return {
      yesOdds,
      noOdds,
      totalVolume,
      houseEdge: 0.15
    };
  }
}
