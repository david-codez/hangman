const STORAGE_KEY = 'hangman-streak'

export const EMPTY_STATS = { wins: 0, losses: 0, currentStreak: 0, bestStreak: 0 }

export function loadStats() {
  try {
    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY))
    return stored ? migrateStats(stored) : EMPTY_STATS
  } catch (error) {
    // Storage can be blocked (private mode, disabled site data); the game still works with fresh stats.
    console.warn('Could not read stats from localStorage', error)
    return EMPTY_STATS
  }
}

export function saveStats(stats) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stats))
  } catch (error) {
    // Same as loadStats: the stats live on in memory for this session.
    console.warn('Could not save stats to localStorage', error)
  }
}

export function migrateStats(stored) {
  const isStreakOnlyFormat = 'current' in stored && !('currentStreak' in stored)
  if (isStreakOnlyFormat) {
    return { ...EMPTY_STATS, currentStreak: stored.current, bestStreak: stored.best }
  }
  return { ...EMPTY_STATS, ...stored }
}

export function nextStats(stats, status) {
  if (status === 'won') {
    const currentStreak = stats.currentStreak + 1
    return {
      ...stats,
      wins: stats.wins + 1,
      currentStreak,
      bestStreak: Math.max(stats.bestStreak, currentStreak),
    }
  }
  return { ...stats, losses: stats.losses + 1, currentStreak: 0 }
}
