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

## Install hint + waveform visual — 2026-09-13
- Added `src/components/InstallHint.tsx`: a gentle, dismissible web-only nudge rendered above the footer. Android/Chrome branch captures `beforeinstallprompt` and triggers the native install prompt; iPhone/iPad branch shows manual Safari share-sheet steps. Hidden when already installed (standalone) and after dismissal, persisted via `@/src/utils/storage` (`emzilla-install-hint-dismissed`).
- Replaced the thin progress bar in `RecordingCard` with a 26-bar animated waveform: bars pulse with staggered slow loops only while that card is playing, settle back on pause, and fill caramel vs. muted based on real playback progress.
- Verified at 390x844: waveform bars render on every card and transforms advance while playing; install hint appears under an iPhone Safari UA with manual steps, dismisses, and stays dismissed after reload.

## Haptic touches — 2026-09-13
- Installed `expo-haptics` and added a web-guarded `buzz` helper in `app/index.tsx`.
- Gentle light impact on every play/pause tap, selection tick when a sleep-timer option is chosen, and a success notification buzz when the triple-tap coffee cup reveals the birthday message.
- Regression-checked on web (haptics no-op there): play toggle, Surprise Me, and birthday reveal all work unchanged.

## Emily's photo in the hero — 2026-09-13
- Replaced the coffee-cup icon inside the hero circle (beside "hi princess 🤎") with the creator's uploaded photo of Emily (`frontend/assets/images/emily.jpg`).
- Cropped the original 1280x960 photo to a warm square (face, smile, and coffee cup kept in frame) at 512x512 via PIL, rendered with `expo-image` (`contentFit="cover"`) inside the existing circular, bordered, gently pulsing orb.
- Verified at 390x844: photo loads and displays correctly in the circle; all other UI unchanged.

## iPhone PWA / Add to Home Screen — 2026-09-13
- Generated real PWA icons from the coffee-cup artwork into `frontend/public/`: `icon-192.png`, `icon-512.png`, and `apple-touch-icon.png` (180x180, opaque espresso — iOS-safe).
- Rewrote `public/manifest.json` with working icon paths, `display: standalone`, portrait orientation, start_url/scope, and brand theme/background colors.
- Extended `app/+html.tsx` (static export path): viewport-fit=cover, title, theme-color, manifest link, icon links, `apple-mobile-web-app-capable`, `mobile-web-app-capable`, `black-translucent` status bar, `apple-mobile-web-app-title`, apple-touch-icon, espresso body background, and inline service-worker registration.
- Added an idempotent runtime injection in `app/index.tsx` because the dev/preview server serves its own HTML shell and ignores `+html.tsx`; it adds any missing manifest/apple meta/link tags, upgrades viewport to viewport-fit=cover, and registers the service worker. Deployed export and dev preview are both covered.
- Bumped service-worker cache to `emzilla-shell-v2`; audio streams stay uncached.
- Verified: all PWA assets serve HTTP 200, live DOM contains every required tag, service worker registers, and playback/waveform/UI are unchanged.

## Prioritized backlog

### P1 — valuable enhancements
- Add optional lock-screen metadata/background audio configuration for native sleep sessions.

### P2 — polish ideas
- Drive the waveform bars from real audio amplitude samples instead of staggered loops.
- Add a private export/import action for the editable note and content configuration.

## Next tasks list
1. Test each recording on Emzilla's actual iPhone/Android (or Expo Go) with volume and silent-mode behavior checked.
2. Deploy via the Publish button and generate iOS/Android builds so the custom coffee icon appears on her real home screen.
3. Optionally replace placeholder durations — real durations load automatically from each file once playback starts.

## Known intentional limitation
- None blocking. All five real recordings are wired; the headless test browser's lack of AAC codec support is an environment-only limitation, not an app bug.