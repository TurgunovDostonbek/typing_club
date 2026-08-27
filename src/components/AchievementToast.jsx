import React, { useEffect } from 'react';
import { Award, Trophy } from 'lucide-react';

export default function AchievementToast({ achievement, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Auto-dismiss after 5 seconds

    return () => clearTimeout(timer);
  }, [achievement, onClose]);

  if (!achievement) return null;

  return (
    <div className="achievement-toast" role="alert">
      <div className="summary-icon-container" style={{ color: 'var(--accent)', background: 'var(--accent-bg)' }}>
        <Trophy size={20} />
      </div>
      <div>
        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--accent)', fontWeight: 800 }}>
          Achievement Unlocked!
        </div>
        <h4 style={{ fontSize: '0.95rem', margin: '0.125rem 0', color: 'var(--text-bright)' }}>
          {achievement.title}
        </h4>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {achievement.desc}
        </p>
      </div>
    </div>
  );
}
