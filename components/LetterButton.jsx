import React, { useState } from 'react'
import { Col } from 'react-bootstrap'


export default function LetterButton(props) {
    // console.log(props)
    return (
        <Col className='letter-button-col'>
            <button className='letter-button mb-1' type='button' onClick={props.handleClick} value={props.letter}>{props.letter}</button>
        </Col>
    )
}
