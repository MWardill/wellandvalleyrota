# WVAS Rota — Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a gallery-themed Next.js app with Google SSO (allowlisted) and a gated Settings → Exhibitions CRUD backed by Google Sheets, plus the guardrails (CLAUDE.md, Vercel skills, `/run` + `/finish` slash commands) — leaving the booking workflow for a later plan.

**Architecture:** Next.js (App Router, TypeScript) on Vercel. Secrets are server-only env vars. Google Sheets is the datastore, reached only from server code via `googleapis` + a service-account JWT. Reads happen in server components; writes happen in Server Actions that re-check auth. Auth.js (NextAuth v5) handles Google sign-in and an email allowlist. Pure logic (validation, row mapping, allowlist) is unit-tested with Vitest; UI is verified by running the app.

**Tech Stack:** Next.js 15 (App Router, no `src/` dir, import alias `@/*`), TypeScript, Tailwind CSS v4, daisyUI v5, Auth.js v5 (`next-auth@beta`), `googleapis`, Vitest.

**Scope note:** This is Phase 1 (spec sections a–c). Section (d) — Book a Shift / Full Overview / Who's Booked — is fully described in the spec (`docs/superpowers/specs/2026-06-06-wvas-rota-rebuild-design.md`) and will get its own plan. Do **not** build (d) here.

**Guardrail note:** Per the maintainer's instruction, Phase 1 commits go to `main`. The "never touch main; always `release/v1.x.x`" rule is encoded in `CLAUDE.md` and the slash commands as the rule for **future** work.

---

## File structure (created/modified in this plan)

```
package.json                      # deps + scripts
tsconfig.json                     # TS config (alias @/*)
next.config.ts                    # Next config
postcss.config.mjs                # Tailwind v4 postcss
eslint.config.mjs                 # ESLint (next)
vitest.config.ts                  # Vitest (node env)
.env.example                      # documented env var template (committed)
.gitignore                        # MODIFY: ensure .vercel ignored
README.md                         # MODIFY: real getting-started

app/layout.tsx                    # root layout: fonts, <html data-theme="gallery">
app/globals.css                   # tailwind + daisyui + "gallery" theme
app/page.tsx                      # home: header + tabs + placeholders
app/settings/page.tsx             # gated server component → CRUD UI
app/api/auth/[...nextauth]/route.ts  # Auth.js handlers

components/site-header.tsx        # header + nav + auth button (server)
components/auth-button.tsx        # sign in/out (server actions form)
components/nav-tabs.tsx           # client tab switcher (Book/Overview/Booked)
components/coming-soon.tsx        # placeholder panel
components/exhibition-form.tsx    # client create/edit form (calls server actions)
components/exhibition-list.tsx    # renders rows + edit/delete (client)

lib/types.ts                      # Exhibition + input types
lib/validation.ts                 # pure validation (TESTED)
lib/validation.test.ts
lib/allowlist.ts                  # isAllowedEmail (TESTED)
lib/allowlist.test.ts
lib/sheet-map.ts                  # row<->Exhibition mapping (TESTED)
lib/sheet-map.test.ts
lib/shifts.ts                     # shift constants (for later (d))
lib/auth.ts                       # Auth.js config
lib/sheets.ts                     # server-only Sheets client
lib/exhibitions.ts                # data access (list/create/update/delete)
actions/exhibitions.ts            # server actions (auth re-check → lib)

CLAUDE.md                         # house rules
.claude/commands/run.md           # /run
.claude/commands/finish.md        # /finish
.claude/skills/<vercel skills>    # copied guardrail skills
```

---

## Task 1: Scaffold Next.js project files

We hand-create the scaffold (deterministic; avoids `create-next-app`'s non-empty-dir conflict checker against `.claude/`, `temp/`, `README.md`).

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`
- Create: `app/globals.css` (minimal for now; themed in Task 2), `app/layout.tsx` (minimal), `app/page.tsx` (placeholder)

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "wellandvalleyrota",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "next": "^15.1.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "next-auth": "^5.0.0-beta.25",
    "googleapis": "^144.0.0"
  },
  "devDependencies": {
    "typescript": "^5.7.0",
    "@types/node": "^22.10.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/postcss": "^4.0.0",
    "daisyui": "^5.0.0",
    "eslint": "^9.17.0",
    "eslint-config-next": "^15.1.0",
    "vitest": "^2.1.8"
  }
}
```

- [ ] **Step 2: Create `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 3: Create `next.config.ts`**

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

export default nextConfig;
```

- [ ] **Step 4: Create `postcss.config.mjs`**

```js
const config = {
  plugins: ["@tailwindcss/postcss"],
};

export default config;
```

- [ ] **Step 5: Create `eslint.config.mjs`**

```js
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig = [...compat.extends("next/core-web-vitals", "next/typescript")];

export default eslintConfig;
```

- [ ] **Step 6: Create minimal `app/globals.css`** (full theme comes in Task 2)

```css
@import "tailwindcss";
@plugin "daisyui";
```

- [ ] **Step 7: Create minimal `app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Welland Valley Art Society — Volunteer Rota",
  description: "Exhibition stewarding rota for the Welland Valley Art Society.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="gallery">
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 8: Create placeholder `app/page.tsx`**

```tsx
export default function Home() {
  return <main className="p-8">WVAS Rota — scaffold OK</main>;
}
```

- [ ] **Step 9: Install dependencies**

Run: `npm install`
Expected: completes; `node_modules/` created; `package-lock.json` written.

- [ ] **Step 10: Verify dev server boots**

Run: `npm run dev` (then stop it after confirming)
Expected: "Ready" on http://localhost:3000; visiting it shows "WVAS Rota — scaffold OK".

- [ ] **Step 11: Commit**

```bash
git add package.json package-lock.json tsconfig.json next.config.ts postcss.config.mjs eslint.config.mjs app/
git commit -m "chore: scaffold Next.js 15 + Tailwind v4 + daisyUI app"
```

---

## Task 2: Gallery theme, fonts, and root layout

Recreate the deep-green / cream / gold look + Playfair Display headings.

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Write the themed `app/globals.css`**

```css
@import "tailwindcss";
@plugin "daisyui";

/* Custom daisyUI v5 theme recreating the gallery look from the original site. */
@plugin "daisyui/theme" {
  name: "gallery";
  default: true;
  prefersdark: false;
  color-scheme: light;

  --color-base-100: #f7f3ee;   /* cream page background */
  --color-base-200: #efe9e1;
  --color-base-300: #e0d8ce;
  --color-base-content: #3a2e22; /* warm dark text */

  --color-primary: #2c4a3e;      /* deep green */
  --color-primary-content: #f7f3ee;
  --color-secondary: #c8a96e;    /* gold */
  --color-secondary-content: #2c2417;
  --color-accent: #8a7a6a;       /* muted brown */
  --color-accent-content: #f7f3ee;
  --color-neutral: #1a3028;      /* darkest green */
  --color-neutral-content: #f7f3ee;

  --color-info: #3a6ea5;
  --color-info-content: #ffffff;
  --color-success: #2c4a3e;
  --color-success-content: #ffffff;
  --color-warning: #c8a96e;
  --color-warning-content: #2c2417;
  --color-error: #8b2e2e;
  --color-error-content: #ffffff;

  --radius-selector: 0rem;
  --radius-field: 0rem;
  --radius-box: 0rem;
  --border: 1.5px;
}

/* Serif display headings, matching the original Playfair usage. */
.font-display {
  font-family: var(--font-playfair), Georgia, serif;
}
```

- [ ] **Step 2: Add Google fonts + body classes in `app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import { Playfair_Display, Source_Sans_3 } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});
const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Welland Valley Art Society — Volunteer Rota",
  description: "Exhibition stewarding rota for the Welland Valley Art Society.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="gallery" className={`${playfair.variable} ${sourceSans.variable}`}>
      <body style={{ fontFamily: "var(--font-source-sans), sans-serif" }}>{children}</body>
    </html>
  );
}
```

- [ ] **Step 3: Sanity-check the theme renders**

Replace `app/page.tsx` body temporarily with a themed probe:

```tsx
export default function Home() {
  return (
    <main className="p-8 space-y-4">
      <h1 className="font-display text-3xl text-primary">Gallery theme check</h1>
      <button className="btn btn-primary">Primary</button>
      <button className="btn btn-secondary">Secondary</button>
    </main>
  );
}
```

- [ ] **Step 4: Run and verify**

Run: `npm run dev`
Expected: cream background, deep-green serif heading, green + gold buttons. Stop the server.

- [ ] **Step 5: Commit**

```bash
git add app/globals.css app/layout.tsx app/page.tsx
git commit -m "feat: add gallery daisyUI theme and Playfair/Source Sans fonts"
```

---

## Task 3: Test infrastructure (Vitest)

**Files:**
- Create: `vitest.config.ts`
- Create: `lib/smoke.test.ts` (temporary, deleted at end of task)

- [ ] **Step 1: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["**/*.test.ts"],
  },
});
```

