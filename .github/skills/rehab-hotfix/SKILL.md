---
name: rehab-hotfix
description: "Use when: debugging a regression in the rehab PWA, fixing exercise filters, validating React/Vite/Tailwind changes, or preparing a small hotfix for this project."
argument-hint: "Describe the issue, regression, or change you want to investigate"
user-invocable: true
---

# Rehab Hotfix Workflow

## When to Use
- Fix UI or logic regressions in the rehab app
- Adjust exercise library filters or routine behavior
- Investigate PWA, offline, or install-flow issues
- Prepare a small release-worthy hotfix

## Goal
Handle issues quickly and safely while preserving the app's local-first behavior, offline support, and existing user data compatibility.

## Procedure
1. Confirm the scope of the issue and identify the affected files before editing.
2. Inspect the relevant source, reproduce the problem if possible, and trace the existing data flow.
3. Follow the project conventions in [AGENTS.md](../../../AGENTS.md) and the specialized guidance in [.github/agents/rehab-app-hotfix.agent.md](../../agents/rehab-app-hotfix.agent.md).
4. Apply the smallest root-cause fix that matches the current architecture.
5. Verify the result with the project build command and report any remaining concerns clearly.

## Guardrails
- Keep changes small and targeted in src/ and public/.
- Preserve local-first storage behavior and avoid introducing backend services.
- Do not break PWA installation, service worker, offline page, or manifest behavior.
- If data shape changes are required, preserve compatibility and update migration logic in src/utils/storage.ts when appropriate.
- Keep user-facing copy in Spanish unless there is a strong reason to change it.

## Completion Checklist
- The issue or regression is understood.
- A minimal fix has been applied.
- The build still succeeds with npm run build.
- The summary includes the root cause, files changed, verification result, and any follow-up risk.
