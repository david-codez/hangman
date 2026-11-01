import { test } from 'node:test'
import assert from 'node:assert/strict'
import { migrateStats, nextStats } from './stats.mjs'

test('a win adds a win, extends the streak, and raises the best when exceeded', () => {
  const stats = { wins: 2, losses: 1, currentStreak: 2, bestStreak: 2 }
  assert.deepEqual(nextStats(stats, 'won'), { wins: 3, losses: 1, currentStreak: 3, bestStreak: 3 })
})

test('a win below the best streak keeps the best', () => {
  const stats = { wins: 5, losses: 2, currentStreak: 1, bestStreak: 5 }
  assert.deepEqual(nextStats(stats, 'won'), { wins: 6, losses: 2, currentStreak: 2, bestStreak: 5 })
})

test('a loss adds a loss and resets the current streak but keeps the best', () => {
  const stats = { wins: 6, losses: 0, currentStreak: 4, bestStreak: 6 }
  assert.deepEqual(nextStats(stats, 'lost'), { wins: 6, losses: 1, currentStreak: 0, bestStreak: 6 })
})

test('migrateStats carries over a streak saved in the old format', () => {
  assert.deepEqual(migrateStats({ current: 3, best: 7 }), { wins: 0, losses: 0, currentStreak: 3, bestStreak: 7 })
})

test('migrateStats keeps stats already in the current format', () => {
  const stats = { wins: 4, losses: 2, currentStreak: 1, bestStreak: 3 }
  assert.deepEqual(migrateStats(stats), stats)
})
