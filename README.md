# Hangman

A Next.js hangman game. Guess the hidden word one letter at a time — click the letter buttons or type on your keyboard — before six wrong guesses complete the figure.

## Features

- **Categories**: Animals, Fruits, Vegetables, Countries, Musical Instruments, Everyday Objects, Sports, or General. "Any" (the default) picks a random category first, then a word from it, so the large General list doesn't crowd out the others. The category is shown above the word.
- **Multi-word answers** like "Costa Rica" or "Cayenne Pepper": spaces, hyphens and apostrophes are shown from the start, and only letters need guessing.
- **Keyboard play**: type letters to guess; repeated letters and non-letters are ignored.
- **Feedback**: correct guesses turn green, wrong ones turn red and are listed as missed letters, with a count of wrong guesses left. When you lose, the letters you missed are revealed in red.
- **Scoreboard**: wins and losses are tallied on either side of the figure, and the end-of-game popup shows your current and best win streak. Stats are saved in the browser's localStorage, so they survive reloads but are per-browser. A "Reset" button (with a confirmation) sets them back to zero.
- Light and dark mode follow the system setting.

## Getting started

Requires Node.js 18.18 or newer.

```bash
npm install
npm run dev    # http://localhost:3000
```

| Command | What it does |
|---|---|
| `npm run dev` | Development server with hot reload |
| `npm test` | Unit tests for game rules, stats and word lists (Node's built-in `node:test`, no extra dependencies) |
| `npm run lint` | ESLint via `next lint` |
| `npm run build` / `npm start` | Production build and server |

## Project layout

```
components/        UI pieces: HangmanFigure, Word, LetterButton, ScoreCounter, GameEndModal, Header, Nav
lib/game.mjs       Pure game rules: status, guess handling, word normalization, category labels
lib/stats.mjs      Wins, losses and streak calculation and localStorage persistence
lib/words/         One JSON word list per category, plus index.mjs that loads and normalizes them
pages/index.js     Start screen
pages/hangman.js   The game page
pages/api/word.js  Word API (keeps the word lists off the client)
```

Game state is just the current word and the list of guessed letters; everything else (won/lost, wrong guesses, button colours, figure stage) is derived from those two values by the functions in `lib/game.mjs`.

## Word API

`GET /api/word?category=<category>` returns a random word:

```json
{ "word": "COSTA RICA", "category": "countries" }
```

`category` is `any` or one of `general`, `animals`, `fruits`, `vegetables`, `countries`, `instruments`, `objects`, `sports`. It defaults to `any` when omitted; an unknown value returns `400` with the list of valid categories.

## Word lists

Each file in `lib/words/` is a plain JSON array of strings, and can be edited by hand. Words are cleaned when the server loads them: trimmed, upper-cased, and kept only if they consist of letters A–Z separated by single spaces, hyphens or apostrophes, with at least 3 letters. Anything else (digits, `&`, accented characters) is skipped.

The General list is the original word list. The other categories come from the public-domain (CC0) [Corpora Project](https://github.com/dariusk/corpora), cleaned up (herbs removed from Vegetables, "&" spelled out in country names, typos fixed) with Sports and Everyday Objects hand-picked.

### Adding a category

1. Add `lib/words/<key>.json` with an array of words.
2. Import it in `lib/words/index.mjs` and add it to `rawWordsByCategory`.
3. Add `<key>: 'Label'` to `CATEGORIES` in `lib/game.mjs`.

`npm test` fails if a category is missing from either place or has fewer than 50 usable words.
