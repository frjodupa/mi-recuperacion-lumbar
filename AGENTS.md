# AGENTS.md

This repository contains a React, TypeScript, and Vite PWA for lumbar rehabilitation. The app is local-first, offline-capable, and stores user data in browser storage rather than a backend.

## Working conventions
- Prefer small, targeted changes in [src](src) and [public](public) rather than broad rewrites.
- Preserve the existing local-first behavior. Do not introduce backend services or external persistence unless clearly necessary.
- Keep the public URL and existing user data safe. If the data shape changes, update the migration logic in [src/utils/storage.ts](src/utils/storage.ts) so older saved state remains compatible.
- Follow the current Tailwind-based UI patterns and reuse shared components from [src/components](src/components) when possible.
- Keep user-facing copy in Spanish unless there is a strong reason to change it.

## Key entry points
- [src/App.tsx](src/App.tsx) for the app shell and page routing.
- [src/pages/ExercisesPage.tsx](src/pages/ExercisesPage.tsx) for exercise-library filters and routine actions.
- [src/utils/storage.ts](src/utils/storage.ts) for persistence, migrations, backups, and import/export behavior.
- [README.md](README.md) for the product overview, release checklist, and deployment notes.
- [.github/agents/rehab-app-hotfix.agent.md](.github/agents/rehab-app-hotfix.agent.md) for the recommended hotfix workflow.

## Commands
- npm install
- npm run dev
- npm run build

## Notes for agents
- Treat this as a health/recovery app, so avoid making claims about medical treatment or safety.
- If PWA assets change, keep the service worker and manifest behavior consistent with the existing assets under [public](public).
- For release-worthy changes, follow the checklist in [README.md](README.md) and avoid breaking installed PWA behavior.
