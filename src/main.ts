import data from '@/data.json';

const words = data.words;
const { vowels, consonants } = data.letters;

console.log(words);

function gaussianInt(min: number, max: number, stdDev: number) {
  const mean = (min + max) / 2;
  // Generate a normally distributed number (Box-Muller transform)
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random(); // avoid 0
  while (v === 0) v = Math.random();
  let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

  // Scale to desired mean and std deviation
  num = num * stdDev + mean;

  // Clamp to integer range [min, max]
  return Math.min(max, Math.max(min, Math.round(num)));
}

const nVowels = gaussianInt(2, 7, 1);
const drawLetter = [];
for (let i = 0; i < 10; i++) {
  if (i < nVowels) {
    drawLetter.push(vowels[Math.floor(Math.random() * vowels.length)]);
  } else {
    drawLetter.push(consonants[Math.floor(Math.random() * consonants.length)]);
  }
}

function shuffle<T>(array: T[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
    [array[i], array[j]] = [array[j], array[i]]; // swap elements
  }
}
shuffle(drawLetter);

console.log('Letters:', drawLetter.join(' '));

function findLongestWords(letters: string[]) {
  const letterCounts = countLetters(letters);
  let maxLen = 0;
  const result = [];
  console.log('Letter counts:', letterCounts);

  for (const word of words) {
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

const longestWords = findLongestWords(drawLetter);
console.log('Longest words:', longestWords.join(', '));

const seed = new URLSearchParams(window.location.search).get('seed') || Date.now().toString();
const rng = mulberry32(hashCode(seed));

const stages = [5, 6, 7, 8, 9, 10];
let index = 0;
const passed: string[] = [];
const found: string[] = [];
let currentWord = '';
let time = 60;

const timerEl = document.getElementById('timer')!;
const lettersEl = document.getElementById('letters')!;
const inputEl = document.getElementById('input') as HTMLInputElement;
const feedbackEl = document.getElementById('feedback')!;
const passBtn = document.getElementById('pass')!;
const resultsEl = document.getElementById('results')!;

function nextWord() {
  if (index >= stages.length && passed.length === 0) {
    // endGame();
    return;
  }
  if (index < stages.length) {
    currentWord = pickWord(stages[index]);
    index++;
  } else {
    currentWord = passed.shift()!;
  }
  //lettersEl.textContent = shuffle(currentWord);
  inputEl.value = '';
  feedbackEl.textContent = '';
}

function pickWord(length: number): string {
  const filtered = words.filter((w) => w.length === length);
  return filtered[Math.floor(rng() * filtered.length)];
}

function endGame() {
  //(document.getElementById('game') as HTMLElement).hidden = true;
  //resultsEl.hidden = false;
  //resultsEl.innerHTML = `<h2>Résultats</h2><p>Tu as trouvé : ${found.join(', ')}</p>`;
}

inputEl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    if (inputEl.value.toUpperCase() === currentWord) {
      found.push(currentWord);
      feedbackEl.textContent = '✅ Correct !';
      nextWord();
    } else {
      feedbackEl.textContent = '❌ Faux';
    }
  }
});

passBtn.addEventListener('click', () => {
  passed.push(currentWord);
  nextWord();
});

// Timer
setInterval(() => {
  time--;
  timerEl.textContent = time.toString();
  if (time <= 0) endGame();
}, 1000);

//nextWord();

// Seed utils
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

function mulberry32(a: number): () => number {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const btn = document.getElementById('pressButton') as HTMLButtonElement;

btn.addEventListener('click', () => {
  btn.classList.toggle('my-inactive');
});
