import React, {useState} from 'react'
import Image from 'next/image'
import hangman0 from './images/hangman-0.png'
import hangman1 from './images/hangman-1.png'
import hangman2 from './images/hangman-2.png'
import hangman3 from './images/hangman-3.png'
import hangman4 from './images/hangman-4.png'
import hangman5 from './images/hangman-5.png'
import hangman6 from './images/hangman-6.png'
import hangman7 from './images/hangman-7.png'



export default function HangmanFigure(props) {
    let index = props.imageIndex
    let images = [
      hangman0,
      hangman1,
      hangman2,
      hangman3,
      hangman4,
      hangman5,
      hangman6,
      hangman7

    ]
    
    

  return (
    <div className='hangman-figure'>
        <Image src={images[index]} alt='hangman figure' width="400" height='400'/>
    </div>
  )
}

