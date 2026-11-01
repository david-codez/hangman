import React from 'react'

export default function ScoreCounter({ label, count, variant }) {
  return (
    <div className={`score-counter score-counter--${variant}`}>
      <span className='score-counter__count'>{count}</span>
      <span className='score-counter__label'>{label}</span>
    </div>
  )
}
