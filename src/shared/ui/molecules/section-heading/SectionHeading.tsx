import type { HTMLAttributes, ReactNode } from 'react';
import { Flex, Text } from 'goniui';

export interface SectionHeadingProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Numbered mono label above the title ("01 — Experience"). */
  eyebrow: ReactNode;
  title: ReactNode;
  /** `id` of the `<h2>`, for `aria-labelledby` on the section. */
  titleId?: string;
  /** Rendered next to the eyebrow (a status pill…). */
  badge?: ReactNode;
}

/** Eyebrow + `<h2>` opening every section of a long page. */
export function SectionHeading({ eyebrow, title, titleId, badge, ...props }: SectionHeadingProps) {
  return (
    <Flex direction="col" gap="md" {...props}>
      <Flex align="center" wrap="wrap" gap="md">
        <Text
          as="span"
          variant="bodySm"
          className="font-medium font-mono text-accent-cyan uppercase tracking-widest"
        >
          {eyebrow}
        </Text>
        {badge}
      </Flex>
      <Text
        as="h2"
        variant="display"
        id={titleId}
        className="max-w-3xl text-balance font-bold text-3xl leading-heading tracking-tighter md:text-4xl lg:text-5xl"
      >
        {title}
      </Text>
    </Flex>
  );
}
