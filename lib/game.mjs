export const MAX_WRONG_GUESSES = 6

export const MIN_LETTERS = 3

export const ALPHABET = Array.from({ length: 26 }, (_, offset) => String.fromCharCode(65 + offset))

export const ANY_CATEGORY = 'any'

export const CATEGORIES = {
  general: 'General',
  animals: 'Animals',
  fruits: 'Fruits',
  vegetables: 'Vegetables',
  countries: 'Countries',
  instruments: 'Musical Instruments',
  objects: 'Everyday Objects',
  sports: 'Sports',
}

const LETTER_WORDS_WITH_SEPARATORS = /^[A-Z]+(?:[ '-][A-Z]+)*$/

export function isLetter(character) {
  return ALPHABET.includes(character)
}

export function normalizeWordList(rawWords) {
  return rawWords
    .map((rawWord) => rawWord.trim().replace(/\s+/g, ' ').toUpperCase())
    .filter((word) => LETTER_WORDS_WITH_SEPARATORS.test(word))
    .filter((word) => [...word].filter(isLetter).length >= MIN_LETTERS)
}

export function getWrongGuesses(word, guesses) {
  return guesses.filter((letter) => !word.includes(letter))
}

export function getGameStatus(word, guesses) {
  if (getWrongGuesses(word, guesses).length >= MAX_WRONG_GUESSES) {
    return 'lost'
  }
  const lettersToGuess = new Set([...word].filter(isLetter))
  const allLettersGuessed = [...lettersToGuess].every((letter) => guesses.includes(letter))
  return allLettersGuessed ? 'won' : 'playing'
}

export function getLetterStatus(word, guesses, letter) {
  if (!guesses.includes(letter)) {
    return 'unused'
  }
  return word.includes(letter) ? 'correct' : 'wrong'
}

export function applyGuess(word, guesses, letter) {
  const isNewLetter = isLetter(letter) && !guesses.includes(letter)
  const isGameOver = getGameStatus(word, guesses) !== 'playing'
  return isNewLetter && !isGameOver ? [...guesses, letter] : guesses
}
