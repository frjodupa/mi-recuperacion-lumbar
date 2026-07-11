# Changelog

## 1.0.6 - 2026-07-11

### Fixed
- Stabilized the home dashboard layout across intermediate widths so KPI cards no longer overlap, compress values or compete with the progress ring.
- Improved KPI card typography, minimum heights and responsive grid behavior for desktop, tablet and mobile.

### Changed
- App version bumped to `1.0.6`.
- Service worker cache version bumped to refresh the installed PWA safely.

## 1.0.5 - 2026-07-11

### Changed
- Completed a dedicated UX/UI design sprint focused only on visual language and reusable components.
- Refined global design tokens, premium cards, buttons, forms, sliders, header, navigation, dashboard hero and progress dashboard visuals.
- App version bumped to `1.0.5`.
- Service worker cache version bumped to refresh the installed PWA safely.

## 1.0.4 - 2026-07-11

### Added
- Added Recharts-based weekly and monthly dashboard charts.
- Added more visual home dashboard cards for surgery days, total rehabilitation time, streak and daily goal.

### Changed
- Refined the interface with a subtle glassmorphism style, softer cards, animated progress ring, improved sliders, mobile safe-area spacing and premium bottom navigation.
- App version bumped to `1.0.4`.
- Service worker cache version bumped to refresh the installed PWA safely.

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
