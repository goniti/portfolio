'use client';

import { useEffect } from 'react';
import { watchInPageLinkJumps } from './scrollJump';

/**
 * Treats every in-page link click (`href="#…"`: the navigation, the hero's calls to action) as a
 * programmatic scroll jump, so scroll-driven effects hold still on the way. Call it once per page.
 */
export function useInPageLinkJumps(): void {
  useEffect(() => watchInPageLinkJumps(), []);
}
