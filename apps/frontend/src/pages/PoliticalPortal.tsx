export default function PoliticalPortal() {
  const [searchingName, setSearchingName] = useState('');
  const [foundProfile, setFoundProfile] = useState<PoliticianProfile | null>(null);
  
  const handleProfileSearch = async (name: string) => {
    // 🔍 Search existing profiles web-crawled from public sources
    const response = await fetch('/api/profiles/search', {
      method: 'POST',
      body: JSON.stringify({ name })
    });
    
    const profile = await response.json();
    
    if (profile) {
      setFoundProfile(profile);
      // 🎯 Auto-login without signup - profile already exists!
      psychologicalSocket.authenticatePolitician(profile.id, 'auto_generated_token');
    }
  };
  
  return (
    <div className="prospect-political-portal">
      {foundProfile ? (
        <div className="profile-found-screen">
          <h2>Your Political Profile is Ready!</h2>
          
          {/* 📊 Perplexity-style profile with citations */}
          <div className="political-profile">
            <div className="politician-header">
              <h3>{foundProfile.name}</h3>
              <span className="position">{foundProfile.position}</span>
              <span className="party">{foundProfile.party}</span>
            </div>
            
            {/* 🎯 Key insights with numbered citations */}
            <div className="public-insights">
              <h4>Public Profile Analysis</h4>
              <div className="insight-points">
                <p>Voter approval rating: 67% based on recent polling [1] [3]</p>
                <p> campaign spending: KES 12.5M disclosed in financial reports [2] [4]</p>
                <p> Social media engagement: Strong momentum on Twitter [5]</p>
                <p> Competition status: Facing 3 major opponents in constituency [1] [3]</p>
              </div>
            </div>
            
            {/* 📚 Citations section like Perplexity */}
            <div className="citation-source">
              <h4>Sources</h4>
              {[1, 2, 3, 4, 5].map(num => (
                <div key={num} className="citation-item">
                  <span className="citation-number">[{num}]</span>
                  <span className="citation-text">
                    {foundProfile.verifiedSources[num - 1]?.source} - {foundProfile.verifiedSources[num - 1]?.title}
                  </span>
                  <span className="citation-date">
                    {foundProfile.verifiedSources[num - 1]?.date}
                  </span>
                </div>
              ))}
            </div>
            
            {/* ⚡ Quick action - no signup needed */}
            <button 
              onClick={() => navigate('/dashboard')}
              className="enter-dashboard-btn"
            >
              Enter Political Marketplaces
            </button>
          </div>
        </div>
        
      ) : (
        <div className="profile-discovery">
          <h2>Find Your Political Profile</h2>
          <p>Search for your name - if you're a public official, we've already built your profile from public sources.</p>
          
          <input
            type="text"
            placeholder="Enter your full name..."
            value={searchingName}
            onChange={(e) => setSearchingName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleProfileSearch(searchingName)}
          />
          
          <button onClick={() => handleProfileSearch(searchingName)}>
            Search Profile
          </button>
        </div>
      )}
    </div>
  );
}
