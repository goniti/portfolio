import { REDUCED_MOTION_QUERY } from '../media';

const REVEAL_DIRECTIONS = ['up', 'down', 'left', 'right', 'fade'] as const;

/** Where an element enters from: below, above (`down`), either side, or in place (`fade`). */
export type RevealDirection = (typeof REVEAL_DIRECTIONS)[number];

/**
 * How the children of a staggered group enter: all from one direction, one after the other;
 * `rows`, rising from below a row at a time; or `columns`, where each child enters from the
 * side of the container it sits on (left column from the left, right column from the right,
 * middle ones from below) and every row plays at once.
 */
export type StaggerPattern = RevealDirection | 'columns' | 'rows';

export interface RevealOptions<From extends string> {
  /** Defaults to `up`. */
  from?: From;
  /** Adds a subtle zoom-in to the entrance. */
  zoom?: boolean;
}

export interface RevealAttributes {
  'data-reveal': 'self' | 'stagger';
  'data-reveal-from': StaggerPattern;
  'data-reveal-zoom'?: true;
}

function revealAttributes(
  kind: RevealAttributes['data-reveal'],
  from: StaggerPattern,
  zoom: boolean,
): RevealAttributes {
  return zoom
    ? { 'data-reveal': kind, 'data-reveal-from': from, 'data-reveal-zoom': true }
    : { 'data-reveal': kind, 'data-reveal-from': from };
}

/** Markers spread on an element so it enters by itself once scrolled into view. */
export function reveal({ from = 'up', zoom = false }: RevealOptions<RevealDirection> = {}) {
  return revealAttributes('self', from, zoom);
}

/** Markers spread on a container so its direct children enter one after the other. */
export function revealStagger({ from = 'up', zoom = false }: RevealOptions<StaggerPattern> = {}) {
  return revealAttributes('stagger', from, zoom);
}

/**
 * Ready-made markers. Styles live in `app/globals.css` (`[data-reveal]`); nothing is hidden
 * until the reveal arms, so content stays visible without JavaScript.
 */
export const REVEAL = {
  self: reveal(),
  up: reveal(),
  down: reveal({ from: 'down' }),
  left: reveal({ from: 'left' }),
  right: reveal({ from: 'right' }),
  fade: reveal({ from: 'fade' }),
  zoom: reveal({ from: 'fade', zoom: true }),
  stagger: revealStagger(),
  columns: revealStagger({ from: 'columns' }),
  rows: revealStagger({ from: 'rows' }),
} as const;

const REVEAL_SELECTOR = '[data-reveal]';
const STATE_ATTRIBUTE = 'data-reveal-state';
const FROM_ATTRIBUTE = 'data-reveal-from';
/** Children past this rank share the last delay, so long lists never lag behind. */
export const MAX_STAGGER_INDEX = 8;
/** Reveal a little before the element reaches the bottom edge. */
const VIEWPORT_MARGIN = '0px 0px -8% 0px';
/** A child whose centre sits in the outer third of its container enters from that side. */
const SIDE_THRESHOLD = 1 / 3;
/** Overlap (px) below which two boxes count as separate rows (borders, rounding). */
const ROW_TOLERANCE = 2;

export interface HorizontalBox {
  left: number;
  width: number;
}

export interface VerticalBox {
  top: number;
  height: number;
}

export interface LaidOutBox extends HorizontalBox, VerticalBox {}

export interface ChildEntrance {
  from: RevealDirection;
  rank: number;
}

/** The side a child enters from, after where its centre falls across its container. */
export function columnDirection(child: HorizontalBox, container: HorizontalBox): RevealDirection {
  if (container.width <= 0) return 'up';
  const centreRatio = (child.left + child.width / 2 - container.left) / container.width;
  if (centreRatio < SIDE_THRESHOLD) return 'left';
  if (centreRatio > 1 - SIDE_THRESHOLD) return 'right';
  return 'up';
}

/**
 * The row of each box (0 for the top one): a box starting before the current row ends joins
 * it, so children aligned to the bottom or centre of a row still share it.
 */
