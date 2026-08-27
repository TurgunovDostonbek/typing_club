/**
 * Calculates Words Per Minute (WPM)
 * WPM = (correct characters / 5) / elapsed minutes
 * @param {number} correctChars - Number of correctly typed characters
 * @param {number} timeElapsedSeconds - Time elapsed in seconds
 * @returns {number} WPM (rounded to nearest integer)
 */
export const calculateWPM = (correctChars, timeElapsedSeconds) => {
  if (timeElapsedSeconds <= 0) return 0;
  const elapsedMinutes = timeElapsedSeconds / 60;
  const wpm = (correctChars / 5) / elapsedMinutes;
  return Math.max(0, Math.round(wpm));
};

/**
 * Calculates accuracy percentage
 * accuracy = (correct characters / total typed characters) * 100
 * @param {number} correctChars - Number of correctly typed characters
 * @param {number} totalTyped - Total number of typed characters (correct + incorrect)
 * @returns {string} Accuracy percentage formatted as a string (e.g. "95.2%")
 */
export const calculateAccuracy = (correctChars, totalTyped) => {
  if (totalTyped <= 0) return "100.0";
  const acc = (correctChars / totalTyped) * 100;
  return acc.toFixed(1);
};

/**
 * Formats time from seconds into mm:ss format
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted string, e.g. "01:30"
 */
export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Selects a random text from the database based on language and difficulty
 * @param {object} textsDataset - The typing texts database
 * @param {string} lang - Language code ('en', 'uz', 'ru')
 * @param {string} diff - Difficulty level ('beginner', 'intermediate', 'advanced', 'expert')
 * @returns {string} A random typing text
 */
export const getRandomText = (textsDataset, lang = 'en', diff = 'beginner') => {
  const languageTexts = textsDataset[lang] || textsDataset['en'] || {};
  const difficultyTexts = languageTexts[diff] || languageTexts['beginner'] || [];
  
  if (difficultyTexts.length === 0) {
    return "Practice makes progress.";
  }
  
  const randomIndex = Math.floor(Math.random() * difficultyTexts.length);
  return difficultyTexts[randomIndex];
};
