import { tv } from 'tailwind-variants';

/** Lit once the last card is open; always lit in the plain list, where the rail is fully drawn. */
const tailVariants = tv({
  base: 'timeline-tail pointer-events-none absolute left-2.25 h-40 w-0.5 shadow-timeline-tail transition-opacity duration-500',
  variants: {
    lit: {
      true: 'opacity-100',
      false: 'opacity-0',
    },
  },
});

export interface TimelineRailProps {
  /** The last card is open: the run-out past it glows. */
  lit: boolean;
}

/**
 * The decorative rail left of the cards: a base line from the first card heading to the last,
 * the gradient fill the scroll draws over it, and a glowing run-out. Its geometry comes from the
 * CSS variables the timeline hooks write on the panel (`--rail-*`).
 */
export function TimelineRail({ lit }: TimelineRailProps) {
  return (
    <>
      <span
        aria-hidden="true"
        className="timeline-rail pointer-events-none absolute left-2.25 w-0.5 rounded-xs"
      />
      <span
        aria-hidden="true"
        className="timeline-fill pointer-events-none absolute left-2.25 w-0.5 rounded-xs shadow-progress"
      />
      <span aria-hidden="true" className={tailVariants({ lit })} />
    </>
  );
}
