/** Position and shape of the cursor follower, in viewport pixels. */
export interface CursorShape {
  x: number;
  y: number;
  width: number;
  height: number;
  radius: number;
}

export interface CursorPoint {
  x: number;
  y: number;
}

/**
 * What the follower looks like: a dot, a ring over large targets, a pill wrapping small ones,
 * an outline tracing a card that opted in, or a snug outline around a control inside it.
 */
export type CursorMode = 'dot' | 'ring' | 'magnet' | 'card' | 'target';

/** Damped spring integrated at a fixed 60 fps step. */
export const CURSOR_SPRING = { stiffness: 700, damping: 35, mass: 1, step: 1 / 60 } as const;

export const DOT_SIZE = 16;
export const RING_SIZE = 44;
/** Gap between a wrapped target and the follower outline. */
export const MAGNET_PADDING = 4;
/** Gap between a wrapped card and its outline: a little wider, the card is larger. */
export const CARD_PADDING = 6;
/** How far the pill leans towards the pointer, per axis. */
const MAGNET_PULL = { x: 0.08, y: 0.12 } as const;
/** Targets larger than this get the ring instead of the wrapping pill. */
const MAGNET_MAX = { width: 360, height: 72 } as const;
export const INTERACTIVE_SELECTOR = 'a,button,input,textarea,[data-cursor]';
/**
 * Spread on an element that must always be wrapped by the pill, whatever its size
 * (a full-width call to action keeps the same cursor reaction as a compact one).
 */
export const MAGNET_CURSOR_TARGET = { 'data-cursor': 'magnet' } as const;
/**
 * Spread on a card the follower must outline whole, whatever its size: the outline matches
 * the card's corners and holds still (no lean). Controls inside it keep the card outlined,
 * except those opting into the pill with `MAGNET_CURSOR_TARGET`.
 */
export const CARD_CURSOR_TARGET = { 'data-cursor': 'card' } as const;
/**
 * Spread on a small control that keeps its own snug outline, even inside a card (a copy
 * button in a contact row): it wins over the card and holds still (no lean).
 */
export const OWN_CURSOR_TARGET = { 'data-cursor': 'target' } as const;
const CARD_SELECTOR = `[data-cursor="${CARD_CURSOR_TARGET['data-cursor']}"]`;
const TEXT_ENTRY_TAGS = new Set(['INPUT', 'TEXTAREA']);

const SHAPE_KEYS = ['x', 'y', 'width', 'height', 'radius'] as const;

export const ZERO_SHAPE: CursorShape = { x: 0, y: 0, width: 0, height: 0, radius: 0 };

/** The resting shape centred on the pointer. */
export function shapeAround(point: CursorPoint, size: number): CursorShape {
  return {
    x: point.x - size / 2,
    y: point.y - size / 2,
    width: size,
    height: size,
    radius: size / 2,
  };
}

/** Advances the spring one step towards `target`; returns the new position and velocity. */
export function stepSpring(
  position: CursorShape,
  velocity: CursorShape,
  target: CursorShape,
): { position: CursorShape; velocity: CursorShape } {
  const { stiffness, damping, mass, step } = CURSOR_SPRING;
  const nextPosition = { ...position };
  const nextVelocity = { ...velocity };
  for (const key of SHAPE_KEYS) {
    const force = stiffness * (target[key] - position[key]) - damping * velocity[key];
    nextVelocity[key] = velocity[key] + (force / mass) * step;
    nextPosition[key] = position[key] + nextVelocity[key] * step;
  }
  return { position: nextPosition, velocity: nextVelocity };
}

export interface HoverTarget {
  mode: CursorMode;
  /** The element to wrap, in `magnet`, `card` and `target` modes only. */
  element: Element | null;
}

/** Decides how the follower reacts to the element under the pointer. */
export function classifyHoverTarget(target: EventTarget | null): HoverTarget {
  const interactive = target instanceof Element ? target.closest(INTERACTIVE_SELECTOR) : null;
  if (!interactive) return { mode: 'dot', element: null };

  const optIn = interactive.getAttribute('data-cursor');
  if (optIn === OWN_CURSOR_TARGET['data-cursor']) return { mode: 'target', element: interactive };
  if (optIn === MAGNET_CURSOR_TARGET['data-cursor'])
    return { mode: 'magnet', element: interactive };
  // A plain control inside a card (a row's link, a copy button) keeps the card outlined.
  const card = interactive.closest(CARD_SELECTOR);
  if (card) return { mode: 'card', element: card };
  const rect = interactive.getBoundingClientRect();
  const isSmall =
    rect.width <= MAGNET_MAX.width &&
    rect.height <= MAGNET_MAX.height &&
    !TEXT_ENTRY_TAGS.has(interactive.tagName);
  return isSmall ? { mode: 'magnet', element: interactive } : { mode: 'ring', element: null };
}

/**
 * Whether the follower jumps straight to its next shape instead of springing there: leaving an
 * outline (a card, or a control's own target) for another style would otherwise draw that
 * style (a filled dot or pill) on the outline's shape while it shrinks. Entering an outline,
 * moving from card to card or target to target, and going from a target back to its card
 * stay springy.
 */
export function snapsOnExit(from: CursorMode, to: CursorMode): boolean {
  if (from === 'card') return to !== 'card';
  if (from === 'target') return to !== 'card' && to !== 'target';
  return false;
}

/** Modes that trace an element, falling back to the dot once it leaves the page. */
export function wrapsElement(mode: CursorMode): boolean {
  return mode === 'magnet' || mode === 'card' || mode === 'target';
}

/** The shape the follower springs towards for the current pointer and hover target. */
export function targetShape(
  pointer: CursorPoint,
  hover: { mode: CursorMode; rect: DOMRect | null; borderRadius: number },
): CursorShape {
  if (hover.mode === 'card' && hover.rect) {
    const { rect } = hover;
    return {
      x: rect.left - CARD_PADDING,
      y: rect.top - CARD_PADDING,
      width: rect.width + CARD_PADDING * 2,
      height: rect.height + CARD_PADDING * 2,
      radius: hover.borderRadius + CARD_PADDING,
    };
  }
  if (hover.mode === 'target' && hover.rect) {
    const { rect } = hover;
    const height = rect.height + MAGNET_PADDING * 2;
    return {
      x: rect.left - MAGNET_PADDING,
      y: rect.top - MAGNET_PADDING,
      width: rect.width + MAGNET_PADDING * 2,
      height,
      radius: Math.min(hover.borderRadius + MAGNET_PADDING, height / 2),
    };
  }
  if (hover.mode === 'magnet' && hover.rect) {
    const { rect } = hover;
    const height = rect.height + MAGNET_PADDING * 2;
    return {
      x: rect.left - MAGNET_PADDING + (pointer.x - (rect.left + rect.width / 2)) * MAGNET_PULL.x,
      y: rect.top - MAGNET_PADDING + (pointer.y - (rect.top + rect.height / 2)) * MAGNET_PULL.y,
      width: rect.width + MAGNET_PADDING * 2,
      height,
      radius: Math.min(hover.borderRadius + MAGNET_PADDING, height / 2),
    };
  }
  return shapeAround(pointer, hover.mode === 'ring' ? RING_SIZE : DOT_SIZE);
}
