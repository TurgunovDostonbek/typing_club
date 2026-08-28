import React from 'react';
import { Link } from 'react-router-dom';
import { getStatsSummary, getDailyChallenge } from '../utils/statisticsUtils';
import { 
  Play, 
  BookOpen, 
  Code,
  Zap, 
  Target, 
  Clock, 
  Award, 
  BarChart2, 
  Keyboard as KeyboardIcon,
  Flame,
  CheckCircle2
} from 'lucide-react';

export default function Home() {
  const stats = getStatsSummary();
  const dailyChallenge = getDailyChallenge();

  const features = [
    { 
      icon: Zap, 
      title: "Real-time WPM", 
      desc: "Track your typing speed dynamically character by character, calculating true words per minute." 
    },
    { 
      icon: Target, 
      title: "Accuracy Tracking", 
      desc: "Monitor your precision in real-time. Aim for 100% and build professional muscle memory." 
    },
    { 
      icon: Clock, 
      title: "Custom Timer", 
      desc: "Choose preset intervals (15, 30, 60, 120s) or set a personalized countdown limit for tests." 
    },
    { 
      icon: Award, 
      title: "Personal Best", 
      desc: "Record and store high scores for each time limit mode, pushing yourself to exceed your records." 
    },
    { 
      icon: BarChart2, 
      title: "Detailed Statistics", 
      desc: "Analyze your progression over time using history tables and modern interactive WPM line charts." 
    },
    { 
      icon: KeyboardIcon, 
      title: "Virtual Keyboard", 
      desc: "A responsive keyboard layout that lights up in real-time, matching your keystrokes and highlighting errors." 
    }
  ];

  return (
    <div className="container" style={{ paddingBottom: '3rem' }}>
      {/* Hero Section */}
      <section className="hero-section" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2rem', textAlign: 'left', alignItems: 'center', padding: '4rem 0' }}>
        <div className="hero-left">
          <h1 className="hero-title" style={{ margin: '0 0 1rem 0', fontSize: '3.5rem', lineHeight: 1.15 }}>
            Improve Your <br />Typing Speed
          </h1>
          <p className="hero-subtitle" style={{ margin: '0 0 2rem 0', fontSize: '1.25rem' }}>
            Practice every day. Type faster. Make fewer mistakes. Built for developers, students, and touch typists.
          </p>
          <div className="hero-actions" style={{ marginBottom: 0, gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link to="/test" className="btn btn-primary" style={{ padding: '0.75rem 1.75rem' }}>
              <Play size={20} fill="currentColor" />
              <span>Start Typing</span>
            </Link>
            <Link to="/practice" className="btn btn-secondary" style={{ padding: '0.75rem 1.75rem' }}>
              <BookOpen size={20} />
              <span>Practice Mode</span>
            </Link>
            <Link to="/coding" className="btn btn-secondary" style={{ padding: '0.75rem 1.75rem' }}>
              <Code size={20} />
              <span>Coding Mode</span>
            </Link>
          </div>
        </div>
        
        {/* Decorative Keyboard Vector Illustration */}
        <div className="hero-right" style={{ display: 'flex', justifyContent: 'center' }}>
          <svg width="320" height="200" viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ maxWidth: '100%', height: 'auto' }}>
            <rect x="10" y="20" width="300" height="160" rx="16" fill="var(--bg-surface)" stroke="var(--border)" strokeWidth="4" />
            <rect x="25" y="35" width="22" height="22" rx="4" fill="var(--border)" opacity="0.6" />
            <rect x="52" y="35" width="22" height="22" rx="4" fill="var(--border)" opacity="0.6" />
            <rect x="79" y="35" width="22" height="22" rx="4" fill="var(--border)" opacity="0.6" />
            <rect x="106" y="35" width="22" height="22" rx="4" fill="var(--border)" opacity="0.6" />
            <rect x="133" y="35" width="22" height="22" rx="4" fill="var(--border)" opacity="0.6" />
            <rect x="160" y="35" width="22" height="22" rx="4" fill="var(--border)" opacity="0.6" />
            <rect x="187" y="35" width="22" height="22" rx="4" fill="var(--border)" opacity="0.6" />
            <rect x="214" y="35" width="22" height="22" rx="4" fill="var(--border)" opacity="0.6" />
            <rect x="241" y="35" width="22" height="22" rx="4" fill="var(--border)" opacity="0.6" />
            <rect x="268" y="35" width="27" height="22" rx="4" fill="var(--border)" />
            
            {/* Typing highlighted keys */}
            <rect x="25" y="62" width="27" height="22" rx="4" fill="var(--border)" />
            <rect x="57" y="62" width="22" height="22" rx="4" fill="var(--primary)" />
            <rect x="84" y="62" width="22" height="22" rx="4" fill="var(--border)" opacity="0.6" />
            <rect x="111" y="62" width="22" height="22" rx="4" fill="var(--border)" opacity="0.6" />
            <rect x="138" y="62" width="22" height="22" rx="4" fill="var(--border)" opacity="0.6" />
            <rect x="165" y="62" width="22" height="22" rx="4" fill="var(--border)" opacity="0.6" />
            <rect x="192" y="62" width="22" height="22" rx="4" fill="var(--border)" opacity="0.6" />
            <rect x="219" y="62" width="22" height="22" rx="4" fill="var(--border)" opacity="0.6" />
            <rect x="246" y="62" width="22" height="22" rx="4" fill="var(--border)" opacity="0.6" />
            <rect x="273" y="62" width="22" height="22" rx="4" fill="var(--border)" opacity="0.6" />
            
            <rect x="25" y="89" width="32" height="22" rx="4" fill="var(--border)" />
            <rect x="62" y="89" width="22" height="22" rx="4" fill="var(--border)" opacity="0.6" />
            <rect x="89" y="89" width="22" height="22" rx="4" fill="var(--border)" opacity="0.6" />
            <rect x="116" y="89" width="22" height="22" rx="4" fill="var(--border)" opacity="0.6" />
            <rect x="143" y="89" width="22" height="22" rx="4" fill="var(--success)" />
            <rect x="170" y="89" width="22" height="22" rx="4" fill="var(--border)" opacity="0.6" />
            <rect x="197" y="89" width="22" height="22" rx="4" fill="var(--border)" opacity="0.6" />
            <rect x="224" y="89" width="22" height="22" rx="4" fill="var(--border)" opacity="0.6" />
            <rect x="251" y="89" width="22" height="22" rx="4" fill="var(--border)" opacity="0.6" />
            <rect x="278" y="89" width="17" height="22" rx="4" fill="var(--border)" />
            
            <rect x="25" y="116" width="40" height="22" rx="4" fill="var(--border)" />
            <rect x="70" y="116" width="22" height="22" rx="4" fill="var(--border)" opacity="0.6" />
            <rect x="97" y="116" width="22" height="22" rx="4" fill="var(--border)" opacity="0.6" />
            <rect x="124" y="116" width="22" height="22" rx="4" fill="var(--border)" opacity="0.6" />
            <rect x="151" y="116" width="22" height="22" rx="4" fill="var(--border)" opacity="0.6" />
            <rect x="178" y="116" width="22" height="22" rx="4" fill="var(--border)" opacity="0.6" />
            <rect x="205" y="116" width="22" height="22" rx="4" fill="var(--border)" opacity="0.6" />
            <rect x="232" y="116" width="22" height="22" rx="4" fill="var(--border)" opacity="0.6" />
            <rect x="259" y="116" width="36" height="22" rx="4" fill="var(--border)" />
            
            <rect x="75" y="143" width="160" height="22" rx="4" fill="var(--primary)" opacity="0.7" />
          </svg>
        </div>
      </section>

      {/* Media Query workaround style for stack grid */}
      <style>{`
        @media (max-width: 768px) {
          .hero-section {
            grid-template-columns: 1fr !important;
            text-align: center !important;
            padding: 2.5rem 0 !important;
          }
          .hero-left {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .hero-right {
            display: none !important;
          }
        }
      `}</style>

      {/* Dashboard Section */}
      {stats.totalTests > 0 ? (
        <section style={{ margin: '1rem 0 3rem 0' }}>
          <div className="card" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>Welcome Back!</span>
            </h2>
            <div className="dashboard-summary" style={{ margin: 0 }}>
              <div className="summary-card card" style={{ padding: '1rem' }}>
                <div className="summary-icon-container" style={{ color: 'var(--accent)', backgroundColor: 'var(--accent-bg)' }}>
                  <Flame size={24} fill="currentColor" />
                </div>
                <div className="summary-details">
                  <h4>Daily Streak</h4>
                  <p>{stats.streak} {stats.streak === 1 ? 'day' : 'days'}</p>
                </div>
              </div>
              <div className="summary-card card" style={{ padding: '1rem' }}>
                <div className="summary-icon-container">
                  <Award size={24} />
                </div>
                <div className="summary-details">
                  <h4>Best Speed</h4>
                  <p>{stats.bestWpm} WPM</p>
                </div>
              </div>
              <div className="summary-card card" style={{ padding: '1rem' }}>
                <div className="summary-icon-container" style={{ color: 'var(--success)', backgroundColor: 'var(--success-bg)' }}>
                  <Target size={24} />
                </div>
                <div className="summary-details">
                  <h4>Avg Accuracy</h4>
                  <p>{stats.averageAccuracy}%</p>
                </div>
              </div>
              <div className="summary-card card" style={{ padding: '1rem' }}>
                <div className="summary-icon-container" style={{ color: 'var(--primary)', backgroundColor: 'rgba(var(--primary-rgb), 0.1)' }}>
                  <KeyboardIcon size={24} />
                </div>
                <div className="summary-details">
                  <h4>Tests Taken</h4>
                  <p>{stats.totalTests}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* Daily Challenge Goal card */}
      <section className="card daily-challenge-card">
        <div className="challenge-header">
          {dailyChallenge.completed ? (
            <div className="challenge-completed-badge">
              <CheckCircle2 size={20} />
              <span>Daily Challenge Completed!</span>
            </div>
          ) : (
            <div className="challenge-badge">
              <Flame size={20} fill="currentColor" />
              <span>Today's Daily Challenge Goal</span>
            </div>
          )}
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Resets daily
          </span>
        </div>
        <p style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-bright)' }}>
          {dailyChallenge.completed 
            ? "Amazing work! You reached 60 WPM with at least 95% accuracy today." 
            : "🔥 Today's Goal: Reach 60 WPM with 95% accuracy on any standard Typing Test."}
        </p>
        {!dailyChallenge.completed && (
          <div style={{ marginTop: '1rem' }}>
            <Link to="/test" className="btn btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
              Accept Challenge
            </Link>
          </div>
        )}
      </section>

      {/* Features Grid */}
      <section style={{ margin: '4rem 0' }}>
        <h2 className="features-title">Designed for Peak Typing Performance</h2>
        <div className="features-grid">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div className="card feature-card" key={idx}>
                <Icon className="feature-icon" size={28} />
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works card" style={{ padding: '3rem 2rem' }}>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>How It Works</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Get speed-typing in three simple steps.</p>
        <div className="steps-container">
          <div className="step-item">
            <div className="step-number">1</div>
            <h3>Choose your mode</h3>
            <p>Pick a countdown timer range or hop into practice mode to choose your text difficulty.</p>
          </div>
          <div className="step-item">
            <div className="step-number">2</div>
            <h3>Start typing</h3>
            <p>Press any key to begin. Keep your eyes on the text and focus on typing clean letters.</p>
          </div>
          <div className="step-item">
            <div className="step-number">3</div>
            <h3>See your results</h3>
            <p>Unlock custom achievements, track personal bests, and visualize your WPM progress.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
