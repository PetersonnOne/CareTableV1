# R0 technical rehearsal — 23 October 2026

## What actually ran

Separate Playwright/Chromium recording of the local app, 1280×720, Midnight theme, reduced motion. Fictional sample loaded through the UI. Default Interactive guidance was shown without starting voice; the walkthrough switched to User Mode, reviewed preferences, created a Local preview, opened checks, drafted feedback and showed updated statistics. Sample reset completed. Browser capture reported zero page errors.

The original WebM is 99.840 seconds. The first full H.264 silent workprint is 99.916667 seconds at 24fps after frame/container rounding and passed full FFmpeg decoding. The shorter review cut is exactly **58.000 seconds** and also passed full decoding; its verification JSON records the 40-second source start and SHA256. There is no narration or audio stream. This is not a live Qloo run, a saved live revision, an approved film or a production test.

Work folder: `work/rehearsals/2026-10-23T16-43-09-658Z/`. It contains source video, capture events, workprint, verification, a contact sheet and review frames. All media stays Git-ignored. The event map records wall time only; it is not an authoritative source-shot timing map.

## What we learned

1. **Loading belongs outside the polished cut.** The raw contact sheet shows blank startup frames, then an established homepage. A frame extracted at actual media time 40 seconds was visually inspected before choosing a 40–98-second review cut. Source media remains unchanged. Rebuild with `python demo-pipeline/scripts/export_workprint.py --start 40 --duration 58`.
2. **A readable screen is not automatically a good shot.** Full-width check details and the chat sidebar become dense. The next story rehearsal should use deliberate close framing with enough surrounding UI to preserve context.
3. **The default voice mode needs a short explanation.** A reliable walkthrough can show the mode bubbles, then explicitly switch to User Mode. Do not dwell on a disconnected microphone session or imply successful voice.
4. **The feedback sequence is the dramatic opportunity.** R0 stops at the preview draft. R1 should record a real development revision and hold the old/new result long enough to compare, including any honest shortage outcome.
5. **The hero is a welcome, not the story.** Its images establish care; the actual differentiator is a grounded, checked, revisable plan. Keep the opening short in the story edit.
6. **Silence helps isolate capture problems.** No paid narration was generated. Once the story and shots work, audition a CareTable voice and build timing around its natural speech.

## Next review questions

Where did you first understand what CareTable does? Which control or check felt crowded? Does the fictional profile feel coherent? How long should the before/after revision remain visible? Answer those from the workprint before making a final film.

This first review is sampled visual/technical analysis, not owner approval or an end-to-end listening result. Final owner review remains separate.
