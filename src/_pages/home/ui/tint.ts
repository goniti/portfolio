import { tv } from 'tailwind-variants';

/**
 * Text colour of a brand tint, darker in the light theme to keep 4.5:1. Dots use it with
 * `bg-current` (and `glow-current` for a halo), so one variant drives fill, glow and label colour.
 */
export const tintVariants = tv({
  variants: {
    tint: {
      indigo: 'text-tint-label-indigo',
      cyan: 'text-tint-label-cyan',
      violet: 'text-tint-label-violet',
      emerald: 'text-tint-label-emerald',
      sky: 'text-tint-label-sky',
      amber: 'text-tint-label-amber',
    },
  },
});
