import React from 'react'
import Head from 'next/head'

export default function Header() {
  return (
    <Head>
      <title>Hangman App</title>
      <meta name='description' content='Guess the hidden word one letter at a time.' />
      <meta property='og:title' content='Hangman App' key='title' />
      <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      <link rel='icon' href='/favicon.ico' />
    </Head>
  )
}
