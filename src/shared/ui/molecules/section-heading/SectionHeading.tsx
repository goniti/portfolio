import type { ReactNode } from 'react';
import { Flex, Text } from 'goniui';

export interface SectionHeadingProps {
  /** Numbered mono label above the title ("01 — Experience"). */
  eyebrow: ReactNode;
  title: ReactNode;
  /** `id` of the `<h2>`, for `aria-labelledby` on the section. */
  titleId?: string;
  /** Rendered next to the eyebrow (a status pill…). */
  badge?: ReactNode;
  className?: string;
}

/** Eyebrow + `<h2>` opening every section of a long page. */
export function SectionHeading({ eyebrow, title, titleId, badge, className }: SectionHeadingProps) {
  return (
    <Flex direction="col" gap="md" className={className}>
      <Flex align="center" wrap="wrap" gap="md">
        <Text
          as="span"
          variant="bodySm"
          className="font-mono font-medium tracking-widest text-accent-cyan uppercase"
        >
          {eyebrow}
        </Text>
        {badge}
      </Flex>
      <Text
        as="h2"
        variant="display"
        id={titleId}
        className="max-w-3xl text-3xl leading-heading font-bold tracking-tighter text-balance md:text-4xl lg:text-5xl"
      >
        {title}
      </Text>
    </Flex>
  );
}
