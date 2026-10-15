# Content (Sanity)

How the portfolio content is edited, checked and published. Decision record: [ADR-003](../adr/0003-sanity-cms-bilingual-content.md).

## In one paragraph

**Content** (what the owner writes about themselves and their work: hero pitch, jobs, skills, projects, watch notes, contact title, footer, links, SEO) lives in Sanity, project `8i6zw2b7`, dataset `production` (public read). **UI copy** (labels, buttons, aria, errors, filter names) stays in each slice's `ui/messages.ts`. `next build` fetches the published content once, checks every localized field in **both** locales, and writes a static site to `out/`. A missing translation fails the build with a precise report; the previous deploy stays online.

## Where things are

| What                       | Where                                                                                                        |
| -------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Studio (hosted)            | <https://goniti-portfolio.sanity.studio> (opens in the Sanity dashboard)                                     |
| Studio (code)              | `studio/`: separate pnpm workspace package (`portfolio-studio`), schema in `studio/schemaTypes/`             |
| Locale validation (Studio) | `studio/schemaTypes/validation/` (`requireLocales()`, "Missing: fr" preview subtitles)                       |
| Seed                       | `studio/seed/` (`seed.ts`, `documents.ts`, `assets/`)                                                        |
| Query                      | `src/_pages/home/api/queries.ts` (`HOME_CONTENT_QUERY`, raw `[{language, value}]` arrays, no `coalesce`)     |
| Zod schemas + domain types | `src/_pages/home/model/content.ts`                                                                           |
| Fetch, report, fallback    | `src/shared/api/sanity/` (public API: `@/shared/api`)                                                        |
| Generated types            | `src/shared/api/sanity/sanity.types.ts` (TypeGen, committed, drift-checked in CI)                            |
| Content check              | `scripts/content-check.ts` (`pnpm content:check`)                                                            |
| Test/story fixture         | `src/_pages/home/model/content.fixture.ts` (also the seed's source; not kept in sync with Sanity afterwards) |

## Commands

| Command              | What it does                                                                                              |
| -------------------- | --------------------------------------------------------------------------------------------------------- |
| `pnpm content:check` | Fetches the published content, validates it with no fallback, prints `document › field › locale` problems |
| `pnpm studio:dev`    | Runs the Studio locally on <http://localhost:3333>                                                        |
| `pnpm studio:deploy` | Builds and deploys the Studio to `goniti-portfolio.sanity.studio`, and deploys the schema                 |
| `pnpm studio:seed`   | (Re)creates every document from the fixture, with your own Sanity login (`sanity exec --with-user-token`) |
| `pnpm typegen`       | Extracts the schema and regenerates `sanity.types.ts`: run it after changing the schema or the query      |
| `pnpm run deploy`    | Runs the "Deploy to GitHub Pages" workflow on `main` (`gh workflow run`): see [Publishing](#publishing)   |

The CLI uses your login (`pnpm --filter portfolio-studio exec sanity login` once). No token is stored anywhere: the dataset is public, and writes use your own session.

## Seeding

`pnpm studio:seed` writes the fixture's documents to the dataset of `SANITY_STUDIO_DATASET` (default `production`), then runs `pnpm content:check` against that same dataset (it passes `SANITY_PROJECT_ID` and `SANITY_DATASET` to the check, overriding `.env.local`). The seed exits 1 when the check fails.

A Studio draft of a seeded document holds unpublished edits, and would hide the seeded version. So before uploading or writing anything, the seed looks for `drafts.<id>` of every document it writes and, if it finds any, lists them and exits 1. Publish or discard them in the Studio, or run `pnpm studio:seed --discard-drafts` to delete them in the seed's transaction (from `studio/`: `pnpm seed --discard-drafts`; the `seed` script ends with `--`, so `sanity exec` hands the flag to the script).

## Editing content

1. Open the Studio, edit, then **Publish**. Every localized field shows an English and a French slot.
2. Publish is blocked while a localized field misses a language or has a blank value: the field shows `Français (fr) translation is required` or `English (en) is empty`, and lists show `Missing: fr` in the subtitle.
3. Publishing in the Studio does not deploy the site: start the deploy by hand, as described in [Publishing](#publishing).

Rules the Studio enforces (and the build re-checks):

- the hero terminal script has exactly 8 lines (their colours are fixed in code, `TERMINAL_SCRIPT_STYLE`);
- the hero "Title, end" may be empty in a language (French ends on the highlighted part), but both languages must exist;
- a project has a screenshot or a placeholder caption;
- a project's source code and live demo URLs are optional and https-only: the card shows a button for each URL set, and no actions row when neither is;
- at least one job and one project are published; `siteSettings` and `homePage` exist.

One transitional exception: `siteSettings.person` (full name, job title, location) is required in the Studio, but the build still accepts its absence until it is first published (#16). Without it the hero keeps its tagline as the h1, and `pnpm content:check` prints a reminder. Once set, every field of it is checked like the rest, in both locales.

A second transitional exception: `job.sector` (a reference to a `sector` document, #24) is required in the Studio, but the build accepts a job without one until the owner links every job. Such a card shows no sector label and no top line, and its dot and bullets keep the default indigo tint; `pnpm content:check` lists the jobs still without a sector. A sector's name is checked in both locales. The `tint` field that jobs had before sectors may stay in the stored documents: the query no longer reads it.

## Fallback policy

| Context                                         | A missing locale…                                                                                   |
| ----------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `pnpm build` (local, CI, deploy)                | fails the build with the full report. No fallback, ever.                                            |
| `pnpm content:check`                            | prints the report and exits 1.                                                                      |
| `pnpm dev`                                      | shows the other locale prefixed with `[missing fr]` and prints one grouped `console.warn` (server). |
| `pnpm dev`, both locales missing / other errors | throws, like the build.                                                                             |
| Unit tests, Storybook                           | never fetch: they render `HOME_CONTENT_FIXTURE`.                                                    |

Example report:

```text
Invalid content: 3 problem(s). Fix them in the Studio, then publish:
  - homePage "homePage" › hero › badge › fr: missing translation
  - job "job-pulselife-vue" › achievements[1] › text › en: empty translation
  - project "project-meeple" › description › fr: missing translation
```

## Changing the content model

1. A value or rule both sides must agree on (a locale, a tint, a category, what makes a localized field complete) lives in `packages/content-model/` (`portfolio-content-model`, ADR-004), never in `studio/` or `src/`. A new value needs its Studio label (`studio/schemaTypes/locales.ts`, `categories.ts`: `pnpm typecheck` fails without it); a new kind of `LocaleProblem` needs a message on each side (`toStudioError` in `studio/schemaTypes/validation/localeMessages.ts`, `siteMessage` in `src/shared/api/sanity/localized.ts`).
2. Edit `studio/schemaTypes/` (a new localized field uses `internationalizedArrayString`/`Text` with `validation: requireLocales()`; a list of localized lines uses `localizedLine`/`localizedParagraph`, since Sanity arrays cannot hold arrays).
3. Edit the query (`src/_pages/home/api/queries.ts`) and the zod schema (`src/_pages/home/model/content.ts`, `localizedString()` / `optionalLocalizedString()`). Never `coalesce` across locales.
4. `pnpm typegen`, then `pnpm typecheck` (the type-level drift test in `content.test.ts` fails if the zod input no longer accepts the query result).
5. `pnpm studio:deploy`, publish the new fields in the Studio, then `pnpm content:check`.
6. Commit `sanity.types.ts`.

## Testing the failure path

Never on `production`. Create a throwaway dataset, seed it, break a document through the API (which bypasses Studio validation), then check:

```bash
cd studio
pnpm exec sanity dataset create development --visibility public
SANITY_STUDIO_DATASET=development pnpm exec sanity exec seed/seed.ts --with-user-token
# break a document, e.g. with a script using getCliClient(): patch.unset(['description[language=="fr"]'])
cd ..
SANITY_DATASET=development pnpm content:check   # exit 1, report
SANITY_DATASET=development pnpm build           # fails with the same report
cd studio && pnpm exec sanity dataset delete development --force
```

## Publishing

The site is a static export: a publish in the Studio reaches the site only after the **Deploy to GitHub Pages** workflow (`deploy.yml`) rebuilds it. You start that workflow by hand.

1. Edit and **Publish** in the Studio.
2. Start the deploy, either way:
   - from the repository, with an authenticated `gh` CLI (`gh auth login` once):

     ```bash
     pnpm run deploy   # gh workflow run deploy.yml --ref main
     gh run watch      # pick the run, follow it to the end
     ```

     Type `pnpm run deploy`, not `pnpm deploy`: `pnpm deploy` is a built-in pnpm command and never reaches the script.

   - or from GitHub: <https://github.com/goniti/portfolio/actions/workflows/deploy.yml> → **Run workflow** → branch `main`.

3. The site updates 2 to 4 minutes later.

The deploy runs `pnpm content:check` first. Invalid content, for example a missing French translation, fails the run with one line per problem; the current site stays online. Fix it in the Studio, publish, and deploy again. `deploy.yml` cancels an in-progress deploy when a newer one starts, so only the latest run deploys.

A Sanity webhook could start the deploy on publish later: `deploy.yml` still listens for the `sanity-content-published` `repository_dispatch` event, and ADR-003 ("Configuration and secrets") specifies the webhook.
