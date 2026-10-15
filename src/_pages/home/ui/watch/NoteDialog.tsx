import * as Dialog from 'goniui/dialog';
import { Button, Flex, Text } from 'goniui';
import type { Tint } from 'portfolio-content-model';
import { tintVariants } from '../tint';

interface NoteDialogContent {
  meta: string;
  tint: Tint;
  title: string;
  excerpt: string;
  body: readonly string[];
  takeaways: readonly string[];
}

export interface NoteDialogProps {
  /** The note to show; `null` closes the panel. */
  note: NoteDialogContent | null;
  onClose: () => void;
  copy: { takeaways: string; takeawayGlyph: string; close: string; closeLabel: string };
}

/** Side panel with the full text of a watch note. */
export function NoteDialog({ note, onClose, copy }: NoteDialogProps) {
  return (
    <Dialog.Root open={note !== null} onOpenChange={(isOpen) => !isOpen && onClose()}>
      {note ? (
        <Dialog.Content className="top-3 right-3 bottom-3 left-auto flex max-h-none max-w-130 translate-x-0 translate-y-0 flex-col overflow-hidden rounded-3xl border-border-strong bg-background p-0 shadow-dialog">
          <Flex
            justify="between"
            align="center"
            gap="md"
            className="border-border border-b px-5 py-4"
          >
            <Text
              as="span"
              variant="bodySm"
              className={tintVariants({ tint: note.tint, className: 'font-medium font-mono' })}
            >
              {note.meta}
            </Text>
            <Dialog.Close asChild>
              <Button
                variant="unstyled"
                size="none"
                className="h-11 min-w-11 flex-none rounded-xl border border-border-strong font-medium font-mono text-foreground-soft text-sm hover:text-foreground-strong"
              >
                {copy.close} <span className="sr-only">{copy.closeLabel}</span>
              </Button>
            </Dialog.Close>
          </Flex>
          <Flex direction="col" className="gap-4.5 overflow-y-auto px-6 py-7">
            <Dialog.Title className="text-balance font-extrabold text-3xl leading-tight tracking-tight">
              {note.title}
            </Dialog.Title>
            <Dialog.Description className="font-medium text-foreground text-lg leading-relaxed">
              {note.excerpt}
            </Dialog.Description>
            {note.body.map((paragraph) => (
              <Text
                key={paragraph}
                variant="bodyLg"
                className="text-pretty text-foreground-soft leading-relaxed"
              >
                {paragraph}
              </Text>
            ))}
            <Flex
              as="section"
              direction="col"
              aria-label={copy.takeaways}
              className="mt-2 gap-2.5 rounded-2xl border border-tint-indigo/20 bg-tint-indigo/10 p-5"
            >
              <Text
                as="span"
                variant="bodySm"
                className="font-medium font-mono text-accent-indigo uppercase tracking-wider"
              >
                {copy.takeaways}
              </Text>
              <Flex as="ul" direction="col" className="gap-2.5">
                {note.takeaways.map((takeaway) => (
                  <Flex as="li" key={takeaway} className="gap-2.5 text-base leading-relaxed">
                    <span aria-hidden="true" className="font-mono text-accent-cyan">
                      {copy.takeawayGlyph}
                    </span>
                    <span>{takeaway}</span>
                  </Flex>
                ))}
              </Flex>
            </Flex>
          </Flex>
        </Dialog.Content>
      ) : null}
    </Dialog.Root>
  );
}
