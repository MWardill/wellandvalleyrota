---
description: Commit, push, and promote the current release branch to Vercel production
---

Finish the current piece of work: commit it, push to GitHub, and deploy to Vercel production. Follow these steps exactly:

1. Check the current branch: `git rev-parse --abbrev-ref HEAD`.
2. **Guardrail:** if the branch is `main` or `master`, STOP and tell the user. Work must be on a `release/v1.x.x` branch. Offer to move the changes onto a new release branch (create `release/v1.0.0` or the next patch version, then continue).
3. Stage and commit any pending changes with a clear conventional-commit message summarising the work. (If there is nothing to commit, say so and continue.)
4. Push the branch and set upstream: `git push -u origin <current-branch>`. This automatically creates a Vercel Preview deployment.
5. **Promote to production** with the Vercel CLI:
   - Requires `VERCEL_TOKEN` in the environment, and the project linked (run `vercel link` once if `.vercel/project.json` is absent).
   - Run: `npx vercel deploy --prod --yes --token "$VERCEL_TOKEN"`.
   - Print the production URL it returns.
6. Remind the user: to roll back, use Vercel dashboard → Deployments → Instant Rollback, or re-run /finish from the previous release branch.

If `VERCEL_TOKEN` is not set, complete steps 1–4 and tell the user how to set up the token (Vercel → Account Settings → Tokens) and run `vercel link`, then re-run /finish.
