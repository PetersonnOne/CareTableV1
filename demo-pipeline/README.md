# CareTable demo workshop

**Status: rehearsal and review, not a final submission.** Production-readiness work is paused at the user's request, 23 October 2026. Preserve its unresolved gates in [PRODUCTION_READINESS.md](../PRODUCTION_READINESS.md). Demo work neither completes those gates nor establishes a completion percentage.

## The beauty of CareTable

A meal is an act of care. A technically eligible recipe can still miss the familiar flavours, daily routines and personal preferences that make someone welcome it. The film should show how CareTable brings those considerations together, then listens when a meal needs to change.

**Working story:** “A little more care at every meal.” Follow one fictional table from preferences to a checked plan, then a focused improvement. Qloo's cultural intelligence is the reason for the film's middle, not an ecosystem logo at the end.

## Start here

1. [Reference review](REFERENCE_REVIEW.md): what the two supplied films teach us, with approximate timecodes and limits of review.
2. [Production brief](PRODUCTION_BRIEF.md): CareTable adaptation, phases, tool choices and evidence boundaries.
3. [Storyboard](STORYBOARD.csv) and [draft narration](NARRATION_DRAFT.txt): editable proposal for a roughly 2:30 story, subject to actual event rules and review.
4. [Review checklist](REVIEW_CHECKLIST.md): structured rehearsal feedback and final gates.
5. [First rehearsal review](REHEARSAL_001_REVIEW.md): actual capture evidence, startup/framing lessons and rebuild command for the shorter review cut.

`scripts/review_references.py` samples the original videos without changing them. Optional `--transcribe` uses a locally cached faster-whisper tiny.en model; it makes no paid speech API calls. Machine transcripts need correction and are not approved narration. The machine initially had an incomplete model cache; its missing public model file was downloaded for this review. Python, Pillow, faster-whisper, FFmpeg and FFprobe are host dependencies.

`scripts/capture-rehearsal.mjs` records a separate Chromium context using fictional data and **Local preview**. It is a technical rehearsal of framing, readability and transitions; it does not prove live Qloo, Luna or spoken voice. No production account is touched. Provider generation is not invoked. App selectors and timings are specific to the current CareTable build. Runtime media and reports stay under Git-ignored `work/`.

```powershell
# Start the app separately on port 4318, then:
node demo-pipeline/scripts/capture-rehearsal.mjs
python demo-pipeline/scripts/export_workprint.py
```

Capture discovers an installed Playwright package and Chromium; optional `PLAYWRIGHT_PACKAGE` (package.json path) and `CHROMIUM_EXECUTABLE` override host paths. `CARETABLE_DEMO_URL` defaults to localhost:4318 and is restricted to localhost for this rehearsal. No package install is performed automatically.

## Iteration sequence

- **R0 — technical rehearsal:** silent browser workprint, preview data, mode explanation, framing and interaction pacing. Label voice as unverified. Review with the owner.
- **R1 — story rehearsal:** refine the hook and script; capture fresh live generation, actual Qloo evidence and targeted revision separately in development only when deliberately authorized. Preserve raw takes and job receipts. A real output may be prerecorded and accurately labelled; a preview must never stand in for it.
- **R2 — voice and captions rehearsal:** choose a CareTable voice after a short audition. Sarah is a reference from Tonight Together, not automatically selected or authorized for this project. Align approved narration using real timestamps, then review captions against the UI.
- **Final:** confirm current event rules, resolve or honestly exclude blocked voice claims, capture exact release evidence, run technical checks, obtain owner watch/listen approval, then separately publish/submit.

The supplied Tonight Together archive and Parallel reference remain read-only. Their video, narration and brand assets are not copied into CareTable's public deliverables. Only methods are adapted. This folder is a CareTable-specific pipeline, not a copy of the original app's capture scripts.
