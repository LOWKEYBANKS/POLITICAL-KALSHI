import { Router } from 'express';
import { PoliticalProfiler } from '../services/politicalProfiler';

const router = Router();

router.post('/discover', async (req, res) => {
  const { name } = req.body;
  try {
    const profiler = new PoliticalProfiler();
    const profile = await profiler.profilePoliticianByName(name);
    res.json({ found: !!profile, profile });
  } catch (error) {
    res.status(500).json({ error: 'Profiling failed' });
  }
});

export default router;

// apps/backend/src/app/routes/underdog.routes.ts (CREATE NEEDED)  
import { Router } from 'express';

const router = Router();

router.post('/register', async (req, res) => {
  const { fullName, position, constituency, party, email } = req.body;
  // Create underdog profile
  const profile = {
    id: fullName.toLowerCase().replace(/\s+/g, '_'),
    name: fullName,
    position,
    constituency,
    party,
    type: 'underdog',
    citations: 0,
    status: 'active'
  };
  
  res.json({ created: true, profile });
});

export default router;
