import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Container } from 'react-bootstrap'
import Header from '../components/Header'
import Nav from '../components/Nav'
import HangmanFigure from '../components/HangmanFigure'
import LetterButton from '../components/LetterButton'
import Word from '../components/Word'
import GameEndModal from '../components/GameEndModal'
import {
  ALPHABET,
  DEFAULT_DIFFICULTY,
  DIFFICULTIES,
  MAX_WRONG_GUESSES,
  applyGuess,
  getGameStatus,
  getLetterStatus,
  getWrongGuesses,
} from '../lib/game.mjs'
import { EMPTY_STREAK, loadStreak, nextStreak, saveStreak } from '../lib/streak.mjs'

export default function Hangman() {
  const [difficulty, setDifficulty] = useState(DEFAULT_DIFFICULTY)
  const [gameWord, setGameWord] = useState(null)
  const [guesses, setGuesses] = useState([])
  const [loadError, setLoadError] = useState(null)
  const [streak, setStreak] = useState(EMPTY_STREAK)
  const pendingRequest = useRef(null)

  const startNewGame = useCallback(async (selectedDifficulty) => {
    pendingRequest.current?.abort()
    const controller = new AbortController()
    pendingRequest.current = controller

    setGameWord(null)
    setGuesses([])
    setLoadError(null)
    try {
      const response = await fetch(`/api/word?difficulty=${selectedDifficulty}`, { signal: controller.signal })
      if (!response.ok) {
        throw new Error(`Word request failed with status ${response.status}`)
      }
      const { word } = await response.json()
      setGameWord(word)
    } catch (error) {
      if (error.name === 'AbortError') {
        return
      }
      console.error(error)
      setLoadError('Could not load a word. Check your connection and try again.')
    }
  }, [])

  useEffect(() => {
    setStreak(loadStreak())
    startNewGame(DEFAULT_DIFFICULTY)
    return () => pendingRequest.current?.abort()
  }, [startNewGame])

  const status = gameWord ? getGameStatus(gameWord, guesses) : 'loading'
  const wrongGuesses = gameWord ? getWrongGuesses(gameWord, guesses) : []

  const handleGuess = useCallback((letter) => {
    if (!gameWord) {
      return
    }
    const nextGuesses = applyGuess(gameWord, guesses, letter)
    if (nextGuesses === guesses) {
      return
    }
    setGuesses(nextGuesses)

    const nextStatus = getGameStatus(gameWord, nextGuesses)
    if (nextStatus !== 'playing') {
      const updatedStreak = nextStreak(streak, nextStatus)
      setStreak(updatedStreak)
      saveStreak(updatedStreak)
    }
  }, [gameWord, guesses, streak])

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey || event.metaKey || event.altKey || event.target.closest('input, select, textarea')) {
        return
      }
      handleGuess(event.key.toUpperCase())
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleGuess])

  const handleDifficultyChange = (event) => {
    setDifficulty(event.target.value)
    startNewGame(event.target.value)
  }

  const isGameOver = status === 'won' || status === 'lost'

  return (
    <div>
      <Header />
      <Nav />

      <div className='game-controls'>
        <label htmlFor='difficulty'>Difficulty</label>
        <select id='difficulty' value={difficulty} onChange={handleDifficultyChange}>
          {Object.entries(DIFFICULTIES).map(([key, { label }]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
        <span className='streak'>Streak: {streak.current} (best {streak.best})</span>
      </div>

      <HangmanFigure wrongGuessCount={wrongGuesses.length} isLost={status === 'lost'} />

      <p className='guesses-left' aria-live='polite'>
        {MAX_WRONG_GUESSES - wrongGuesses.length} of {MAX_WRONG_GUESSES} wrong guesses left
        {wrongGuesses.length > 0 && <> · Missed: <span className='missed-letters'>{wrongGuesses.join(' ')}</span></>}
      </p>

      <Container className='word-container'>
        {loadError && (
          <p className='load-error' role='alert'>
            {loadError} <button type='button' onClick={() => startNewGame(difficulty)}>Retry</button>
          </p>
        )}
        {status === 'loading' && !loadError && <p>Loading word…</p>}
        {gameWord && <Word gameWord={gameWord} guesses={guesses} revealAll={status === 'lost'} />}
      </Container>

      <Container id='button-container'>
        <div className='button-row'>
          {ALPHABET.map((letter) => (
            <LetterButton
              key={letter}
              letter={letter}
              status={gameWord ? getLetterStatus(gameWord, guesses, letter) : 'unused'}
              disabled={!gameWord || isGameOver || guesses.includes(letter)}
              onGuess={handleGuess}
            />
          ))}
        </div>
      </Container>

      <GameEndModal
        status={status}
        gameWord={gameWord}
        streak={streak}
        onPlayAgain={() => startNewGame(difficulty)}
      />
    </div>
  )
}
