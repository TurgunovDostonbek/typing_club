import React, { useState, useEffect, useRef } from 'react';
import useTypingTest from '../hooks/useTypingTest';
import VirtualKeyboard from '../components/VirtualKeyboard';
import ResultModal from '../components/ResultModal';
import { useSettings } from '../context/SettingsContext';
import { codeSnippets } from '../data/codeSnippets';
import { 
  RotateCcw, 
  ArrowRight, 
  HelpCircle, 
  Code, 
  Terminal
} from 'lucide-react';

export default function CodingMode() {
  const { settings } = useSettings();
  const [currentLang, setCurrentLang] = useState('javascript');
  const [snippetIndex, setSnippetIndex] = useState(0);
  const [currentCode, setCurrentCode] = useState(() => codeSnippets.javascript[0]);

  // Coding mode doesn't have a strict time limit, let's give it a relaxed 10 minutes limit (600s)
  const CODING_LIMIT = 600;

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
    shakeActive,
    showResultsModal,
    setShowResultsModal,
    results,
    resetTest,
    handleKeyDown
  } = useTypingTest(CODING_LIMIT, currentCode);

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

  // Reset test when the code snippet changes
  useEffect(() => {
    resetTest();
  }, [currentCode, resetTest]);

  const handleLangChange = (lang) => {
    setCurrentLang(lang);
    setSnippetIndex(0);
    setCurrentCode(codeSnippets[lang][0]);
  };

  const handleNextSnippet = () => {
    const snippets = codeSnippets[currentLang];
    const nextIndex = (snippetIndex + 1) % snippets.length;
    setSnippetIndex(nextIndex);
    setCurrentCode(snippets[nextIndex]);
  };

  const handleWrapperClick = () => {
    focusInput();
  };

  // Math helper for dynamic speed ranking badge
  const getSpeedRank = (wpmVal) => {
    if (wpmVal < 20) return { label: 'Novice 💻', class: 'turtle' };
    if (wpmVal < 40) return { label: 'Scripter 📜', class: 'rabbit' };
    if (wpmVal < 65) return { label: 'Developer 🛠️', class: 'cheetah' };
    return { label: 'Hacker ⚡', class: 'lightning' };
  };

  const speedRank = getSpeedRank(wpm);
  const timeElapsed = CODING_LIMIT - timer;
  const characterCount = text.length;
  const characterTypedCount = typedText.length;
  const progressPercent = characterCount > 0 ? (characterTypedCount / characterCount) * 100 : 0;

  const isZenActive = status === 'running' && settings.zenMode;

  const languages = [
    { id: 'javascript', label: 'JavaScript' },
    { id: 'python', label: 'Python' },
    { id: 'css', label: 'CSS' },
    { id: 'html', label: 'HTML' },
    { id: 'cpp', label: 'C++' }
  ];

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      
      {/* Title Header */}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <Code size={28} className="logo-icon" />
          <span>Developer Coding Mode</span>
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Practice typing syntax characters and coding blocks from modern programming languages.
        </p>
      </div>

      {/* Language Tabs - Hidden when test is running */}
      {status === 'idle' ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase' }}>
            Select Programming Language
          </span>
          <div className="difficulty-selector">
            {languages.map((lang) => (
              <button
                key={lang.id}
                onClick={() => handleLangChange(lang.id)}
                className={`diff-btn ${currentLang === lang.id ? `active beginner` : ''}`}
                style={{ padding: '0.5rem 1.25rem' }}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ height: '3.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Terminal size={14} /> Coding Mode: {currentLang.toUpperCase()} | Snippet #{snippetIndex + 1}
          </span>
        </div>
      )}

      {/* Live Stats Display Panel */}
      <div className={`card stats-bar ${isZenActive ? 'zen-hidden' : ''}`} style={{ marginBottom: '1.5rem' }}>
        <div className="stats-group">
          <div className="stat-box">
            <span className="label">Time Elapsed</span>
            <span className="val" style={{ fontFamily: 'var(--font-mono)' }}>
              {timeElapsed}s
            </span>
          </div>
          <div className="stat-box" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span className="label">Coding WPM</span>
              <span className="val" style={{ color: 'var(--primary)' }}>{wpm}</span>
            </div>
            <span className={`speed-badge ${speedRank.class}`} style={{ alignSelf: 'flex-end', marginBottom: '3px' }}>
              {speedRank.label}
            </span>
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

      {/* Code Typing Box */}
      <div 
        key={currentCode}
        className={`typing-box-wrapper fade-in-up-anim ${isFocused ? 'focused' : ''} ${shakeActive ? 'shake-active' : ''}`}
        onClick={handleWrapperClick}
        style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minHeight: '220px' }}
      >
        {!isFocused && (
          <div className="focus-banner">
            <HelpCircle size={28} />
            <span>Click here to resume coding</span>
            <span style={{ fontSize: '0.75rem', opacity: 0.8, color: 'var(--text-muted)' }}>
              Or press Tab to load next snippet
            </span>
          </div>
        )}

        <div 
          className={`typing-text-display caret-${settings.caretStyle}`}
          style={{ 
            fontFamily: 'var(--font-mono)', 
            fontSize: '1.15rem', 
            lineHeight: '1.6', 
            textAlign: 'left', 
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word'
          }}
        >
          {text.split('').map((char, index) => {
            let charClass = 'char';
            if (index < characterTypedCount) {
              const matches = typedText[index] === char;
              charClass += matches ? ' correct' : ' incorrect';
            } else if (index === characterTypedCount) {
              charClass += ' current';
            }

            // Visual return indicator for newlines
            if (char === '\n') {
              return (
                <span key={index} className={`${charClass} char-newline`} style={{ opacity: index < characterTypedCount ? 0.7 : 0.3, display: 'inline-block' }}>
                  ↵{"\n"}
                </span>
              );
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
      <div className={isZenActive ? 'zen-hidden' : ''} style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        <span>Characters: {characterTypedCount} / {characterCount}</span>
        <span>{Math.round(progressPercent)}% Complete</span>
      </div>
      <div className={isZenActive ? 'zen-hidden' : ''} style={{ marginTop: '0.25rem', marginBottom: '1.5rem' }}>
        <div className="progress-bar-wrapper" style={{ height: '2px' }} title="Typing Progress">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${progressPercent}%`, backgroundColor: 'var(--success)' }}
          />
        </div>
      </div>

      {/* Action Buttons Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        <button className="btn btn-secondary" onClick={resetTest} title="Reset current coding block">
          <RotateCcw size={18} />
          <span>Reset Code</span>
        </button>
        <button className="btn btn-primary" onClick={handleNextSnippet} title="Load next code snippet">
          <span>Next Code Block</span>
          <ArrowRight size={18} />
        </button>
      </div>

      {/* Shortcuts toolbar */}
      <div className="shortcuts-bar" style={{ marginTop: '1rem' }}>
        <span><kbd>Tab</kbd> Next code block</span>
        <span><kbd>Esc</kbd> Reset</span>
        {status === 'completed' && <span><kbd>Enter</kbd> Retry</span>}
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

      <style>{`
        .fade-in-up-anim {
          animation: fadeInUp 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .char.correct {
          animation: charCorrectPop 0.12s ease-out;
        }

        @keyframes charCorrectPop {
          0% {
            background-color: rgba(16, 185, 129, 0.15);
            transform: scale(0.96);
          }
          100% {
            background-color: transparent;
            transform: scale(1);
          }
        }

        .char.incorrect {
          animation: charIncorrectShake 0.15s ease-in-out;
        }

        @keyframes charIncorrectShake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-2px); }
          75% { transform: translateX(2px); }
        }

        .typing-box-wrapper.focused {
          animation: focusPulse 2s infinite alternate ease-in-out;
          border-color: var(--primary);
        }

        @keyframes focusPulse {
          0% {
            box-shadow: 0 0 0 2px rgba(var(--primary-rgb), 0.12);
          }
          100% {
            box-shadow: 0 0 0 5px rgba(var(--primary-rgb), 0.22);
          }
        }

        .speed-badge {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .diff-btn {
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .diff-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(var(--primary-rgb), 0.15);
        }

        .diff-btn:active {
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
}
