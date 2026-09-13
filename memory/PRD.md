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
- Updated the home introduction greeting to “hi princess 🤎” without changing its existing styling or behavior.

## Real recordings connected — 2026-09-13
- Replaced all six placeholder entries in `src/content.ts` with the five creator-supplied voice files under `frontend/assets/audio/`, exactly mapped: `1 yr`, `dreams`, `why i love u`, `e m i l y`, `happy bday baby`.
- Updated the stale "make it yours" info-box copy to reflect that real recordings are connected; no other UI, styling, layout, animation, or navigation changes.
- Verified every `.m4a` asset resolves and is served by Metro with correct `audio/mp4` MIME (HTTP 200/206), cards render with exact lowercase titles, exclusive-play and play/pause state toggling confirmed at 390x844.
- Note: M4A/AAC cannot decode in the headless-Chromium test browser (no proprietary codecs), so in-browser preview play stays silent there; M4A plays natively on iPhone, Android, and Expo Go, which are the real targets.

## Custom app icon + silent-mode audio — 2026-09-13
- Generated a full icon set with a script (`/tmp/make_icons.py`, supersampled 4x): caramel coffee cup with heart cutout, cream steam and saucer on deep espresso — matches the theme tokens exactly.
- Replaced `icon.png` (1024), `adaptive-icon.png` (1024, artwork inside Android safe zone), `favicon.png` (512), and `splash-image.png` in `frontend/assets/images/`.
- Updated `app.json`: Android adaptive-icon and splash background colors changed from pure black to brand espresso `#1A1412` so icon, splash, and app blend seamlessly.
- Added `setAudioModeAsync({ playsInSilentMode: true })` on app mount so recordings still play when Emzilla's iPhone is on silent at night (the core use case).
- Verified: lint clean, app re-renders with all 5 cards and greeting intact.

## Prioritized backlog

### P1 — valuable enhancements
- Add optional lock-screen metadata/background audio configuration for native sleep sessions.
- Add a small "install this app" hint only when the browser exposes an install prompt.

### P2 — polish ideas
- Add a subtle waveform visualization driven by real audio samples.
- Add a private export/import action for the editable note and content configuration.
- Add gentle haptic confirmation for play, timer, and birthday reveal on native devices.

## Next tasks list
1. Test each recording on Emzilla's actual iPhone/Android (or Expo Go) with volume and silent-mode behavior checked.
2. Optionally replace placeholder durations — real durations load automatically from each file once playback starts.

## Known intentional limitation
- None blocking. All five real recordings are wired; the headless test browser's lack of AAC codec support is an environment-only limitation, not an app bug.