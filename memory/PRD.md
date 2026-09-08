# Emzilla 🤎 — Product Requirements Document

## Problem statement
Build a private, romantic sleep companion for Emzilla: a warm coffee-brown mobile experience where she can press play and feel close to the creator’s voice when she cannot sleep. This is a personal digital love letter, not a generic meditation product.

## Architecture
- Expo Router mobile app with one focused, scrollable experience in `frontend/app/index.tsx`.
- React Native UI, `expo-audio` playback support, `expo-linear-gradient`, `expo-vector-icons`, AsyncStorage for the editable note, and Reanimated-compatible native animations.
- Content is intentionally centralized in `frontend/src/content.ts` for easy recording and message edits.
- No backend or database is required for the private local experience.
- Web installability metadata is provided through `frontend/public/manifest.json`, `frontend/public/service-worker.js`, and runtime manifest registration.

## User personas
- **Emzilla:** the recipient, using the app at night on iPhone or Android for comfort and sleep.
- **Gift creator:** adds personal voice recordings and edits the love note and birthday message in one configuration file.

## Core requirements (static)
- Personal welcome: “Hey, Emzilla 🤎”, “Can’t sleep?”, “Don’t worry. I’m right here.”
- Six editable voice recording cards with play/pause, progress, timing, active playback styling, and one-track-at-a-time behavior.
- Surprise Me random selection and playback.
- Immersive Sleep Mode with darkened visual treatment, breathing moon animation, active track, controls, and 15/30/60/end timer choices.
- Editable and persistable personal note.
- Hidden birthday reveal after three coffee-cup taps.
- Mobile-first touch targets, responsive layout, warm coffee/cream design, and no login, ads, social, or public data.
- PWA metadata and service worker for supported mobile browsers.

## Implemented — 2026-09-05
- Replaced starter screen with the complete Emzilla experience and coffee-brown visual system.
- Added centralized editable recordings, note, and birthday content in `src/content.ts`.
- Added playback cards, exclusive active-track behavior, placeholder progress playback, Surprise Me, Sleep Mode, timer UI, note persistence, and three-tap birthday reveal.
- Added Expo audio integration so replacing a recording’s `file: null` with a local `require("../assets/audio/your-file.mp3")` plays the real file on supported platforms.
- Added PWA manifest/service worker registration and updated app metadata.
- Verified with TypeScript, ESLint, and Expo browser testing at 390x844. Core frontend test pass rate: 100%.

## Text/UI update — 2026-09-08
- Replaced the personal note with the requested lowercase “angel” message while preserving the existing editable note treatment and readable line breaks supplied in the request.
- Replaced the triple-tap birthday copy, promoted “happy bdayy my goat” as the large heading, and made the reveal content a full-height scroll container for smaller screens.
- Lowercased all visible app copy, including buttons, labels, recording metadata, Sleep Mode, fallback messaging, app metadata, and install metadata; accessibility labels and technical paths remain unchanged by request.
- Regression-checked note editing, triple-tap reveal, birthday scrolling, playback, Sleep Mode, and mobile overflow with no functional regressions.

## Prioritized backlog

### P0 — next task
- Add the creator’s real voice files under `frontend/assets/audio/` and replace the six `file: null` entries in `src/content.ts`.

### P1 — valuable enhancements
- Add real app icon artwork based on the coffee cup mark instead of the starter icon.
- Add optional lock-screen metadata/background audio configuration for native sleep sessions.
- Add a small “install this app” hint only when the browser exposes an install prompt.

### P2 — polish ideas
- Add a subtle waveform visualization driven by real audio samples.
- Add a private export/import action for the editable note and content configuration.
- Add gentle haptic confirmation for play, timer, and birthday reveal on native devices.

## Next tasks list
1. Copy voice recordings into `frontend/assets/audio/`.
2. Update only the `file` fields in `frontend/src/content.ts`.
3. Test each recording on the target iPhone and Android device with the phone volume and silent-mode behavior checked.

## Known intentional limitation
The initial audio entries are **PLACEHOLDER playback states** because real recordings were not supplied. The UI, progress behavior, and native audio integration are ready; real voice audio becomes active by following the visible replacement instructions and updating `src/content.ts`.