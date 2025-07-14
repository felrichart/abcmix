import data from '@/data.json';
import { random, nonZeroRandom } from '@/random';
import { shuffle } from '@/utils';

const words = data.words.map((info) => info.word);
const simpleWords = data.words.filter((info) => info.freq > 0.33).map((info) => info.word);
const { vowels, consonants } = data.letters;

export function drawLetters() {
  let nVowels =
    Math.sqrt(-2.0 * Math.log(nonZeroRandom())) * Math.cos(2.0 * Math.PI * nonZeroRandom());
  // Sttdev = 1, mean = 4.5
  nVowels = nVowels * 1 + 4.5;
  nVowels = Math.min(7, Math.max(2, Math.round(nVowels)));

  const drawLetter = [];
  for (let i = 0; i < 10; i++) {
    if (i < nVowels) {
      drawLetter.push(vowels[Math.floor(random() * vowels.length)]);
    } else {
      drawLetter.push(consonants[Math.floor(random() * consonants.length)]);
    }
  }
  return shuffle(drawLetter).join('');
}

export function findLongestWords(drawLetter: string, simple: boolean = false) {
  const letterCounts = countLetters(drawLetter.split(''));
  let maxLen = 0;
  const result = [];
  const useWords = simple ? simpleWords : words;
  for (const word of useWords) {
    if (word.length < maxLen) continue;

    if (canBuild(word, letterCounts)) {
      if (word.length > maxLen) {
        maxLen = word.length;
        result.length = 0; // reset
      }
      result.push(word);
    }
  }

  return result;
}

export function extractWord(drawLetter: string, length: number, simple: boolean = false) {
  const letters = drawLetter.split('');
  const letterCounts = countLetters(letters);
  const result = [];
  const useWords = simple ? simpleWords : words;

  for (const word of useWords) {
    if (word.length !== length) continue;
    if (canBuild(word, letterCounts)) {
      result.push(word);
    }
  }
  if (result.length === 0) {
    return null;
  }
  return result[Math.floor(random() * result.length)];
}

// Private

function countLetters(letters: string[]) {
  const counts: { [key: string]: number } = {};
  for (const letter of letters) {
    counts[letter] = (counts[letter] || 0) + 1;
  }
  return counts;
}

function canBuild(word: string, availableCounts: { [key: string]: number }) {
  const temp = { ...availableCounts };
  for (const letter of word) {
    if (!temp[letter]) return false;
    temp[letter]--;
  }
  return true;
}

// Seed utils
