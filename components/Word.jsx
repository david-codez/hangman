import React from 'react'

export default function Word({ gameWord, guesses, revealAll }) {
  const maskedWord = gameWord
    .split('')
    .map((letter) => (guesses.includes(letter) ? letter : '_'))
    .join(' ')

  return (
    <div className='word' role='img' aria-label={`Word: ${maskedWord}`}>
      {gameWord.split('').map((letter, i) => {
        const isGuessed = guesses.includes(letter)
        const isMissed = revealAll && !isGuessed
        return (
          <span className={isMissed ? 'letter letter--missed' : 'letter'} key={i} aria-hidden='true'>
            {isGuessed || isMissed ? letter : ''}
          </span>
        )
      })}
    </div>
  )
}
