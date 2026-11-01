import rawWordList from '../../lib/wordList.json'
import { DIFFICULTIES, normalizeWordList, wordsForDifficulty } from '../../lib/game.mjs'

const words = normalizeWordList(rawWordList.wordList)

export default function handler(req, res) {
  const { difficulty } = req.query
  if (!Object.hasOwn(DIFFICULTIES, difficulty)) {
    res.status(400).json({ error: `Unknown difficulty "${difficulty}". Use one of: ${Object.keys(DIFFICULTIES).join(', ')}.` })
    return
  }
  const candidates = wordsForDifficulty(words, difficulty)
  const word = candidates[Math.floor(Math.random() * candidates.length)]
  res.setHeader('Cache-Control', 'no-store')
  res.status(200).json({ word })
}
