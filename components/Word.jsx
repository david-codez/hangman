import React from 'react'
import { isLetter } from '../lib/game.mjs'

export default function Word({ gameWord, guesses, revealAll }) {
  const maskedWord = [...gameWord]
    .map((character) => (!isLetter(character) || guesses.includes(character) ? character : '_'))
    .join(' ')

  return (
    <div className='word' role='img' aria-label={`Word: ${maskedWord}`}>
      {gameWord.split(' ').map((wordPart, partIndex) => (
        <span className='word-part' key={partIndex} aria-hidden='true'>
          {[...wordPart].map((character, i) => {
            if (!isLetter(character)) {
              return <span className='letter letter--separator' key={i}>{character}</span>
            }
            const isGuessed = guesses.includes(character)
            const isMissed = revealAll && !isGuessed
            return (
              <span className={isMissed ? 'letter letter--missed' : 'letter'} key={i}>
                {isGuessed || isMissed ? character : ''}
              </span>
            )
          })}
        </span>
      ))}
    </div>
  )
}
