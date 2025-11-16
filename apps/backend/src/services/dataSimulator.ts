// apps/backend/src/services/dataSimulator.ts

export interface TractionData {
  politicianId: string;
  currentTraction: number;        // 0-100 percentage
  weeklyTrend: number;            // % change this week
  regionalBreakdown: {
    nairobi: number;
    kisumu: number; 
    mombasa: number;
    eldoret: number;
    nakuru: number;
  };
  vibeTags: ["protest_energy" | "policy_focus" | "meme_value"];
  lastUpdated: Date;
}

export class DataSimulator {
  
  // Generate initial traction for new politician (20-60% base)
  generateBaseTraction(politicianId: string): TractionData {
    const baseTraction = Math.random() * 40 + 20; // 20-60%
    
    return {
      politicianId,
      currentTraction: baseTraction,
      weeklyTrend: (Math.random() - 0.5) * 20, // -10% to +10%
      
      regionalBreakdown: {
        nairobi: baseTraction * (Math.random() * 0.4 + 0.3), // 30-70% of total
        kisumu: baseTraction * (Math.random() * 0.3 + 0.2),   // 20-50% of total
        mombasa: baseTraction * (Math.random() * 0.2 + 0.1),  // 10-30% of total
        eldoret: baseTraction * (Math.random() * 0.2 + 0.1),
        nakuru: baseTraction * (Math.random() * 0.2 + 0.1)
      },
      
      vibeTags: this.generateVibeTags(),
      lastUpdated: new Date()
    };
  }
  
  // Create believable political event volatility
  simulateEventImpact(eventType: "protest" | "debate" | "scandal" | "viral_tiktok"): {
    tractionChange: number;
    regionalSpike: string;
    reason: string;
  } {
    const impacts = {
      protest: { change: 8 + Math.random() * 20, region: "nairobi", reason: "youth protest engagement" },
      debate: { change: 5 + Math.random() * 15, region: "national", reason: "policy position clarity" },
      scandal: { change: -10 - Math.random() * 15, region: "mixed", reason: "controversy backlash" },
      viral_tiktok: { change: 3 + Math.random() * 12, region: "nairobi", reason: "youth meme culture" }
    };
    
    const impact = impacts[eventType];
    
    return {
      tractionChange: impact.change * (Math.random() > 0.3 ? 1 : -1), // 70% positive, 30% negative
      regionalSpike: impact.region,
      reason: impact.reason
    };
  }
  
  // Daily updates for leaderboard volatility (politicians checking addiction)
  updateDailyTraction(currentData: TractionData): TractionData {
    const dailyChange = (Math.random() - 0.5) * 10; // -5% to +5% daily
    const newTraction = Math.max(0, Math.min(100, currentData.currentTraction + dailyChange));
    
    return {
      ...currentData,
      currentTraction: newTraction,
      weeklyTrend: ((newTraction - currentData.currentTraction) / currentData.currentTraction) * 100,
      lastUpdated: new Date()
    };
  }
  
  // Assign politically relevant persona tags
  private generateVibeTags(): ["protest_energy" | "policy_focus" | "meme_value"] {
    const tagCombos = [
      ["protest_energy", "policy_focus"] as const,
      ["policy_focus", "meme_value"] as const,
      ["protest_energy", "meme_value"] as const,
      ["policy_focus"] as const,
      ["protest_energy"] as const,
      ["meme_value"] as const
    ];
    
    return tagCombos[Math.floor(Math.random() * tagCombos.length)];
  }
  
  // Create "believable" spike during intense campaign moments
  createCampaignSpike(urgencyLevel: 1 | 2 | 3): {
    spikeMagnitude: number;
    targetPolitician?: string;
    eventType: string;
  } {
    const magnitudes = { 1: 5, 2: 12, 3: 25 };
    
    return {
      spikeMagnitude: magnitudes[urgencyLevel] + Math.random() * 10,
      eventType: urgencyLevel === 3 ? "debate_performance" : "rally_attendance",
      targetPolitician: Math.random() > 0.7 ? "random_politician" : undefined
    };
  }
}
