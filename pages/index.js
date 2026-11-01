import Link from 'next/link'
import Header from '../components/Header'
import Nav from '../components/Nav'

export default function Home() {
  return (
    <>
      <Header />
      <Nav />
      <div className='start-button-div'>
        <Link href='/hangman' className='start-button'>Start Game</Link>
      </div>
    </>
  )
}
