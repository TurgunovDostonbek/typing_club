import React from 'react';
import { Link } from 'react-router-dom';
import { Home, HelpCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="container page-404-container">
      <div style={{ color: 'var(--primary)', marginBottom: '1rem' }}>
        <HelpCircle size={64} />
      </div>
      <h1 className="title-404">404</h1>
      <h2 className="subtitle-404">Page Not Found</h2>
      <p className="desc-404">
        The page you are looking for might have been removed, had its name changed,
        or is temporarily unavailable.
      </p>
      <Link to="/" className="btn btn-primary">
        <Home size={18} />
        <span>Back to Home</span>
      </Link>
    </div>
  );
}
