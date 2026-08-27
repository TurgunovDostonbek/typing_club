import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useSettings } from '../context/SettingsContext';
import { clearAllData } from '../utils/statisticsUtils';
import { 
  Settings as SettingsIcon, 
  Sun, 
  Moon, 
  Laptop, 
  Volume2, 
  VolumeX, 
  Keyboard, 
  Eye, 
  EyeOff, 
  Clock, 
  Globe, 
  Activity, 
  RotateCcw,
  Trash2,
  Check,
  Eye as ZenIcon
} from 'lucide-react';

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { settings, updateSetting, resetSettings } = useSettings();

  const handleCaretChange = (style) => {
    updateSetting('caretStyle', style);
  };

  const handleResetSettings = () => {
    resetSettings();
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to permanently delete all typing test logs, streak counts, and unlocked achievements? This cannot be undone.')) {
      clearAllData();
      alert('Local statistics database cleared successfully.');
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', maxWidth: '800px' }}>
      
      {/* Title */}
      <div style={{ marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
        <h1 style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <SettingsIcon className="logo-icon" size={28} />
          <span>App Settings</span>
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Customize your typing practice layouts, theme modes, keyboard behaviors, and text preferences.
        </p>
      </div>

      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Section 1: Appearance */}
        <section className="settings-section" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', fontSize: '1.15rem' }}>
            <Sun size={18} style={{ color: 'var(--primary)' }} />
            <span>Appearance & Theme</span>
          </h3>
          
          <div className="setting-row">
            <div>
              <label style={{ display: 'block', fontWeight: 600, color: 'var(--text-bright)' }}>Theme Preference</label>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Toggle between light, dark, or system matching colors.</span>
            </div>
            
            <div style={{ display: 'flex', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
              <button 
                className={`caret-opt-btn ${theme === 'dark' ? 'active' : ''}`}
                onClick={() => setTheme('dark')}
                title="Dark Theme"
                style={{ padding: '0.5rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
              >
                <Moon size={14} />
                <span>Dark</span>
              </button>
              <button 
                className={`caret-opt-btn ${theme === 'light' ? 'active' : ''}`}
                onClick={() => setTheme('light')}
                title="Light Theme"
                style={{ padding: '0.5rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
              >
                <Sun size={14} />
                <span>Light</span>
              </button>
              <button 
                className={`caret-opt-btn ${theme === 'system' ? 'active' : ''}`}
                onClick={() => setTheme('system')}
                title="System Colors Sync"
                style={{ padding: '0.5rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
              >
                <Laptop size={14} />
                <span>System</span>
              </button>
            </div>
          </div>
        </section>

        {/* Section 2: Typing Options */}
        <section className="settings-section" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', fontSize: '1.15rem' }}>
            <Keyboard size={18} style={{ color: 'var(--primary)' }} />
            <span>Typing Environment</span>
          </h3>

          {/* Sound Effects toggle */}
          <div className="setting-row">
            <div>
              <label style={{ display: 'block', fontWeight: 600, color: 'var(--text-bright)' }}>Sound Feedback</label>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Play synthesized mechanical key sounds on click, buzz warning on error.</span>
            </div>
            <label className="switch">
              <input 
                type="checkbox" 
                checked={settings.sound} 
                onChange={(e) => updateSetting('sound', e.target.checked)} 
              />
              <span className="slider"></span>
            </label>
          </div>

          {/* Sound Preset Type selector */}
          {settings.sound && (
            <div className="setting-row">
              <div>
                <label style={{ display: 'block', fontWeight: 600, color: 'var(--text-bright)' }}>Sound Preset Type</label>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Choose between mechanical keyclick, digital retro bleep, or ambient synth chords.</span>
              </div>
              <select 
                value={settings.soundType}
                onChange={(e) => updateSetting('soundType', e.target.value)}
                className="select-input"
              >
                <option value="mechanical">Mechanical click</option>
                <option value="retro">8-bit Retro Beep</option>
                <option value="synth">Ambient Pop Synth</option>
              </select>
            </div>
          )}

          {/* Zen Mode toggle */}
          <div className="setting-row">
            <div>
              <label style={{ display: 'block', fontWeight: 600, color: 'var(--text-bright)' }}>Zen Mode Focus</label>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Hides WPM, accuracy, and timer elements during typing to minimize stress.</span>
            </div>
            <label className="switch">
              <input 
                type="checkbox" 
                checked={settings.zenMode} 
                onChange={(e) => updateSetting('zenMode', e.target.checked)} 
              />
              <span className="slider"></span>
            </label>
          </div>

          {/* Cursor Caret Style selection */}
          <div className="setting-row">
            <div>
              <label style={{ display: 'block', fontWeight: 600, color: 'var(--text-bright)' }}>Cursor Caret Style</label>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Customize the typing indicator visual caret.</span>
            </div>
            <div className="caret-options">
              {['line', 'block', 'underline', 'none'].map((style) => (
                <button
                  key={style}
                  onClick={() => handleCaretChange(style)}
                  className={`caret-opt-btn ${settings.caretStyle === style ? 'active' : ''}`}
                  style={{ textTransform: 'capitalize' }}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          {/* Show Virtual Keyboard toggle */}
          <div className="setting-row">
            <div>
              <label style={{ display: 'block', fontWeight: 600, color: 'var(--text-bright)' }}>Show Virtual Keyboard</label>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Display a live feedback keyboard at the bottom of the screen.</span>
            </div>
            <label className="switch">
              <input 
                type="checkbox" 
                checked={settings.showKeyboard} 
                onChange={(e) => updateSetting('showKeyboard', e.target.checked)} 
              />
              <span className="slider"></span>
            </label>
          </div>

          {/* Show Error highlights toggle */}
          <div className="setting-row">
            <div>
              <label style={{ display: 'block', fontWeight: 600, color: 'var(--text-bright)' }}>Highlight Typing Errors</label>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Red-flag and underline incorrect letters while typing.</span>
            </div>
            <label className="switch">
              <input 
                type="checkbox" 
                checked={settings.showErrors} 
                onChange={(e) => updateSetting('showErrors', e.target.checked)} 
              />
              <span className="slider"></span>
            </label>
          </div>
        </section>

        {/* Section 3: Test Options */}
        <section className="settings-section" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', fontSize: '1.15rem' }}>
            <Activity size={18} style={{ color: 'var(--primary)' }} />
            <span>Test Specifications</span>
          </h3>

          {/* Default Timer */}
          <div className="setting-row">
            <div>
              <label style={{ display: 'block', fontWeight: 600, color: 'var(--text-bright)' }}>Default Countdown Timer</label>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Default duration in seconds loaded on standard tests.</span>
            </div>
            <select 
              value={settings.defaultTimer}
              onChange={(e) => updateSetting('defaultTimer', parseInt(e.target.value, 10))}
              className="select-input"
            >
              <option value={15}>15 seconds</option>
              <option value={30}>30 seconds</option>
              <option value={60}>60 seconds</option>
              <option value={120}>120 seconds</option>
            </select>
          </div>

          {/* Default Language */}
          <div className="setting-row">
            <div>
              <label style={{ display: 'block', fontWeight: 600, color: 'var(--text-bright)' }}>Practice Language</label>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Dataset language for sentences (English, Uzbek, Russian).</span>
            </div>
            <select 
              value={settings.language}
              onChange={(e) => updateSetting('language', e.target.value)}
              className="select-input"
            >
              <option value="en">English (US)</option>
              <option value="uz">O'zbekcha (UZ)</option>
              <option value="ru">Русский (RU)</option>
            </select>
          </div>

          {/* Default Difficulty */}
          <div className="setting-row">
            <div>
              <label style={{ display: 'block', fontWeight: 600, color: 'var(--text-bright)' }}>Vocabulary Difficulty</label>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Initial word-complexity load (Beginner, Intermediate, etc).</span>
            </div>
            <select 
              value={settings.difficulty}
              onChange={(e) => updateSetting('difficulty', e.target.value)}
              className="select-input"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>
          </div>
        </section>

        {/* Section 4: Maintenance Actions */}
        <section className="settings-section" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <button 
              className="btn btn-secondary" 
              onClick={handleResetSettings}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <RotateCcw size={16} />
              <span>Restore Defaults</span>
            </button>
            <button 
              className="btn btn-danger" 
              onClick={handleClearHistory}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Trash2 size={16} />
              <span>Purge Stats Database</span>
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}
