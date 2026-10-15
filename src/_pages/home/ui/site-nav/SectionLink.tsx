import { Link, type LinkProps } from 'goniui';
import { tv, type VariantProps } from 'tailwind-variants';

const sectionLinkVariants = tv({
  base: 'transition-colors duration-200',
  variants: {
    layout: {
      bar: 'flex-none whitespace-nowrap rounded-full px-3.5 py-2 font-medium text-sm',
      menu: 'flex min-h-12 items-center justify-between rounded-xl px-3.5 font-semibold text-base',
    },
    active: {
      true: 'bg-tint-indigo/20 text-foreground-strong',
      false: 'text-foreground-muted hover:text-foreground-strong',
    },
  },
  defaultVariants: { layout: 'bar', active: false },
});

export interface SectionLinkProps
  extends Omit<LinkProps, 'kind' | 'variant' | 'size'>,
    VariantProps<typeof sectionLinkVariants> {}

/** In-page link to a section; marked as the current location while that section is read. */
export function SectionLink({ layout, active, className, ...props }: SectionLinkProps) {
  return (
    <Link
      kind="internal"
      variant="unstyled"
      aria-current={active ? 'location' : undefined}
      className={sectionLinkVariants({ layout, active, className })}
      {...props}
    />
  );
}
