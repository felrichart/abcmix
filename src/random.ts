let lastSeed: string | null = null;

export let random: () => number = Math.random;

export const nonZeroRandom: () => number = () => random() || nonZeroRandom();

export function seedRandomGenerator(seed: string) {
  random = mulberry32(hashCode(seed));
  lastSeed = seed;
}

export function resetRandomGenerator() {
  random = Math.random;
  lastSeed = null;
}

export function nextSeed() {
  if (!lastSeed) {
    throw new Error('Random generator has not been seeded yet.');
  }
  const nextSeedValue = lastSeed + '-next';
  seedRandomGenerator(nextSeedValue);
  return nextSeedValue;
}

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
    let t = (a += 0x6d2b79f5); // Mutate a
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
