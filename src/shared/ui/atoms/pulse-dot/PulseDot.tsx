import type { HTMLAttributes } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

export const pulseDotVariants = tv({
  base: 'inline-block flex-none rounded-full bg-tint-emerald motion-safe:animate-pulse-ring',
  variants: {
    size: {
      sm: 'size-1.5',
      md: 'size-2',
    },
  },
  defaultVariants: { size: 'md' },
});

export interface PulseDotProps
  extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof pulseDotVariants> {}

/** Decorative "live" indicator: a green dot with an expanding ring. */
export function PulseDot({ size, className, ...props }: PulseDotProps) {
  return <span aria-hidden="true" className={pulseDotVariants({ size, className })} {...props} />;
}
