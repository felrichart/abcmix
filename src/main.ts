const words = ['SOLEIL', 'CHAINE', 'TOMATE', 'NUAGES', 'CRAYON', 'PIGEON', 'BRUNIR', 'CITRON'];

function shuffle(str: string): string {
  return str
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');
}

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
    endGame();
    return;
  }
  if (index < stages.length) {
    currentWord = pickWord(stages[index]);
    index++;
  } else {
    currentWord = passed.shift()!;
  }
  lettersEl.textContent = shuffle(currentWord);
  inputEl.value = '';
  feedbackEl.textContent = '';
}

function pickWord(length: number): string {
  const filtered = words.filter((w) => w.length === length);
  return filtered[Math.floor(rng() * filtered.length)];
}

function endGame() {
  (document.getElementById('game') as HTMLElement).hidden = true;
  resultsEl.hidden = false;
  resultsEl.innerHTML = `<h2>Résultats</h2><p>Tu as trouvé : ${found.join(', ')}</p>`;
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

nextWord();

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
