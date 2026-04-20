# Regenerating isolated pattern audio

These 16 MP3s ship as static assets and never change at runtime.
Regenerate them only if voice/style changes are approved.

## Files
`oi.mp3, oy.mp3, ou.mp3, ow.mp3, au.mp3, aw.mp3, ai.mp3, ay.mp3,
 ea.mp3, ee.mp3, oa.mp3, oe.mp3, ie.mp3, igh.mp3, ui.mp3, ue.mp3`

Output path: `public/audio/patterns/{pattern}.mp3`.

## Spec
- MP3, mono, 44.1 kHz, VBR ≈ 64 kbps, target ≤ 20 KB each.
- Trim to <50 ms head/tail silence.
- Normalize peak to -1 dBFS, target loudness ≈ -16 LUFS.
- Total bundle < 400 KB.

## Voice
- Provider: ElevenLabs or Azure Neural TTS.
- Voice: warm en-US child-friendly (e.g., ElevenLabs "Rachel" or Azure "en-US-JennyNeural").
- Rate ≈ 0.8× normal.
- Spoken in isolation — say the sound, NOT a carrier word.
  - For `oi`/`oy` say `/oi/` (as in "boy") in isolation, not "boy".
  - For `ai`/`ay` say `/ay/` (as in "rain") in isolation.
  - etc.

## Procedure
1. Generate the 16 audio files locally.
2. Convert to MP3 with the spec above (`ffmpeg -i in.wav -ac 1 -ar 44100 -b:a 64k out.mp3`).
3. Trim silence (`sox in.mp3 out.mp3 silence 1 0.05 0.5% reverse silence 1 0.05 0.5% reverse`).
4. Normalize loudness (`ffmpeg -i in.mp3 -af "loudnorm=I=-16:TP=-1" out.mp3`).
5. Move into `public/audio/patterns/`.
6. Have founder review every file before committing.
7. Commit binaries; do NOT add this regeneration to CI.