- [ ] **Step 2: Create a temporary smoke test `lib/smoke.test.ts`**

```ts
import { describe, it, expect } from "vitest";

describe("vitest wiring", () => {
  it("runs", () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 3: Run the test suite**

Run: `npm test`
Expected: 1 passed.

- [ ] **Step 4: Delete the smoke test**

```bash
git rm -f --ignore-unmatch lib/smoke.test.ts 2>/dev/null; rm -f lib/smoke.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add vitest.config.ts package.json
git commit -m "chore: add Vitest test runner"
```

---

## Task 4: Types and pure validation (TDD)

**Files:**
- Create: `lib/types.ts`
- Create: `lib/validation.ts`
- Test: `lib/validation.test.ts`

- [ ] **Step 1: Create `lib/types.ts`**

```ts
export interface ExhibitionInput {
  societyName: string;
  title: string; // may be empty
  startDate: string; // ISO YYYY-MM-DD
  endDate: string; // ISO YYYY-MM-DD
}

export interface Exhibition extends ExhibitionInput {
  id: string;
  createdAt: string; // ISO timestamp
}

export const DEFAULT_SOCIETY_NAME = "Welland Valley Art Society";
```

- [ ] **Step 2: Write the failing test `lib/validation.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { validateExhibitionInput } from "./validation";

