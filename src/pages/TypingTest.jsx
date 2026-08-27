import React, { useState, useEffect, useRef } from 'react';
import useTypingTest from '../hooks/useTypingTest';
import ModeSelector from '../components/ModeSelector';
import VirtualKeyboard from '../components/VirtualKeyboard';
import ResultModal from '../components/ResultModal';
import AchievementToast from '../components/AchievementToast';
import { useSettings } from '../context/SettingsContext';
import { 
  RotateCcw, 
  Settings as SettingsIcon,
  Play, 
  HelpCircle,
  Clock, 
  Zap, 
  Target, 
  AlertTriangle 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TypingTest() {
  const { settings, updateSetting } = useSettings();
  const navigate = useNavigate();
  
  // Custom timer duration option (managed locally, resets to settings.defaultTimer when settings load)
  const [testTime, setTestTime] = useState(settings.defaultTimer);
  
  // Ref to settings default time to update when it changes
  useEffect(() => {
    setTestTime(settings.defaultTimer);
  }, [settings.defaultTimer]);

  // Hook initialization
  const {
    text,
    typedText,
    status,
    timer,
    wpm,
    accuracy,
    errors,
    totalTypedCount,
    activeKey,
    incorrectKey,
    showResultsModal,
    setShowResultsModal,
    results,
    resetTest,
    handleKeyDown
  } = useTypingTest(testTime);

  const [isFocused, setIsFocused] = useState(true);
  const [currentToast, setCurrentToast] = useState(null);
  const inputRef = useRef(null);

  // Focus input ref helper
  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
      setIsFocused(true);
    }
  };

  // Focus automatically on mount
  useEffect(() => {
    focusInput();
  }, []);

  // Sync click anywhere on the typing box to focus the hidden text area
  const handleWrapperClick = () => {
    focusInput();
  };

  // Watch for toast triggers on completion
  useEffect(() => {
    if (results && results.unlockedAchievements && results.unlockedAchievements.length > 0) {
      // Trigger toast for the first newly unlocked achievement
      setCurrentToast(results.unlockedAchievements[0]);
    }
  }, [results]);

  // Percentage calculations
  const timeProgressPercent = ((testTime - timer) / testTime) * 100;
  const characterCount = text.length;
  const characterTypedCount = typedText.length;
  const charProgressPercent = characterCount > 0 ? (characterTypedCount / characterCount) * 100 : 0;

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      
      {/* Mode Selector - Hidden when test is running */}
      {status === 'idle' ? (
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
            SELECT SPEED TEST MODE
          </span>
          <ModeSelector 
            activeTime={testTime} 
            onSelectTime={(time) => {
              setTestTime(time);
              resetTest();
            }} 
          />
        </div>
      ) : (
        <div style={{ height: '3.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'var(--font-mono)' }}>
            Test Mode: {testTime}s | Language: {settings.language.toUpperCase()} | Difficulty: {settings.difficulty}
          </span>
        </div>
      )}

      {/* Main Stats Display Panel */}
      <div className="card stats-bar" style={{ marginBottom: '1.5rem' }}>
        <div className="stats-group">
          <div className="stat-box">
            <span className="label">Time Left</span>
            <span className="val" style={{ color: timer <= 5 ? 'var(--error)' : 'var(--text-bright)' }}>
              {timer}s
            </span>
          </div>
          <div className="stat-box">
            <span className="label">WPM</span>
            <span className="val" style={{ color: 'var(--primary)' }}>{wpm}</span>
          </div>
        </div>

        <div className="stats-group">
          <div className="stat-box">
            <span className="label">Accuracy</span>
            <span className="val" style={{ color: 'var(--success)' }}>{accuracy}%</span>
          </div>
          <div className="stat-box">
            <span className="label">Errors</span>
            <span className="val" style={{ color: errors > 0 ? 'var(--error)' : 'var(--text-muted)' }}>
              {errors}
            </span>
          </div>
        </div>
      </div>

      {/* Timer Progress Bar (above typing box) */}
      <div style={{ marginBottom: '0.5rem' }}>
        <div className="progress-bar-wrapper" title="Timer Progress">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${100 - timeProgressPercent}%`, backgroundColor: timer <= 5 ? 'var(--error)' : 'var(--primary)' }}
          />
        </div>
      </div>

      {/* Hidden Textarea capturing keystrokes */}
      <textarea
        ref={inputRef}
        className="hidden-textarea"
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        value={typedText}
        onChange={() => {}} // Controlled read-only via hook keydown handlers
        tabIndex={0}
      />

      {/* Typing box wrapper with custom caret class styling */}
      <div 
        className={`typing-box-wrapper ${isFocused ? 'focused' : ''}`}
        onClick={handleWrapperClick}
        style={{ flexGrow: 1 }}
      >
        {/* Blur state reminder overlay */}
        {!isFocused && (
          <div className="focus-banner">
            <HelpCircle size={28} />
            <span>Click here to focus and begin typing</span>
            <span style={{ fontSize: '0.75rem', opacity: 0.8, color: 'var(--text-muted)' }}>
              Or press Tab to reset text
            </span>
          </div>
        )}

        {/* Character highlights grid */}
        <div className={`typing-text-display caret-${settings.caretStyle}`}>
          {text.split('').map((char, index) => {
            let charClass = 'char';
            if (index < characterTypedCount) {
              const matches = typedText[index] === char;
              charClass += matches ? ' correct' : ' incorrect';
            } else if (index === characterTypedCount) {
              charClass += ' current';
            }
            return (
              <span key={index} className={charClass}>
                {char}
              </span>
            );
          })}
        </div>
      </div>

      {/* Character progress indicator */}
      <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        <span>Progress: {characterTypedCount} / {characterCount} chars</span>
        <span>{Math.round(charProgressPercent)}% Complete</span>
      </div>
      <div style={{ marginTop: '0.25rem', marginBottom: '1.5rem' }}>
        <div className="progress-bar-wrapper" style={{ height: '2px' }} title="Typing Progress">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${charProgressPercent}%`, backgroundColor: 'var(--success)' }}
          />
        </div>
      </div>

      {/* Action Buttons Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <button className="btn btn-secondary" onClick={resetTest} title="Reset Speed Test">
          <RotateCcw size={18} />
          <span>Restart Test</span>
        </button>
        <button className="btn btn-secondary" onClick={() => navigate('/settings')} title="Typing Settings">
          <SettingsIcon size={18} />
          <span>Settings</span>
        </button>
      </div>

      {/* Keyboard Shortcuts Notice */}
      <div className="shortcuts-bar">
        <span><kbd>Tab</kbd> Restart</span>
        <span><kbd>Esc</kbd> Reset</span>
        {status === 'completed' && <span><kbd>Enter</kbd> Retry</span>}
      </div>

      {/* Virtual Keyboard visual rendering */}
      <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
        <VirtualKeyboard activeKey={activeKey} incorrectKey={incorrectKey} />
      </div>

      {/* Result Modal display */}
      <ResultModal 
        isOpen={showResultsModal} 
        results={results} 
        onRestart={resetTest}
        onClose={() => setShowResultsModal(false)}
      />

      {/* Floating Achievement Toast notification */}
      {currentToast && (
        <AchievementToast 
          achievement={currentToast} 
          onClose={() => setCurrentToast(null)} 
        />
      )}
    </div>
  );
}
