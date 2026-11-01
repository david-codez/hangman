import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  MAX_WRONG_GUESSES,
  applyGuess,
  getGameStatus,
  getLetterStatus,
  getWrongGuesses,
  normalizeWordList,
  wordsForDifficulty,
} from './game.mjs'

test('normalizeWordList uppercases, trims, and drops words with non-letters', () => {
  assert.deepEqual(normalizeWordList([' apple ', 'old-fashioned', "don't", 'Zebra']), ['APPLE', 'ZEBRA'])
})

test('wordsForDifficulty keeps only words inside the length band', () => {
  const words = ['CAT', 'HOUSE', 'GARDEN', 'ELEPHANT', 'BUTTERFLY']
  assert.deepEqual(wordsForDifficulty(words, 'easy'), ['CAT', 'HOUSE'])
  assert.deepEqual(wordsForDifficulty(words, 'medium'), ['GARDEN', 'ELEPHANT'])
  assert.deepEqual(wordsForDifficulty(words, 'hard'), ['BUTTERFLY'])
})

test('a game with no guesses is in progress', () => {
  assert.equal(getGameStatus('APPLE', []), 'playing')
})

test('guessing every unique letter wins, regardless of repeats in the word', () => {
  assert.equal(getGameStatus('APPLE', ['A', 'P', 'L', 'E']), 'won')
})

test('wrong guesses do not prevent a win below the limit', () => {
  assert.equal(getGameStatus('APPLE', ['Z', 'A', 'P', 'X', 'L', 'E']), 'won')
})

test('reaching the wrong-guess limit loses', () => {
  const wrongLetters = ['B', 'C', 'D', 'F', 'G', 'H'].slice(0, MAX_WRONG_GUESSES)
  assert.equal(getGameStatus('APPLE', wrongLetters), 'lost')
})

test('one wrong guess short of the limit is still in progress', () => {
  const wrongLetters = ['B', 'C', 'D', 'F', 'G', 'H'].slice(0, MAX_WRONG_GUESSES - 1)
  assert.equal(getGameStatus('APPLE', wrongLetters), 'playing')
})

test('getWrongGuesses returns only letters absent from the word', () => {
  assert.deepEqual(getWrongGuesses('APPLE', ['A', 'Z', 'P', 'Q']), ['Z', 'Q'])
})

test('getLetterStatus classifies unused, correct, and wrong letters', () => {
  assert.equal(getLetterStatus('APPLE', ['A', 'Z'], 'B'), 'unused')
  assert.equal(getLetterStatus('APPLE', ['A', 'Z'], 'A'), 'correct')
  assert.equal(getLetterStatus('APPLE', ['A', 'Z'], 'Z'), 'wrong')
})

test('applyGuess appends a new letter', () => {
  assert.deepEqual(applyGuess('APPLE', ['A'], 'P'), ['A', 'P'])
})

test('applyGuess ignores repeated letters and non-letters', () => {
  const guesses = ['A']
  assert.equal(applyGuess('APPLE', guesses, 'A'), guesses)
  assert.equal(applyGuess('APPLE', guesses, '-'), guesses)
})

test('applyGuess ignores guesses once the game is over', () => {
  const winningGuesses = ['A', 'P', 'L', 'E']
  assert.equal(applyGuess('APPLE', winningGuesses, 'Z'), winningGuesses)
})
