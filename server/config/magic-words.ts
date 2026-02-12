export const MAGIC_WORDS = process.env.MAGIC_WORDS
  ? process.env.MAGIC_WORDS.split(',').map(w => w.trim().toLowerCase())
  : ['REDACTED'];
