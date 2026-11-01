# Hangman

A Next.js hangman game. Guess the hidden word one letter at a time, by clicking the letter buttons or typing on your keyboard, before six wrong guesses complete the figure.

- Three difficulty levels based on word length (easy 3–5, medium 6–8, hard 9+ letters)
- Correct guesses turn green, wrong guesses turn red and are listed as missed letters
- Missed letters are revealed when you lose
- Your current and best win streak are saved in the browser

## Development

```bash
npm install
npm run dev    # http://localhost:3000
npm test       # game-logic unit tests (node:test)
npm run lint
```

## Layout

- `lib/game.mjs` — pure game rules (status, guess handling, difficulty filtering)
- `lib/streak.mjs` — win-streak calculation and localStorage persistence
- `lib/wordList.json` — the word list, read only on the server
- `pages/api/word.js` — `GET /api/word?difficulty=easy|medium|hard` returns a random word
- `pages/hangman.js` — the game page
