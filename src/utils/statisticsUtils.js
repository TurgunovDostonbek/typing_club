// Statistics Utility functions for TypingPro

/**
 * Safe retrieval from local storage with optional fallback
 */
const safeGetItem = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage`, e);
    return fallback;
  }
};

/**
 * Safe save to local storage
 */
const safeSetItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key} to localStorage`, e);
  }
};

/**
 * Retrieve all typing history
 */
export const getHistory = () => safeGetItem('typingpro_history', []);

/**
 * Retrieve personal bests map
 */
export const getPersonalBests = () => safeGetItem('typingpro_pb', {});

/**
 * Retrieve streak info
 */
export const getStreak = () => safeGetItem('typingpro_streak', { count: 0, lastActiveDate: '' });

/**
 * Retrieve achievements unlocked
 */
export const getAchievements = () => safeGetItem('typingpro_achievements', []);

/**
 * Retrieve daily challenge state
 */
export const getDailyChallenge = () => {
  const today = new Date().toISOString().split('T')[0];
  const saved = safeGetItem('typingpro_daily_challenge', { date: '', completed: false });
  if (saved.date !== today) {
    return { date: today, completed: false };
  }
  return saved;
};

/**
 * Formats a Date object to YYYY-MM-DD
 */
export const getTodayDateString = () => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Saves a new typing test record, updates streaks, checks achievements, 
 * checks daily challenge, and saves personal bests.
 * @param {object} testRecord - The test details
 * @returns {object} { isNewPB: boolean, unlockedAchievements: Array }
 */
export const saveTestRecord = (testRecord) => {
  const history = getHistory();
  const personalBests = getPersonalBests();
  const streak = getStreak();
  const achievements = getAchievements();
  const dailyChallenge = getDailyChallenge();
  
  const today = getTodayDateString();
  const recordId = Date.now().toString();
  const newRecord = {
    id: recordId,
    date: new Date().toLocaleString(),
    ...testRecord
  };

  // 1. Save to History
  history.push(newRecord);
  safeSetItem('typingpro_history', history);

  // 2. Personal Best Check
  // We track PBs per mode/time (e.g. '15', '30', '60', '120', 'practice').
  // PBs are measured by WPM.
  const modeKey = testRecord.mode || '30';
  const previousBest = personalBests[modeKey] || 0;
  let isNewPB = false;
  
  if (testRecord.wpm > previousBest) {
    personalBests[modeKey] = testRecord.wpm;
    safeSetItem('typingpro_pb', personalBests);
    isNewPB = true;
  }

  // 3. Streak Update
  let newStreakCount = streak.count;
  if (!streak.lastActiveDate) {
    newStreakCount = 1;
  } else {
    const lastDate = new Date(streak.lastActiveDate);
    const todayDate = new Date(today);
    const diffTime = Math.abs(todayDate - lastDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      newStreakCount += 1;
    } else if (diffDays > 1) {
      newStreakCount = 1; // broken streak
    }
    // if diffDays === 0, keep current streak (practiced multiple times today)
  }
  
  const newStreak = {
    count: newStreakCount === 0 ? 1 : newStreakCount,
    lastActiveDate: today
  };
  safeSetItem('typingpro_streak', newStreak);

  // 4. Daily Challenge Check
  // Target: Reach 60 WPM with 95% accuracy
  let completedDailyChallenge = false;
  if (!dailyChallenge.completed && testRecord.wpm >= 60 && testRecord.accuracy >= 95) {
    dailyChallenge.completed = true;
    safeSetItem('typingpro_daily_challenge', dailyChallenge);
    completedDailyChallenge = true;
  }

  // 5. Achievement System
  const newlyUnlocked = [];
  const addAchievement = (id, title, desc) => {
    if (!achievements.includes(id)) {
      achievements.push(id);
      newlyUnlocked.push({ id, title, desc });
    }
  };

  // Achievement criteria checks
  // 🏆 First Test
  addAchievement('first_test', 'First Test', 'Complete your first typing test.');

  // ⚡ Speed Demon
  if (testRecord.wpm >= 80) {
    addAchievement('speed_demon', 'Speed Demon', 'Reach 80 WPM.');
  }

  // ⚡ Speed God (extra achievement for expert typists!)
  if (testRecord.wpm >= 100) {
    addAchievement('speed_god', 'Speed God', 'Reach 100 WPM.');
  }

  // 🎯 Accuracy Master
  if (testRecord.accuracy >= 98 && testRecord.wpm >= 30) {
    addAchievement('accuracy_master', 'Accuracy Master', 'Reach 98% accuracy with speed above 30 WPM.');
  }

  // 🔥 7 Day Streak
  if (newStreak.count >= 7) {
    addAchievement('7_day_streak', '7 Day Streak', 'Practice for 7 consecutive days.');
  }

  // 🎹 Dedicated Typist (10 tests)
  if (history.length >= 10) {
    addAchievement('dedicated_typist', 'Dedicated Typist', 'Complete 10 typing tests.');
  }

  if (newlyUnlocked.length > 0) {
    safeSetItem('typingpro_achievements', achievements);
  }

  return {
    isNewPB,
    newlyUnlocked,
    completedDailyChallenge
  };
};

/**
 * Calculates summary statistics for the user profile / dashboard
 */
export const getStatsSummary = () => {
  const history = getHistory();
  const personalBests = getPersonalBests();
  const streak = getStreak();
  
  if (history.length === 0) {
    return {
      averageWpm: 0,
      bestWpm: 0,
      averageAccuracy: 0,
      bestAccuracy: 0,
      totalTests: 0,
      totalCharacters: 0,
      totalTime: 0,
      totalErrors: 0,
      streak: streak.count
    };
  }

  let totalWpm = 0;
  let totalAccuracy = 0;
  let totalCharacters = 0;
  let totalTime = 0;
  let totalErrors = 0;
  let bestWpm = 0;
  let bestAccuracy = 0;

  history.forEach((record) => {
    totalWpm += record.wpm;
    totalAccuracy += parseFloat(record.accuracy || 0);
    totalCharacters += record.characters || 0;
    totalTime += record.time || 0;
    totalErrors += record.errors || 0;

    if (record.wpm > bestWpm) bestWpm = record.wpm;
    const accNum = parseFloat(record.accuracy || 0);
    if (accNum > bestAccuracy) bestAccuracy = accNum;
  });

  return {
    averageWpm: Math.round(totalWpm / history.length),
    bestWpm,
    averageAccuracy: Math.round((totalAccuracy / history.length) * 10) / 10,
    bestAccuracy: Math.round(bestAccuracy * 10) / 10,
    totalTests: history.length,
    totalCharacters,
    totalTime,
    totalErrors,
    streak: streak.count
  };
};

/**
 * Reset all statistical and history information
 */
export const clearAllData = () => {
  try {
    localStorage.removeItem('typingpro_history');
    localStorage.removeItem('typingpro_pb');
    localStorage.removeItem('typingpro_streak');
    localStorage.removeItem('typingpro_achievements');
    localStorage.removeItem('typingpro_daily_challenge');
    return true;
  } catch (e) {
    console.error('Error clearing localStorage data', e);
    return false;
  }
};
