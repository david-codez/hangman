# Hangman

A Next.js hangman game. Guess the hidden word one letter at a time, by clicking the letter buttons or typing on your keyboard, before six wrong guesses complete the figure.

- Pick a category (Animals, Fruits, Vegetables, Countries, Musical Instruments, Everyday Objects, Sports, General) or play "Any"; the category is shown during play
- Multi-word answers like "Costa Rica" show spaces, hyphens and apostrophes from the start
- Correct guesses turn green, wrong guesses turn red and are listed as missed letters
- Missed letters are revealed when you lose
- Wins and losses are tallied on either side of the figure, and they are saved in the browser along with your current and best win streak

## Development

```bash
npm install
npm run dev    # http://localhost:3000
npm test       # game-logic unit tests (node:test)
npm run lint
```

## Layout

- `lib/game.mjs` — pure game rules (status, guess handling, word normalization) and category labels
- `lib/stats.mjs` — wins, losses and streak calculation and localStorage persistence
- `lib/words/*.json` — one word list per category, read only on the server. Category lists come from the public-domain (CC0) [Corpora Project](https://github.com/dariusk/corpora), cleaned up and with Sports and Everyday Objects hand-picked; edit them freely
- `pages/api/word.js` — `GET /api/word?category=any|animals|…` returns `{ word, category }`
- `pages/hangman.js` — the game page
