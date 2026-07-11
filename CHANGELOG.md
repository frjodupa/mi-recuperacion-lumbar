# Changelog

## 1.0.3 - 2026-07-11

### Fixed
- Prevented the production Service Worker from interfering with the Vite development server and HMR.

### Changed
- App version bumped to `1.0.3`.
- Service worker cache version bumped to refresh the installed PWA safely.

## 1.0.2 - 2026-07-11

### Fixed
- Fixed React hook ordering crash that could render the deployed PWA as a blank page.

### Changed
- App version bumped to `1.0.2`.
- Service worker cache version bumped to refresh the installed PWA safely.

## 1.0.1 - 2026-07-11

### Added
- Daily assistant on the home screen with patient greeting, date, days since surgery, total rehabilitation time and recommended routine.
- Pre-session daily check-in for pain, stiffness, fatigue, sleep hours, sleep quality and mood.
- Local in-app assistant for usage help, exercise lookup, routines, progress and history explanations without diagnosis.
- Intelligent routine flow with 3-second preparation countdown, automatic work/rest transitions, mid-time cue, remaining time and remaining series.
- Full exercise detail screen with real photos, movement explanation, start/end position, breathing, muscles, benefits, errors, stop criteria, material, level, phase and dosage.
- Medical history section with date, time, duration, pain, fatigue, stiffness, load, incidents, observations and exercises performed.
- Progress dashboard additions: session calendar, completion percentage and favorite exercises by usage.
- Rehabilitation module registry prepared for future knee, cervical, shoulder, hip and ankle modules.

### Changed
- App version bumped to `1.0.1`.
- Service worker cache version bumped to force installed PWA updates without clearing existing LocalStorage.
- Existing local data remains compatible through storage migration defaults.

### Verification
- `npm run build` passes.
- No PNG intermediates remain in `public/exercise-photos`.
- Public URL policy: keep the same deployed URL for future releases; local dev ports may vary.

## Update Policy

- Do not alter the public production URL.
- Preserve existing LocalStorage and migrate old models when data shape changes.
- Increment the application version on every change set.
- Update this changelog on every change set.
- Run `npm run build` and fix errors before publishing.
- Bump the service worker cache name when published assets change.
- Keep the PWA install path and offline behavior compatible.