describe("validateExhibitionInput", () => {
  const valid = {
    societyName: "Welland Valley Art Society",
    title: "Autumn 2026",
    startDate: "2026-09-28",
    endDate: "2026-10-18",
  };

  it("accepts a valid input", () => {
    expect(validateExhibitionInput(valid)).toEqual({ ok: true });
  });

  it("requires a society name", () => {
    const r = validateExhibitionInput({ ...valid, societyName: "  " });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.societyName).toBeTruthy();
  });

  it("allows an empty title", () => {
    expect(validateExhibitionInput({ ...valid, title: "" })).toEqual({ ok: true });
  });

  it("requires a start date", () => {
    const r = validateExhibitionInput({ ...valid, startDate: "" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.startDate).toBeTruthy();
  });

  it("requires an end date", () => {
    const r = validateExhibitionInput({ ...valid, endDate: "" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.endDate).toBeTruthy();
  });

  it("rejects end date before start date", () => {
    const r = validateExhibitionInput({ ...valid, startDate: "2026-10-18", endDate: "2026-09-28" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.endDate).toBeTruthy();
  });

  it("accepts end date equal to start date", () => {
    expect(validateExhibitionInput({ ...valid, startDate: "2026-09-28", endDate: "2026-09-28" })).toEqual({ ok: true });
  });

  it("rejects malformed dates", () => {
    const r = validateExhibitionInput({ ...valid, startDate: "28/09/2026" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.startDate).toBeTruthy();
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npx vitest run lib/validation.test.ts`
Expected: FAIL — cannot find module `./validation`.

- [ ] **Step 4: Implement `lib/validation.ts`**

```ts
import type { ExhibitionInput } from "./types";

export type ValidationResult =
  | { ok: true }
  | { ok: false; errors: Partial<Record<keyof ExhibitionInput, string>> };

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function validateExhibitionInput(input: ExhibitionInput): ValidationResult {
  const errors: Partial<Record<keyof ExhibitionInput, string>> = {};

  if (!input.societyName || input.societyName.trim() === "") {
    errors.societyName = "Society name is required.";
  }

  if (!input.startDate) {
    errors.startDate = "Start date is required.";
  } else if (!ISO_DATE.test(input.startDate)) {
    errors.startDate = "Start date must be a valid date.";
  }

  if (!input.endDate) {
    errors.endDate = "End date is required.";
  } else if (!ISO_DATE.test(input.endDate)) {
    errors.endDate = "End date must be a valid date.";
  }

  if (!errors.startDate && !errors.endDate && input.endDate < input.startDate) {
    errors.endDate = "End date cannot be before the start date.";
  }

  return Object.keys(errors).length === 0 ? { ok: true } : { ok: false, errors };
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run lib/validation.test.ts`
Expected: PASS (8 tests).

- [ ] **Step 6: Commit**

```bash
git add lib/types.ts lib/validation.ts lib/validation.test.ts
git commit -m "feat: exhibition types and input validation"
```

---

## Task 5: Email allowlist (TDD)

**Files:**
- Create: `lib/allowlist.ts`
- Test: `lib/allowlist.test.ts`

- [ ] **Step 1: Write the failing test `lib/allowlist.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { isAllowedEmail } from "./allowlist";

describe("isAllowedEmail", () => {
  const list = "mat3740@gmail.com, twardill@gmail.com";

  it("allows a listed email", () => {
    expect(isAllowedEmail("mat3740@gmail.com", list)).toBe(true);
  });

  it("is case-insensitive", () => {
    expect(isAllowedEmail("TWardill@Gmail.com", list)).toBe(true);
  });

  it("trims whitespace around entries", () => {
    expect(isAllowedEmail("twardill@gmail.com", list)).toBe(true);
  });

  it("rejects an unlisted email", () => {
    expect(isAllowedEmail("stranger@gmail.com", list)).toBe(false);
  });

  it("rejects null/empty email", () => {
    expect(isAllowedEmail(null, list)).toBe(false);
    expect(isAllowedEmail("", list)).toBe(false);
  });

  it("rejects everyone when the list is empty/undefined", () => {
    expect(isAllowedEmail("mat3740@gmail.com", "")).toBe(false);
    expect(isAllowedEmail("mat3740@gmail.com", undefined)).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run lib/allowlist.test.ts`
Expected: FAIL — cannot find module `./allowlist`.

- [ ] **Step 3: Implement `lib/allowlist.ts`**

```ts
export function isAllowedEmail(email: string | null | undefined, allowList: string | undefined): boolean {
  if (!email || !allowList) return false;
  const normalized = email.trim().toLowerCase();
  if (!normalized) return false;
  return allowList
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
    .includes(normalized);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run lib/allowlist.test.ts`
Expected: PASS (6 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/allowlist.ts lib/allowlist.test.ts
git commit -m "feat: email allowlist check"
```

---

## Task 6: Sheet row mapping (TDD)

Pure functions converting between sheet rows and `Exhibition` objects. Column order: `id | societyName | title | startDate | endDate | createdAt`.

**Files:**
- Create: `lib/sheet-map.ts`
- Test: `lib/sheet-map.test.ts`

- [ ] **Step 1: Write the failing test `lib/sheet-map.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { EXHIBITION_HEADER, exhibitionToRow, rowToExhibition } from "./sheet-map";
import type { Exhibition } from "./types";

const ex: Exhibition = {
  id: "abc123",
  societyName: "Welland Valley Art Society",
  title: "Autumn 2026",
  startDate: "2026-09-28",
  endDate: "2026-10-18",
  createdAt: "2026-06-06T10:00:00.000Z",
};

describe("sheet-map", () => {
  it("has the expected header", () => {
    expect(EXHIBITION_HEADER).toEqual([
      "id", "societyName", "title", "startDate", "endDate", "createdAt",
    ]);
  });

  it("serializes an exhibition to a row in header order", () => {
    expect(exhibitionToRow(ex)).toEqual([
      "abc123", "Welland Valley Art Society", "Autumn 2026",
      "2026-09-28", "2026-10-18", "2026-06-06T10:00:00.000Z",
    ]);
  });

  it("parses a row back to an exhibition", () => {
    expect(rowToExhibition(exhibitionToRow(ex))).toEqual(ex);
  });

  it("tolerates missing trailing cells (empty title)", () => {
    const row = ["id1", "Soc", "", "2026-01-01", "2026-01-02"]; // createdAt missing
    expect(rowToExhibition(row)).toEqual({
      id: "id1", societyName: "Soc", title: "", startDate: "2026-01-01",
      endDate: "2026-01-02", createdAt: "",
    });
  });

  it("returns null for a row without an id", () => {
    expect(rowToExhibition(["", "Soc", "", "2026-01-01", "2026-01-02", ""])).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run lib/sheet-map.test.ts`
Expected: FAIL — cannot find module `./sheet-map`.

- [ ] **Step 3: Implement `lib/sheet-map.ts`**

```ts
import type { Exhibition } from "./types";

export const EXHIBITION_HEADER = [
  "id", "societyName", "title", "startDate", "endDate", "createdAt",
] as const;

export function exhibitionToRow(ex: Exhibition): string[] {
  return [ex.id, ex.societyName, ex.title, ex.startDate, ex.endDate, ex.createdAt];
}

export function rowToExhibition(row: string[]): Exhibition | null {
  const [id, societyName, title, startDate, endDate, createdAt] = row;
  if (!id) return null;
  return {
    id,
    societyName: societyName ?? "",
    title: title ?? "",
    startDate: startDate ?? "",
    endDate: endDate ?? "",
    createdAt: createdAt ?? "",
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run lib/sheet-map.test.ts`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/sheet-map.ts lib/sheet-map.test.ts
git commit -m "feat: exhibition <-> sheet row mapping"
```

---

## Task 7: Shift constants (for later (d))

**Files:**
- Create: `lib/shifts.ts`

- [ ] **Step 1: Create `lib/shifts.ts`**

```ts
// Shift definitions for the rota. Kept as a constant for now (matches the
// original app); may become per-exhibition configuration in a later phase.
export interface Shift {
  id: string;
  label: string;
}

export const SHIFTS: Shift[] = [
  { id: "s1", label: "10:00am – 1:30pm" },
  { id: "s2", label: "1:30pm – 5:00pm" },
  { id: "s3", label: "5:00pm – Closing" },
];

export const MAX_PER_SLOT = 2;
```

- [ ] **Step 2: Commit**

```bash
git add lib/shifts.ts
git commit -m "feat: shift constants for future booking phase"
```

---

## Task 8: Server-only Google Sheets client

Wraps `googleapis` with service-account JWT auth from env. `import "server-only"` guarantees it can never be bundled into client code.

**Files:**
- Create: `lib/sheets.ts`

- [ ] **Step 1: Install `server-only`**

Run: `npm install server-only`
Expected: added to dependencies.

- [ ] **Step 2: Create `lib/sheets.ts`**

```ts
import "server-only";
import { google, sheets_v4 } from "googleapis";

/**
 * Decode the service-account private key. Stored base64-encoded in
 * GOOGLE_PRIVATE_KEY to avoid newline-escaping problems in env vars.
 */
function getPrivateKey(): string {
  const raw = process.env.GOOGLE_PRIVATE_KEY;
  if (!raw) throw new Error("GOOGLE_PRIVATE_KEY is not set");
  // Support both base64 and raw (with literal \n) values.
  if (raw.includes("BEGIN PRIVATE KEY")) return raw.replace(/\\n/g, "\n");
  return Buffer.from(raw, "base64").toString("utf8");
}

let cached: sheets_v4.Sheets | null = null;

export function getSheetsClient(): sheets_v4.Sheets {
  if (cached) return cached;
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  if (!email) throw new Error("GOOGLE_SERVICE_ACCOUNT_EMAIL is not set");

  const auth = new google.auth.JWT({
    email,
    key: getPrivateKey(),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  cached = google.sheets({ version: "v4", auth });
  return cached;
}

export function getSheetId(): string {
  const id = process.env.GOOGLE_SHEET_ID;
  if (!id) throw new Error("GOOGLE_SHEET_ID is not set");
  return id;
}
```

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add lib/sheets.ts package.json package-lock.json
git commit -m "feat: server-only Google Sheets client"
```

---

## Task 9: Exhibitions data-access layer

CRUD against the `Exhibitions` tab, building on the tested mapping. Uses crypto for ids and ensures the header row exists.

**Files:**
- Create: `lib/exhibitions.ts`

- [ ] **Step 1: Create `lib/exhibitions.ts`**

```ts
import "server-only";
import { randomUUID } from "crypto";
import { getSheetsClient, getSheetId } from "./sheets";
import { EXHIBITION_HEADER, exhibitionToRow, rowToExhibition } from "./sheet-map";
import { validateExhibitionInput } from "./validation";
import type { Exhibition, ExhibitionInput } from "./types";

const TAB = "Exhibitions";
const RANGE = `${TAB}!A:F`;

/** Ensure the tab exists with a header row. Safe to call repeatedly. */
async function ensureSheet(): Promise<void> {
  const sheets = getSheetsClient();
  const spreadsheetId = getSheetId();

  const meta = await sheets.spreadsheets.get({ spreadsheetId });
  const exists = meta.data.sheets?.some((s) => s.properties?.title === TAB);
  if (!exists) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: { requests: [{ addSheet: { properties: { title: TAB } } }] },
    });
  }

  const header = await sheets.spreadsheets.values.get({ spreadsheetId, range: `${TAB}!A1:F1` });
  if (!header.data.values || header.data.values.length === 0) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${TAB}!A1`,
      valueInputOption: "RAW",
      requestBody: { values: [[...EXHIBITION_HEADER]] },
    });
  }
}

export async function listExhibitions(): Promise<Exhibition[]> {
  await ensureSheet();
  const sheets = getSheetsClient();
  const res = await sheets.spreadsheets.values.get({ spreadsheetId: getSheetId(), range: RANGE });
  const rows = res.data.values ?? [];
  return rows
    .slice(1) // skip header
    .map((r) => rowToExhibition(r as string[]))
    .filter((e): e is Exhibition => e !== null);
}

export async function createExhibition(input: ExhibitionInput): Promise<Exhibition> {
  const result = validateExhibitionInput(input);
  if (!result.ok) throw new Error("Invalid exhibition: " + JSON.stringify(result.errors));
  await ensureSheet();

  const exhibition: Exhibition = {
    id: randomUUID(),
    societyName: input.societyName.trim(),
    title: input.title.trim(),
    startDate: input.startDate,
    endDate: input.endDate,
    createdAt: new Date().toISOString(),
  };

  const sheets = getSheetsClient();
  await sheets.spreadsheets.values.append({
    spreadsheetId: getSheetId(),
    range: RANGE,
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [exhibitionToRow(exhibition)] },
  });
  return exhibition;
}

/** Find the 1-based sheet row number for an exhibition id (header is row 1). */
async function findRowNumber(id: string): Promise<number | null> {
  const sheets = getSheetsClient();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: getSheetId(),
    range: `${TAB}!A:A`,
  });
  const ids = res.data.values ?? [];
  for (let i = 1; i < ids.length; i++) {
    if (ids[i]?.[0] === id) return i + 1; // +1 → 1-based row number
  }
  return null;
}

export async function updateExhibition(id: string, input: ExhibitionInput): Promise<Exhibition> {
  const result = validateExhibitionInput(input);
  if (!result.ok) throw new Error("Invalid exhibition: " + JSON.stringify(result.errors));

  const all = await listExhibitions();
  const existing = all.find((e) => e.id === id);
  if (!existing) throw new Error("Exhibition not found: " + id);

  const rowNumber = await findRowNumber(id);
  if (rowNumber === null) throw new Error("Exhibition row not found: " + id);

  const updated: Exhibition = {
    ...existing,
    societyName: input.societyName.trim(),
    title: input.title.trim(),
    startDate: input.startDate,
    endDate: input.endDate,
  };

  const sheets = getSheetsClient();
  await sheets.spreadsheets.values.update({
    spreadsheetId: getSheetId(),
    range: `${TAB}!A${rowNumber}:F${rowNumber}`,
    valueInputOption: "RAW",
    requestBody: { values: [exhibitionToRow(updated)] },
  });
  return updated;
}

export async function deleteExhibition(id: string): Promise<void> {
  const sheets = getSheetsClient();
  const spreadsheetId = getSheetId();

  // Resolve the numeric sheetId for the tab (needed by deleteDimension).
  const meta = await sheets.spreadsheets.get({ spreadsheetId });
  const sheet = meta.data.sheets?.find((s) => s.properties?.title === TAB);
  const numericSheetId = sheet?.properties?.sheetId;
  if (numericSheetId === undefined || numericSheetId === null) {
    throw new Error("Exhibitions tab not found");
  }

  const rowNumber = await findRowNumber(id);
  if (rowNumber === null) throw new Error("Exhibition not found: " + id);

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId: numericSheetId,
              dimension: "ROWS",
              startIndex: rowNumber - 1, // 0-based, inclusive
              endIndex: rowNumber,       // exclusive
            },
          },
        },
      ],
    },
  });
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/exhibitions.ts
git commit -m "feat: exhibitions data-access layer (Google Sheets CRUD)"
```

---

## Task 10: Auth.js (NextAuth v5) config + route + auth button

**Files:**
- Create: `lib/auth.ts`
- Create: `app/api/auth/[...nextauth]/route.ts`
- Create: `components/auth-button.tsx`

- [ ] **Step 1: Create `lib/auth.ts`**

```ts
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { isAllowedEmail } from "./allowlist";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    // Allowlist gate: only listed emails may complete sign-in.
    signIn({ profile, user }) {
      const email = profile?.email ?? user?.email ?? null;
      return isAllowedEmail(email, process.env.ALLOWED_EMAILS);
    },
  },
});
```

- [ ] **Step 2: Create `app/api/auth/[...nextauth]/route.ts`**

```ts
import { handlers } from "@/lib/auth";

