import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export default function GameEndModal(props) {
    let message = ''
    let result = ''

    if(props.gameWon) {
      message = 'Congratulations! You Won!'
      result = 'game-won'
    }

    else if(props.gameLoss) {
      message = 'You Lost, Better Luck Next Time!'
      result = 'game-loss'

    }
    
  return (
    <Modal
      show ={props.show}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className='game-over-modal'
    >

      <Modal.Body>
        <h4 className={result}>{message}</h4>
        <p className={result}>
         The word was: {props.gameWord}
        </p>
      </Modal.Body>
      <Modal.Footer id='modal-footer-button'>
        <Button onClick={props.onHide}>Play Again</Button>
      </Modal.Footer>
    </Modal>
  );
}