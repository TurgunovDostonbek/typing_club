import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Trophy, 
  RotateCcw, 
  Plus, 
  BarChart2, 
  Award, 
  Clock, 
  CheckCircle2, 
  X,
  Target
} from 'lucide-react';

export default function ResultModal({ isOpen, results, onRestart, onClose }) {
  const navigate = useNavigate();

  if (!isOpen || !results) return null;

  const handleViewStats = () => {
    onClose();
    navigate('/statistics');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            right: '1.25rem',
            top: '1.25rem',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer'
          }}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ color: 'var(--primary)', display: 'inline-flex', marginBottom: '0.5rem' }}>
            <CheckCircle2 size={48} />
          </div>
          <h2 className="modal-title">Test Complete!</h2>
          
          {/* New Personal Best celebration badge */}
          {results.isNewPB && (
            <div className="pb-badge">
              <Trophy size={16} />
              <span>🏆 New Personal Best! 🏆</span>
            </div>
          )}
        </div>

        {/* Results Grid */}
        <div className="results-grid">
          <div className="result-metric highlighted">
            <span className="label">Speed</span>
            <span className="val">{results.wpm} <span style={{ fontSize: '1rem', fontWeight: 500 }}>WPM</span></span>
          </div>
          <div className="result-metric highlighted" style={{ borderColor: 'var(--success)', backgroundColor: 'var(--success-bg)' }}>
            <span className="label">Accuracy</span>
            <span className="val" style={{ color: 'var(--success)' }}>{results.accuracy}%</span>
          </div>
          <div className="result-metric">
            <span className="label">Errors</span>
            <span className="val" style={{ color: 'var(--error)' }}>{results.errors}</span>
          </div>
          <div className="result-metric">
            <span className="label">Characters</span>
            <span className="val">{results.characters}</span>
          </div>
          <div className="result-metric">
            <span className="label">Time Spent</span>
            <span className="val" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
              <Clock size={16} style={{ color: 'var(--text-muted)' }} />
              {results.timeSpent}s
            </span>
          </div>
          <div className="result-metric" style={{ borderColor: 'var(--accent)', backgroundColor: 'var(--accent-bg)' }}>
            <span className="label">Personal Best</span>
            <span className="val" style={{ color: 'var(--accent)' }}>{results.personalBest} WPM</span>
          </div>
        </div>

        {/* Daily Challenge unlocked highlight */}
        {results.completedDailyChallenge && (
          <div className="card" style={{ borderColor: 'var(--accent)', backgroundColor: 'var(--accent-bg)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem' }}>
            <Trophy size={20} style={{ color: 'var(--accent)' }} />
            <div>
              <h5 style={{ color: 'var(--accent)', margin: 0, fontWeight: 700 }}>Daily Challenge Completed!</h5>
              <p style={{ fontSize: '0.75rem', color: 'var(--text)', margin: 0 }}>You hit 60+ WPM with 95%+ accuracy. Streak updated!</p>
            </div>
          </div>
        )}

        {/* Newly Unlocked Achievements */}
        {results.unlockedAchievements && results.unlockedAchievements.length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--accent)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <Award size={16} />
              <span>Achievements Unlocked!</span>
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {results.unlockedAchievements.map((ach) => (
                <div 
                  key={ach.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 0.75rem',
                    backgroundColor: 'var(--bg-surface-hover)',
                    borderRadius: '6px',
                    border: '1px dashed var(--accent)'
                  }}
                >
                  <Trophy size={16} style={{ color: 'var(--accent)' }} />
                  <div>
                    <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-bright)' }}>{ach.title}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>{ach.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions Footer */}
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={handleViewStats}>
            <BarChart2 size={16} />
            <span>Statistics</span>
          </button>
          <button className="btn btn-secondary" onClick={onRestart}>
            <Plus size={16} />
            <span>New Test</span>
          </button>
          <button className="btn btn-primary" onClick={onRestart} style={{ backgroundColor: 'var(--primary)', color: 'var(--bg)' }}>
            <RotateCcw size={16} />
            <span>Try Again</span>
          </button>
        </div>
      </div>
    </div>
  );
}