export const { GET, POST } = handlers;
```

- [ ] **Step 3: Create `components/auth-button.tsx`**

```tsx
import { auth, signIn, signOut } from "@/lib/auth";

export default async function AuthButton() {
  const session = await auth();

  if (session?.user) {
    return (
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/" });
        }}
        className="flex items-center gap-3"
      >
        <span className="text-sm text-primary-content/80 hidden sm:inline">
          {session.user.email}
        </span>
        <button type="submit" className="btn btn-sm btn-outline">
          Sign out
        </button>
      </form>
    );
  }

  return (
    <form
      action={async () => {
        "use server";
        await signIn("google", { redirectTo: "/settings" });
      }}
    >
      <button type="submit" className="btn btn-sm btn-secondary">
        Sign in with Google
      </button>
    </form>
  );
}
```

- [ ] **Step 4: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 5: Create `.env.local` for local testing** (gitignored)

```
AUTH_SECRET=dev-only-secret-change-me
AUTH_URL=http://localhost:3000
AUTH_GOOGLE_ID=<from Google Cloud OAuth client>
AUTH_GOOGLE_SECRET=<from Google Cloud OAuth client>
ALLOWED_EMAILS=mat3740@gmail.com,twardill@gmail.com
GOOGLE_SERVICE_ACCOUNT_EMAIL=<service account email>
GOOGLE_PRIVATE_KEY=<base64 of the service-account private key>
GOOGLE_SHEET_ID=<spreadsheet id>
```

Note: generate `AUTH_SECRET` with `npx auth secret` or `openssl rand -base64 32`. The maintainer (repo owner) supplies the Google OAuth + service-account values.

- [ ] **Step 6: Commit (code only; `.env.local` is gitignored)**

```bash
git add lib/auth.ts app/api/auth/ components/auth-button.tsx
git commit -m "feat: Auth.js Google sign-in with email allowlist"
```

---

## Task 11: Server actions for exhibitions (auth re-check)

Defense in depth: even though the UI is gated, each mutation re-verifies the caller is allowlisted.

**Files:**
- Create: `actions/exhibitions.ts`

- [ ] **Step 1: Create `actions/exhibitions.ts`**

```ts
"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { isAllowedEmail } from "@/lib/allowlist";
import {
  createExhibition,
  updateExhibition,
  deleteExhibition,
} from "@/lib/exhibitions";
import type { ExhibitionInput } from "@/lib/types";

