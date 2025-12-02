export default function ElitePortal() {
  const [searchQuery, setSearchQuery] = useState('');
  const [discoveredProfile, setDiscoveredProfile] = useState<PoliticianProfile | null>(null);
  
  const handleEliteSearch = async (name: string) => {
    // 🚨 Instant gratification - "We found you!"
    const response = await fetch('/api/elites/discover', {
      method: 'POST',
      body: JSON.stringify({ 
        name,
        searchMode: 'elite' // Only search known political databases
      })
    });
    
    const profile = await response.json();
    
    if (profile.found) {
      setDiscoveredProfile(profile);
      
      // 🎯 ELITE BRANDING - "You're already known!"
      toast.success(`Elite Status: ${name} profile found!`, {
        style: { backgroundColor: '#7c3aed', color: '#fff' }
      });
      
      // Immediate elite access - no signup barriers
      psychologicalSocket.authenticatePolitician(profile.id, 'elite_access_granted');
      
      // 🏆 Rival anxiety triggers activation
      setTimeout(() => {
        psychologicalSocket.requestRivalActivity();
        psychologicalSocket.requestLeaderboard('elite');
      }, 1000);
    }
  };
  
  return (
    <div className="elite-discovery-portal">
      {!discoveredProfile ? (
        <div className="elite-search">
          <div className="prestige-header">
            <h1 className="text-3xl font-bold text-purple-900">
              Political Elite Detection System
            </h1>
            <p className="text-purple-700">
              For established political leaders - access your competitive intelligence instantly
            </p>
          </div>
          
          <div className="elite-search-form">
            <h2>Your Political Presence Is Already Catalogued</h2>
            <p>Most senior officials are already in our public database of political influence</p>
            
            <input
              type="text"
              placeholder="Enter your full political name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="elite-name-input"
            />
            
            <button onClick={() => handleEliteSearch(searchQuery)}>
              <span className="elite-icon">👑</span>
              Access Elite Profile
            </button>
          </div>
          
          {/* 🏆 Elite Credibility Display */}
          <div className="elite-trust-signals">
            <div className="trust-item">
              <span className="signal-icon">📊</span>
              <div>
                <h3>15+ Public Sources Analyzed</h3>
                <p>Parliament records, media coverage, party databases</p>
              </div>
            </div>
            <div className="trust-item">
              <span className="signal-icon">🎯</span>
              <div>
                <h3>98% Profile Accuracy</h3>
                <p>Verified citations from official political records</p>
              </div>
            </div>
            <div className="trust-item">
              <span className="signal-icon">⚡</span>
              <div>
                <h3>Instant Competition Access</h3>
                <p>Immediate rivalry monitoring and intelligence</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="elite-profile-access">
          <div className="elite-confirmation">
            <span className="crown-icon">👑</span>
            <h2>Elite Political Profile Confirmed</h2>
            <p>{discoveredProfile.name} • {discoveredProfile.position}</p>
          </div>
          
          {/* 📊 Elite Profile Display */}
          <div className="elite-profile-summary">
            <div className="prestige-indicators">
              <div className="indicator">
                <span className="label">Political Influence:</span>
                <span className="value">National Level</span>
              </div>
              <div className="indicator">
                <span className="label">Competition Rank:</span>
                <span className="value">#3 in Region</span>
              </div>
              <div className="indicator">
                <span className="label">Network Strength:</span>
                <span className="value">85 Connections</span>
              </div>
            </div>
            
            {/* 🎭 Perplexity-style citations */}
            <div className="elite-citations">
              <h3>Profile Verified From:</h3>
              {discoveredProfile.verifiedSources.map((citation, idx) => (
                <div key={idx} className="citation-ref">
                  <span className="cite-num">[{idx + 1}]</span>
                  <span className="cite-source">{citation.source}</span>
                  <span className="cite-confidence">{Math.round(citation.confidence * 100)}% confidence</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* ⚡ Immediate Elite Access */}
          <div className="elite-dashboard-access">
            <h3>Your Strategic Command Center Awaits</h3>
            <button onClick={() => navigate('/dashboard')}>
              Enter Intelligence Dashboard
            </button>
            
            <div className="elite-features">
              <div className="feature">🎯 Real-time Rival Monitoring</div>
              <div className="feature">📊 Status Competition Tracking</div>
              <div className="feature">💰 Premium Market Access</div>
              <div className="feature">🏆 Elite Leaderboard Position</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
