import { useEffect, useState } from 'react';
import { activeSection, PARALLAX_MAX_SCROLL, scrollProgress } from './scrollSpy';
import { SECTION_IDS, type SectionId } from './sections';

/**
 * Tracks the scroll position: returns the section being read and writes two CSS variables on
 * `<html>` for the effect utilities (`--scroll-progress` 0 → 1, `--scroll-y` capped in px).
 */
export function useScrollSpy(): SectionId {
  const [active, setActive] = useState<SectionId>(SECTION_IDS[0]);

  useEffect(() => {
    const root = document.documentElement;
    const onScroll = () => {
      root.style.setProperty('--scroll-progress', String(scrollProgress(root)));
      root.style.setProperty('--scroll-y', String(Math.min(root.scrollTop, PARALLAX_MAX_SCROLL)));
      const tops = SECTION_IDS.map((id) => ({
        id,
        top: document.getElementById(id)?.getBoundingClientRect().top ?? null,
      }));
      const next = activeSection(tops, window.innerHeight);
      if (next) setActive(next);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return active;
}
