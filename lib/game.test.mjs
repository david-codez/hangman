import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  MAX_WRONG_GUESSES,
  applyGuess,
  getGameStatus,
  getLetterStatus,
  getWrongGuesses,
  normalizeWordList,
} from './game.mjs'

test('normalizeWordList uppercases, trims, and collapses inner whitespace', () => {
  assert.deepEqual(normalizeWordList([' apple ', 'Costa   Rica']), ['APPLE', 'COSTA RICA'])
})

test('normalizeWordList keeps hyphens, apostrophes and spaces between letters', () => {
  assert.deepEqual(normalizeWordList(['old-fashioned', "don't", 'bell pepper']), ['OLD-FASHIONED', "DON'T", 'BELL PEPPER'])
})

test('normalizeWordList drops entries with other characters or too few letters', () => {
  assert.deepEqual(normalizeWordList(['mp3 player', 'St. Lucia', 'Côte', 'at', 'I', 'cat']), ['CAT'])
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

test('separators are revealed from the start and never need guessing', () => {
  assert.equal(getGameStatus('OLD-FASHIONED', ['O', 'L', 'D', 'F', 'A', 'S', 'H', 'I', 'N', 'E']), 'won')
  assert.equal(getGameStatus('BELL PEPPER', ['B', 'E', 'L', 'P', 'R']), 'won')
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
