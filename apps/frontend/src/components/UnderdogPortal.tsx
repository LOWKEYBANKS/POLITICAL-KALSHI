export default function UnderdogPortal() {
  const [signupData, setSignupData] = useState({
    fullName: '',
    position: '',
    constituency: '',
    party: '',
    email: '',
    phone: '',
    ambitionGoals: ''
  });
  const [isRegistered, setIsRegistered] = useState(false);
  
  const handleUnderdogSignup = async () => {
    // 🚀 Underdog empowerment - prove your worth!
    const response = await fetch('/api/underdogs/register', {
      method: 'POST',
      body: JSON.stringify(signupData)
    });
    
    const profile = await response.json();
    
    if (profile.created) {
      setIsRegistered(true);
      
      // ⚡ Underdog motivation - show competition stats
      toast.success('Welcome, Rising Star! Build your legacy!', {
        style: { backgroundColor: '#059669', color: '#fff' }
      });
      
      psychologicalSocket.authenticatePolitician(profile.id, 'underdog_access_granted');
      
      // 🎯 Show elite competition to motivate
      setTimeout(() => {
        psychologicalSocket.requestEliteRankings();
        psychologicalSocket.requestUnderdogOpportunities();
      }, 1000);
    }
  };
  
  return (
    <div className="underdog-portal">
      {!isRegistered ? (
        <div className="underdog-signup">
          <div className="underdog-header">
            <h1 className="text-3xl font-bold text-green-900">
              Political Rising Stars Registry
            </h1>
            <p className="text-green-700">
              For ambitious political leaders - build your competitive footprint
            </p>
          </div>
          
          {/* ⚡ Underdog Motivation Display */}
          <div className="current-opportunities">
            <h3>Today's Political Opportunities</h3>
            <div className="opportunity-grid">
              <div className="opportunity">
                <span className="opp-icon">🎯</span>
                <h4>12 Open Constituency Races</h4>
                <p>Positions without established incumbents</p>
              </div>
              <div className="opportunity">
                <span className="opp-icon">💪</span>
                <h4>5 Party Leadership Vacancies</h4>
                <p>Upcoming party elections nationwide</p>
              </div>
              <div className="opportunity">
                <span className="opp-icon">📈</span>
                <h4>Growing Voter Discontent</h4>
                <p>35% districts seeking new leadership</p>
              </div>
            </div>
          </div>
          
          {/* 📝 Underdog Registration Form */}
          <div className="underdog-signup-form">
            <h3>Create Your Political Identity</h3>
            
            <div className="form-section">
              <h4>Political Ambition</h4>
              <input
                placeholder="Your Full Name"
                value={signupData.fullName}
                onChange={(e) => setSignupData({...signupData, fullName: e.target.value})}
              />
              
              <select 
                value={signupData.position}
                onChange={(e) => setSignupData({...signupData, position: e.target.value})}
              >
                <option value="">Select Position Type</option>
                <option value="MP Candidate">MP Candidate</option>
                <option value="Senator">Senator</option>
                <option value="Governor">Governor</option>
                <option value="MCA">MCA</option>
                <option value="Party Leader">Party Leader</option>
              </select>
              
              <input
                placeholder="Target Constituency"
                value={signupData.constituency}
                onChange={(e) => setSignupData({...signupData, constituency: e.target.value})}
              />
              
              <input
                placeholder="Political Party/Independent"
                value={signupData.party}
                onChange={(e) => setSignupData({...signupData, party: e.target.value})}
              />
            </div>
            
            <div className="form-section">
              <h4>Competitive Intelligence</h4>
              <input
                type="email"
                placeholder="Contact Email"
                value={signupData.email}
                onChange={(e) => setSignupData({...signupData, email: e.target.value})}
              />
              
              <input
                type="tel"
                placeholder="Phone Number"
                value={signupData.phone}
                onChange={(e) => setSignupData({...signupData, phone: e.target.value})}
              />
              
              <textarea
                placeholder="Your Political Goals & What Sets You Apart"
                value={signupData.ambitionGoals}
                onChange={(e) => setSignupData({...signupData, ambitionGoals: e.target.value})}
              />
            </div>
            
            <button onClick={handleUnderdogSignup}>
              <span className="underdog-icon">⚡</span>
              Build Political Presence
            </button>
          </div>
        </div>
      ) : (
        <div className="underdog-profile-created">
          <h2>Political Foundation Established!</h2>
          <p>Your competitive journey begins now, {signupData.fullName}!</p>
          
          {/* 🚀 Underdog Motivation Dashboard */}
          <div className="underdog-dashboard-preview">
            <h3>Your Starting Position</h3>
            
            <div className="starting-stats">
              <div className="stat">
                <span className="stat-value">0</span>
                <span className="stat-label">Profile Citations</span>
              </div>
              <div className="stat">
                <span className="stat-value">New</span>
                <span className="stat-label">Market Status</span>
              </div>
              <div className="stat">
                <span className="stat-value">Build</span>
                <span className="stat-label">Your Legacy</span>
              </div>
            </div>
            
            {/* ⚡ Competition Motivators */}
            <div className="elite-competition-preview">
              <h4>Elite Politicians Already Competing</h4>
              <div className="elite-examples">
                <div className="elite-preview">
                  <span className="elite-status">👑 Elite</span>
                  <span className="elite-name">James Karanja</span>
                  <span className="elite-stats">124 Citations • KES 2.5M Spent</span>
                </div>
                <div className="elite-preview">
                  <span className="elite-status">👑 Elite</span>
                  <span className="elite-name">Aisha Hassan</span>
                  <span className="elite-stats">87 Citations • KES 1.8M Spent</span>
                </div>
              </div>
            </div>
          </div>
          
          <button onClick={() => navigate('/dashboard')}>
            Enter Your Command Center
          </button>
        </div>
      )}
    </div>
  );
}
