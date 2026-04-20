#!/usr/bin/env node
// Build-time generator for heart-word distractors.
// Reads src/data/heartWords.json, regenerates `common_misspellings`
// for each entry, writes the file back, and prints any words whose pool
// dropped below 2 valid distractors so reviewers can act on them.

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { generateDistractors } from '../src/utils/heartWordGenerator.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.resolve(here, '..', 'src', 'data', 'heartWords.json');

const words = JSON.parse(await readFile(dataPath, 'utf8'));
const warnings = [];
const out = words.map((w) => {
  const next = generateDistractors(w);
  if (next.length < 2) warnings.push({ word: w.word, count: next.length });
  return { ...w, common_misspellings: next };
});

await writeFile(dataPath, JSON.stringify(out, null, 2) + '\n', 'utf8');
console.log(`Regenerated distractors for ${out.length} heart words.`);
if (warnings.length) {
  console.warn(`WARN: ${warnings.length} word(s) produced fewer than 2 distractors:`);
  for (const w of warnings) console.warn(`  - ${w.word} (${w.count})`);
  process.exitCode = 1;
}
