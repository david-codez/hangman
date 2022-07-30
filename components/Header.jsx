import React from 'react'
import Head from 'next/head'


export default function  Header() {
  return (
    <div>
        <Head>
            <title>Hangman App</title>
            <meta property="og:title" content="Hangman App" key='title' />
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />

        </Head>
    </div>
  )
}

