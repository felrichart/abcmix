import { drawLetters, extractWord } from './game';
import { seedRandomGenerator, nextSeed } from './random';
import { shuffle } from './utils';

const seed = new URLSearchParams(window.location.search).get('seed') || Date.now().toString();
const iteration = new URLSearchParams(window.location.search).get('iteration') || '0';
seedRandomGenerator(seed);

for (let i = 0; i < parseInt(iteration, 10); i++) {
  nextSeed();
}

for (let i = 4; i <= 10; i++) {
  let letters = drawLetters();
  let k = 0;
  let res = null;
  while (!(res = extractWord(letters, i, true))) {
    letters = drawLetters();
    k++;
  }
  console.log(`Iteration ${i} (${k} tries)`);
  console.log(`Letters: ${shuffle(res.split(''))}`);
  console.log(`Found word: ${res}`);
}
