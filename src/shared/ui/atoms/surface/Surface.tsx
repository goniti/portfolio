import { Box, type BoxProps } from 'goniui';
import { tv, type VariantProps } from 'tailwind-variants';

export const surfaceVariants = tv({
  base: 'border transition duration-300 ease-spring',
  variants: {
    fill: {
      glass: 'border-border bg-linear-to-b from-surface to-surface-fade',
      indigo: 'border-border bg-card-indigo',
      violet: 'border-border bg-card-violet',
      contact: 'border-border-strong bg-card-contact',
      form: 'border-border bg-surface-form',
      chip: 'border-border bg-chip',
    },
    radius: {
      md: 'rounded-2xl',
      lg: 'rounded-3xl',
      xl: 'rounded-4xl',
    },
    hover: {
      none: '',
      lift: 'hover:-translate-y-0.5 hover:border-tint-indigo/40 hover:shadow-lift-indigo',
      project: 'hover:-translate-y-1 hover:border-tint-indigo/40 hover:shadow-lift-project',
      note: 'hover:-translate-y-0.5 hover:border-tint-cyan/45 hover:shadow-lift-note',
      indigo: 'hover:border-tint-indigo/45 hover:shadow-glow-indigo',
      cyan: 'hover:border-tint-cyan/40 hover:shadow-glow-cyan',
      violet: 'hover:border-tint-violet/45 hover:shadow-glow-violet',
      soft: 'hover:border-tint-indigo/40 hover:shadow-glow-soft',
    },
    blur: {
      true: 'backdrop-blur-md',
      false: '',
    },
  },
  defaultVariants: { fill: 'glass', radius: 'lg', hover: 'none', blur: false },
});

export interface SurfaceProps extends BoxProps, VariantProps<typeof surfaceVariants> {}

/**
 * Glass panel of the portfolio: translucent gradient fill, hairline border and an optional
 * hover glow. Polymorphic through goniui's `Box` (`as="article"`, `as="li"`…).
 */
export function Surface({ fill, radius, hover, blur, className, ...props }: SurfaceProps) {
  return <Box className={surfaceVariants({ fill, radius, hover, blur, className })} {...props} />;
}
