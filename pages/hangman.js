import React, { useState, useEffect } from 'react'
import { Row, Col, Container } from 'react-bootstrap'
import Header from '../components/header'
import Nav from '../components/Nav'
import HangmanFigure from '../components/HangmanFigure'
import LetterButton from '../components/LetterButton'
import Word from '../components/Word'
import GameEndModal from '../components/GameEndModal'
import getWord  from '../pages/api/GetWord'

export const word = getWord()

export default function Hangman() {


 const selectWord = () => {

  } 
    //sets challenge word
    const [gameWord, setGameWord] = useState(word)
    

    //keeps track of when the game is won
    const [gameWon, setGameWon] = useState(false)
    const [gameLoss, setGameLoss] = useState(false)

    //keeps track of the letters guessed
    const [guesses, setGuesses] = useState([])
    const [wrongGuesses, setWrongGuesses] = useState([])
    const [correctGuesses, setCorrectGuesses] = useState([])

    // Geame end Modal
    const [modalShow, setModalShow] = useState(false);


    //create letters array
    const alpha = Array.from(Array(26)).map((e, i) => i + 65);
    const alphabet = alpha.map((x) => String.fromCharCode(x));



    //initialize hangman figure images
    const [imageIndex, setImageIndex] = useState(0)

    //function to determine the amount of correct guesses needed to win
    const findNumUniqueChars = () => {
      let string = gameWord.split('')
      string = new Set(string)
      return string.size
    }


    //save the value of correct guesses needed to win
    let goal = findNumUniqueChars()
    

    // handle user guessing
    const handleLetterButtonClick =  (e) => {

      //prevent refresh
      e.preventDefault()

      //grab letter variable
      let letter = e.target.value
      // console.log(letter)

      //disable button after guess
      e.target.disabled = true

      //keeps track of all guesses
      setGuesses((guesses) => [...guesses, letter])

      //check if guess is correct or incorrect
      gameWord.includes(letter) ? setCorrectGuesses((correctGuesses) => [...correctGuesses, letter]) : setWrongGuesses((wrongGuesses) => [...wrongGuesses, letter])
    }

    const resetGame = () => {
        setGameLoss(false)
        setGameWon(false)
        setCorrectGuesses([])
        setWrongGuesses([])
        setImageIndex(0)
        setGuesses([])
        setModalShow(false)
        const buttons = document.querySelectorAll(".letter-button")
        buttons.forEach((button) => button.disabled = false)
        setGameWord(getWord())
    }

    useEffect(() => {

      setImageIndex(wrongGuesses.length)
      //check for loss
      if(wrongGuesses.length === 6) {
        setGameLoss(true)
        setModalShow(true)
        setImageIndex(7)
      } 
      // console.log(correctGuesses)
      //check for win
      if(correctGuesses.length === goal){
        setGameWon(true)
        setModalShow(true)
      }
      return

    }, [
          setGameWord,  
          gameLoss, 
          setGameLoss, 
          gameWon, 
          setGameWon, 
          setImageIndex, 
          correctGuesses, 
          wrongGuesses, 
          goal
        ])




  return (
    <div>
        <Header />
        <Nav />
        <HangmanFigure imageIndex={imageIndex} />
        <Container className='word-container'>
          <Word gameWord={gameWord} correctGuesses={correctGuesses} />
        </Container>
       

        <Container id='button-container'>
          
          <Row className='button-row'>
            <>
             {alphabet.map((letter, index) => <LetterButton letter={letter} handleClick={handleLetterButtonClick} key={index} />)}
            </>
          </Row>
          
        </Container>
        
        <GameEndModal
        show={modalShow}
        onHide={() => resetGame()}
        gameLoss={gameLoss}
        gameWon={gameWon}
        gameWord={gameWord}
      />
    </div>
  )
}


