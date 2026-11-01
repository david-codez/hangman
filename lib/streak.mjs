const STORAGE_KEY = 'hangman-streak'

export const EMPTY_STREAK = { current: 0, best: 0 }

export function loadStreak() {
  try {
    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY))
    return stored ?? EMPTY_STREAK
  } catch (error) {
    // Storage can be blocked (private mode, disabled site data); the game still works with a fresh streak.
    console.warn('Could not read win streak from localStorage', error)
    return EMPTY_STREAK
  }
}

export function saveStreak(streak) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(streak))
  } catch (error) {
    // Same as loadStreak: the streak lives on in memory for this session.
    console.warn('Could not save win streak to localStorage', error)
  }
}

export function nextStreak(streak, status) {
  if (status === 'won') {
    const current = streak.current + 1
    return { current, best: Math.max(streak.best, current) }
  }
  return { current: 0, best: streak.best }
}
