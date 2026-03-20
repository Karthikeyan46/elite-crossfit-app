import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { challenges } from '../data/challenges';
import { Trophy, ChevronRight } from 'lucide-react';

const ChallengeSummaryCard = () => {
  const navigate = useNavigate();
  const [activeChallenges, setActiveChallenges] = useState([]);

  useEffect(() => {
    const active = challenges.filter(c => {
      const saved = localStorage.getItem(`challenge-progress-${c.id}`);
      return saved && JSON.parse(saved).length > 0;
    }).map(c => {
      const saved = JSON.parse(localStorage.getItem(`challenge-progress-${c.id}`));
      return {
        ...c,
        completedCount: saved.length,
        progress: Math.round((saved.length / c.duration) * 100)
      };
    });
    setActiveChallenges(active);
  }, []);

  if (activeChallenges.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
        <Trophy size={48} className="primary" style={{ opacity: 0.3, marginBottom: '1rem' }} />
        <h3>No Active Challenges</h3>
        <p className="text-dim">Take your fitness to the next level by joining a challenge!</p>
        <button 
          className="primary-button" 
          onClick={() => navigate('/challenges')}
          style={{ marginTop: '1.5rem' }}
        >
          Browse Challenges
        </button>
      </div>
    );
  }

  return (
    <div className="challenges-summary-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {activeChallenges.map(challenge => (
        <div 
          key={challenge.id} 
          className="glass-panel active-challenge-item" 
          onClick={() => navigate(`/challenges/${challenge.id}`)}
          style={{ 
            padding: '1.5rem', 
            cursor: 'pointer',
            transition: 'transform 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem'
          }}
        >
          <div className="challenge-icon-container" style={{ position: 'relative' }}>
             <img src={challenge.image} alt="" style={{ width: '60px', height: '60px', borderRadius: '12px', objectFit: 'cover' }} />
             <div style={{
               position: 'absolute',
               bottom: '-5px',
               right: '-5px',
               background: 'var(--primary)',
               width: '24px',
               height: '24px',
               borderRadius: '50%',
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
               fontSize: '10px',
               color: 'black',
               fontWeight: 'bold'
             }}>
               {challenge.progress}%
             </div>
          </div>
          
          <div style={{ flex: 1 }}>
            <h4 style={{ margin: 0 }}>{challenge.title}</h4>
            <p className="text-dim" style={{ fontSize: '0.85rem', margin: '4px 0 8px' }}>
              Day {challenge.completedCount} of {challenge.duration}
            </p>
            <div className="progress-bar-container" style={{ margin: 0, height: '6px' }}>
              <div className="progress-bar-fill" style={{ width: `${challenge.progress}%` }}></div>
            </div>
          </div>
          
          <ChevronRight size={20} className="text-dim" />
        </div>
      ))}
    </div>
  );
};

export default ChallengeSummaryCard;
