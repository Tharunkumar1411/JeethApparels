const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function randomLetters(n) {
  let out = '';
  for (let i = 0; i < n; i++) {
    out += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return out;
}

export function generateReferralCode(seed = '') {
  const prefix = seed
    .replace(/[^a-zA-Z]/g, '')
    .slice(0, 3)
    .toUpperCase()
    .padEnd(3, 'X');
  return `${prefix}${randomLetters(6)}`;
}
