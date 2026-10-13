import { tv } from 'tailwind-variants';

/**
 * Text colour of a brand tint. Dots use it with `bg-current` (and `glow-current` for a halo),
 * so one variant drives fill, glow and label colour.
 */
export const tintVariants = tv({
  variants: {
    tint: {
      indigo: 'text-tint-indigo',
      cyan: 'text-tint-cyan',
      violet: 'text-tint-violet',
      emerald: 'text-tint-emerald',
      sky: 'text-tint-sky',
      amber: 'text-tint-amber',
    },
  },
});
