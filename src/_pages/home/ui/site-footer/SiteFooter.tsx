'use client';

import { useState } from 'react';
import { Button, Flex, Text } from 'goniui';
import { useMessages } from '@/shared/lib/i18n';
import { PulseDot } from '@/shared/ui/atoms';
import { OPEN_TO_WORK } from '../../config/site';
import { siteFooterMessages } from './messages';

/** Availability status and a rotating credit line. */
export function SiteFooter() {
  const copy = useMessages(siteFooterMessages);
  const [creditIndex, setCreditIndex] = useState(0);

  return (
    <Flex
      as="footer"
      justify="between"
      align="center"
      wrap="wrap"
      gap="lg"
      className="mx-auto max-w-300 border-t border-border px-5 pt-7 pb-12"
    >
      <Text
        as="span"
        variant="label"
        className="inline-flex items-center gap-2.5 text-foreground-soft"
      >
        {OPEN_TO_WORK ? <PulseDot size="sm" /> : null}
        {OPEN_TO_WORK ? copy.status.open : copy.status.busy}
      </Text>
      <Button
        variant="unstyled"
        size="none"
        title={copy.nextCredit}
        onClick={() => setCreditIndex((current) => (current + 1) % copy.credits.length)}
        className="min-h-9 font-mono text-xs text-foreground-subtle hover:text-accent-indigo"
      >
        {copy.credits[creditIndex % copy.credits.length]}
      </Button>
    </Flex>
  );
}
