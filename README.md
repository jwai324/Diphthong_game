# Diphthong Dash

Kids phonics PWA — three modes:

- **DASH** — timed multiple-choice over selected vowel-team patterns and heart-word grades.
- **LEARNING** — untimed flash flow per pattern (full word TTS + isolated pattern audio + GOT IT / AGAIN).
- **HEART WORDS** — flash-card multiple-choice over generated misspelling distractors.

Shape and feel mirror Math Dash (Vite + React 18 + Tailwind + `vite-plugin-pwa`, no router, no state library).

## Develop

```bash
npm install
npm run dev          # local dev server
npm run build        # production build
npm run preview      # serve the build
npm test             # vitest
```

## Heart-word distractor pool

Distractors are **generated at build time** and committed to `src/data/heartWords.json`:

```bash
npm run generate:heart-distractors
```

The generator is deterministic; review the JSON diff before committing regenerations.

## Pattern audio

Isolated pattern MP3s live in `public/audio/patterns/`. Format/regen instructions are in
`scripts/REGEN_AUDIO.md`. Playback only happens in Learning Mode.
