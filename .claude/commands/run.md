---
description: Ensure a release branch, then run the app locally
---

Run the app locally for development. Follow these steps exactly:

1. Check the current git branch: `git rev-parse --abbrev-ref HEAD`.
2. **Enforce the branch guardrail.** If the current branch is NOT named like `release/v1.x.x`:
   - Find the highest existing `release/v1.*` branch: `git branch --list "release/v1.*"`.
   - If none exist, create `release/v1.0.0`.
   - Otherwise, create the next patch version (e.g. if `release/v1.0.3` is the highest, create `release/v1.0.4`).
   - Create and switch with: `git checkout -b release/v1.x.x` (substitute the computed version).
   - Tell the user which branch you created and that work must never happen on `main`.
3. If `node_modules` is missing, run `npm install`.
4. Start the dev server: `npm run dev`.
5. Tell the user the app is running at http://localhost:3000 and how to stop it (Ctrl+C).
