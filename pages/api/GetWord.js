import wordList from './wordList.json'

export default function getWord() {
    let word = wordList.wordList[Math.floor(Math.random() * wordList.wordList.length)].toUpperCase();
    return word
}