import { Button, type ButtonProps } from 'goniui';
import { tv, type VariantProps } from 'tailwind-variants';

export const ctaButtonVariants = tv({
  base: 'gap-2.5 font-semibold whitespace-nowrap duration-300 ease-spring',
  variants: {
    tone: {
      gradient:
        'bg-linear-135 from-tint-indigo-strong via-tint-indigo-deep via-60% to-tint-cyan-deep text-primary-foreground shadow-cta hover:text-primary-foreground hover:shadow-cta-hover',
      outline:
        'border border-border-strong bg-chip text-foreground hover:border-tint-indigo/50 hover:text-foreground-strong',
      quiet: 'border border-border-strong text-foreground-soft hover:text-foreground-strong',
      soft: 'border border-tint-indigo/30 bg-tint-indigo/15 text-accent-indigo hover:bg-tint-indigo/25 hover:text-foreground-strong',
      inverse:
        'bg-surface-inverse text-foreground-inverse hover:text-foreground-inverse hover:shadow-halo',
    },
    size: {
      lg: 'h-13 rounded-2xl px-6.5 text-base',
      md: 'h-11 rounded-xl px-4 text-sm',
      pill: 'h-9 rounded-full px-4 text-sm',
    },
    block: {
      true: 'w-full',
      false: '',
    },
  },
  defaultVariants: { tone: 'gradient', size: 'lg', block: false },
});

export interface CtaButtonProps
  extends Omit<ButtonProps, 'variant' | 'size'>, VariantProps<typeof ctaButtonVariants> {}

/**
 * The portfolio's call-to-action look on top of goniui's `Button` (gradient, outline, inverse…).
 * Use `asChild` to render a link.
 */
export function CtaButton({ tone, size, block, className, ...props }: CtaButtonProps) {
  return (
    <Button
      variant="unstyled"
      size="none"
      className={ctaButtonVariants({ tone, size, block, className })}
      {...props}
    />
  );
}
