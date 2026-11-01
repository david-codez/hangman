import React from 'react'

export default function LetterButton({ letter, status, disabled, onGuess }) {
  return (
    <button
      className={`letter-button letter-button--${status}`}
      type='button'
      disabled={disabled}
      onClick={() => onGuess(letter)}
      aria-label={status === 'unused' ? letter : `${letter}, ${status}`}
    >
      {letter}
    </button>
  )
}
