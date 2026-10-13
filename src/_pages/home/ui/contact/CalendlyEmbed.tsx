'use client';

import { useEffect, useState } from 'react';
import { preconnect } from 'react-dom';
import { Flex } from 'goniui';
import { tv } from 'tailwind-variants';
import { useNearViewport, useScrolledPastOnce } from '@/shared/lib/viewport';

const CALENDLY_ORIGINS = ['https://calendly.com', 'https://assets.calendly.com'];

const calendlyFrameVariants = tv({
  base: 'absolute inset-0 size-full rounded-3xl border border-border bg-surface-form transition-opacity duration-500 ease-out-expo motion-reduce:transition-none',
  variants: {
    loaded: {
      true: 'opacity-100',
      false: 'opacity-0',
    },
  },
});

export interface CalendlyEmbedProps {
  /** The Calendly embed URL (see `calendlyEmbedUrl`). */
  src: string;
  /** Accessible name of the frame. */
  title: string;
  /** Announced while the scheduler loads. */
  loadingLabel: string;
  /** Scroll depth (viewport heights) past which the frame starts loading. */
  loadAfterViewports: number;
}

/**
 * Calendly scheduler in a fixed-height frame. It starts loading once the page has scrolled past
 * `loadAfterViewports`, or as soon as its slot comes near the viewport (a deep link, a reload
 * mid-page), whichever comes first; it shows a skeleton of the same size meanwhile (no layout shift),
 * then fades in once loaded. A new `src` (theme switch) reloads the frame behind the skeleton.
 */
export function CalendlyEmbed({
  src,
  title,
  loadingLabel,
  loadAfterViewports,
}: CalendlyEmbedProps) {
  const { ref, isNear } = useNearViewport<HTMLDivElement>();
  const isPastThreshold = useScrolledPastOnce(loadAfterViewports);
  const shouldLoad = isNear || isPastThreshold;
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const isLoaded = loadedSrc === src;

  useEffect(() => {
    if (!shouldLoad) return;
    for (const origin of CALENDLY_ORIGINS) preconnect(origin);
  }, [shouldLoad]);

  return (
    // A plain `div`: goniui's `Box` takes no `ref`, needed to watch the frame's slot.
    <div ref={ref} className="relative h-160">
      {isLoaded ? null : (
        <Flex
          role="status"
          direction="col"
          gap="md"
          className="absolute inset-0 rounded-3xl border border-border bg-surface-form p-8 motion-safe:animate-pulse"
        >
          <span className="sr-only">{loadingLabel}</span>
          <span aria-hidden="true" className="mx-auto h-4 w-32 rounded-full bg-chip" />
          <span aria-hidden="true" className="mx-auto h-7 w-64 rounded-full bg-chip" />
          <span aria-hidden="true" className="mx-auto h-4 w-40 rounded-full bg-chip" />
          <span aria-hidden="true" className="mt-6 grow rounded-2xl bg-chip" />
        </Flex>
      )}
      {shouldLoad ? (
        <iframe
          src={src}
          title={title}
          onLoad={() => setLoadedSrc(src)}
          className={calendlyFrameVariants({ loaded: isLoaded })}
        />
      ) : null}
    </div>
  );
}
