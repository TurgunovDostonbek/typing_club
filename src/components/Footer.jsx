import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="container">
        <p>&copy; {currentYear} TypingPro. Built for developers and typing enthusiasts.</p>
        <p style={{ fontSize: '0.75rem', marginTop: '0.5rem', opacity: 0.7 }}>
          Press <kbd style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', padding: '1px 4px', borderRadius: '3px' }}>Tab</kbd> then <kbd style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', padding: '1px 4px', borderRadius: '3px' }}>Enter</kbd> to restart a test anytime.
        </p>
      </div>
    </footer>
  );
}
