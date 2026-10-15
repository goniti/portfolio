# ADR-005 — `motion` hooks for scroll-driven animation

- **Date:** 2026-10-15
- **Status:** `accepted` (implemented 2026-10-15, issue #27)
- **Deciders:** Carlos Gonzalez Lo Vullo (owner, issue #27), react-feature-builder agent

## Context

Issue #27 turns the Experience section into the owner's pinned timeline (mockup `Portfolio v2`, variant A): while the page scrolls through a tall track, a sticky panel opens a window of job cards in turn and a rail fills continuously towards the next job.

The mockup drives it with a `requestAnimationFrame` loop that measures the DOM every frame and a `setState` on every scroll event. The site has no animation library: its motion is CSS (`REVEAL`) and small hooks writing CSS variables (scroll progress, magnet, cursor).

Constraints: a client bundle budget (`pnpm size`, 250 kB brotli; 224 kB before this change), Lighthouse CI on mobile, no React re-render per scroll frame, `prefers-reduced-motion` respected.

## Options considered

### Option A — Hand-written scroll hook

A passive `scroll` listener plus a `ResizeObserver`, writing CSS variables, like `useScrollSpy`. No dependency. Cons: re-implements scroll-progress tracking against a target (offsets, resize, scroll containers), frame batching and derived values, which `motion` already does and tests.

### Option B — `motion` with its `motion` components

`<motion.div style={{ scaleY }}>`. Pros: idiomatic. Cons: the `motion` component pulls the animation and gesture features (tens of kB); `LazyMotion` + `m` trims it, but the component core still ships.

### Option C — `motion` hooks only

`useScroll({ target, offset: ['start start', 'end end'] })`, `useTransform`, `useMotionValueEvent`. MotionValues are mirrored into CSS variables (`useMotionCssVariable` in `src/shared/lib/motion`), read by Tailwind utilities in `app/globals.css`; React state changes only when the step changes.

## Decision

**Chosen option: C.** The issue asks for `motion` (`motion/react`). The hooks alone cover the need at the smallest cost, and the CSS-variable bridge is the pattern the site already uses for its other scroll effects.

Measured on the static export (`pnpm build`), all browser scripts:

| | gzip | brotli (`pnpm size`) |
| --- | --- | --- |
| Before | 261.4 KB | 224.35 kB |
| After | 271.2 KB | 232.75 kB |
| Delta | +9.8 KB | +8.4 kB |

The four `motion` hooks bundled alone weigh 21.7 KB minified, 8.5 KB gzip: the dependency is most of the delta, the timeline code the rest.

## Consequences

- **Positive:** scroll-driven values never re-render React; the step maths is a pure, tested module (`scrollSteps.ts`); further scroll effects reuse `useScrollSteps` and `useMotionCssVariable` at no extra cost.
- **Negative / accepted trade-offs:** +8.4 kB brotli (budget left: 17 kB). The `main` element clips with `overflow-clip` instead of `overflow-hidden`, so `position: sticky` works inside it.
- **Constraints introduced:** import from `motion/react` only, hooks only; a `motion`/`m` component needs a new measurement and a decision here first.