async function assertAllowed(): Promise<void> {
  const session = await auth();
  if (!isAllowedEmail(session?.user?.email ?? null, process.env.ALLOWED_EMAILS)) {
    throw new Error("Not authorized.");
  }
}

function readInput(formData: FormData): ExhibitionInput {
  return {
    societyName: String(formData.get("societyName") ?? ""),
    title: String(formData.get("title") ?? ""),
    startDate: String(formData.get("startDate") ?? ""),
    endDate: String(formData.get("endDate") ?? ""),
  };
}

export async function createExhibitionAction(formData: FormData): Promise<void> {
  await assertAllowed();
  await createExhibition(readInput(formData));
  revalidatePath("/settings");
}

export async function updateExhibitionAction(formData: FormData): Promise<void> {
  await assertAllowed();
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing exhibition id.");
  await updateExhibition(id, readInput(formData));
  revalidatePath("/settings");
}

export async function deleteExhibitionAction(formData: FormData): Promise<void> {
  await assertAllowed();
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing exhibition id.");
  await deleteExhibition(id);
  revalidatePath("/settings");
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add actions/exhibitions.ts
git commit -m "feat: server actions for exhibition CRUD with auth re-check"
```

---

## Task 12: Header, nav tabs, and home page

**Files:**
- Create: `components/coming-soon.tsx`
- Create: `components/nav-tabs.tsx`
- Create: `components/site-header.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Create `components/coming-soon.tsx`**

```tsx
export default function ComingSoon({ feature }: { feature: string }) {
  return (
    <div className="border border-base-300 bg-base-200 p-10 text-center">
      <h2 className="font-display text-2xl text-primary mb-2">{feature}</h2>
      <p className="text-base-content/70">
        This part of the rota is coming soon.
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Create `components/nav-tabs.tsx`** (client tab switcher for the three booking views; Settings is a real link)

```tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import ComingSoon from "./coming-soon";

const TABS = [
  { id: "book", label: "Book a Shift" },
  { id: "overview", label: "Full Overview" },
  { id: "booked", label: "Who's Booked" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function NavTabs() {
  const [active, setActive] = useState<TabId>("book");

  const labels: Record<TabId, string> = {
    book: "Book a Shift",
    overview: "Full Overview",
    booked: "Who's Booked",
  };

  return (
    <div>
      <div role="tablist" className="tabs tabs-bordered mb-6">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            className={`tab ${active === t.id ? "tab-active" : ""}`}
            onClick={() => setActive(t.id)}
          >
            {t.label}
          </button>
        ))}
        <Link href="/settings" className="tab" role="tab">
          Settings
        </Link>
      </div>
      <ComingSoon feature={labels[active]} />
    </div>
  );
}
```

- [ ] **Step 3: Create `components/site-header.tsx`**

```tsx
import AuthButton from "./auth-button";

