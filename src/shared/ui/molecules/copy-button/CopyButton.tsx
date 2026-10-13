'use client';

import { useState } from 'react';
import * as Tooltip from 'goniui/tooltip';
import { Button, Icon } from 'goniui';
import { Check, Copy, X } from 'lucide-react';
import { tv } from 'tailwind-variants';
import { useCopyToClipboard, type CopyStatus } from '../../../lib/clipboard';
import { OWN_CURSOR_TARGET } from '../../atoms';

export const copyButtonVariants = tv({
  base: 'relative size-11 flex-none rounded-lg p-0 md:size-9',
  variants: {
    status: {
      idle: '',
      copied: 'text-success hover:text-success',
      failed: 'text-error hover:text-error',
    },
  },
  defaultVariants: { status: 'idle' },
});

const STATUS_ICON = { idle: Copy, copied: Check, failed: X } as const;

export interface CopyButtonProps {
  /** The text written to the clipboard. */
  value: string;
  /** Accessible name and tooltip before the click ("Copy email"). */
  label: string;
  /** Tooltip and announcement once copied ("Copied!"). */
  copiedLabel: string;
  /** Tooltip and announcement when the clipboard refused ("Copy failed"). */
  failedLabel: string;
  className?: string;
}

/**
 * Icon button copying `value` in one click. Its tooltip names the action, then confirms the
 * copy (or the failure) for a couple of seconds; screen readers hear the outcome through a
 * polite live region. The cursor follower outlines the button itself, even inside a card.
 */
export function CopyButton({ value, label, copiedLabel, failedLabel, className }: CopyButtonProps) {
  const { status, copy } = useCopyToClipboard();
  const [isHintOpen, setHintOpen] = useState(false);
  const feedback: Record<CopyStatus, string> = {
    idle: label,
    copied: copiedLabel,
    failed: failedLabel,
  };

  return (
    <Tooltip.Provider>
      <Tooltip.Root open={isHintOpen || status !== 'idle'} onOpenChange={setHintOpen}>
        <Tooltip.Trigger asChild>
          <Button
            variant="ghost"
            size="none"
            aria-label={label}
            onClick={() => copy(value)}
            {...OWN_CURSOR_TARGET}
            className={copyButtonVariants({ status, className })}
          >
            <Icon icon={STATUS_ICON[status]} size="sm" />
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content>{feedback[status]}</Tooltip.Content>
      </Tooltip.Root>
      <span role="status" className="sr-only">
        {status === 'idle' ? '' : feedback[status]}
      </span>
    </Tooltip.Provider>
  );
}
