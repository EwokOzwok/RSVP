/**
 * Splits raw text into an array of "words" suitable for RSVP display.
 * Collapses all whitespace (including newlines) so punctuation stays
 * attached to its word, which keeps natural reading rhythm.
 */
export function tokenize(text) {
  if (!text) return [];
  return text
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean);
}

/**
 * Approximates the Optimal Recognition Point (ORP) — the letter the eye
 * naturally lands on — based on word length. This mirrors the classic
 * Spritz-style heuristic: short words pivot near the start, longer words
 * pivot a bit further in.
 */
export function getORPIndex(word) {
  const len = word.length;
  if (len <= 1) return 0;
  if (len <= 5) return 1;
  if (len <= 9) return 2;
  if (len <= 13) return 3;
  return 4;
}

/**
 * Splits a word into [prefix, pivotLetter, suffix] around its ORP index,
 * so a fixed-position layout can render the pivot letter in one spot.
 */
export function splitAtORP(word) {
  const idx = Math.min(getORPIndex(word), Math.max(word.length - 1, 0));
  return {
    prefix: word.slice(0, idx),
    pivot: word.slice(idx, idx + 1) || '',
    suffix: word.slice(idx + 1),
  };
}

/**
 * Words that benefit from a slightly longer pause when displayed
 * (end of sentence, comma, etc.) so the reader's brain has a beat
 * to process before the next word.
 */
export function getPauseMultiplier(word) {
  if (/[.!?]["')\]]?$/.test(word)) return 2.2;
  if (/[,;:]["')\]]?$/.test(word)) return 1.6;
  if (word.length >= 9) return 1.25;
  return 1;
}
