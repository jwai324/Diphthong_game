import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import patternMetaData from '../data/patternMeta.json';

const EXPECTED_FILES = ['ai', 'aw', 'ea_short', 'ee', 'igh', 'oe', 'ou', 'oy', 'ue']
  .map((n) => `${n}.mp3`);

describe('pattern audio routing', () => {
  const variants = Object.values(patternMetaData.patterns).flatMap((p) => p.variants);

  it('routes every variant to one of the 9 consolidated phoneme files', () => {
    const allowed = new Set(EXPECTED_FILES);
    for (const v of variants) {
      const file = v.audio.split('/').pop();
      expect(allowed, `variant ${v.id} routes to ${v.audio}`).toContain(file);
    }
  });

  it('every referenced audio file exists on disk', () => {
    const repoRoot = resolve(process.cwd());
    for (const v of variants) {
      const fsPath = resolve(repoRoot, 'public', v.audio.replace(/^\//, ''));
      expect(existsSync(fsPath), `missing audio file: ${fsPath}`).toBe(true);
    }
  });

  it('uses exactly 9 distinct audio files across all 19 variants', () => {
    const distinct = new Set(variants.map((v) => v.audio));
    expect(distinct.size).toBe(9);
    expect(variants.length).toBe(19);
  });
});
