export const STORAGE_KEY = 'datavention_progress';

export const getProgress = () => {
  if (typeof window === 'undefined') return { achievements: {}, bestTime: null };
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return {
    achievements: {
      first_step: 0,
      data_explorer: 0,
      snake_charmer: 0,
      lucky_roller: 0
    },
    bestTime: null
  };
};

export const saveProgress = (progress) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }
};

export const updateAchievement = (id, incrementValue = 1) => {
  const progress = getProgress();
  if (!progress.achievements) progress.achievements = {};
  progress.achievements[id] = (progress.achievements[id] || 0) + incrementValue;
  saveProgress(progress);
};

export const updateBestTime = (timeInSeconds) => {
  const progress = getProgress();
  if (progress.bestTime === null || timeInSeconds < progress.bestTime) {
    progress.bestTime = timeInSeconds;
    saveProgress(progress);
    return true; // updated
  }
  return false;
};
