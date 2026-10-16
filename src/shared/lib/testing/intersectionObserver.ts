import { vi } from 'vitest';

/** The margin a real observer reports when none is given. */
const DEFAULT_ROOT_MARGIN = '0px';

export interface FakeIntersectionObserver extends IntersectionObserver {
  /** Elements the observer currently watches. */
  readonly observed: ReadonlySet<Element>;
  /** How many times `disconnect` was called. */
  readonly disconnections: number;
  /** Disconnected and not observing anything since. */
  readonly isDisconnected: boolean;
  /** Reports the given elements (by default every observed one) entering or leaving. */
  fire: (isIntersecting: boolean, targets?: readonly Element[]) => void;
}

export interface IntersectionObserverStub {
  /** The latest live observer created with this `rootMargin` (any margin when omitted). */
  find: (rootMargin?: string) => FakeIntersectionObserver;
  /** The live observers watching this element. */
  watching: (element: Element) => FakeIntersectionObserver[];
  /** Reports the element entering the viewport to every live observer watching it. */
  enter: (element: Element) => void;
}

function entryFor(target: Element, isIntersecting: boolean): IntersectionObserverEntry {
  const box = target.getBoundingClientRect();
  return {
    target,
    isIntersecting,
    intersectionRatio: isIntersecting ? 1 : 0,
    boundingClientRect: box,
    intersectionRect: isIntersecting ? box : new DOMRect(),
    rootBounds: null,
    time: performance.now(),
  };
}

/**
 * Stubs `IntersectionObserver` (missing in jsdom) with doubles that record their `rootMargin`
 * and what they observe, and let the test fire entries per observer. Undo with
 * `vi.unstubAllGlobals()`.
 */
export function stubIntersectionObserver(): IntersectionObserverStub {
  const observers: FakeIntersectionObserver[] = [];
  const isLive = (observer: FakeIntersectionObserver) => !observer.isDisconnected;

  class StubbedIntersectionObserver implements FakeIntersectionObserver {
    readonly root: Element | Document | null;
    readonly rootMargin: string;
    readonly scrollMargin: string;
    readonly thresholds: readonly number[];
    readonly observed = new Set<Element>();
    disconnections = 0;
    isDisconnected = false;
    readonly #callback: IntersectionObserverCallback;

    constructor(callback: IntersectionObserverCallback, options: IntersectionObserverInit = {}) {
      this.#callback = callback;
      this.root = options.root ?? null;
      this.rootMargin = options.rootMargin ?? DEFAULT_ROOT_MARGIN;
      this.scrollMargin = options.scrollMargin ?? DEFAULT_ROOT_MARGIN;
      this.thresholds = [options.threshold ?? 0].flat();
      observers.push(this);
    }

    observe(target: Element) {
      this.isDisconnected = false;
      this.observed.add(target);
    }

    unobserve(target: Element) {
      this.observed.delete(target);
    }

    disconnect() {
      this.observed.clear();
      this.disconnections += 1;
      this.isDisconnected = true;
    }

    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }

    fire(isIntersecting: boolean, targets: readonly Element[] = [...this.observed]) {
      this.#callback(
        targets.map((target) => entryFor(target, isIntersecting)),
        this,
      );
    }
  }

  vi.stubGlobal('IntersectionObserver', StubbedIntersectionObserver);

  const watching = (element: Element) =>
    observers.filter((observer) => isLive(observer) && observer.observed.has(element));

  return {
    find(rootMargin) {
      const found = observers.findLast(
        (observer) =>
          isLive(observer) && (rootMargin === undefined || observer.rootMargin === rootMargin),
      );
      if (!found) throw new Error(`No live IntersectionObserver with rootMargin ${rootMargin}`);
      return found;
    },
    watching,
    enter(element) {
      for (const observer of watching(element)) observer.fire(true, [element]);
    },
  };
}
