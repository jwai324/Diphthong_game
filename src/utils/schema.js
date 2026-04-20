import patternMetaData from '../data/patternMeta.json';
import vowelTeamData from '../data/vowelTeamWords.json';
import heartWordData from '../data/heartWords.json';

export function validateContentBanks() {
  const errors = [];
  const warnings = [];

  if (patternMetaData.schema_version !== '1.2') {
    errors.push(`patternMeta: schema_version must be "1.2", got ${patternMetaData.schema_version}`);
  }
  if (vowelTeamData.schema_version !== '1.2') {
    errors.push(`vowelTeamWords: schema_version must be "1.2", got ${vowelTeamData.schema_version}`);
  }
  if (heartWordData.schema_version !== '1.2') {
    errors.push(`heartWords: schema_version must be "1.2", got ${heartWordData.schema_version}`);
  }

  const patterns = patternMetaData.patterns ?? {};
  for (const [id, p] of Object.entries(patterns)) {
    if (!Array.isArray(p.variants) || p.variants.length === 0) {
      errors.push(`patternMeta.${id}: variants[] required`);
      continue;
    }
    if (!p.default_variant) errors.push(`patternMeta.${id}: default_variant required`);
    const variantIds = new Set(p.variants.map((v) => v.id));
    if (p.default_variant && !variantIds.has(p.default_variant)) {
      errors.push(`patternMeta.${id}: default_variant "${p.default_variant}" not in variants[]`);
    }
    for (const v of p.variants) {
      if (!v.id || !v.audio || !v.sound_label) {
        errors.push(`patternMeta.${id}.variants: each variant needs id, audio, sound_label`);
      }
    }
  }

  const words = vowelTeamData.words ?? [];
  for (const w of words) {
    if (!Array.isArray(w.patterns) || w.patterns.length === 0) {
      errors.push(`vowelTeamWords: word "${w.word}" missing patterns[]`);
      continue;
    }
    for (const p of w.patterns) {
      if (!patterns[p]) {
        errors.push(`vowelTeamWords: word "${w.word}" references unknown pattern "${p}"`);
      }
    }
    if (w.patterns.length === 1) {
      const p = w.patterns[0];
      const entry = patterns[p];
      if (entry && (entry.variants?.length ?? 0) > 1 && !w.sound_variant) {
        warnings.push(`vowelTeamWords: "${w.word}" pattern "${p}" is multi-variant but has no sound_variant (defaulting to ${entry.default_variant})`);
      }
      if (entry && w.sound_variant) {
        const vIds = entry.variants.map((v) => v.id);
        if (!vIds.includes(w.sound_variant)) {
          errors.push(`vowelTeamWords: "${w.word}" sound_variant "${w.sound_variant}" not in pattern "${p}" variants`);
        }
      }
    }
  }

  const hearts = heartWordData.words ?? [];
  for (const h of hearts) {
    if (!h.word || !h.grade || !Array.isArray(h.heart_indices)) {
      errors.push(`heartWords: entry "${h.word}" missing required fields`);
    }
  }

  return { errors, warnings };
}

export function assertContentBanksOrThrow() {
  const { errors, warnings } = validateContentBanks();
  if (warnings.length && typeof console !== 'undefined') {
    for (const w of warnings) console.warn('[content-bank]', w);
  }
  if (errors.length) {
    const msg = `Content bank schema violations:\n  - ${errors.join('\n  - ')}`;
    throw new Error(msg);
  }
}
