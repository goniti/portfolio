'use client';

import { useState } from 'react';
import { Button, Flex, Text } from 'goniui';
import { useLocalized, useMessages } from '@/shared/lib/i18n';
import { PulseDot } from '@/shared/ui/atoms';
import type { SiteSettings } from '../../model/content';
import { siteFooterMessages } from './messages';

export type SiteFooterProps = Pick<SiteSettings, 'openToWork' | 'status' | 'credits'>;

/** Availability status and a rotating credit line. */
export function SiteFooter({ openToWork, status, credits }: SiteFooterProps) {
  const localize = useLocalized();
  const copy = useMessages(siteFooterMessages);
  const [creditIndex, setCreditIndex] = useState(0);
  const credit = credits[creditIndex % credits.length];

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
        {openToWork ? <PulseDot size="sm" /> : null}
        {openToWork ? localize(status.open) : localize(status.busy)}
      </Text>
      <Button
        variant="unstyled"
        size="none"
        title={copy.nextCredit}
        onClick={() => setCreditIndex((current) => (current + 1) % credits.length)}
        className="min-h-9 font-mono text-xs text-foreground-subtle hover:text-accent-indigo"
      >
        {credit ? localize(credit) : null}
      </Button>
    </Flex>
  );
}