export default function SiteHeader() {
  return (
    <header className="bg-primary border-b-[3px] border-secondary">
      <div className="max-w-4xl mx-auto px-6 py-7 flex items-start justify-between gap-4">
        <div>
          <div className="text-secondary text-[11px] tracking-[0.18em] uppercase mb-1.5">
            Exhibition Stewarding
          </div>
          <h1 className="font-display text-2xl text-primary-content font-normal leading-tight">
            Welland Valley Art Society
            <br />
            <em className="text-xl">Volunteer Rota</em>
          </h1>
        </div>
        <div className="pt-1">
          <AuthButton />
        </div>
      </div>
    </header>
  );
}
```

- [ ] **Step 4: Replace `app/page.tsx`**

```tsx
import SiteHeader from "@/components/site-header";
import NavTabs from "@/components/nav-tabs";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <NavTabs />
      </main>
    </>
  );
}
```

- [ ] **Step 5: Type-check, then run and verify**

Run: `npx tsc --noEmit`
Expected: no errors.

Run: `npm run dev`
Expected: gallery header with the society title, a "Sign in with Google" button top-right, three tabs that switch the "Coming soon" panel, and a "Settings" tab that links to `/settings`. Stop the server.

- [ ] **Step 6: Commit**

```bash
git add components/coming-soon.tsx components/nav-tabs.tsx components/site-header.tsx app/page.tsx
git commit -m "feat: themed home page with header, nav tabs, and auth button"
```

---

## Task 13: Settings page (gated) + exhibition form + list

**Files:**
- Create: `components/exhibition-form.tsx`
- Create: `components/exhibition-list.tsx`
- Create: `app/settings/page.tsx`

- [ ] **Step 1: Create `components/exhibition-form.tsx`** (client form used for create and edit)

```tsx
"use client";

import { useRef } from "react";
import { DEFAULT_SOCIETY_NAME, type Exhibition } from "@/lib/types";
import { createExhibitionAction, updateExhibitionAction } from "@/actions/exhibitions";

export default function ExhibitionForm({ existing }: { existing?: Exhibition }) {
  const formRef = useRef<HTMLFormElement>(null);
  const isEdit = Boolean(existing);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        if (isEdit) {
          await updateExhibitionAction(formData);
        } else {
          await createExhibitionAction(formData);
          formRef.current?.reset();
        }
      }}
      className="space-y-4 border border-base-300 bg-base-100 p-6"
    >
      <h2 className="font-display text-xl text-primary">
        {isEdit ? "Edit exhibition" : "New exhibition"}
      </h2>

      {existing && <input type="hidden" name="id" value={existing.id} />}

      <label className="form-control w-full">
        <span className="label-text uppercase text-xs tracking-wider">Society name</span>
        <input
          name="societyName"
          required
          defaultValue={existing?.societyName ?? DEFAULT_SOCIETY_NAME}
          className="input input-bordered w-full"
        />
      </label>

      <label className="form-control w-full">
        <span className="label-text uppercase text-xs tracking-wider">Title (optional)</span>
        <input
          name="title"
          defaultValue={existing?.title ?? ""}
          className="input input-bordered w-full"
        />
      </label>

      <div className="flex gap-4 flex-wrap">
        <label className="form-control">
          <span className="label-text uppercase text-xs tracking-wider">Start date</span>
          <input
            type="date"
            name="startDate"
            required
            defaultValue={existing?.startDate ?? ""}
            className="input input-bordered"
          />
        </label>
        <label className="form-control">
          <span className="label-text uppercase text-xs tracking-wider">End date</span>
          <input
            type="date"
            name="endDate"
            required
            defaultValue={existing?.endDate ?? ""}
            className="input input-bordered"
          />
        </label>
      </div>

      <button type="submit" className="btn btn-primary">
        {isEdit ? "Save changes" : "Create exhibition"}
      </button>
    </form>
  );
}
```

- [ ] **Step 2: Create `components/exhibition-list.tsx`**

```tsx
"use client";

import { useState } from "react";
import type { Exhibition } from "@/lib/types";
import { deleteExhibitionAction } from "@/actions/exhibitions";
import ExhibitionForm from "./exhibition-form";

function formatRange(start: string, end: string): string {
  const fmt = (s: string) =>
    new Date(s + "T12:00:00").toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  return `${fmt(start)} — ${fmt(end)}`;
}

