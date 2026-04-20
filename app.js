const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;
const APP_VERSION = process.env.APP_VERSION || '1.0.0';
const WORDS_PER_MINUTE = parseInt(process.env.WORDS_PER_MINUTE || '200', 10);
const TOP_WORDS_COUNT = parseInt(process.env.TOP_WORDS_COUNT || '5', 10);

const STOPWORDS = new Set([
  'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas',
  'de', 'del', 'al', 'a', 'en', 'y', 'o', 'u', 'e',
  'que', 'por', 'para', 'con', 'sin', 'su', 'sus',
  'es', 'son', 'fue', 'ser', 'soy', 'eres',
  'lo', 'le', 'les', 'me', 'te', 'se', 'nos', 'os',
  'este', 'esta', 'estos', 'estas', 'ese', 'esa', 'esos', 'esas',
  'como', 'pero', 'más', 'mas', 'muy', 'ya', 'si', 'no', 'ni',
  'the', 'a', 'an', 'and', 'or', 'but', 'of', 'to', 'in', 'on',
  'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'it', 'this', 'that', 'these', 'those', 'for', 'with'
]);

app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, 'public')));

function analyzeText(text) {
  const trimmed = text.trim();

  if (trimmed.length === 0) {
    return {
      characters: 0,
      characters_no_spaces: 0,
      words: 0,
      sentences: 0,
      paragraphs: 0,
      reading_time_minutes: 0,
      reading_time_seconds: 0,
      top_words: [],
    };
  }

  const characters = text.length;
  const characters_no_spaces = text.replace(/\s/g, '').length;

  const wordsArray = trimmed
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .split(/[^a-z0-9ñ]+/)
    .filter(w => w.length > 0);

  const words = wordsArray.length;

  const sentences = (trimmed.match(/[^.!?]+[.!?]+/g) || []).length
    || (words > 0 ? 1 : 0);

  const paragraphs = trimmed
    .split(/\n\s*\n/)
    .filter(p => p.trim().length > 0).length;

  const totalSeconds = Math.round((words / WORDS_PER_MINUTE) * 60);
  const reading_time_minutes = Math.floor(totalSeconds / 60);
  const reading_time_seconds = totalSeconds % 60;

  const frequencies = new Map();
  for (const word of wordsArray) {
    if (STOPWORDS.has(word) || word.length < 3) continue;
    frequencies.set(word, (frequencies.get(word) || 0) + 1);
  }

  const top_words = Array.from(frequencies.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, TOP_WORDS_COUNT)
    .map(([word, count]) => ({ word, count }));

  return {
    characters,
    characters_no_spaces,
    words,
    sentences,
    paragraphs,
    reading_time_minutes,
    reading_time_seconds,
    top_words,
  };
}

app.post('/api/analyze', (req, res) => {
  const { text } = req.body;

  if (typeof text !== 'string') {
    return res.status(400).json({ error: 'El campo "text" debe ser una cadena.' });
  }

  res.json(analyzeText(text));
});

app.get('/api/config', (req, res) => {
  res.json({
    app_version: APP_VERSION,
    words_per_minute: WORDS_PER_MINUTE,
    top_words_count: TOP_WORDS_COUNT,
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Text Analyzer v${APP_VERSION} escuchando en puerto ${PORT}`);
});
