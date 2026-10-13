import type { ReactNode } from 'react';
import { Flex } from 'goniui';
import { tv, type VariantProps } from 'tailwind-variants';

export const pageSectionVariants = tv({
  base: 'relative mx-auto max-w-300 scroll-mt-15 px-5',
  variants: {
    spacing: {
      default: 'gap-9 py-16 md:gap-11 md:py-24',
      closing: 'gap-9 pt-16 pb-15 md:pt-24',
    },
  },
  defaultVariants: { spacing: 'default' },
});

export interface PageSectionProps extends VariantProps<typeof pageSectionVariants> {
  /** Anchor of the section (in-page navigation). */
  id: string;
  /** `id` of the heading naming the section. */
  labelledBy: string;
  children: ReactNode;
  className?: string;
}

/** Centred, anchor-able band of a long page; its children stack with the section rhythm. */
export function PageSection({ id, labelledBy, spacing, children, className }: PageSectionProps) {
  return (
    <Flex
      as="section"
      direction="col"
      id={id}
      aria-labelledby={labelledBy}
      className={pageSectionVariants({ spacing, className })}
    >
      {children}
    </Flex>
  );
}
