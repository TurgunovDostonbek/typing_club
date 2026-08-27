import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { getStreak } from '../utils/statisticsUtils';
import { 
  Keyboard, 
  Flame, 
  Sun, 
  Moon, 
  Laptop, 
  Menu, 
  X,
  Play,
  BookOpen,
  BarChart2,
  Settings as SettingsIcon,
  Home
} from 'lucide-react';

export default function Header() {
  const { theme, toggleTheme, activeTheme } = useTheme();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const streak = getStreak();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/test', label: 'Test', icon: Play },
    { path: '/practice', label: 'Practice', icon: BookOpen },
    { path: '/statistics', label: 'Statistics', icon: BarChart2 },
    { path: '/settings', label: 'Settings', icon: SettingsIcon },
  ];

  const getThemeIcon = () => {
    if (theme === 'dark') return <Moon size={18} />;
    if (theme === 'light') return <Sun size={18} />;
    return <Laptop size={18} />;
  };

  const getThemeTitle = () => {
    if (theme === 'dark') return 'Dark Mode';
    if (theme === 'light') return 'Light Mode';
    return 'System Mode';
  };

  return (
    <header className="header">
      <div className="container header-container">
        <Link to="/" className="logo-section" onClick={() => setMobileMenuOpen(false)}>
          <Keyboard className="logo-icon" size={28} />
          <span>TypingPro</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="nav-links">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Header Actions */}
        <div className="header-actions">
          {/* Daily Streak */}
          {streak.count > 0 && (
            <div 
              className="pb-badge" 
              style={{ margin: 0, display: 'flex', animation: 'none' }}
              title={`${streak.count} day streak`}
            >
              <Flame size={16} fill="currentColor" />
              <span>{streak.count}d</span>
            </div>
          )}

          {/* Theme Toggle */}
          <button 
            className="btn btn-secondary" 
            onClick={toggleTheme}
            title={`Switch Theme (Current: ${getThemeTitle()})`}
            style={{ padding: '0.5rem', borderRadius: '50%', width: '2.25rem', height: '2.25rem' }}
          >
            {getThemeIcon()}
          </button>

          {/* Mobile Menu Button */}
          <button 
            className="hamburger-btn" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="nav-links mobile-open">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
