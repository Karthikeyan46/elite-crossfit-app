import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { challenges } from '../data/challenges';
import './Challenges.css';

const ChallengeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const challenge = challenges.find(c => c.id === id);
  
  const [completedDays, setCompletedDays] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem(`challenge-progress-${id}`);
    if (saved) {
      setCompletedDays(JSON.parse(saved));
    }
  }, [id]);

  if (!challenge) {
    return (
      <div className="challenges-container">
        <h2>Challenge not found</h2>
        <button onClick={() => navigate('/challenges')}>Back to Challenges</button>
      </div>
    );
  }

  const toggleDayCompletion = (dayNumber) => {
    let newCompleted;
    if (completedDays.includes(dayNumber)) {
      newCompleted = completedDays.filter(d => d !== dayNumber);
    } else {
      newCompleted = [...completedDays, dayNumber].sort((a, b) => a - b);
    }
    setCompletedDays(newCompleted);
    localStorage.setItem(`challenge-progress-${id}`, JSON.stringify(newCompleted));
  };

  const progressPercentage = Math.round((completedDays.length / challenge.duration) * 100);

  return (
    <div className="challenge-detail-container">
      <button className="back-btn" onClick={() => navigate('/challenges')}>← Back</button>
      
      <header className="challenge-detail-header">
        <img src={challenge.image} alt={challenge.title} className="detail-image" />
        <div className="detail-header-content">
          <h1>{challenge.title}</h1>
          <p>{challenge.description}</p>
          <div className={`difficulty-badge difficulty-${challenge.difficulty.toLowerCase()}`}>
            {challenge.difficulty}
          </div>
        </div>
      </header>

      <section className="progress-section">
        <div className="progress-info">
          <h2>Your Progress</h2>
          <span>{progressPercentage}% Complete ({completedDays.length}/{challenge.duration} Days)</span>
        </div>
        <div className="progress-bar-container">
          <div className="progress-fill" style={{ width: `${progressPercentage}%` }}></div>
        </div>
      </section>

      <div className="days-grid">
        {challenge.days.map((day) => (
          <div 
            key={day.day} 
            className={`day-card ${completedDays.includes(day.day) ? 'completed' : ''}`}
          >
            <div className="day-header">
              <span className="day-number">Day {day.day}</span>
              {completedDays.includes(day.day) && <span className="status-icon">✅</span>}
            </div>
            <h4>{day.title}</h4>
            
            <ul className="task-list">
              {day.tasks.map((task, idx) => (
                <li key={idx} className="task-item">
                  <span>{task.name}</span>
                  <span>{task.sets} sets × {task.reps || task.duration}</span>
                </li>
              ))}
            </ul>

            <button 
              className={`complete-btn ${completedDays.includes(day.day) ? 'done' : ''}`}
              onClick={() => toggleDayCompletion(day.day)}
            >
              {completedDays.includes(day.day) ? 'Mark Incomplete' : 'Mark as Done'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChallengeDetail;
