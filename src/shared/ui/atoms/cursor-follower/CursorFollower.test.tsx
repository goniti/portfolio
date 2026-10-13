import { act, fireEvent, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CursorFollower } from './CursorFollower';

function mockMedia(matchingQueries: string[]) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => ({
      matches: matchingQueries.includes(query),
      addEventListener: () => {},
      removeEventListener: () => {},
    })),
  );
}

describe('CursorFollower', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('renders nothing on a touch screen', () => {
    mockMedia([]);
    const { container } = render(<CursorFollower />);
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when motion is reduced', () => {
    mockMedia(['(pointer: fine)', '(prefers-reduced-motion: reduce)']);
    const { container } = render(<CursorFollower />);
    expect(container.firstChild).toBeNull();
  });

  it('follows the mouse and cleans up on unmount', () => {
    mockMedia(['(pointer: fine)']);
    const requestFrame = vi.spyOn(window, 'requestAnimationFrame').mockImplementation(() => 7);
    const cancelFrame = vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});
    const removeListener = vi.spyOn(window, 'removeEventListener');

    const { container, unmount } = render(<CursorFollower />);
    const follower = container.firstElementChild;
    expect(follower?.getAttribute('aria-hidden')).toBe('true');
    expect(follower?.className).toContain('opacity-0');
    expect(requestFrame).toHaveBeenCalled();

    act(() => {
      fireEvent.mouseMove(window, { clientX: 40, clientY: 50 });
    });
    expect(follower?.className).toContain('opacity-100');

    unmount();
    expect(cancelFrame).toHaveBeenCalledWith(7);
    expect(removeListener).toHaveBeenCalledWith('mousemove', expect.any(Function));
  });
});
