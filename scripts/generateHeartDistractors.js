#!/usr/bin/env node
// Build-time generator for heart-word distractors.
// Reads src/data/heartWords.json. For each entry it MERGES generator output
// into existing curator-supplied common_misspellings, deduping and capping at 4.
// Words with fewer than 2 distractors after merge are reported so reviewers can
// hand-pick additions. Pass --overwrite to discard curator entries entirely.

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { generateDistractors } from '../src/utils/heartWordGenerator.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.resolve(here, '..', 'src', 'data', 'heartWords.json');
const overwrite = process.argv.includes('--overwrite');
const MAX_DISTRACTORS = 4;

const data = JSON.parse(await readFile(dataPath, 'utf8'));
const words = Array.isArray(data) ? data : data.words ?? [];
const warnings = [];
const nextWords = words.map((w) => {
  const generated = generateDistractors(w);
  const base = overwrite ? [] : (w.common_misspellings ?? []);
  const merged = [];
  const seen = new Set();
  for (const d of [...base, ...generated]) {
    if (!d || seen.has(d) || d === w.word) continue;
    seen.add(d);
    merged.push(d);
    if (merged.length >= MAX_DISTRACTORS) break;
  }
  if (merged.length < 2) warnings.push({ word: w.word, count: merged.length });
  return { ...w, common_misspellings: merged };
});

const updated = Array.isArray(data) ? nextWords : { ...data, words: nextWords };
await writeFile(dataPath, JSON.stringify(updated, null, 2) + '\n', 'utf8');
console.log(`Regenerated distractors for ${nextWords.length} heart words.`);
if (warnings.length) {
  console.warn(`WARN: ${warnings.length} word(s) have fewer than 2 distractors:`);
  for (const w of warnings) console.warn(`  - ${w.word} (${w.count})`);
  process.exitCode = 1;
}
