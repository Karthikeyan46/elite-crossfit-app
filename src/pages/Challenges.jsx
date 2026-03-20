import React from 'react';
import { useNavigate } from 'react-router-dom';
import { challenges } from '../data/challenges';
import './Challenges.css';

const Challenges = () => {
  const navigate = useNavigate();

  return (
    <div className="challenges-container">
      <header className="challenges-header">
        <h1>Daywise Challenges</h1>
        <p>Transform your body and mind with our structured fitness programs.</p>
      </header>

      <div className="challenges-grid">
        {challenges.map((challenge) => (
          <div 
            key={challenge.id} 
            className="challenge-card"
            onClick={() => navigate(`/challenges/${challenge.id}`)}
          >
            <div className="challenge-image-container">
              <img src={challenge.image} alt={challenge.title} />
              <span className="challenge-category">{challenge.category}</span>
            </div>
            
            <div className="challenge-content">
              <h3>{challenge.title}</h3>
              <p>{challenge.description}</p>
              
              <div className="challenge-meta">
                <div className="meta-item">
                  <span>⏱️ {challenge.duration} Days</span>
                </div>
                <div className={`difficulty-badge difficulty-${challenge.difficulty.toLowerCase()}`}>
                  {challenge.difficulty}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Challenges;
