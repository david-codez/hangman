import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

const OUTCOMES = {
  won: { message: 'Congratulations! You Won!', className: 'game-won' },
  lost: { message: 'You Lost, Better Luck Next Time!', className: 'game-loss' },
}

export default function GameEndModal({ status, gameWord, streak, onPlayAgain }) {
  const outcome = OUTCOMES[status]

  return (
    <Modal
      show={Boolean(outcome)}
      onHide={onPlayAgain}
      size='lg'
      aria-labelledby='game-end-title'
      centered
      className='game-over-modal'
    >
      {outcome && (
        <>
          <Modal.Body>
            <h4 id='game-end-title' className={outcome.className}>{outcome.message}</h4>
            <p className={outcome.className}>The word was: {gameWord}</p>
            <p>Current win streak: {streak.current} (best: {streak.best})</p>
          </Modal.Body>
          <Modal.Footer id='modal-footer-button'>
            <Button onClick={onPlayAgain} autoFocus>Play Again</Button>
          </Modal.Footer>
        </>
      )}
    </Modal>
  )
}
