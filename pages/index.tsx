import React from 'react'
import Head from 'next/head'
import Game from '../components/Game'

export default function Home() {
  return (
    <>
      <Head>
        <title>Cube Survivor | Play Now</title>
        <meta name="description" content="Fast-paced 3D cube survival game" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main id="game-root">
        <Game />
      </main>
    </>
  )
}
