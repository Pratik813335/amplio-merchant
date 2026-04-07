const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const ALPHANUMERIC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export function randomInt(min, max) {
  const lower = Math.ceil(min);
  const upper = Math.floor(max);

  return Math.floor(Math.random() * (upper - lower + 1)) + lower;
}

export function pickRandom(items) {
  if (!Array.isArray(items) || items.length === 0) {
    return undefined;
  }

  return items[randomInt(0, items.length - 1)];
}

export function randomDigits(length) {
  return Array.from({ length }, () => randomInt(0, 9)).join('');
}

export function randomChars(length, charset = ALPHABET) {
  return Array.from({ length }, () => charset[randomInt(0, charset.length - 1)]).join('');
}

export function randomAlpha(length) {
  return randomChars(length, ALPHABET);
}

export function randomAlphaNumeric(length) {
  return randomChars(length, ALPHANUMERIC);
}

export function randomPastDate({ startYear = 2000, endYear = new Date().getFullYear() - 1 } = {}) {
  const start = new Date(startYear, 0, 1).getTime();
  const end = new Date(endYear, 11, 31).getTime();

  return new Date(randomInt(start, end));
}

export function padRight(value, length, fill = 'X') {
  const normalized = String(value || '');

  if (normalized.length >= length) {
    return normalized.slice(0, length);
  }

  return `${normalized}${fill.repeat(length - normalized.length)}`;
}

export function slugify(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}
