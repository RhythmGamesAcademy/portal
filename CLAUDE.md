# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Next.js dev server
npm run build        # Production build (succeeds without env vars — see "Lazy env")
npm run typecheck    # tsc --noEmit — the only automated check in this repo
npm run db:generate  # drizzle-kit generate: emit SQL into drizzle/ after editing src/db/schema.ts
npm run db:migrate   # Apply pending migrations to DATABASE_URL
```

There is no test suite and no linter. `npm run typecheck` is the check to run after changes.

Requires a `.env.local` (copy `.env.example`). `drizzle.config.ts` runs outside Next.js, so it calls `process.loadEnvFile` itself — anything else added under `scripts` must do the same.

`drizzle-kit generate` needs a TTY whenever a diff is ambiguous (a dropped column plus an added one makes it ask "renamed?"). It cannot be run through a pipe. Split such a change into two unambiguous migrations — add the new column nullable, then drop the old one and set `NOT NULL` — which is also what lets you slip a backfill in between (see `drizzle/0002_drop_entered_term.sql`).

This directory is not a git repository.

## Stack

Next.js 15 App Router / React 19 / TypeScript strict, Auth.js v5 (`next-auth@5 beta`) with Discord OAuth, Drizzle ORM over Neon serverless Postgres (HTTP driver), Tailwind v4. Path alias `@/*` → `src/*`.

Tailwind v4 is CSS-first: there is no `tailwind.config`. The palette lives in `src/app/globals.css` as CSS custom properties mapped to theme tokens under `@theme inline`. Use those semantic tokens (`bg-surface`, `text-muted`, `border-line`, `text-danger`, `bg-notice`, `font-serif`) rather than raw Tailwind colors — they carry the light/dark switch via `prefers-color-scheme`.

## The core invariant: the raw Discord ID is never persisted

This shapes most of the non-obvious code. The database stores only `students.discord_hash` = `HMAC-SHA256("lookup:v1:" + discordId)`; the JWT and session carry that digest, never the ID or profile.

- `src/lib/student-id.ts` derives everything from `RGA_STUDENT_ID_SALT` with two domain-separated prefixes: `lookup:v1:` for the lookup key and `sid:v1:` for the student-ID body. The split exists so collision retries can re-roll the ID body while the lookup key stays fixed.
- `ensureStudent()` in `src/services/students.ts` is the only function that receives a raw Discord ID. Keep it that way.
- The `jwt` callback in `src/auth.ts` deletes `name`/`email`/`picture` and overwrites `sub` with the digest — Auth.js would otherwise put the Discord ID in `sub`.
- **`RGA_STUDENT_ID_SALT` can never be rotated.** Changing it invalidates every issued student ID and orphans every existing row.

Student ID format: `{cohort code}{6 chars of Crockford Base32}`, e.g. `26WK7M2QP`.

## Sign-in flow (`src/auth.ts`)

Guild membership check and student issuance both happen in the **`signIn` callback**, not `jwt`. This is deliberate: `signIn` can return a redirect path, so a non-member goes to `/join`, whereas an exception thrown from `jwt` gets flattened by Auth.js into one generic error code. `jwt` then calls `ensureStudent` again, which by that point is a plain read of the row just created.

Membership is verified per-login against the Discord API (`src/lib/discord.ts`, guild ID is a hard-coded constant). Only the `identify guilds` scopes are requested — no email.

`ensureStudent` handles two distinct unique-violation cases from Postgres `23505`: a `student_id` clash re-rolls the body with the next `attempt` (up to `MAX_ISSUE_ATTEMPTS`), while a `discord_hash` clash means a concurrent login for the same user won the race, so it re-reads and returns that row. Drizzle wraps driver errors, so `postgresError()` walks the `cause` chain to find the code.

## Cohort codes vs. terms

These are two different things and must not be wired together.

The **cohort code** is the student ID prefix. `cohortCode(at)` in `src/lib/cohort.ts` is a pure function of the issue date — it does not touch the database:

- issued 08/15 through the following 02/14 → `{last 2 digits of the starting year}W`
- issued 02/15 through 08/14 → `{last 2 digits of the year}S`

So 2026-09-05 and 2027-01-10 both give `26W`; 2027-03-01 gives `27S`.

The comparison **must** happen in JST. Vercel runs on UTC, and judging by server-local time issues the wrong code for a nine-hour window around each boundary (02/14–15, 08/14–15). `jstParts()` shifts by a fixed +9h, which is exact because JST has no DST.

Call `cohortCode` **only on the INSERT path** in `ensureStudent`. Never recompute it when reading a student: the value is frozen in `students.entered_cohort` and in the `student_id` itself, and recomputing would give the same person a different cohort depending on when you asked. `entered_cohort` deliberately has no foreign key to `terms`.

`terms` is the separate academic-term table, unused in Phase 1 and kept for the registration/grading work. `src/services/terms.ts` has no callers yet.

## Lazy env and runtime constraints

`requireEnv()` (`src/lib/env.ts`) throws at access time, not module load, and `src/db/index.ts` exports `db` as a Proxy that constructs the Neon client on first property access. Together these let `next build` run with no secrets present; failures surface at request time instead. Don't hoist env reads or the drizzle client to module scope.

Anything reaching `node:crypto` must run on the Node runtime — hence `export const runtime = "nodejs"` in `src/app/api/auth/[...nextauth]/route.ts` and `src/app/id/page.tsx`. Pages reading the session also need `export const dynamic = "force-dynamic"`.

## Conventions

UI copy and code comments are Japanese; keep new code consistent. Comments cite the academy regulations by article (e.g. 規則第3章第2条第2項) — `policies/` is the authoritative source for those numbers, so check it before changing behavior that a comment ties to a rule.

## policies/

LaTeX sources for the academy's governing documents (`academy-charter`, `academy-regulations`, `guidelines/deans-handbook`). Each has `ja/main.tex` inputting `NN_01.tex` chapter files where `NN` is the chapter number (`00_01.tex` is front matter); `published/` holds released PDFs named `ja_<doc>_version-N.pdf`.

Note: every `main.tex` does `\input{.../preamble.tex}`, but that file is absent from this tree — the documents will not compile as-is.
