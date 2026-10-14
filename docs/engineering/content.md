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

The CLI uses your login (`pnpm --filter portfolio-studio exec sanity login` once). No token is stored anywhere: the dataset is public, and writes use your own session.

## Editing content

1. Open the Studio, edit, then **Publish**. Every localized field shows an English and a French slot.
2. Publish is blocked while a localized field misses a language or has a blank value: the field shows `Français (fr) translation is required` or `English (en) is empty`, and lists show `Missing: fr` in the subtitle.
3. Once the Sanity webhook is set up (below), a publish starts `deploy.yml`; the change is live 2 to 4 minutes later. Until then, run the **Deploy to GitHub Pages** workflow by hand (Actions → Run workflow).

Rules the Studio enforces (and the build re-checks):

- the hero terminal script has exactly 8 lines (their colours are fixed in code, `TERMINAL_SCRIPT_STYLE`);
- the hero "Title, end" may be empty in a language (French ends on the highlighted part), but both languages must exist;
- a project has a screenshot or a placeholder caption;
- at least one job and one project are published; `siteSettings` and `homePage` exist.

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

1. Edit `studio/schemaTypes/` (a new localized field uses `internationalizedArrayString`/`Text` with `validation: requireLocales()`; a list of localized lines uses `localizedLine`/`localizedParagraph`, since Sanity arrays cannot hold arrays).
2. Edit the query (`src/_pages/home/api/queries.ts`) and the zod schema (`src/_pages/home/model/content.ts`, `localizedString()` / `localizedText()` / `optionalLocalizedString()`). Never `coalesce` across locales.
3. `pnpm typegen`, then `pnpm typecheck` (the type-level drift test in `content.test.ts` fails if the zod input no longer accepts the query result).
4. `pnpm studio:deploy`, publish the new fields in the Studio, then `pnpm content:check`.
5. Commit `sanity.types.ts`.

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

## Sanity → GitHub webhook (manual, one time)

A publish should start `deploy.yml` through GitHub's `repository_dispatch`. This needs a GitHub token that only the owner can create. Steps:

1. **Create a fine-grained personal access token** at <https://github.com/settings/personal-access-tokens/new>:
   - Token name: `sanity-portfolio-webhook`; expiration: 1 year (set a reminder to rotate it).
   - Resource owner: `goniti`. Repository access: **Only select repositories** → `goniti/portfolio`.
   - Repository permissions: **Contents: Read and write** (required by `repository_dispatch`; Metadata: Read-only is added automatically). Nothing else.
   - Generate, copy the token (`github_pat_…`). Never commit it.
2. **Check the token** (expects `HTTP 204`, then a new "Deploy to GitHub Pages" run in Actions):

   ```bash
   curl -i -X POST https://api.github.com/repos/goniti/portfolio/dispatches \
     -H "Authorization: Bearer github_pat_…" \
     -H "Accept: application/vnd.github+json" \
     -H "X-GitHub-Api-Version: 2022-11-28" \
     -d '{"event_type":"sanity-content-published"}'
   ```

3. **Create the webhook** at <https://www.sanity.io/manage/project/8i6zw2b7/api/webhooks> → **Create webhook**:
   - Name: `GitHub Pages deploy`.
   - URL: `https://api.github.com/repos/goniti/portfolio/dispatches`.
   - Dataset: `production`.
   - Trigger on: **Create**, **Update**, **Delete**.
   - Filter: `_type in ["siteSettings", "homePage", "job", "project", "watchNote"]`.
   - Projection: `{"event_type": "sanity-content-published", "client_payload": {"id": _id, "op": delta::operation()}}`.
   - Status: enabled. HTTP method: **POST**.
   - HTTP headers: `Authorization: Bearer github_pat_…`, `Accept: application/vnd.github+json`, `X-GitHub-Api-Version: 2022-11-28`.
   - Advanced: **Drafts off**, **Versions off** (only published changes deploy). Secret: leave empty (GitHub does not verify it).
4. **Test it**: fix a typo in the Studio and publish; a "Deploy to GitHub Pages" run starts within seconds (event `repository_dispatch`). The webhook's attempt log in Sanity shows `204`.

The token is visible to anyone who can read the webhook configuration: never share the webhook, and rotate the token when it expires (edit the header in place). `deploy.yml` cancels an in-progress deploy when a newer one starts, so a burst of publishes collapses into one deploy.
