'use client';

import { BackToTop } from 'goniui';
import { useMessages } from '@/shared/lib/i18n';
import { startScrollJump } from '@/shared/lib/motion';
import { PAST_HERO_VIEWPORTS } from '../../config/site';
import { backToTopMessages } from './messages';

/**
 * Round floating button, bottom right, shown once past the hero (`PAST_HERO_VIEWPORTS`),
 * taking the visitor back to the top: smooth scroll,
 * instant with reduced motion (goniui's `BackToTop`), glass look of the site navigation.
 */
export function BackToTopButton() {
  const copy = useMessages(backToTopMessages);

  // goniui's `BackToTop` takes no click handler: the `contents` span (no box) catches its click
  // to mark the scroll to the top as a jump, so the Work timeline does not replay on the way.
  return (
    <span className="contents" onClickCapture={startScrollJump}>
      <BackToTop
        label={copy.label}
        thresholdViewports={PAST_HERO_VIEWPORTS}
        className="right-5 bottom-5 border-border-strong bg-surface-glass shadow-nav backdrop-blur-xl hover:border-tint-indigo/50 motion-safe:animate-rise-in md:right-8 md:bottom-8"
      />
    </span>
  );
}
