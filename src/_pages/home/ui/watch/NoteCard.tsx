import { Button, Flex, Text } from 'goniui';
import { surfaceVariants } from '@/shared/ui/atoms';
import type { Tint } from '../../model/tints';
import { tintVariants } from '../tint';

export interface NoteCardProps {
  category: string;
  tint: Tint;
  meta: string;
  title: string;
  excerpt: string;
  cta: string;
  onOpen: () => void;
}

/** Teaser of a watch note; opens the full note. */
export function NoteCard({ category, tint, meta, title, excerpt, cta, onOpen }: NoteCardProps) {
  return (
    <Button
      variant="unstyled"
      size="none"
      onClick={onOpen}
      className={surfaceVariants({
        radius: 'md',
        hover: 'note',
        className:
          'h-full w-full flex-col items-start justify-start gap-3.5 p-6 text-left text-foreground',
      })}
    >
      <Flex justify="between" align="center" gap="sm" className="w-full">
        <Text
          as="span"
          variant="bodySm"
          className={tintVariants({ tint, className: 'font-mono font-medium' })}
        >
          {category}
        </Text>
        <Text as="span" variant="bodySm" className="font-mono text-foreground-subtle">
          {meta}
        </Text>
      </Flex>
      <Text
        as="span"
        variant="h2"
        className="text-lg leading-snug font-bold tracking-tight text-balance"
      >
        {title}
      </Text>
      <Text as="span" variant="body" tone="muted" className="leading-relaxed">
        {excerpt}
      </Text>
      <Text as="span" variant="label" className="mt-auto font-semibold text-accent-indigo">
        {cta}
      </Text>
    </Button>
  );
}
