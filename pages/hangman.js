import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Container } from 'react-bootstrap'
import Header from '../components/Header'
import Nav from '../components/Nav'
import HangmanFigure from '../components/HangmanFigure'
import LetterButton from '../components/LetterButton'
import Word from '../components/Word'
import GameEndModal from '../components/GameEndModal'
import ScoreCounter from '../components/ScoreCounter'
import {
  ALPHABET,
  ANY_CATEGORY,
  CATEGORIES,
  MAX_WRONG_GUESSES,
  applyGuess,
  getGameStatus,
  getLetterStatus,
  getWrongGuesses,
} from '../lib/game.mjs'
import { EMPTY_STATS, loadStats, nextStats, saveStats } from '../lib/stats.mjs'

export default function Hangman() {
  const [selectedCategory, setSelectedCategory] = useState(ANY_CATEGORY)
  const [gameWord, setGameWord] = useState(null)
  const [wordCategory, setWordCategory] = useState(null)
  const [guesses, setGuesses] = useState([])
  const [loadError, setLoadError] = useState(null)
  const [stats, setStats] = useState(EMPTY_STATS)
  const pendingRequest = useRef(null)

  const startNewGame = useCallback(async (category) => {
    pendingRequest.current?.abort()
    const controller = new AbortController()
    pendingRequest.current = controller

    setGameWord(null)
    setGuesses([])
    setLoadError(null)
    try {
      const response = await fetch(`/api/word?category=${category}`, { signal: controller.signal })
      if (!response.ok) {
        throw new Error(`Word request failed with status ${response.status}`)
      }
      const { word, category: chosenCategory } = await response.json()
      setGameWord(word)
      setWordCategory(chosenCategory)
    } catch (error) {
      if (error.name === 'AbortError') {
        return
      }
      console.error(error)
      setLoadError('Could not load a word. Check your connection and try again.')
    }
  }, [])

  useEffect(() => {
    setStats(loadStats())
    startNewGame(ANY_CATEGORY)
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
      const updatedStats = nextStats(stats, nextStatus)
      setStats(updatedStats)
      saveStats(updatedStats)
    }
  }, [gameWord, guesses, stats])

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

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value)
    startNewGame(event.target.value)
  }

  const handleResetStats = () => {
    if (!window.confirm('Reset your wins, losses and win streak to zero?')) {
      return
    }
    setStats(EMPTY_STATS)
    saveStats(EMPTY_STATS)
  }

  const isGameOver = status === 'won' || status === 'lost'

  return (
    <div>
      <Header />
      <Nav />

      <div className='game-controls'>
        <label htmlFor='category'>Category</label>
        <select id='category' value={selectedCategory} onChange={handleCategoryChange}>
          <option value={ANY_CATEGORY}>Any</option>
          {Object.entries(CATEGORIES).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
        <button
          type='button'
          className='reset-stats-button'
          onClick={handleResetStats}
          title='Set wins, losses and win streak back to zero'
        >
          <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
            <path d='M21 12a9 9 0 1 1-3-6.7' />
            <polyline points='21 3 21 9 15 9' />
          </svg>
          Reset
        </button>
      </div>

      <div className='figure-row'>
        <ScoreCounter label='Wins' count={stats.wins} variant='wins' />
        <HangmanFigure wrongGuessCount={wrongGuesses.length} isLost={status === 'lost'} />
        <ScoreCounter label='Losses' count={stats.losses} variant='losses' />
      </div>

      <p className='guesses-left' aria-live='polite'>
        {MAX_WRONG_GUESSES - wrongGuesses.length} of {MAX_WRONG_GUESSES} wrong guesses left
        {wrongGuesses.length > 0 && <> · Missed: <span className='missed-letters'>{wrongGuesses.join(' ')}</span></>}
      </p>

      <Container className='word-container'>
        {loadError && (
          <p className='load-error' role='alert'>
            {loadError} <button type='button' onClick={() => startNewGame(selectedCategory)}>Retry</button>
          </p>
        )}
        {status === 'loading' && !loadError && <p>Loading word…</p>}
        {gameWord && <p className='word-category'>Category: {CATEGORIES[wordCategory]}</p>}
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
        stats={stats}
        onPlayAgain={() => startNewGame(selectedCategory)}
      />
    </div>
  )
}
