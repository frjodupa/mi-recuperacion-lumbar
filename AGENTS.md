# AGENTS.md

This repository contains a React, TypeScript, and Vite PWA for lumbar rehabilitation. The app is local-first, offline-capable, and stores user data in browser storage rather than a backend.

## Working conventions
- Prefer small, targeted changes in [src](src) and [public](public) rather than broad rewrites.
- Preserve the existing local-first behavior. Do not introduce backend services or external persistence unless clearly necessary.
- Keep the public URL and existing user data safe. If the data shape changes, update the migration logic in [src/utils/storage.ts](src/utils/storage.ts) so older saved state remains compatible.
- Follow the current Tailwind-based UI patterns and reuse shared components from [src/components](src/components) when possible.
- Keep user-facing copy in Spanish unless there is a strong reason to change it.

## VS Code local workflow
- Work only on the local project copy opened in Visual Studio Code, not on the published Vercel version.
- Before modifying files, state exactly which files will change and briefly why, then wait for user approval.
- After approval, modify only the approved files and keep the change as small as possible.
- Keep the development server available with `npm run dev` when visual review is needed.
- After each change, provide the local URL shown by Vite, usually `http://127.0.0.1:5174/` or the next available port.
- Run `npm run build` before considering an app change complete. For documentation-only changes, note that the build was run to confirm the project still compiles.
- If a change affects design, state exactly what the user should inspect visually.
- Do not create commits, push, merge, restore, switch branches, or update dependencies unless the user explicitly asks.
- If duplicate code, reusable components, or architecture improvements are found, propose them first and wait for approval before implementing.
- If a change could break existing functionality, warn the user before making it.
- Treat this as a professional React + TypeScript + Vite PWA and preserve accessibility, performance, responsive behavior, offline behavior, and local data compatibility.

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
