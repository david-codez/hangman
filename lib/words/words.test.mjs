import { test } from 'node:test'
import assert from 'node:assert/strict'
import { CATEGORIES, isLetter } from '../game.mjs'
import { WORDS_BY_CATEGORY } from './index.mjs'

test('every category label has a word list and every word list has a label', () => {
  assert.deepEqual(Object.keys(WORDS_BY_CATEGORY).sort(), Object.keys(CATEGORIES).sort())
})

test('every category has enough playable words after normalization', () => {
  for (const [category, words] of Object.entries(WORDS_BY_CATEGORY)) {
    assert.ok(words.length >= 50, `${category} has only ${words.length} words`)
  }
})

test('every word has at least one letter to guess', () => {
  for (const words of Object.values(WORDS_BY_CATEGORY)) {
    for (const word of words) {
      assert.ok([...word].some(isLetter), `"${word}" has nothing to guess`)
    }
  }
})
