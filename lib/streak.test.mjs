import { test } from 'node:test'
import assert from 'node:assert/strict'
import { nextStreak } from './streak.mjs'

test('a win extends the current streak and raises the best when exceeded', () => {
  assert.deepEqual(nextStreak({ current: 2, best: 2 }, 'won'), { current: 3, best: 3 })
})

test('a win below the best keeps the best', () => {
  assert.deepEqual(nextStreak({ current: 1, best: 5 }, 'won'), { current: 2, best: 5 })
})

test('a loss resets the current streak but keeps the best', () => {
  assert.deepEqual(nextStreak({ current: 4, best: 6 }, 'lost'), { current: 0, best: 6 })
})
