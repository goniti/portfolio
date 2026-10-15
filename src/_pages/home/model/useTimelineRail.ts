'use client';

import { type RefObject, useLayoutEffect, useRef } from 'react';
import { type MotionValue, useMotionValue, useTransform } from 'motion/react';
import { scrollStepAt, useMotionCssVariable } from '@/shared/lib/motion';
import { railFillRatio, railSpan } from './timelineRail';

/** Spread on each card of the timeline: its dot reads the `--dot-y` written on it. */
export const RAIL_ITEM = { 'data-rail-item': true } as const;
/** Spread on the element of a card its dot and the rail line up with (the heading). */
export const RAIL_ANCHOR = { 'data-rail-anchor': true } as const;
const RAIL_ITEM_SELECTOR = '[data-rail-item]';
const RAIL_ANCHOR_SELECTOR = '[data-rail-anchor]';

export interface UseTimelineRailOptions {
  /** Scroll progress through the timeline track (0 → 1). */
  progress: MotionValue<number>;
  itemCount: number;
  openCount: number;
}

/** Offset of an element's top inside a positioned ancestor, ignoring transforms (scroll reveal). */
function offsetTopWithin(element: HTMLElement, ancestor: HTMLElement): number {
  let top = 0;
  let current: HTMLElement | null = element;
  while (current && current !== ancestor) {
    top += current.offsetTop;
    current = current.offsetParent instanceof HTMLElement ? current.offsetParent : null;
  }
  return top;
}

/**
 * Centre of each card heading inside the panel (px), and `--dot-y` on each card: the same centre
 * inside the card, where its dot sits.
 */
function measureHeadingCentres(panel: HTMLElement): number[] {
  const centres: number[] = [];
  for (const item of panel.querySelectorAll<HTMLElement>(RAIL_ITEM_SELECTOR)) {
    const anchor = item.querySelector<HTMLElement>(RAIL_ANCHOR_SELECTOR);
    if (!anchor) continue;
    const centreInItem = offsetTopWithin(anchor, item) + anchor.offsetHeight / 2;
    item.style.setProperty('--dot-y', `${centreInItem}px`);
    centres.push(offsetTopWithin(item, panel) + centreInItem);
  }
  return centres;
}

/**
 * Lays the timeline rail along the card headings and fills it with the scroll, outside React:
 * a `ResizeObserver` measures the headings when the layout changes (never every frame) and
 * writes `--rail-start`, `--rail-length` and each `--dot-y`; the fill (`--rail-fill`, 0 → 1)
 * follows the scroll progress as a MotionValue.
 */
export function useTimelineRail<Panel extends HTMLElement>({
  progress,
  itemCount,
  openCount,
}: UseTimelineRailOptions): RefObject<Panel | null> {
  const panelRef = useRef<Panel>(null);
  const headingCentres = useMotionValue<readonly number[]>([]);
  const fill = useTransform(() =>
    railFillRatio(
      headingCentres.get(),
      scrollStepAt(progress.get(), itemCount, openCount),
      openCount,
    ),
  );
  useMotionCssVariable(panelRef, '--rail-fill', fill);

  // `itemCount`: a new list of cards needs measuring and observing.
  useLayoutEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const measure = () => {
      const centres = measureHeadingCentres(panel);
      const { start, length } = railSpan(centres);
      panel.style.setProperty('--rail-start', `${start}px`);
      panel.style.setProperty('--rail-length', `${length}px`);
      headingCentres.set(centres);
    };
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(measure);
    observer.observe(panel);
    for (const item of panel.querySelectorAll(RAIL_ITEM_SELECTOR)) observer.observe(item);
    return () => observer.disconnect();
  }, [headingCentres, itemCount]);

  return panelRef;
}
