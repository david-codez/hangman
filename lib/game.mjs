export const MAX_WRONG_GUESSES = 6

export const ALPHABET = Array.from({ length: 26 }, (_, offset) => String.fromCharCode(65 + offset))

export const DIFFICULTIES = {
  easy: { label: 'Easy', minLength: 3, maxLength: 5 },
  medium: { label: 'Medium', minLength: 6, maxLength: 8 },
  hard: { label: 'Hard', minLength: 9, maxLength: Infinity },
}

export const DEFAULT_DIFFICULTY = 'medium'

const LETTERS_ONLY = /^[A-Z]+$/

export function normalizeWordList(rawWords) {
  return rawWords
    .map((rawWord) => rawWord.trim().toUpperCase())
    .filter((word) => LETTERS_ONLY.test(word))
}

export function wordsForDifficulty(words, difficulty) {
  const { minLength, maxLength } = DIFFICULTIES[difficulty]
  return words.filter((word) => word.length >= minLength && word.length <= maxLength)
}

export function getWrongGuesses(word, guesses) {
  return guesses.filter((letter) => !word.includes(letter))
}

export function getGameStatus(word, guesses) {
  if (getWrongGuesses(word, guesses).length >= MAX_WRONG_GUESSES) {
    return 'lost'
  }
  const allLettersGuessed = [...new Set(word)].every((letter) => guesses.includes(letter))
  return allLettersGuessed ? 'won' : 'playing'
}

export function getLetterStatus(word, guesses, letter) {
  if (!guesses.includes(letter)) {
    return 'unused'
  }
  return word.includes(letter) ? 'correct' : 'wrong'
}

export function applyGuess(word, guesses, letter) {
  const isNewLetter = ALPHABET.includes(letter) && !guesses.includes(letter)
  const isGameOver = getGameStatus(word, guesses) !== 'playing'
  return isNewLetter && !isGameOver ? [...guesses, letter] : guesses
}
