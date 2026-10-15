import { Button } from 'goniui';
import type { Tint } from 'portfolio-content-model';
import { tv } from 'tailwind-variants';
import type { TimelineCardState } from '../../model/useJobTimeline';
import { tintVariants } from '../tint';

/** The dot itself, in the job's sector tint (`text-*`, read through `currentColor`). */
const dotVariants = tv({
  base: 'block rounded-full border-2 transition-all duration-400 ease-spring group-hover:scale-125',
  variants: {
    state: {
      open: 'glow-current-ring size-4.5 border-current bg-current',
      past: 'size-3.5 border-current bg-current/35',
      future: 'size-3.5 border-border-strong bg-background group-hover:border-current',
      listed: 'glow-current-lg size-4 border-current bg-background',
    },
  },
});

/** Centred on the card heading (`--dot-y`) and on the rail, left of the card. */
const ON_RAIL = 'timeline-dot absolute -translate-y-1/2';

export interface TimelineDotProps {
  state: TimelineCardState;
  tint: Tint;
  /** Accessible name of the dot button: the job it scrolls to. */
  label: string;
  onOpen: () => void;
}

/**
 * The job's mark on the rail: a 44px button scrolling to its card while the timeline is pinned,
 * a decorative dot in the plain list.
 */
export function TimelineDot({ state, tint, label, onOpen }: TimelineDotProps) {
  const tintClass = tintVariants({ tint });
  if (state === 'listed') {
    return (
      <span
        aria-hidden="true"
        className={dotVariants({ state, className: `${tintClass} ${ON_RAIL} -left-8.5` })}
      />
    );
  }

  return (
    <Button
      variant="unstyled"
      size="none"
      onClick={onOpen}
      onFocus={state === 'open' ? undefined : onOpen}
      className={`group ${ON_RAIL} -left-12 z-10 grid size-11 place-items-center rounded-full`}
    >
      <span aria-hidden="true" className={dotVariants({ state, className: tintClass })} />
      <span className="sr-only">{label}</span>
    </Button>
  );
}
