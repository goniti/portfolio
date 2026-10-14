# Architecture: Feature-Sliced Design + Atomic Design

These rules decide **where code goes and what it may import**. `pnpm lint:arch` checks them (Steiger, the official FSD linter, then dependency-cruiser) and CI fails on any breach.

- A failure is fixed by **moving the code**, never by disabling a rule or adding an exception in `.dependency-cruiser.cjs` or `steiger.config.js`. A justified exception is an ADR first.
- **No circular imports** at runtime: two modules importing each other, directly or through a chain, are fixed by moving the shared part one level down. Type-only cycles (`import type`) are erased at build time and tolerated.
- Official documentation, written for AI tools: [llms-small.txt](https://feature-sliced.design/llms-small.txt) (abridged) and [llms-full.txt](https://feature-sliced.design/llms-full.txt). Read it before creating a layer or a slice, or when a Steiger message is unclear.

## 1. Layers

Code is split into **layers**, from the most to the least responsible. A layer only imports from the layers **strictly below** it.

| Layer    | Folder                    | Holds                                                                           | Imports from                        |
| -------- | ------------------------- | ------------------------------------------------------------------------------- | ----------------------------------- |
| App      | `src/_app/`               | Entry point, providers, router, global styles: what concerns the whole app      | every layer below                   |
| Pages    | `src/_pages/<page>/`      | One slice per screen, with the blocks only that screen uses                     | widgets, features, entities, shared |
| Widgets  | `src/widgets/<widget>/`   | Large self-sufficient UI blocks **reused** on several pages (header, sidebar)   | features, entities, shared          |
| Features | `src/features/<feature>/` | User interactions **reused** on several pages (add to cart, sign in, like)      | entities, shared                    |
| Entities | `src/entities/<entity>/`  | Business concepts: type, schema, API calls, visual representation (user, order) | shared                              |
| Shared   | `src/shared/`             | No business logic: UI kit, API client, libraries, configuration                 | shared only                         |

Next.js owns `app/` (routes) and `pages/`: the FSD layers are prefixed (`src/_app/`, `src/_pages/`) and a route only re-exports its page:

```tsx
// app/page.tsx
export { HomePage as default } from '@/_pages/home';
```

Only add a layer when it brings value: a new app has `_app`, `_pages` and `shared`. The deprecated `processes` layer is never used.

## 2. Slices, segments and public API

- **Slices** split Pages, Widgets, Features and Entities by business meaning (`entities/user`, `features/add-to-cart`). App and Shared have no slices, only segments.
- **Segments** split a slice by technical purpose: `ui` (components, styles, `messages.ts`), `model` (types, schemas, state, business logic), `api` (requests), `lib` (slice-local helpers), `config` (constants, flags). Never `components`, `hooks`, `types`, `utils`, `helpers`: they say what the code is, not what it is for.
- Every slice exposes a **public API**, its `index.ts`, with named re-exports only (no `export *`). Code outside the slice imports that file and nothing else:

```ts
// ✅ through the public API
import { UserAvatar } from '@/entities/user';

// ❌ reaching into the slice
import { UserAvatar } from '@/entities/user/ui/UserAvatar';
```

- **Inside a slice, imports are relative** (`./ui/UserCard`); **between slices, they go through `@/`**. A file never imports its own slice's `index.ts`: that is how index files create cycles.
- User-facing copy lives in the slice's `ui/messages.ts` (see `src/_pages/home/ui/hero/messages.ts`); content the owner edits (projects, jobs, notes…) comes from Sanity instead (`CONTEXT.md`, ADR-003).

## 3. No cross-imports

Two slices of the same layer never import each other (`features/cart` → `features/product` is forbidden). Pick one of these, in order:

1. **Merge** the slices: if they always change together, they are one slice.
2. **Push the shared logic down** to an entity (`entities/product/model`), used by both features.
3. **Compose from the layer above**: the page renders both and connects them through props, `children` or a render prop.

```tsx
// pages/post/ui/PostPage.tsx: the page connects two features that never know each other
<CommentList comments={comments} renderAuthor={(userId) => <UserAvatar userId={userId} />} />
```

Entities that really reference each other (an order contains products) use the `@x` notation, as a last resort: `entities/product/@x/order.ts` re-exports what `entities/order` may use, imported as `@/entities/product/@x/order`.

## 4. Not everything is a slice

- A block used by **a single page stays in that page** (`src/_pages/home/ui/counter/`). It becomes a feature or a widget when a second page needs it.
- `lint:arch` fails on a slice referenced once or never (`fsd/insignificant-slice`): extracting early is the error, not the reverse.
- Avoid one entity per database table: an entity is a concept the business names.

## 5. `shared/ui`: Atomic Design

The UI kit of `shared/ui` is organized in **Atomic Design** levels. Each level only builds on the levels below it (checked by dependency-cruiser):

| Level     | Folder                     | Holds                                                                              | Imports from                |
| --------- | -------------------------- | ---------------------------------------------------------------------------------- | --------------------------- |
| Atoms     | `src/shared/ui/atoms/`     | Indivisible components: button, input, label, icon, badge                          | atoms                       |
| Molecules | `src/shared/ui/molecules/` | Small groups of atoms with one job: form field (label + input + error), search box | atoms                       |
| Organisms | `src/shared/ui/organisms/` | Generic sections: data table with its toolbar, empty state, navigation bar         | atoms, molecules            |
| Templates | `src/shared/ui/templates/` | Page layouts: regions and slots, no content                                        | atoms, molecules, organisms |

- Atomic Design's _pages_ are the FSD Pages layer. A component that names a business noun or fetches data is **not** an organism: it goes to the `ui` segment of an entity, a feature, a widget or a page.
- Each level has an `index.ts`; consumers import the level, never a file inside it (Steiger allows one level under `shared/ui`):

```ts
import { Button } from '@/shared/ui/atoms';
import { FormField } from '@/shared/ui/molecules';
```

- A compound component is exported as a namespace, with an explicit named export:

```ts
// shared/ui/molecules/index.ts
import * as Card from './card';

export { Card };
```

- goniui already covers atoms to organisms: `shared/ui` only holds what goniui lacks, at the matching level.

## 6. Where does this code go?

1. Generic, no business noun → `shared/` (`ui/<level>`, `api`, `lib/<topic>`, `config`).
2. A business concept, its type or its representation → `entities/<entity>/`.
3. A user action needed on several pages → `features/<feature>/`.
4. A large UI block needed on several pages → `widgets/<widget>/`.
5. Anything else that serves one screen → that page's slice.
6. Wiring for the whole app (providers, router, global styles) → `_app/`.