export function rowRanks(boxes: readonly VerticalBox[]): number[] {
  const order = boxes
    .map((box, boxIndex) => ({ box, boxIndex }))
    .sort((first, second) => first.box.top - second.box.top);
  const ranks: number[] = new Array<number>(boxes.length).fill(0);
  let row = -1;
  let rowBottom = Number.NEGATIVE_INFINITY;
  for (const { box, boxIndex } of order) {
    if (box.top >= rowBottom - ROW_TOLERANCE) {
      row += 1;
      rowBottom = box.top + box.height;
    } else {
      rowBottom = Math.max(rowBottom, box.top + box.height);
    }
    ranks[boxIndex] = row;
  }
  return ranks;
}

/**
 * The entrance of each child of a staggered group, read from the layout at play time so it
 * follows the breakpoints: `columns` gives each child the side it sits on and one rank per
 * row (a single column falls back to `up`, one child per rank); `rows` sends every child up,
 * one rank per row; a plain direction ranks the children in order. Ranks are capped at `MAX_STAGGER_INDEX`.
 */
export function planStagger(
  pattern: StaggerPattern,
  children: readonly LaidOutBox[],
  container: HorizontalBox,
): ChildEntrance[] {
  const capped = (rank: number) => Math.min(rank, MAX_STAGGER_INDEX);
  if (pattern !== 'columns' && pattern !== 'rows') {
    return children.map((_child, childIndex) => ({ from: pattern, rank: capped(childIndex) }));
  }
  const rows = rowRanks(children);
  return children.map((child, childIndex) => ({
    from: pattern === 'rows' ? 'up' : columnDirection(child, container),
    rank: capped(rows[childIndex] ?? childIndex),
  }));
}

function isInViewport(element: Element): boolean {
  const rect = element.getBoundingClientRect();
  return rect.top < window.innerHeight && rect.bottom > 0;
}

function canReveal(): boolean {
  if (typeof IntersectionObserver === 'undefined') return false;
  const prefersReducedMotion =
    typeof window.matchMedia === 'function' && window.matchMedia(REDUCED_MOTION_QUERY).matches;
  return !prefersReducedMotion;
}

const STAGGER_PATTERNS: readonly string[] = [...REVEAL_DIRECTIONS, 'columns', 'rows'];

function isStaggerPattern(value: string | null): value is StaggerPattern {
  return value !== null && STAGGER_PATTERNS.includes(value);
}

/** Gives each child of a staggered group its direction and delay rank, from the live layout. */
function planChildren(container: Element) {
  const children = Array.from(container.children).filter(
    (child): child is HTMLElement => child instanceof HTMLElement,
  );
  const declared = container.getAttribute(FROM_ATTRIBUTE);
  const pattern = isStaggerPattern(declared) ? declared : 'up';
  const entrances = planStagger(
    pattern,
    children.map((child) => child.getBoundingClientRect()),
    container.getBoundingClientRect(),
  );
  children.forEach((child, childIndex) => {
    const entrance = entrances[childIndex];
    if (!entrance) return;
    child.setAttribute(FROM_ATTRIBUTE, entrance.from);
    child.style.setProperty('--reveal-index', String(entrance.rank));
  });
}

/** Plays the entrance: plans the children of a staggered group, then flips the state. */
function show(element: Element) {
  if (element.getAttribute('data-reveal') === 'stagger') planChildren(element);
  element.setAttribute(STATE_ATTRIBUTE, 'shown');
}

/**
 * Arms every marked element below the fold of `root`: hides it, then plays its entrance the
 * first time it enters the viewport. Elements already on screen are left untouched, and
 * nothing happens without `IntersectionObserver` or with reduced motion, so content is never
 * stuck invisible. Returns a cleanup that disconnects and un-hides what never revealed.
 */
export function armScrollReveal(root: ParentNode = document): () => void {
  if (!canReveal()) return () => {};

  const pending = Array.from(root.querySelectorAll(REVEAL_SELECTOR)).filter(
    (element) => !element.hasAttribute(STATE_ATTRIBUTE) && !isInViewport(element),
  );
  if (pending.length === 0) return () => {};

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        show(entry.target);
      }
    },
    { rootMargin: VIEWPORT_MARGIN },
  );
  for (const element of pending) {
    element.setAttribute(STATE_ATTRIBUTE, 'pending');
    observer.observe(element);
  }

  return () => {
    observer.disconnect();
    for (const element of pending) {
      if (element.getAttribute(STATE_ATTRIBUTE) === 'pending') {
        element.removeAttribute(STATE_ATTRIBUTE);
      }
    }
  };
}
