import animals from './animals.json' with { type: 'json' }
import countries from './countries.json' with { type: 'json' }
import fruits from './fruits.json' with { type: 'json' }
import general from './general.json' with { type: 'json' }
import instruments from './instruments.json' with { type: 'json' }
import objects from './objects.json' with { type: 'json' }
import sports from './sports.json' with { type: 'json' }
import vegetables from './vegetables.json' with { type: 'json' }
import { normalizeWordList } from '../game.mjs'

const rawWordsByCategory = { animals, countries, fruits, general, instruments, objects, sports, vegetables }

export const WORDS_BY_CATEGORY = Object.fromEntries(
  Object.entries(rawWordsByCategory).map(([category, rawWords]) => [category, normalizeWordList(rawWords)]),
)
