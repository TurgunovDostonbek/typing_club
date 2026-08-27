import React, { useState } from 'react';
import { 
  getHistory, 
  getStatsSummary, 
  getAchievements, 
  clearAllData 
} from '../utils/statisticsUtils';
import { 
  BarChart2, 
  Trophy, 
  Award, 
  Activity, 
  Clock, 
  Target, 
  RotateCcw, 
  Calendar,
  Zap,
  Flame,
  ShieldCheck,
  History,
  AlertTriangle
} from 'lucide-react';

export default function Statistics() {
  const [history, setHistory] = useState(() => getHistory());
  const [stats, setStats] = useState(() => getStatsSummary());
  const [unlockedAchievements, setUnlockedAchievements] = useState(() => getAchievements());
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const handleResetData = () => {
    clearAllData();
    setHistory([]);
    setStats({
      averageWpm: 0,
      bestWpm: 0,
      averageAccuracy: 0,
      bestAccuracy: 0,
      totalTests: 0,
      totalCharacters: 0,
      totalTime: 0,
      totalErrors: 0,
      streak: 0
    });
    setUnlockedAchievements([]);
    setShowConfirmReset(false);
  };

  const formatTotalTime = (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins < 60) return `${mins}m ${secs}s`;
    const hrs = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return `${hrs}h ${remainingMins}m`;
  };

  // Achievements Definition list
  const achievementsList = [
    { 
      id: 'first_test', 
      title: 'First Test', 
      desc: 'Complete your first typing test.',
      icon: ShieldCheck
    },
    { 
      id: 'speed_demon', 
      title: 'Speed Demon', 
      desc: 'Reach 80 WPM in any test.',
      icon: Zap
    },
    { 
      id: 'speed_god', 
      title: 'Speed God', 
      desc: 'Reach 100 WPM in any test.',
      icon: Flame
    },
    { 
      id: 'accuracy_master', 
      title: 'Accuracy Master', 
      desc: 'Reach 98% accuracy (at 30+ WPM).',
      icon: Target
    },
    { 
      id: '7_day_streak', 
      title: '7 Day Streak', 
      desc: 'Practice for 7 consecutive days.',
      icon: Calendar
    },
    { 
      id: 'dedicated_typist', 
      title: 'Dedicated Typist', 
      desc: 'Complete 10 typing tests.',
      icon: Clock
    }
  ];

  // Custom SVG line chart plotting logic
  const renderChart = () => {
    // Select last 15 tests for clean visual fitting
    const chartData = [...history].reverse().slice(-15);
    
    if (chartData.length < 2) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Complete at least 2 tests to generate progress chart trends.
        </div>
      );
    }

    const width = 500;
    const height = 180;
    const padding = 25;

    const wpmValues = chartData.map(d => d.wpm);
    const minWpm = Math.max(0, Math.min(...wpmValues) - 10);
    const maxWpm = Math.max(...wpmValues) + 10;
    const yRange = maxWpm - minWpm;

    // Calculate X and Y coordinates
    const points = chartData.map((d, index) => {
      const x = padding + (index * (width - 2 * padding)) / (chartData.length - 1);
      const y = (height - padding) - ((d.wpm - minWpm) * (height - 2 * padding)) / yRange;
      return { x, y, val: d.wpm, date: d.date.split(',')[0] };
    });

    // Create polyline stroke representation
    const pathD = points.reduce((acc, p, idx) => {
      return acc + `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y} `;
    }, '');

    // Grid markers
    const gridLinesCount = 3;
    const gridLines = Array.from({ length: gridLinesCount }).map((_, i) => {
      const wpmVal = Math.round(minWpm + (yRange * i) / (gridLinesCount - 1));
      const y = (height - padding) - ((wpmVal - minWpm) * (height - 2 * padding)) / yRange;
      return { y, label: wpmVal };
    });

    return (
      <svg className="custom-chart-svg" viewBox={`0 0 ${width} ${height}`}>
        {/* Draw grid lines */}
        {gridLines.map((line, idx) => (
          <g key={idx}>
            <line 
              x1={padding} 
              y1={line.y} 
              x2={width - padding} 
              y2={line.y} 
              className="chart-grid-line" 
            />
            <text 
              x={padding - 5} 
              y={line.y + 3} 
              textAnchor="end" 
              className="chart-text"
            >
              {line.label}
            </text>
          </g>
        ))}

        {/* Draw trend line */}
        <path d={pathD} className="chart-line" />

        {/* Draw interactive dots */}
        {points.map((p, idx) => (
          <g key={idx}>
            <circle 
              cx={p.x} 
              cy={p.y} 
              r="4" 
              className="chart-dot" 
            />
            {/* Tooltip on WPM */}
            <title>{`Test #${idx + 1}: ${p.val} WPM (${p.date})`}</title>
            {/* Labels below dots if not too dense */}
            {chartData.length <= 10 && (
              <text 
                x={p.x} 
                y={p.y - 8} 
                textAnchor="middle" 
                className="chart-text" 
                style={{ fill: 'var(--text-bright)', fontWeight: 600 }}
              >
                {p.val}
              </text>
            )}
          </g>
        ))}
      </svg>
    );
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <BarChart2 className="logo-icon" size={28} />
            <span>Statistics Dashboard</span>
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Monitor your speed, accuracy progression, streaks, and unlocked typing achievements.
          </p>
        </div>

        {history.length > 0 && (
          <div>
            {!showConfirmReset ? (
              <button className="btn btn-danger" onClick={() => setShowConfirmReset(true)} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                <RotateCcw size={16} />
                <span>Reset All Stats</span>
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--error)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <AlertTriangle size={14} /> Are you sure?
                </span>
                <button className="btn btn-danger" onClick={handleResetData} style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                  Yes
                </button>
                <button className="btn btn-secondary" onClick={() => setShowConfirmReset(false)} style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {history.length === 0 ? (
        <div className="card empty-state">
          <Activity className="empty-state-icon" size={48} style={{ margin: '0 auto 1rem auto' }} />
          <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-bright)' }}>No typing tests yet</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', maxWidth: '400px', marginInline: 'auto' }}>
            Complete your first typing speed test or practice session to aggregate your visual metrics and unlock badges.
          </p>
          <a href="/test" className="btn btn-primary">
            Take Speed Test
          </a>
        </div>
      ) : (
        <div className="stats-layout">
          
          {/* Summary Cards */}
          <div className="dashboard-summary" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
            <div className="summary-card card" style={{ padding: '1rem' }}>
              <div className="summary-icon-container">
                <Activity size={20} />
              </div>
              <div className="summary-details">
                <h4>Average Speed</h4>
                <p>{stats.averageWpm} WPM</p>
              </div>
            </div>
            <div className="summary-card card" style={{ padding: '1rem' }}>
              <div className="summary-icon-container" style={{ color: 'var(--accent)', backgroundColor: 'var(--accent-bg)' }}>
                <Trophy size={20} />
              </div>
              <div className="summary-details">
                <h4>Best Speed</h4>
                <p>{stats.bestWpm} WPM</p>
              </div>
            </div>
            <div className="summary-card card" style={{ padding: '1rem' }}>
              <div className="summary-icon-container" style={{ color: 'var(--success)', backgroundColor: 'var(--success-bg)' }}>
                <Target size={20} />
              </div>
              <div className="summary-details">
                <h4>Avg Accuracy</h4>
                <p>{stats.averageAccuracy}%</p>
              </div>
            </div>
            <div className="summary-card card" style={{ padding: '1rem' }}>
              <div className="summary-icon-container" style={{ color: 'var(--error)', backgroundColor: 'var(--error-bg)' }}>
                <AlertTriangle size={20} />
              </div>
              <div className="summary-details">
                <h4>Total Errors</h4>
                <p>{stats.totalErrors}</p>
              </div>
            </div>
          </div>

          <div className="dashboard-summary" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginTop: '-1rem' }}>
            <div className="summary-card card" style={{ padding: '1rem' }}>
              <div className="summary-icon-container" style={{ color: 'var(--primary)', backgroundColor: 'rgba(var(--primary-rgb), 0.1)' }}>
                <ShieldCheck size={20} />
              </div>
              <div className="summary-details">
                <h4>Total Tests</h4>
                <p>{stats.totalTests}</p>
              </div>
            </div>
            <div className="summary-card card" style={{ padding: '1rem' }}>
              <div className="summary-icon-container">
                <Clock size={20} />
              </div>
              <div className="summary-details">
                <h4>Total Time</h4>
                <p>{formatTotalTime(stats.totalTime)}</p>
              </div>
            </div>
            <div className="summary-card card" style={{ padding: '1rem' }}>
              <div className="summary-icon-container" style={{ color: 'var(--accent)', backgroundColor: 'var(--accent-bg)' }}>
                <Flame size={20} fill="currentColor" />
              </div>
              <div className="summary-details">
                <h4>Daily Streak</h4>
                <p>{stats.streak} days</p>
              </div>
            </div>
            <div className="summary-card card" style={{ padding: '1rem' }}>
              <div className="summary-icon-container">
                <Zap size={20} />
              </div>
              <div className="summary-details">
                <h4>Total Chars</h4>
                <p>{stats.totalCharacters}</p>
              </div>
            </div>
          </div>

          {/* Chart & Achievements Row */}
          <div className="stats-grid-row">
            {/* WPM Trend Chart */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <Activity size={18} style={{ color: 'var(--primary)' }} />
                <span>WPM History Trend (Last 15 Tests)</span>
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1rem' }}>
                Track your writing rate progress timeline. Hover dots to see exact values.
              </p>
              <div className="chart-wrapper" style={{ flexGrow: 1 }}>
                {renderChart()}
              </div>
            </div>

            {/* Achievements Grid */}
            <div className="card">
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <Award size={18} style={{ color: 'var(--accent)' }} />
                <span>Typing Milestones & Achievements</span>
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1rem' }}>
                Practice daily and hit target typing speeds to unlock badges.
              </p>
              
              <div className="achievements-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem', marginTop: 0 }}>
                {achievementsList.map((ach) => {
                  const isUnlocked = unlockedAchievements.includes(ach.id);
                  const Icon = ach.icon;
                  return (
                    <div 
                      key={ach.id} 
                      className={`card achievement-card ${isUnlocked ? 'unlocked' : ''}`}
                      style={{ padding: '0.75rem', borderRadius: '8px' }}
                      title={ach.desc}
                    >
                      <div className="achievement-badge" style={{ width: '2.25rem', height: '2.25rem', flexShrink: 0 }}>
                        <Icon size={16} />
                      </div>
                      <div className="achievement-details">
                        <h4 style={{ fontSize: '0.85rem', fontWeight: 700, margin: 0 }}>{ach.title}</h4>
                        <p style={{ fontSize: '0.65rem', margin: '2px 0 0 0', display: isUnlocked ? 'block' : 'none' }}>
                          Unlocked!
                        </p>
                        <p style={{ fontSize: '0.65rem', margin: '2px 0 0 0', color: 'var(--text-muted)', display: isUnlocked ? 'none' : 'block' }}>
                          Locked
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* History Table */}
          <div className="card">
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <History size={18} style={{ color: 'var(--primary)' }} />
              <span>Chronological History Logs</span>
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1rem' }}>
              Detailed audit trail of all speed test outcomes.
            </p>
            <div className="table-container">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Date Taken</th>
                    <th>Mode</th>
                    <th>Speed (WPM)</th>
                    <th>Accuracy</th>
                    <th>Errors</th>
                    <th>Time Spent</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((record) => (
                    <tr key={record.id}>
                      <td style={{ fontWeight: 500 }}>{record.date}</td>
                      <td style={{ textTransform: 'capitalize' }}>
                        {record.mode.includes('custom') ? 'Custom Time' : `${record.mode}s`}
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--primary)' }}>
                        {record.wpm}
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--success)', fontWeight: 500 }}>
                        {record.accuracy}%
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--error)' }}>
                        {record.errors}
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)' }}>
                        {record.time}s
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
