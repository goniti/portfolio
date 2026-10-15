'use client';

import type { MouseEvent } from 'react';
import { Button, type ButtonProps } from 'goniui';
import { tv, type VariantProps } from 'tailwind-variants';
import { useMagnet } from '../../../lib/motion';
import { MAGNET_CURSOR_TARGET } from '../cursor-follower';

export const ctaButtonVariants = tv({
  base: 'gap-2.5 whitespace-nowrap font-semibold duration-300 ease-spring',
  variants: {
    tone: {
      gradient:
        'bg-linear-135 from-tint-indigo-strong via-60% via-tint-indigo-deep to-tint-cyan-deep text-primary-foreground shadow-cta hover:text-primary-foreground hover:shadow-cta-hover',
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
    magnetic: {
      true: 'magnet-offset',
      false: '',
    },
  },
  defaultVariants: { tone: 'gradient', size: 'lg', block: false, magnetic: false },
});

export interface CtaButtonProps
  extends Omit<ButtonProps, 'variant' | 'size'>,
    VariantProps<typeof ctaButtonVariants> {}

/** The primary (gradient) call to action is magnetic unless told otherwise. */
function isMagneticByDefault(tone: CtaButtonProps['tone']): boolean {
  return (tone ?? 'gradient') === 'gradient';
}

/**
 * The portfolio's call-to-action look on top of goniui's `Button` (gradient, outline, inverse…).
 * A magnetic button leans towards the mouse and is wrapped by the cursor follower, whatever its
 * width; the primary `gradient` tone is magnetic by default. Use `asChild` to render a link.
 */
export function CtaButton({
  tone,
  size,
  block,
  magnetic,
  className,
  onMouseMove,
  onMouseLeave,
  ...props
}: CtaButtonProps) {
  const isMagnetic = magnetic ?? isMagneticByDefault(tone);
  const magnet = useMagnet<HTMLButtonElement>({ enabled: isMagnetic });

  const handleMouseMove = (event: MouseEvent<HTMLButtonElement>) => {
    onMouseMove?.(event);
    magnet.onMouseMove(event);
  };
  const handleMouseLeave = (event: MouseEvent<HTMLButtonElement>) => {
    onMouseLeave?.(event);
    magnet.onMouseLeave(event);
  };

  return (
    <Button
      variant="unstyled"
      size="none"
      className={ctaButtonVariants({ tone, size, block, magnetic: isMagnetic, className })}
      onMouseMove={isMagnetic ? handleMouseMove : onMouseMove}
      onMouseLeave={isMagnetic ? handleMouseLeave : onMouseLeave}
      {...(isMagnetic ? MAGNET_CURSOR_TARGET : {})}
      {...props}
    />
  );
}
