import { useState, useEffect, useRef, useCallback } from 'react';
import { typingTexts } from '../data/texts';
import { getRandomText, calculateWPM, calculateAccuracy } from '../utils/typingUtils';
import { saveTestRecord } from '../utils/statisticsUtils';
import { useSettings } from '../context/SettingsContext';

export default function useTypingTest(customDuration = null, customText = null) {
  const { settings } = useSettings();
  const soundEnabled = settings.sound;
  const showErrorsEnabled = settings.showErrors;
  const testLang = settings.language;
  const testDiff = settings.difficulty;
  
  // Decide test target duration (custom duration takes priority, then settings default)
  const durationLimit = customDuration !== null ? customDuration : settings.defaultTimer;

  // Typing core states
  const [text, setText] = useState('');
  const [typedText, setTypedText] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'running' | 'completed'
  const [timer, setTimer] = useState(durationLimit);
  const [errors, setErrors] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState('100.0');
  const [totalTypedCount, setTotalTypedCount] = useState(0);
  
  // Keyboard sync state (holds key name of currently pressed key)
  const [activeKey, setActiveKey] = useState(null);
  const [incorrectKey, setIncorrectKey] = useState(null);

  // Results display state
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [results, setResults] = useState(null);

  // Refs for tracking timer intervals and exact time elapsed
  const timerIntervalRef = useRef(null);
  const startTimeRef = useRef(null);
  const totalCorrectCharsRef = useRef(0);

  // Play synthesized mechanical key click / buzz warning
  const playSynthesizedSound = useCallback((isCorrect) => {
    if (!soundEnabled) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      if (isCorrect) {
        // High click sound
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(900, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(350, ctx.currentTime + 0.04);
        
        gain.gain.setValueAtTime(0.015, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.04);
      } else {
        // Deep buzz warning
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(90, ctx.currentTime + 0.12);
        
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
      }
    } catch (e) {
      console.warn('Audio synthesis failed', e);
    }
  }, [soundEnabled]);

  // Selects and prepares a new typing test target text
  const fetchNewText = useCallback(() => {
    if (customText) {
      setText(customText);
    } else {
      const randomText = getRandomText(typingTexts, testLang, testDiff);
      setText(randomText);
    }
  }, [customText, testLang, testDiff]);

  // Full reset of the typing test states
  const resetTest = useCallback(() => {
    // Clear timer interval
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    
    // Reset state values
    fetchNewText();
    setTypedText('');
    setStatus('idle');
    setTimer(durationLimit);
    setErrors(0);
    setWpm(0);
    setAccuracy('100.0');
    setTotalTypedCount(0);
    setActiveKey(null);
    setIncorrectKey(null);
    setShowResultsModal(false);
    
    // Reset refs
    startTimeRef.current = null;
    totalCorrectCharsRef.current = 0;
  }, [fetchNewText, durationLimit]);

  // Fetch initial text on mount
  useEffect(() => {
    fetchNewText();
  }, [fetchNewText]);

  // Adjust timer value when duration settings change
  useEffect(() => {
    if (status === 'idle') {
      setTimer(durationLimit);
    }
  }, [durationLimit, status]);

  // Finalizes test, aggregates metrics, saves record, and opens Results Modal
  const endTest = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    setStatus('completed');

    const finalTimeSpent = durationLimit - timer;
    const timeSpent = finalTimeSpent > 0 ? finalTimeSpent : durationLimit;

    // Compile record object
    const finalWpm = calculateWPM(totalCorrectCharsRef.current, timeSpent);
    const finalAccuracy = calculateAccuracy(totalCorrectCharsRef.current, totalTypedCount);

    const record = {
      wpm: finalWpm,
      accuracy: finalAccuracy,
      errors: errors,
      characters: totalTypedCount,
      time: timeSpent,
      language: testLang,
      difficulty: testDiff,
      mode: customDuration ? `custom_${customDuration}` : `${durationLimit}`
    };

    // Save record to local storage
    const summary = saveTestRecord(record);

    // Read personal best
    const pbList = JSON.parse(localStorage.getItem('typingpro_pb') || '{}');
    const modeKey = customDuration ? `custom_${customDuration}` : `${durationLimit}`;
    const personalBestWpm = pbList[modeKey] || finalWpm;

    setResults({
      wpm: finalWpm,
      accuracy: finalAccuracy,
      errors: errors,
      characters: totalTypedCount,
      timeSpent: timeSpent,
      isNewPB: summary.isNewPB,
      personalBest: personalBestWpm,
      unlockedAchievements: summary.newlyUnlocked,
      completedDailyChallenge: summary.completedDailyChallenge
    });

    setShowResultsModal(true);
  }, [durationLimit, timer, errors, totalTypedCount, testLang, testDiff, customDuration]);

  // Handles standard timer countdown interval
  useEffect(() => {
    if (status === 'running') {
      timerIntervalRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current);
            // Must end test
            setTimeout(() => {
              endTest();
            }, 0);
            return 0;
          }
          
          // Calculate live mid-test WPM
          const elapsed = startTimeRef.current ? (Date.now() - startTimeRef.current) / 1000 : 0;
          const currentWpm = calculateWPM(totalCorrectCharsRef.current, elapsed);
          setWpm(currentWpm);
          
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [status, endTest]);

  // Handle keys inputs
  const handleKeyDown = useCallback((e) => {
    // 1. Reset shortcuts
    if (e.key === 'Escape') {
      e.preventDefault();
      resetTest();
      return;
    }

    // Tab key handling
    if (e.key === 'Tab') {
      // Allow browser focus traversal or override for fast refocus
      e.preventDefault();
      resetTest();
      return;
    }

    if (e.key === 'Enter' && status === 'completed') {
      e.preventDefault();
      resetTest();
      return;
    }

    // Ignore non-character keys (e.g. Shift, Control, Alt, Meta)
    if (e.key.length !== 1 && e.key !== 'Backspace') {
      return;
    }

    // If test is completed, reject inputs
    if (status === 'completed') return;

    // Start timer on first keystroke
    let activeStatus = status;
    if (status === 'idle') {
      setStatus('running');
      activeStatus = 'running';
      startTimeRef.current = Date.now();
    }

    // Sync pressed key name (lowercase for comparison)
    let keyName = e.key;
    if (keyName === ' ') keyName = 'space';
    setActiveKey(keyName);
    
    // Clear key highlighting after a brief delay
    setTimeout(() => {
      setActiveKey((prev) => prev === keyName ? null : prev);
    }, 100);

    const currentIndex = typedText.length;

    // Backspace handling
    if (e.key === 'Backspace') {
      e.preventDefault();
      if (currentIndex > 0) {
        const deletedChar = typedText[currentIndex - 1];
        const targetChar = text[currentIndex - 1];
        
        // Adjust correct chars ref if the deleted one was correct
        if (deletedChar === targetChar) {
          totalCorrectCharsRef.current = Math.max(0, totalCorrectCharsRef.current - 1);
        }
        
        setTypedText((prev) => prev.slice(0, -1));
        
        // Recalculate accuracy & WPM
        const newTyped = typedText.slice(0, -1);
        const elapsed = startTimeRef.current ? (Date.now() - startTimeRef.current) / 1000 : 0;
        setWpm(calculateWPM(totalCorrectCharsRef.current, elapsed));
        setAccuracy(calculateAccuracy(totalCorrectCharsRef.current, newTyped.length));
      }
      return;
    }

    // If user has already finished all characters, do not append further
    if (currentIndex >= text.length) return;

    // Validate key typed
    const targetChar = text[currentIndex];
    const typedChar = e.key;
    const isCorrect = typedChar === targetChar;

    playSynthesizedSound(isCorrect);

    if (isCorrect) {
      totalCorrectCharsRef.current += 1;
      setIncorrectKey(null);
    } else {
      setErrors((prev) => prev + 1);
      
      // Flash incorrect key visual highlight
      if (showErrorsEnabled) {
        const wrongKey = typedChar === ' ' ? 'space' : typedChar;
        setIncorrectKey(wrongKey);
        setTimeout(() => {
          setIncorrectKey((prev) => prev === wrongKey ? null : prev);
        }, 150);
      }
    }

    const nextTyped = typedText + typedChar;
    setTypedText(nextTyped);
    setTotalTypedCount((prev) => prev + 1);

    // Compute live metrics
    const elapsed = startTimeRef.current ? (Date.now() - startTimeRef.current) / 1000 : 0.001;
    setWpm(calculateWPM(totalCorrectCharsRef.current, elapsed));
    setAccuracy(calculateAccuracy(totalCorrectCharsRef.current, nextTyped.length));

    // End test immediately if the last character has been typed
    if (nextTyped.length === text.length) {
      setTimeout(() => {
        endTest();
      }, 50);
    }
  }, [text, typedText, status, resetTest, endTest, playSynthesizedSound, showErrorsEnabled, testLang, testDiff, durationLimit, errors, totalTypedCount, customDuration]);

  return {
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
  };
}
