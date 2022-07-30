import React, {useState} from 'react'
import Image from 'next/image'
// import hangman1 from '/images/hangman-1.png'
// import hangman2 from '/images/hangman-2'
// import hangman3 from '/images/hangman-3'
// import hangman4 from '/images/hangman-4'
// import hangman5 from '/images/hangman-5'
// import hangman6 from '/images/hangman-6'


export default function HangmanFigure(props) {
    let index = props.imageIndex
   

    

  return (
    <div className='hangman-figure'>
        <Image src={`/images/hangman-${index}.png`} alt='hangman figure' width="400" height='400'/>
    </div>
  )
}

