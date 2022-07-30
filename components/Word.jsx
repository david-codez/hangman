import React from 'react'
import Container from 'react-bootstrap'



export default function Word({ gameWord, correctGuesses}) {

    return (

            <div className='word'>
                    {gameWord.split('').map((letter, i) => {
                        return(
                            <span className='letter' key={i}>
                                {correctGuesses.includes(letter) ? letter : ''}
                            </span>
                        )
                    })}

            </div>

    )
}