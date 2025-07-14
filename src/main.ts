import { drawLetters } from './game';
import { seedRandomGenerator, nextSeed } from './random';

const seed = new URLSearchParams(window.location.search).get('seed') || Date.now().toString();
const iteration = new URLSearchParams(window.location.search).get('iteration') || '0';
seedRandomGenerator(seed);

for (let i = 0; i < parseInt(iteration, 10); i++) {
  nextSeed();
}
console.log(drawLetters());
