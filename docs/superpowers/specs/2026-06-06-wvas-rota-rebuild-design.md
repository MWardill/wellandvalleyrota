# Design: Welland Valley Art Society Rota — modern rebuild

**Date:** 2026-06-06
**Status:** Approved (brainstorming complete; ready for implementation plan)

## Background

The Welland Valley Art Society runs stewarding rotas for exhibitions across
Cambridgeshire. The current tool is a single static `example.html` (preserved in
`temp/example.html`) that Claude (Sonnet) produced. It works, but has serious
problems:

- **Secrets in the client.** The Google service-account *private key*, sheet id,
  and the settings password are all embedded in the page source. Anyone who
  views source can read/write/delete the entire sheet — or use that key against
  any Google API the service account can reach. This is the single most important
  thing to fix.
- **Hard-coded to one event.** The exhibition dates, "special days", and shift
  structure are baked into the HTML for a specific Sept–Oct 2026 event. There is
  no way to create a new exhibition without editing code.
- **No real auth.** The "Settings" area is gated by a plaintext password constant.

The intent of the rebuild is to produce a **modern, maintainable Next.js app**
that a non-web-developer (the maintainer's father, an engineer comfortable with
AI tools) can continue to evolve by asking Claude for changes — *with guardrails
that keep those changes safe and on-pattern*. We deliberately stay "skin deep":
simple, conventional, well-signposted code.

## Goals

1. Recreate the existing experience (look + the three views) on a modern stack.
2. Replace the password gate with proper **Google SSO**, restricted to an
   allowlist.
3. Make **exhibitions data-driven**: create / edit / delete exhibitions from a
   gated Settings area, no code edits required.
4. Keep all secrets server-side.
5. Establish **guardrails** (house rules, slash commands, Vercel skills, branch
   strategy) so future AI-assisted edits stay safe.

## Non-goals (for now)

- The booking workflow itself — "Book a Shift", "Full Overview", "Who's Booked"
  (collectively "section (d)"). These are **fully specified here and will be in
  the implementation plan, but are intentionally left unbuilt** so the maintainer
  can finish them with Claude using these rails. Today's build stops after
  Settings/Exhibitions CRUD.
- "Special days" (closed days / per-slot notes) from the original app. YAGNI for
  now — the create form has four fields only. Noted as a future enhancement.
- Per-action authorisation on bookings (booking/cancelling needs no login, by
  design, for this phase).

## Decisions (from brainstorming)

| Decision | Choice | Rationale |
|---|---|---|
| Storage | **Google Sheets, key server-side** | Data literally *is* a spreadsheet the maintainer can open/edit/export to Excel — matches the "pull it into Excel" ideal. Reuses existing sheet + service account. Moving the key server-side closes the security hole. |
| Deploy pipeline | **`/finish` promotes; `main` frozen** | Fewest moving parts; release branches get automatic Vercel *preview* URLs; production promotion is one explicit command; rollback is Vercel 1-click instant rollback. |
| Theme | **Recreate the gallery theme** | Custom daisyUI theme (deep green / cream / gold + Playfair Display serif) so it "loads up similar" to the current site. |
| Auth | **Auth.js (NextAuth v5) + Google**, env allowlist | Standard, free, well-documented. Repo owner manages the OAuth client. |

## Architecture & stack

- **Next.js (latest, App Router, TypeScript)** on **Vercel free tier**.
- **Tailwind CSS + daisyUI**, with a custom daisyUI theme for the gallery look
  and Playfair Display for headings.
- **Auth.js (NextAuth v5)** with the Google provider; access gated by an env
  allowlist.
- **Google Sheets** as the datastore, accessed **only** from server code using
  `google-auth-library` (JWT auth with the service-account key). The key lives in
  an env var and is never sent to the browser.
- **Mutations via Server Actions** (less boilerplate, easier to read); **reads
  via server components** calling a small data-access layer.

### The security fix (headline change)

All three secrets currently shipped to the browser — service-account private key,
sheet id, settings password — move to **server-only environment variables**. No
secret ever appears in client JavaScript.

## Data model (Google Sheet tabs)

### `Exhibitions` (built now)

| Column | Notes |
|---|---|
| `id` | Generated unique id (e.g. timestamp-based) |
| `societyName` | Required; defaults to "Welland Valley Art Society" |
| `title` | Optional |
| `startDate` | Required (ISO `YYYY-MM-DD`) |
| `endDate` | Required (ISO `YYYY-MM-DD`); must be ≥ `startDate` |
| `createdAt` | ISO timestamp |

### `Bookings` (defined now, used by deferred section (d))

| Column | Notes |
|---|---|
| `id` | Generated unique id |
| `exhibitionId` | FK to `Exhibitions.id` |
| `date` | ISO `YYYY-MM-DD` |
| `shiftId` | One of the shift constants |
| `name` | Volunteer name |
| `phone` | Volunteer phone |
| `createdAt` | ISO timestamp |

### Shifts (code-level constant)

Mirrors the current app: 3 shifts/day, **2 stewards per slot**.

- `s1` — 10:00am – 1:30pm
- `s2` — 1:30pm – 5:00pm
- `s3` — 5:00pm – Closing

`MAX_PER_SLOT = 2`. Kept as a constant in `lib/shifts.ts`; revisited if the
society needs per-exhibition shift configuration later.

## Pages & components

### `/` — home (built now)
- Header (society name + "Volunteer Rota", gallery styling).
- Nav tabs: **Book a Shift · Full Overview · Who's Booked · Settings**.
- **Sign in / account control top-right** (Google SSO).
- Book / Overview / Who's Booked render a tasteful **"Coming soon"** placeholder
  for this phase (they are the deferred section (d)).

