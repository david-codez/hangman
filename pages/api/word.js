import { ANY_CATEGORY, CATEGORIES } from '../../lib/game.mjs'
import { WORDS_BY_CATEGORY } from '../../lib/words/index.mjs'

const pickRandom = (items) => items[Math.floor(Math.random() * items.length)]

export default function handler(req, res) {
  const requestedCategory = req.query.category ?? ANY_CATEGORY
  const isKnownCategory = requestedCategory === ANY_CATEGORY || Object.hasOwn(CATEGORIES, requestedCategory)
  if (!isKnownCategory) {
    const validCategories = [ANY_CATEGORY, ...Object.keys(CATEGORIES)].join(', ')
    res.status(400).json({ error: `Unknown category "${requestedCategory}". Use one of: ${validCategories}.` })
    return
  }
  const category = requestedCategory === ANY_CATEGORY ? pickRandom(Object.keys(CATEGORIES)) : requestedCategory
  res.setHeader('Cache-Control', 'no-store')
  res.status(200).json({ word: pickRandom(WORDS_BY_CATEGORY[category]), category })
}
