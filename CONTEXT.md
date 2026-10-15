# Glossary — my-portfolio

Reference business vocabulary. Agents and humans use **these terms, not synonyms**. A concept missing from here signals a gap to fill, or an invented term.

| Term                | Definition                                                                                                                                                                                                          |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Content             | What the owner writes about themselves and their work (hero pitch, jobs, skills, projects, watch notes, contact title, footer, links, SEO). Edited in Sanity, in both locales, and fetched at build time (ADR-003). |
| UI copy             | What the interface says to operate itself (labels, buttons, aria, errors, glyphs, eyebrows, filter names). Lives in code, in each slice's `ui/messages.ts`.                                                         |
| Locale              | One of the site languages, `en` (default) or `fr`. Every localized content field must exist in both.                                                                                                                |
| Missing translation | A localized field without a value in one locale. Blocks Publish in the Studio and fails the build.                                                                                                                  |
| Studio              | The Sanity editing app (`studio/`, hosted at `goniti-portfolio.sanity.studio`) where the content is written.                                                                                                        |
| Job                 | One position of the career timeline (company, sector, summary, role, dates, achievements).                                                                                                                          |
| Sector              | The industry a job belongs to ("MedTech", "Public affairs & influence"). A Sanity document with a localized name and a tint; jobs of the same sector share its label and colour.                                    |
| Project             | A piece of work shown as a card in "Projects".                                                                                                                                                                      |
| Watch note          | A short tech-watch article shown in "AI & Tech Watch".                                                                                                                                                              |

<!-- ADAPT: complete the glossary from the business domain (entities, roles, states, actions); one row per term, terms in the singular. -->

## Terms to avoid

| Avoid                                    | Use                                     |
| ---------------------------------------- | --------------------------------------- |
| "messages" or "copy" for Sanity text     | content                                 |
| "content" for labels in `messages.ts`    | UI copy                                 |
| "language" in code (outside Sanity data) | locale (Sanity stores it as `language`) |
| "CMS page", "admin"                      | Studio                                  |
