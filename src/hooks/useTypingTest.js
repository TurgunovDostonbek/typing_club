import { useState, useEffect, useRef, useCallback } from 'react';
import { typingTexts } from '../data/texts';
import { getRandomText, calculateWPM, calculateAccuracy } from '../utils/typingUtils';
import { saveTestRecord } from '../utils/statisticsUtils';
import { useSettings } from '../context/SettingsContext';

export default function useTypingTest(customDuration = null, customText = null) {
  const { settings } = useSettings();
  const soundEnabled = settings.sound;
  const soundType = settings.soundType || 'mechanical';
  const showErrorsEnabled = settings.showErrors;
  const testLang = settings.language;
  const testDiff = settings.difficulty;
  
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
  
  // Keyboard sync states
  const [activeKey, setActiveKey] = useState(null);
  const [incorrectKey, setIncorrectKey] = useState(null);
  const [shakeActive, setShakeActive] = useState(false); // Activates typing card shake on typo

  // Results display state
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [results, setResults] = useState(null);

  // Refs for tracking timer intervals and exact time elapsed
  const timerIntervalRef = useRef(null);
  const startTimeRef = useRef(null);
  const totalCorrectCharsRef = useRef(0);

  // Play synthesized mechanical / retro / synth sounds
  const playSynthesizedSound = useCallback((isCorrect) => {
    if (!soundEnabled) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      if (soundType === 'retro') {
        // 8-bit digital sound style
        if (isCorrect) {
          osc.type = 'square';
          osc.frequency.setValueAtTime(1200, ctx.currentTime);
          gain.gain.setValueAtTime(0.008, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.03);
          
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.03);
        } else {
          osc.type = 'square';
          osc.frequency.setValueAtTime(80, ctx.currentTime);
          gain.gain.setValueAtTime(0.04, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);
          
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.12);
        }
      } else if (soundType === 'synth') {
        // Soft synth pop chord style
        if (isCorrect) {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(523.25, ctx.currentTime); // Note C5
          gain.gain.setValueAtTime(0.02, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);
          
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.08);
        } else {
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(110, ctx.currentTime); // Note A2
          gain.gain.setValueAtTime(0.03, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.18);
          
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.18);
        }
      } else {
        // Standard 'mechanical' typewriter style
        if (isCorrect) {
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
      }
    } catch (e) {
      console.warn('Audio synthesis failed', e);
    }
  }, [soundEnabled, soundType]);

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
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    
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
    setShakeActive(false);
    setShowResultsModal(false);
    
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
            setTimeout(() => {
              endTest();
            }, 0);
            return 0;
          }
          
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
    if (e.key === 'Escape') {
      e.preventDefault();
      resetTest();
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      resetTest();
      return;
    }

    if (e.key === 'Enter' && status === 'completed') {
      e.preventDefault();
      resetTest();
      return;
    }

    const isEnterKey = e.key === 'Enter';
    if (isEnterKey && status !== 'completed') {
      e.preventDefault();
    }

    if (e.key.length !== 1 && e.key !== 'Backspace' && !isEnterKey) {
      return;
    }

    if (status === 'completed') return;

    let activeStatus = status;
    if (status === 'idle') {
      setStatus('running');
      activeStatus = 'running';
      startTimeRef.current = Date.now();
    }

    let keyName = e.key;
    if (keyName === ' ') keyName = 'space';
    if (keyName === 'Enter') keyName = 'enter';
    setActiveKey(keyName);
    
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
        
        if (deletedChar === targetChar) {
          totalCorrectCharsRef.current = Math.max(0, totalCorrectCharsRef.current - 1);
        }
        
        setTypedText((prev) => prev.slice(0, -1));
        
        const newTyped = typedText.slice(0, -1);
        const elapsed = startTimeRef.current ? (Date.now() - startTimeRef.current) / 1000 : 0;
        setWpm(calculateWPM(totalCorrectCharsRef.current, elapsed));
        setAccuracy(calculateAccuracy(totalCorrectCharsRef.current, newTyped.length));
      }
      return;
    }

    if (currentIndex >= text.length) return;

    const targetChar = text[currentIndex];
    const typedChar = isEnterKey ? '\n' : e.key;
    const isCorrect = typedChar === targetChar;

    playSynthesizedSound(isCorrect);

    if (isCorrect) {
      totalCorrectCharsRef.current += 1;
      setIncorrectKey(null);
    } else {
      setErrors((prev) => prev + 1);
      
      // Trigger card shake and keyboard highlights on typo
      setShakeActive(true);
      setTimeout(() => {
        setShakeActive(false);
      }, 150);

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

    const elapsed = startTimeRef.current ? (Date.now() - startTimeRef.current) / 1000 : 0.001;
    setWpm(calculateWPM(totalCorrectCharsRef.current, elapsed));
    setAccuracy(calculateAccuracy(totalCorrectCharsRef.current, nextTyped.length));

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
    shakeActive,
    showResultsModal,
    setShowResultsModal,
    results,
    resetTest,
    handleKeyDown
  };
}
