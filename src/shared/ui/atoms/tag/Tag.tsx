import { Badge, type BadgeProps } from 'goniui';
import { tv, type VariantProps } from 'tailwind-variants';

export const tagVariants = tv({
  base: 'border border-border-strong font-medium font-mono text-foreground-soft',
  variants: {
    size: {
      sm: 'px-2 py-1 text-xs',
      md: 'px-3 py-1.5 text-xs',
    },
    filled: {
      true: 'bg-chip',
      false: 'bg-transparent',
    },
  },
  defaultVariants: { size: 'sm', filled: true },
});

export interface TagProps
  extends Omit<BadgeProps, 'variant' | 'onRemove' | 'removeLabel'>,
    VariantProps<typeof tagVariants> {}

/** Monospace pill naming a technology or a topic, on top of goniui's `Badge`. */
export function Tag({ size, filled, className, ...props }: TagProps) {
  return (
    <Badge variant="outline" className={tagVariants({ size, filled, className })} {...props} />
  );
}
