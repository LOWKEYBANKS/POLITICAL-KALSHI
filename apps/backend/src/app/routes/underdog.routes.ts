// apps/backend/src/app/routes/underdog.routes.ts
import { Router, Response } from 'express';
import cors from 'cors';

const router = Router();

// Enable CORS for all underdog routes
router.use(cors());

interface UnderdogRegistration {
  fullName: string;
  position: string;
  constituency: string;
  party: string;
  email: string;
  phone?: string;
  ambitionGoals: string;
}

interface UnderdogProfile {
  id: string;
  name: string;
  position: string;
  constituency: string;
  party: string;
  type: 'underdog';
  citations: number;
  status: 'active';
  email: string;
  phone?: string;
  ambitionGoals: string;
  progressMetrics: {
    initialCitations: number;
    currentCitations: number;
    growthRate: number;
    eliteCompetitionCount: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Store underdog profiles in memory (database in production)
const underdogProfiles = new Map<string, UnderdogProfile>();

router.post('/register', async (req: any, res: Response) => {
  try {
    const { fullName, position, constituency, party, email, phone, ambitionGoals }: UnderdogRegistration = req.body;
    
    // Validate required fields
    if (!fullName || !position || !constituency || !party || !email || !ambitionGoals) {
      return res.status(400).json({ 
        error: 'Missing required field',
        required: ['fullName', 'position', 'constituency', 'party', 'email', 'ambitionGoals']
      });
    }

    // Generate profile ID
    const profileId = fullName.toLowerCase().replace(/\s+/g, '_') + '_' + Date.now();
    
    // Check if profile already exists
    if (underdogProfiles.has(profileId)) {
      return res.status(409).json({ 
        error: 'Profile already exists',
        message: 'This political identity is already registered'
      });
    }

    // Create underdog profile with metrics
    const underdogProfile: UnderdogProfile = {
      id: profileId,
      name: fullName,
      position,
      constituency,
      party,
      type: 'underdog',
      citations: 0, // Start with 0 citations
      status: 'active',
      email,
      phone,
      ambitionGoals,
      progressMetrics: {
        initialCitations: 0,
        currentCitations: 0,
        growthRate: 0,
        eliteCompetitionCount: 5 // Show 5 elite competitors by default
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Store profile
    underdogProfiles.set(profileId, underdogProfile);

    console.log(`🎯 New underdog registered: ${fullName} (${profileId})`);

    // Send immediate psychological triggers
    res.status(201).json({ 
      created: true, 
      profile: underdogProfile,
      message: 'Welcome to the political arena! Build your legacy from scratch.',
      nextSteps: [
        'Complete your profile to increase citations',
        'Monitor elite competition for opportunities',
        'Build your political network strategically'
      ],
      eliteCompetitionCount: underdogProfile.progressMetrics.eliteCompetitionCount
    });

  } catch (error) {
    console.error('Underdog registration error:', error);
    res.status(500).json({ 
      error: 'Registration failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.get('/profile/:id', async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const profile = underdogProfiles.get(id);
    
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Include competitive insights
    res.json({ 
      success: true,
      profile,
      insights: {
        nextMilestone: 'Reach 10 citations to unlock premium features',
        competitionLevel: 'Growing field with 5+ elite competitors',
        growthPotential: 'High - new leaders gaining traction in your constituency'
      }
    });

  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update profile (for when underdogs build their reputation)
router.put('/profile/:id', async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const profile = underdogProfiles.get(id);
    
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Update profile with new citations or achievements
    const updates = req.body;
    
    profile.updatedAt = new Date();
    
    if (updates.citations) {
      profile.progressMetrics.currentCitations = updates.citations;
      profile.citations = updates.citations;
      profile.progressMetrics.growthRate = 
        updates.citations - profile.progressMetrics.initialCitations;
    }

    underdogProfiles.set(id, profile);

    res.json({ 
      success: true,
      profile,
      message: 'Profile updated successfully'
    });

  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get all underdogs (for competitive intelligence)
router.get('/all', async (req: any, res: Response) => {
  try {
    const allUnderdogs = Array.from(underdogProfiles.values())
      .sort((a, b) => b.progressMetrics.currentCitations - a.progressMetrics.currentCitations)
      .slice(0, 10); // Top 10 underdogs

    res.json({
      success: true,
      underdogs: allUnderdogs,
      totalCompetitors: underdogProfiles.size,
      message: allUnderdogs.length === 0 ? 'Be the first underdog to register!' : 'Competitors ranked by citations'
    });

  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch competitors' });
  }
});

export default router;