### `/settings` — gated (built now)
- If not signed in or not on the allowlist → shows the sign-in prompt.
- If allowed → **Exhibitions CRUD**:
  - **Create**: Society Name (default "Welland Valley Art Society", required),
    Title (optional), Start Date (required), End Date (required, must be ≥ start).
  - **Edit** an existing exhibition.
  - **Delete** an existing exhibition (with confirmation).
- Backed by the `Exhibitions` tab via Server Actions.

### `lib/` (data + config)
- `auth.ts` — Auth.js config + allowlist check.
- `sheets.ts` — **server-only** Google Sheets client (JWT auth from env).
- `exhibitions.ts` — read/create/update/delete exhibitions.
- `shifts.ts` — shift constants.

## Auth flow

1. User clicks **Sign in** → Google OAuth via Auth.js.
2. Auth.js `signIn` callback checks `email ∈ ALLOWED_EMAILS`; reject otherwise.
3. Session drives the top-right control and gates `/settings`.
4. Booking actions (section (d)) require **no** auth, by design, for this phase.

Allowlist contains `mat3740@gmail.com` and `twardill@gmail.com` via
`ALLOWED_EMAILS` (comma-separated).

## Deferred — section (d) booking (specified, not built this phase)

- **Book a Shift**: auto-load the *next* (soonest upcoming) exhibition, with a
  selector to switch between exhibitions; day pills across `startDate…endDate`;
  selecting a day shows each shift, who is currently assigned, and sign-up /
  cancel controls. Each shift needs 2 stewards.
- **Full Overview**: tabular rota for the selected exhibition.
- **Who's Booked**: volunteers alphabetical by surname, each with their booked
  dates/shifts.
- All read/write the `Bookings` tab via server code. For bookings, writes
  re-read the slot before inserting to mitigate the rare concurrent-write race
  (acceptable for a small society).

## Guardrails & developer experience

### House rules — `CLAUDE.md`
- **Never commit or push to `main`/`master`.** Always create a
  `release/v1.x.x` branch before any work. *(Exception, documented: the initial
  scaffold/spec for this project was committed directly to `main` at the
  maintainer's request; the rule applies to all work thereafter.)*
- Secrets live only in env vars / server code — never in client components or
  committed files.
- Follow the bundled Vercel skills for composition, React, and design.

### Vercel skills
Copied into `.claude/skills/` from `C:\git\b2c\RAMPWeb\.claude\skills`:
`vercel-composition-patterns`, `vercel-react-best-practices`,
`vercel-react-native-skills`, `vercel-react-view-transitions`,
`web-design-guidelines`. These steer future Claude edits.

### Slash commands — `.claude/commands/`
- **`/run`**: if not currently on a `release/v1.x.x` branch, **cut the next one
  first** (guardrail enforcement), then install deps if needed and start
  `npm run dev` locally.
- **`/finish`**: ensure we're on a `release/v1.x.x` branch, commit, push to
  GitHub, then **promote that branch to Vercel production** via the Vercel CLI
  (`vercel deploy --prod` with a token). Documents the required
  `VERCEL_TOKEN` + project link.

Both slash commands are guardrail entry points: there is no normal path that
leaves the maintainer working on `main`.

### Deploy pipeline (Approach 1)
- Vercel **Production Branch = `main`**; since nothing is ever pushed to `main`,
  production never auto-deploys.
- Every pushed `release/v1.x.x` branch gets an automatic Vercel **Preview** URL.
- **Production** is reached only via `/finish`.
- **Rollback** = Vercel dashboard "Instant Rollback", or re-run `/finish` from
  the previous branch.

### Protecting `main` on GitHub (maintainer task, documented)
Add a **branch ruleset** targeting `main`: Restrict deletions, Block force
pushes, Require a pull request before merging; Enforcement = Active; empty bypass
list. This blocks direct pushes without breaking `/finish` (which deploys via the
Vercel CLI, not a git push to `main`).

## Environment variables (all server-side)

| Var | Purpose |
|---|---|
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Sheets service account |
| `GOOGLE_PRIVATE_KEY` | Service-account private key (base64-encoded to avoid newline issues) |
| `GOOGLE_SHEET_ID` | Target spreadsheet id |
| `ALLOWED_EMAILS` | Comma-separated sign-in allowlist |
| `AUTH_GOOGLE_ID` | Google OAuth client id |
| `AUTH_GOOGLE_SECRET` | Google OAuth client secret |
| `AUTH_SECRET` | Auth.js session secret |
| `AUTH_URL` | App URL for Auth.js callbacks |

For local `/finish` only (not app runtime): `VERCEL_TOKEN`, plus project link via
`vercel link` (`VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`).

## Vercel setup (one-time, maintainer)

1. Push repo to GitHub.
2. Vercel → Add New → Project → import the repo (Next.js auto-detected).
3. Settings → Environment Variables → add the eight app env vars (Production,
   Preview, Development).
4. Settings → Git → leave Production Branch = `main` (never pushed ⇒ no auto
   production deploys; release branches ⇒ preview URLs).
5. Create a Vercel token (Account → Tokens) for `/finish`; run `vercel link`
   once to capture the project ids.

## This phase's deliverable

A deployable app with:
- Gallery-themed home + nav.
- Working Google sign-in (allowlisted).
- Fully working **Settings → Exhibitions CRUD** on Google Sheets.
- Guardrails (`CLAUDE.md`), Vercel skills, `/run` + `/finish` slash commands,
  and the deploy pipeline.

Section (d) (booking) is planned but deliberately left for the maintainer to
finish using these rails.
