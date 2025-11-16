// apps/backend/src/services/marketResolver.ts

export interface MarketResolution {
  marketId: string;
  finalOutcome: "YES" | "NO";
  resolvedAt: Date;
  winners: Array<{
    politicianId: string;
    contractId: string;
    winningsAmount: number;
    payoutScheduled: boolean;
  }>;
  losers: Array<{
    politicianId: string;
    contractId: string;
    lostAmount: number;
  }>;
  houseRevenue: number;
  resolutionTrigger: string;
}

export interface PayoutRequest {
  mpesaNumber: string;
  politicianId: string;
  amount: number;
  transactionId: string;
  status: "pending" | "completed" | "failed";
}

export class MarketResolver {
  
  private pendingResolutions: Map<string, MarketResolution> = new Map();
  private payoutQueue: Map<string, PayoutRequest> = new Map();
  
  // Auto-resolve markets based on time OR event triggers
  resolveMarket(
    marketId: string, 
    finalOutcome: "YES" | "NO",
    trigger: "time_elapsed" | "political_event" | "admin_override",
    allBets: Array<{contractId: string, politicianId: string, outcome: "YES" | "NO", stakeAmount: number, mpesaNumber: string}>
  ): MarketResolution {
    
    let totalStaked = 0;
    let winners: Array<any> = [];
    let losers: Array<any> = [];
    let houseRevenue = 0;
    
    // Calculate winners and losers
    for (const bet of allBets) {
      totalStaked += bet.stakeAmount;
      
      if (bet.outcome === finalOutcome) {
        // Winner: Double or nothing (minus house fee already taken on stake)
        const winningsAmount = bet.stakeAmount * 2;
        winners.push({
          politicianId: bet.politicianId,
          contractId: bet.contractId,
          winningsAmount,
          payoutScheduled: false
        });
      } else {
        // Loser: Already lost their house fee + stake
        losers.push({
          politicianId: bet.politicianId,
          contractId: bet.contractId,
          lostAmount: bet.stakeAmount
        });
      }
    }
    
    // House already took 15% on each stake, but we track revenue
    houseRevenue = totalStaked * 0.15;
    
    const resolution: MarketResolution = {
      marketId,
      finalOutcome,
      resolvedAt: new Date(),
      winners,
      losers,
      houseRevenue,
      resolutionTrigger: trigger
    };
    
    this.pendingResolutions.set(marketId, resolution);
    
    // Schedule immediate payouts to winners (dopamine hit)
    this.scheduleWinnerPayouts(resolution, allBets);
    
    return resolution;
  }
  
  // Schedule immediate M-Pesa payouts to winners (addiction reinforcement)
  private scheduleWinnerPayouts(resolution: MarketResolution, allBets: Array<any>): void {
    for (const winner of resolution.winners) {
      // Get MPesa number from original bet
      const originalBet = allBets.find(bet => bet.contractId === winner.contractId);
      
      if (!originalBet?.mpesaNumber) continue;
      
      const payoutRequest: PayoutRequest = {
        mpesaNumber: originalBet.mpesaNumber,
        politicianId: winner.politicianId,
        amount: winner.winningsAmount,
        transactionId: `payout_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        status: "pending"
      };
      
      this.payoutQueue.set(payoutRequest.transactionId, payoutRequest);
      
      // Send payout immediately (maximize instant gratification)
      this.processPayout(payoutRequest);
    }
  }
  
  // Process M-Pesa payout (integration point with your payment service)
  private async processPayout(payoutRequest: PayoutRequest): Promise<void> {
    try {
      // M-Pesa API integration goes here
      // For now, simulate instant payout
      console.log(`🏦 M-Pesa payout: KES ${payoutRequest.amount} to ${payoutRequest.mpesaNumber}`);
      
      // Update status
      payoutRequest.status = "completed";
      this.payoutQueue.set(payoutRequest.transactionId, payoutRequest);
      
      // Trigger addiction notification (rival sees winners, feels urgency)
      this.sendPayoutNotification(payoutRequest);
      
    } catch (error) {
      console.error(`Payout failed for ${payoutRequest.transactionId}:`, error);
      payoutRequest.status = "failed";
      this.payoutQueue.set(payoutRequest.transactionId, payoutRequest);
      
      // Critical: Failed payouts need retry mechanism (politicians will panic)
      this.schedulePayoutRetry(payoutRequest);
    }
  }
  
  // Send notifications to all politicians when markets resolve (psychological warfare)
  private sendPayoutNotification(payoutRequest: PayoutRequest): void {
    // This triggers Socket.IO messages to all politicians in the same market
    // Winners get: "KES 50,000 credited to your account instantly!"  
    // Losers get: "Market resolved - you lost KES 25,000. Create new position to recover!"
    // Non-participants get: "Your rival just won KES 50,000. Are you missing out?"
  }
  
  // Critical system: Failed payout retry (politicians panic over money)
  private schedulePayoutRetry(payoutRequest: PayoutRequest): void {
    setTimeout(async () => {
      if (payoutRequest.status === "failed") {
        console.log(`🔄 Retrying payout for ${payoutRequest.transactionId}`);
        payoutRequest.status = "pending";
        await this.processPayout(payoutRequest);
      }
    }, 5000); // Retry after 5 seconds
  }
  
  // Get resolution results for politician dashboard feeds
  getResolutionResults(politicianId: string): Array<{
    marketId: string;
    result: "won" | "lost"; 
    amount: number;
    resolutionTime: Date;
    paidStatus: "completed" | "pending" | "failed";
  }> {
    const results: Array<any> = [];
    
    for (const resolution of this.pendingResolutions.values()) {
      const winner = resolution.winners.find(w => w.politicianId === politicianId);
      const loser = resolution.losers.find(l => l.politicianId === politicianId);
      
      if (winner) {
        const payout = Array.from(this.payoutQueue.values())
          .find(p => p.politicianId === politicianId);
        
        results.push({
          marketId: resolution.marketId,
          result: "won",
          amount: winner.winningsAmount,
          resolutionTime: resolution.resolvedAt,
          paidStatus: payout?.status || "pending"
        });
      } else if (loser) {
        results.push({
          marketId: resolution.marketId,
          result: "lost",
          amount: loser.lostAmount,
          resolutionTime: resolution.resolvedAt,
          paidStatus: "completed" // Lost money is always "complete"
        });
      }
    }
    
    return results;
  }
  
  // Critical for revenue tracking: Sum up house revenue
  getDailyHouseRevenue(date: Date): number {
    let dailyRevenue = 0;
    
    for (const resolution of this.pendingResolutions.values()) {
      const resolutionDate = new Date(resolution.resolvedAt).toDateString();
      const targetDate = date.toDateString();
      
      if (resolutionDate === targetDate) {
        dailyRevenue += resolution.houseRevenue;
      }
    }
    
    return dailyRevenue;
  }
}
