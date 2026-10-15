import { Button } from 'goniui';
import { tv } from 'tailwind-variants';
import type { TimelineCardState } from '../../model/useJobTimeline';

/**
 * The dot itself, in the rail gradient's colour where it sits (`text-rail-gradient`, read through
 * `currentColor`): lit when open, translucent once passed, a grey outline until reached.
 */
const dotVariants = tv({
  base: 'block rounded-full border-2 text-rail-gradient transition-all duration-400 ease-spring group-hover:scale-125',
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
  /** Accessible name of the dot button: the job it scrolls to. */
  label: string;
  onOpen: () => void;
}

/**
 * The job's mark on the rail: a 44px button scrolling to its card while the timeline is pinned,
 * a decorative dot in the plain list.
 */
export function TimelineDot({ state, label, onOpen }: TimelineDotProps) {
  if (state === 'listed') {
    return (
      <span
        aria-hidden="true"
        className={dotVariants({ state, className: `${ON_RAIL} -left-8.5` })}
      />
    );
  }

  // The dot of an open card is no jump target: disabled, full colour (no faded look).
  return (
    <Button
      variant="unstyled"
      size="none"
      disabled={state === 'open'}
      onClick={onOpen}
      onFocus={onOpen}
      className={`group ${ON_RAIL} -left-12 z-10 grid size-11 place-items-center rounded-full disabled:opacity-100`}
    >
      <span aria-hidden="true" className={dotVariants({ state })} />
      <span className="sr-only">{label}</span>
    </Button>
  );
}
