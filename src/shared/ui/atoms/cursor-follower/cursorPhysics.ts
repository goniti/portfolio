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

/** What the follower looks like: a dot, a ring over large targets, a pill wrapping small ones. */
export type CursorMode = 'dot' | 'ring' | 'magnet';

/** Damped spring integrated at a fixed 60 fps step. */
export const CURSOR_SPRING = { stiffness: 700, damping: 35, mass: 1, step: 1 / 60 } as const;

export const DOT_SIZE = 16;
export const RING_SIZE = 44;
/** Gap between a wrapped target and the follower outline. */
export const MAGNET_PADDING = 4;
/** How far the pill leans towards the pointer, per axis. */
const MAGNET_PULL = { x: 0.08, y: 0.12 } as const;
/** Targets larger than this get the ring instead of the wrapping pill. */
const MAGNET_MAX = { width: 360, height: 72 } as const;
export const INTERACTIVE_SELECTOR = 'a,button,input,textarea,[data-cursor]';
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
  /** The element to wrap, in `magnet` mode only. */
  element: Element | null;
}

/** Decides how the follower reacts to the element under the pointer. */
export function classifyHoverTarget(target: EventTarget | null): HoverTarget {
  const interactive = target instanceof Element ? target.closest(INTERACTIVE_SELECTOR) : null;
  if (!interactive) return { mode: 'dot', element: null };

  const rect = interactive.getBoundingClientRect();
  const isSmall =
    rect.width <= MAGNET_MAX.width &&
    rect.height <= MAGNET_MAX.height &&
    !TEXT_ENTRY_TAGS.has(interactive.tagName);
  return isSmall ? { mode: 'magnet', element: interactive } : { mode: 'ring', element: null };
}

/** The shape the follower springs towards for the current pointer and hover target. */
export function targetShape(
  pointer: CursorPoint,
  hover: { mode: CursorMode; rect: DOMRect | null; borderRadius: number },
): CursorShape {
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
