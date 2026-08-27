import React, { useState, useEffect, useRef } from 'react';
import useTypingTest from '../hooks/useTypingTest';
import VirtualKeyboard from '../components/VirtualKeyboard';
import ResultModal from '../components/ResultModal';
import { useSettings } from '../context/SettingsContext';
import { 
  RotateCcw, 
  ChevronRight, 
  HelpCircle,
  Clock, 
  Award, 
  ArrowRight,
  BookOpen
} from 'lucide-react';

export default function Practice() {
  const { settings, updateSetting } = useSettings();
  const currentDiff = settings.difficulty;
  const currentLang = settings.language;

  // We set a generous 10-minute limit (600s) for practice mode so they never run out of time
  const PRACTICE_LIMIT = 600;

  // Initialize typing engine
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
  } = useTypingTest(PRACTICE_LIMIT);

  const [isFocused, setIsFocused] = useState(true);
  const inputRef = useRef(null);

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
      setIsFocused(true);
    }
  };

  useEffect(() => {
    focusInput();
  }, []);

  // Reset test and fetch a new text when language or difficulty changes
  useEffect(() => {
    resetTest();
  }, [currentDiff, currentLang, resetTest]);

  const handleDifficultyChange = (diff) => {
    updateSetting('difficulty', diff);
  };

  const handleWrapperClick = () => {
    focusInput();
  };

  // Math metrics
  const timeElapsed = PRACTICE_LIMIT - timer;
  const characterCount = text.length;
  const characterTypedCount = typedText.length;
  const progressPercent = characterCount > 0 ? (characterTypedCount / characterCount) * 100 : 0;

  const difficulties = [
    { id: 'beginner', label: 'Beginner', desc: 'Short, easy words' },
    { id: 'intermediate', label: 'Intermediate', desc: 'Simple sentences' },
    { id: 'advanced', label: 'Advanced', desc: 'Long paragraphs' },
    { id: 'expert', label: 'Expert', desc: 'Advanced coding & terms' }
  ];

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      
      {/* Title Header */}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <BookOpen size={28} className="logo-icon" />
          <span>Practice Sandbox</span>
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Untimed typing training with customizable vocabulary and difficulty modes.
        </p>
      </div>

      {/* Difficulty buttons Selector */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.5rem' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase' }}>
          Select Difficulty
        </span>
        <div className="difficulty-selector">
          {difficulties.map((diff) => (
            <button
              key={diff.id}
              onClick={() => handleDifficultyChange(diff.id)}
              className={`diff-btn ${currentDiff === diff.id ? `active ${diff.id}` : ''}`}
              title={diff.desc}
            >
              {diff.label}
            </button>
          ))}
        </div>
      </div>

      {/* Live Stats Display Panel */}
      <div className="card stats-bar" style={{ marginBottom: '1.5rem' }}>
        <div className="stats-group">
          <div className="stat-box">
            <span className="label">Time Elapsed</span>
            <span className="val" style={{ fontFamily: 'var(--font-mono)' }}>
              {timeElapsed}s
            </span>
          </div>
          <div className="stat-box">
            <span className="label">Speed</span>
            <span className="val" style={{ color: 'var(--primary)' }}>{wpm} <span style={{ fontSize: '0.85rem' }}>WPM</span></span>
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

      {/* Hidden Textarea capturing typing events */}
      <textarea
        ref={inputRef}
        className="hidden-textarea"
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        value={typedText}
        onChange={() => {}}
        tabIndex={0}
      />

      {/* Typing box card wrapper */}
      <div 
        className={`typing-box-wrapper ${isFocused ? 'focused' : ''}`}
        onClick={handleWrapperClick}
        style={{ flexGrow: 1 }}
      >
        {!isFocused && (
          <div className="focus-banner">
            <HelpCircle size={28} />
            <span>Click here to resume practice</span>
            <span style={{ fontSize: '0.75rem', opacity: 0.8, color: 'var(--text-muted)' }}>
              Or press Tab to reset text
            </span>
          </div>
        )}

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

      {/* Typing Progress details bar */}
      <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        <span>Character Progress: {characterTypedCount} / {characterCount}</span>
        <span>{Math.round(progressPercent)}% Complete</span>
      </div>
      <div style={{ marginTop: '0.25rem', marginBottom: '1.5rem' }}>
        <div className="progress-bar-wrapper" style={{ height: '2px' }} title="Typing Progress">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${progressPercent}%`, backgroundColor: 'var(--success)' }}
          />
        </div>
      </div>

      {/* Restart/Next actions */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        <button className="btn btn-secondary" onClick={resetTest} title="Reset practice session">
          <RotateCcw size={18} />
          <span>Restart Sentence</span>
        </button>
        <button className="btn btn-primary" onClick={resetTest} title="Load next practice sentence">
          <span>Next Sentence</span>
          <ArrowRight size={18} />
        </button>
      </div>

      {/* Shortcuts toolbar */}
      <div className="shortcuts-bar">
        <span><kbd>Tab</kbd> Next sentence</span>
        <span><kbd>Esc</kbd> Reset</span>
      </div>

      {/* Keyboard sync UI */}
      <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
        <VirtualKeyboard activeKey={activeKey} incorrectKey={incorrectKey} />
      </div>

      {/* Modal Result pop up */}
      <ResultModal 
        isOpen={showResultsModal} 
        results={results} 
        onRestart={resetTest}
        onClose={() => setShowResultsModal(false)}
      />
    </div>
  );
}