export default function ExhibitionList({ exhibitions }: { exhibitions: Exhibition[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);

  if (exhibitions.length === 0) {
    return <p className="text-base-content/60 italic">No exhibitions yet. Create one above.</p>;
  }

  return (
    <ul className="space-y-3">
      {exhibitions.map((ex) => (
        <li key={ex.id} className="border border-base-300 bg-base-100 p-4">
          {editingId === ex.id ? (
            <div className="space-y-3">
              <ExhibitionForm existing={ex} />
              <button className="btn btn-ghost btn-sm" onClick={() => setEditingId(null)}>
                Done
              </button>
            </div>
          ) : (
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-semibold text-primary">
                  {ex.title || ex.societyName}
                </div>
                <div className="text-sm text-base-content/70">{ex.societyName}</div>
                <div className="text-sm text-base-content/70">
                  {formatRange(ex.startDate, ex.endDate)}
                </div>
              </div>
              <div className="flex gap-2">
                <button className="btn btn-sm btn-outline" onClick={() => setEditingId(ex.id)}>
                  Edit
                </button>
                <form
                  action={async (formData) => {
                    if (confirm(`Delete "${ex.title || ex.societyName}"? This cannot be undone.`)) {
                      await deleteExhibitionAction(formData);
                    }
                  }}
                >
                  <input type="hidden" name="id" value={ex.id} />
                  <button type="submit" className="btn btn-sm btn-error btn-outline">
                    Delete
                  </button>
                </form>
              </div>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
```

- [ ] **Step 3: Create `app/settings/page.tsx`** (server component; gate + data)

```tsx
import Link from "next/link";
import { auth, signIn } from "@/lib/auth";
import { isAllowedEmail } from "@/lib/allowlist";
import { listExhibitions } from "@/lib/exhibitions";
import SiteHeader from "@/components/site-header";
import ExhibitionForm from "@/components/exhibition-form";
import ExhibitionList from "@/components/exhibition-list";

export default async function SettingsPage() {
  const session = await auth();
  const allowed = isAllowedEmail(session?.user?.email ?? null, process.env.ALLOWED_EMAILS);

  if (!allowed) {
    return (
      <>
        <SiteHeader />
        <main className="max-w-md mx-auto px-4 py-12 text-center space-y-4">
          <h1 className="font-display text-2xl text-primary">Settings</h1>
          <p className="text-base-content/70">
            This area is restricted. Please sign in with an authorised Google account.
          </p>
          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/settings" });
            }}
          >
            <button type="submit" className="btn btn-primary">
              Sign in with Google
            </button>
          </form>
          <Link href="/" className="link text-sm">
            ← Back to the rota
          </Link>
        </main>
      </>
    );
  }

  const exhibitions = await listExhibitions();

  return (
    <>
      <SiteHeader />
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl text-primary">Exhibition settings</h1>
          <Link href="/" className="link text-sm">
            ← Back to the rota
          </Link>
        </div>
        <ExhibitionForm />
        <section>
          <h2 className="font-display text-xl text-primary mb-3">Existing exhibitions</h2>
          <ExhibitionList exhibitions={exhibitions} />
        </section>
      </main>
    </>
  );
}
```

- [ ] **Step 4: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 5: Verify (requires real Google env vars in `.env.local`)**

Run: `npm run dev`
Expected (when env vars are present):
- Visiting `/settings` while signed out shows the restricted prompt.
- Signing in with an allowlisted Google account returns to `/settings` with the CRUD UI.
- Creating an exhibition adds a row to the `Exhibitions` tab of the Google Sheet; it appears in the list.
- Editing updates the row; deleting (after confirm) removes it.
- Signing in with a non-allowlisted account is rejected.

If Google env vars are not yet configured, verify instead that `/settings` renders the restricted prompt without crashing, and revisit this step once credentials are in place.

- [ ] **Step 6: Commit**

```bash
git add components/exhibition-form.tsx components/exhibition-list.tsx app/settings/
git commit -m "feat: gated settings page with exhibitions CRUD"
```

---

## Task 14: Guardrails — CLAUDE.md

**Files:**
- Create: `CLAUDE.md`

- [ ] **Step 1: Create `CLAUDE.md`**

```markdown
# Welland Valley Art Society — Rota

A Next.js (App Router) volunteer-stewarding rota for the Welland Valley Art
Society, hosted on Vercel. Data lives in a Google Sheet, read/written only from
server code. Auth is Google sign-in restricted to an email allowlist.

## House rules (always follow these)

1. **Never commit or push to `main` / `master`.** Before doing ANY work, create
   (or switch to) a `release/v1.x.x` branch. The `/run` and `/finish` commands
   enforce this. (Exception, already taken: the initial Phase-1 build was
   committed to `main` at the maintainer's request.)
2. **Secrets are server-only.** Never put API keys, the Google private key, the
   sheet id, or the allowlist into client components or committed files. They
   live in environment variables and are used only in `lib/*` server modules and
   server actions. Files importing `server-only` must never be imported by a
   client component.
3. **Validate before writing.** All exhibition writes go through the validation
   in `lib/validation.ts` and the server actions in `actions/exhibitions.ts`,
   which re-check the signed-in user against the allowlist.
4. **Keep it simple and conventional.** Small, focused files; follow the existing
   patterns. Prefer Server Actions for writes and server components for reads.
5. **Follow the bundled Vercel skills** in `.claude/skills/` for React, Next.js,
   composition, and design decisions.

## Project map

- `app/` — routes. `app/page.tsx` (home), `app/settings/page.tsx` (gated CRUD),
  `app/api/auth/[...nextauth]/route.ts` (Auth.js).
- `components/` — UI. `*-form`/`*-list` are client; header/auth are server.
- `lib/` — logic + data. `validation.ts`, `allowlist.ts`, `sheet-map.ts` are pure
  and unit-tested. `sheets.ts`, `exhibitions.ts`, `auth.ts` are server-only.
- `actions/` — server actions (mutations, with auth re-check).
- `docs/superpowers/` — design spec and implementation plans.

## Commands

- `npm run dev` — local dev server (or use `/run`).
- `npm test` — Vitest unit tests.
- `npx tsc --noEmit` — type-check.
- `/run` — ensure a release branch, then start dev.
- `/finish` — commit, push, and promote to Vercel production.

## Environment variables

See `.env.example`. All are server-side. Never commit real values.

## Deferred work

The booking workflow (Book a Shift / Full Overview / Who's Booked) is specified
in `docs/superpowers/specs/2026-06-06-wvas-rota-rebuild-design.md` and not yet
built. It reads/writes a `Bookings` tab and needs no sign-in.
```

- [ ] **Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: add CLAUDE.md house rules and project map"
```

---

## Task 15: Install the Vercel guardrail skills

**Files:**
- Create: `.claude/skills/vercel-composition-patterns/`, `.claude/skills/vercel-react-best-practices/`, `.claude/skills/vercel-react-view-transitions/`, `.claude/skills/web-design-guidelines/` (copied)

Note: `vercel-react-native-skills` is mobile-only and not relevant to this web app — skip it to keep the repo focused.

- [ ] **Step 1: Copy the relevant skills**

```bash
cp -r "/c/git/b2c/RAMPWeb/.claude/skills/vercel-composition-patterns" .claude/skills/
cp -r "/c/git/b2c/RAMPWeb/.claude/skills/vercel-react-best-practices" .claude/skills/
cp -r "/c/git/b2c/RAMPWeb/.claude/skills/vercel-react-view-transitions" .claude/skills/
cp -r "/c/git/b2c/RAMPWeb/.claude/skills/web-design-guidelines" .claude/skills/
```

- [ ] **Step 2: Verify they copied**

Run: `ls .claude/skills/`
Expected: the four skill folders, each containing `SKILL.md`.

- [ ] **Step 3: Commit**

```bash
git add .claude/skills/
git commit -m "chore: add Vercel guardrail skills"
```

---

## Task 16: `/run` slash command

**Files:**
- Create: `.claude/commands/run.md`

- [ ] **Step 1: Create `.claude/commands/run.md`**

````markdown
---
description: Ensure a release branch, then run the app locally
---

Run the app locally for development. Follow these steps exactly:

1. Check the current git branch: `git rev-parse --abbrev-ref HEAD`.
2. **Enforce the branch guardrail.** If the current branch is NOT named like
   `release/v1.x.x`:
   - Find the highest existing `release/v1.*` branch:
     `git branch --list "release/v1.*"`.
   - If none exist, create `release/v1.0.0`.
   - Otherwise, create the next patch version (e.g. if `release/v1.0.3` is the
     highest, create `release/v1.0.4`).
   - Create and switch with: `git checkout -b release/v1.x.x` (substitute the
     computed version).
   - Tell the user which branch you created and that work must never happen on
     `main`.
3. If `node_modules` is missing, run `npm install`.
4. Start the dev server: `npm run dev`.
5. Tell the user the app is running at http://localhost:3000 and how to stop it
   (Ctrl+C).
````

- [ ] **Step 2: Commit**

```bash
git add .claude/commands/run.md
git commit -m "feat: /run slash command with release-branch guardrail"
```

---

## Task 17: `/finish` slash command

**Files:**
- Create: `.claude/commands/finish.md`
- Modify: `.gitignore` (ignore `.vercel`)

- [ ] **Step 1: Ensure `.vercel` is gitignored**

Add this block to `.gitignore` (under the build-output section):

```
# ---- Vercel ----
.vercel/
```

- [ ] **Step 2: Create `.claude/commands/finish.md`**

````markdown
---
description: Commit, push, and promote the current release branch to Vercel production
---

Finish the current piece of work: commit it, push to GitHub, and deploy to
Vercel production. Follow these steps exactly:

1. Check the current branch: `git rev-parse --abbrev-ref HEAD`.
2. **Guardrail:** if the branch is `main` or `master`, STOP and tell the user.
   Work must be on a `release/v1.x.x` branch. Offer to move the changes onto a
   new release branch (create `release/v1.0.0` or the next patch version, then
   continue).
3. Stage and commit any pending changes with a clear conventional-commit
   message summarising the work. (If there is nothing to commit, say so and
   continue.)
4. Push the branch and set upstream:
   `git push -u origin <current-branch>`.
   - This automatically creates a Vercel **Preview** deployment.
5. **Promote to production** with the Vercel CLI:
   - Requires `VERCEL_TOKEN` to be set in the environment, and the project to be
     linked (run `vercel link` once if `.vercel/project.json` is absent).
   - Run: `npx vercel deploy --prod --yes --token "$VERCEL_TOKEN"`.
   - Print the production URL it returns.
6. Remind the user: to roll back, use Vercel dashboard → Deployments → Instant
   Rollback, or re-run `/finish` from the previous release branch.

If `VERCEL_TOKEN` is not set, complete steps 1–4 and tell the user how to set up
the token (Vercel → Account Settings → Tokens) and run `vercel link`, then
re-run `/finish`.
````

- [ ] **Step 3: Commit**

```bash
git add .claude/commands/finish.md .gitignore
git commit -m "feat: /finish slash command for push + Vercel production promote"
```

---

## Task 18: `.env.example`, README, and final verification

**Files:**
- Create: `.env.example`
- Modify: `README.md`

- [ ] **Step 1: Create `.env.example`**

```
# Auth.js
AUTH_SECRET=            # generate: npx auth secret
AUTH_URL=http://localhost:3000

# Google OAuth client (Google Cloud Console → Credentials → OAuth client ID)
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=

# Comma-separated list of Google emails allowed to sign in
ALLOWED_EMAILS=mat3740@gmail.com,twardill@gmail.com

# Google Sheets datastore (service account with access to the sheet)
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_PRIVATE_KEY=        # base64-encoded service-account private key
GOOGLE_SHEET_ID=
```

- [ ] **Step 2: Replace `README.md`**

```markdown
# Welland Valley Art Society — Volunteer Rota

A Next.js app for managing exhibition stewarding rotas. Volunteers sign up for
shifts; organisers create and manage exhibitions from a gated settings area.
Data is stored in a Google Sheet; sign-in is Google SSO restricted to an
allowlist.

## Getting started (local)

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env.local` and fill in the values (see below).
3. Start the app: `npm run dev` (or use the `/run` Claude command).
4. Open http://localhost:3000.

## Environment variables

See `.env.example`. All values are server-side secrets — never commit real
values. The repo owner provisions the Google OAuth client and the Sheets
service account.

## Tests & checks

- `npm test` — unit tests (Vitest)
- `npx tsc --noEmit` — type-check

## How it is built

- Next.js App Router + TypeScript, Tailwind v4 + daisyUI (custom "gallery"
  theme).
- Auth.js (Google) with an email allowlist.
- Google Sheets datastore accessed only from server code.
- See `CLAUDE.md` for house rules and `docs/superpowers/` for the design spec
  and implementation plan.

## Deploying

Hosted on Vercel. Use the `/finish` Claude command to commit, push, and promote
the current `release/v1.x.x` branch to production. Never push to `main`.

## Status

Phase 1 complete: home + Google sign-in + Settings → Exhibitions CRUD. The
booking workflow (Book a Shift / Full Overview / Who's Booked) is specified and
planned but not yet built.
```

- [ ] **Step 3: Full verification pass**

Run: `npm test`
Expected: all unit tests pass (validation, allowlist, sheet-map).

Run: `npx tsc --noEmit`
Expected: no type errors.

Run: `npm run build`
Expected: production build succeeds (no compile/lint failures).

- [ ] **Step 4: Commit**

```bash
git add .env.example README.md
git commit -m "docs: add .env.example and project README"
```

---

## Self-review (completed during planning)

**Spec coverage:**
- (a) Next.js + daisyUI + Tailwind on Vercel → Tasks 1, 2, 15–17.
- (b) Google SSO login button top-right, env allowlist → Tasks 5, 10, 12.
- (c) Settings gated behind login; create/edit/delete exhibition with the four
  fields + defaults/required/end≥start → Tasks 4, 9, 11, 13.
- Storage = Google Sheets, key server-side → Tasks 8, 9.
- Guardrails: never-main rule, Vercel skills, `/run`, `/finish`, branch/deploy
  strategy, GitHub protection (documented) → Tasks 14–18 + spec.
- Section (d) booking → intentionally deferred to a future plan (spec documents
  it; `Bookings` tab + `lib/shifts.ts` groundwork laid in Task 7).

**Placeholder scan:** No TBD/TODO; every code step contains complete code; every
command has expected output.

**Type consistency:** `ExhibitionInput`/`Exhibition` (lib/types.ts) used
consistently across validation, sheet-map, exhibitions, actions, and components.
`EXHIBITION_HEADER` order matches `exhibitionToRow`/`rowToExhibition` and the
`A:F` ranges in `lib/exhibitions.ts`. Server action names
(`createExhibitionAction`/`updateExhibitionAction`/`deleteExhibitionAction`)
match their imports in the form/list components. `isAllowedEmail` signature is
identical in `lib/auth.ts`, `actions/exhibitions.ts`, and the settings page.
