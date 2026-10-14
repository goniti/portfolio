# Frontend rules

React 19 · strict TypeScript · **Tailwind CSS** · UI library: **goniui**.
They apply to every TSX change; a reviewer sends back any code that breaks them.

## 1. The UI library first

The design system is **goniui** (npm): ~50 accessible components on Radix primitives, black & white by default. It is the single source of truth for generic UI.

1. Check what goniui exports before writing any component (`pnpm storybook` lists the app's stories; the goniui catalogue, atoms to organisms, is at https://goniti.github.io/goniui/): reuse it, never re-create one of its components locally.
2. Simple components come from the root (`import { Button, Flex, Text } from 'goniui'`); compound ones from their subpath, as a namespace (`import * as Dialog from 'goniui/dialog'`, `goniui/dropdown-menu`, `goniui/tabs`, `goniui/toast`, `goniui/form`, `goniui/data-table`…).
3. Layout and text go through `Flex`, `Grid`, `Box` and `Text` (`variant`, `tone`) rather than raw `div`/`p` with utility classes.
4. **Extend, never fork**: a new look for one of its components (a call-to-action button, a round icon button), reused in several places, is a wrapper in `src/shared/ui/` at the level of the component it wraps (`cta-button.tsx`): it renders the goniui component (props passed through) with its variants through `tv`, passed to the goniui component through `className`; the app imports the wrapper. A one-off adjustment is a `className` at the call site, no wrapper. Never copy the component's code; a variant every project needs is proposed to goniui as well.
5. App-specific components (that know a business noun or fetch data) are composed on top of goniui in the `ui` segment of their slice (entity, feature, widget or page); a generic one goniui lacks lives in `src/shared/ui/` at its Atomic Design level, follows the same conventions and gets a story (`<Name>.stories.tsx`).
6. Re-skin through the goniui tokens, overridden in `app/globals.css` (`--primary-400`, `--primary-foreground`, `--background`, `--foreground`…); a `.dark` class on `<html>` switches to the dark theme.

Placement litmus test: does it name a business noun or fetch data? **Yes** → the `ui` segment of its slice (entity, feature, widget or page). **No** → `src/shared/ui/`, at its Atomic Design level (atoms, molecules, organisms, templates). Folders and imports: [`architecture.md`](architecture.md).

## 2. Styling

- **Tailwind utilities only**: no CSS file per component, no CSS Modules, no inline `style` (except a truly dynamic value, passed through a CSS variable).
- **Tokens only**: colors, radii and fonts come from the tokens of `app/globals.css` (`bg-primary-400`, `text-foreground-muted`, `bg-surface`, `border-border`, `rounded-md`). Never a raw color (`#fff`, `bg-[#ff0]`), never an arbitrary value (`p-[13px]`) when the scale has a step. A missing token is added to `app/globals.css` (`:root`, `.dark`, `@theme inline`), then used.
- **Variants through `tv`**: `tv({ base, variants, defaultVariants })`, props typed with `VariantProps<typeof xVariants>`, `className` merged last. A `cn(cond && '…')` chain choosing between style sets according to a prop is a variant: use `tv`. `cn()` only merges a passed `className` or a one-off toggle; it comes from `goniui` (`import { cn } from 'goniui'`), never a local helper.
- Class order is Prettier's job (`prettier-plugin-tailwindcss`): do not sort by hand.

```tsx
// ❌ hand-rolled variant map, raw color
const className = isDanger ? 'bg-[#e11d48] text-white' : 'bg-gray-900 text-white';

// ✅ variant from the design system
const button = <Button variant="destructive">{formMessages.delete}</Button>;
```

## 3. No useless DOM nodes

A wrapper element must earn its place: it carries layout, styling or semantics.

```tsx
// ❌ throwaway div to space a single child
export function Settings({ tabs }: SettingsProps) {
  return (
    <section>
      <h2>{settingsMessages.title}</h2>
      <div className="mt-7">
        <Tabs items={tabs} />
      </div>
    </section>
  );
}

// ✅ the parent's flex/grid `gap` owns the spacing
export function Settings({ tabs }: SettingsProps) {
  return (
    <section className="flex flex-col gap-7">
      <h2>{settingsMessages.title}</h2>
      <Tabs items={tabs} />
    </section>
  );
}
```

- Spacing through a `flex`/`grid` parent with `gap`, not per-child margin wrappers.
- Grouping siblings without a DOM node: a Fragment `<>…</>`, never a `div`.
- A `div > div` chain where one element would do is collapsed.

## 4. Composition over configuration

- UI comes in as `children` or slots; props carry **data and behavior** (`items`, `onSelect`, `variant`). A boolean toggling a chunk of markup (`showHeader`, `withFooter`) is a slot or a subcomponent.
- Part-of-a-whole UI is a **compound component**, one level deep: a folder with one file per subcomponent (`CardHeader.tsx`, `CardBody.tsx`), named after the component it exports.
- Assembly through named exports and a namespace import, never `Object.assign` nor `Card.Header = …` (both defeat tree-shaking):

```ts
// card/index.ts
export { CardRoot as Root } from './CardRoot';
export { CardHeader as Header } from './CardHeader';
```

```ts
// shared/ui/molecules/index.ts: the level exposes the namespace (no `export *`)
import * as Card from './card';

export { Card };
```

```tsx
import { Card } from '@/shared/ui/molecules';

export function ProfileCard({ user }: ProfileCardProps) {
  return (
    <Card.Root>
      <Card.Header>{user.name}</Card.Header>
    </Card.Root>
  );
}
```

- A field with a stable identity (email, password…) is a **preset component** sealing its label, `type`, `autoComplete` and accessibility once, instead of being re-specified at every call site.

## 5. Readable and predictable

- **The hook does the dirty work, the view reads**: validation, formatting, sanitization and integration quirks live in a hook returning view-ready values. No regex, sanitization or `dangerouslySetInnerHTML` in JSX.
- Guard clauses over nested `if/else`; magic values named (`const TOAST_DURATION_MS = 4500`).
- State scoped as narrowly as possible; abstraction at the 3rd occurrence, not before.
- **No single-letter or cryptic names**, callbacks and tests included: `items.map((item) => …)`, `rowIndex`, never `i`, `x`, `el`, `c`.

## 6. No hard-coded copy

Every label, title, placeholder and message lives in the slice's `ui/messages.ts` (see `src/_pages/home/ui/hero/messages.ts`); content the owner edits (projects, jobs, notes…) comes from Sanity instead (`CONTEXT.md`, ADR-003), until an i18n library replaces it with locale files. `src/shared/ui/` components take their copy through props or children. Tests may use literals.

## 7. TypeScript and data

- Named exports only for components; a props interface above each one.
- React 19: `ref` is a regular prop, no `forwardRef`; the global `JSX` namespace is gone (`ReactNode`, `ReactElement` from `react`).
- No `any` (use `unknown` and narrow), no `as X` without proof, no `enum` (`as const`).
- Server state goes through a query library (TanStack Query): never `useState` + `useEffect` to fetch. A page handles its **loading, error and empty** states.
- Forms: validation in a schema (zod) wired with react-hook-form; fields read their error from the form context, the view has no `{errors.x && …}` branches.

## 8. Accessibility (baseline)

- Semantic HTML first (`<button>`, `<nav>`, `<ul>`, headings in order); ARIA only to fill a gap.
- Every interactive element is keyboard-reachable and has an accessible name; `aria-label` on icon-only buttons; decorative icons and images get `aria-hidden` / `alt=""`.
- Form fields: a unique id (`useId`) linking label and control, `aria-invalid` when in error, `aria-describedby` pointing at the error message. A color alone never signals an error.

## 9. Before declaring a UI task done

- `pnpm typecheck`
- `pnpm lint`
- `pnpm lint:arch`
- `pnpm test`
- The UI library was searched before creating a component; no useless wrapper; composition over boolean props.
- Tailwind utilities and tokens only; variants through `tv`.
- No hard-coded copy, no single-letter names, accessible names everywhere.
