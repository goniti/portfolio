import { act, render, renderHook, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { useLocale, useLocalized, useMessages } from './useLocale';

const greetings = { en: { hello: 'Hello' }, fr: { hello: 'Bonjour' } };

function Greeting() {
  const copy = useMessages(greetings);
  return <p>{copy.hello}</p>;
}

describe('useLocale', () => {
  afterEach(() => window.localStorage.clear());

  it('renders English by default', () => {
    render(<Greeting />);
    expect(screen.getByText('Hello')).toBeTruthy();
  });

  it('restores the stored locale and sets the document language', () => {
    window.localStorage.setItem('pf-lang', 'fr');
    render(<Greeting />);
    expect(screen.getByText('Bonjour')).toBeTruthy();
    expect(document.documentElement.lang).toBe('fr');
  });

  it('switches and persists the locale for every component', () => {
    render(<Greeting />);
    const { result } = renderHook(() => useLocale());
    act(() => result.current.setLocale('fr'));
    expect(result.current.locale).toBe('fr');
    expect(window.localStorage.getItem('pf-lang')).toBe('fr');
    expect(screen.getByText('Bonjour')).toBeTruthy();
  });

  it('follows a change made in another tab', () => {
    const { result } = renderHook(() => useLocale());
    act(() => {
      window.localStorage.setItem('pf-lang', 'fr');
      window.dispatchEvent(new StorageEvent('storage', { key: 'pf-lang', newValue: 'fr' }));
    });
    expect(result.current.locale).toBe('fr');
  });
});

describe('useLocalized', () => {
  afterEach(() => window.localStorage.clear());

  const title = { en: 'Projects', fr: 'Projets' };

  it('picks the value of the current locale', () => {
    const { result } = renderHook(() => useLocalized());
    expect(result.current(title)).toBe('Projects');
  });

  it('follows a locale switch', () => {
    const { result } = renderHook(() => ({ localize: useLocalized(), state: useLocale() }));
    act(() => result.current.state.setLocale('fr'));
    expect(result.current.localize(title)).toBe('Projets');
  });

  it('keeps the same function while the locale does not change', () => {
    const { result, rerender } = renderHook(() => useLocalized());
    const first = result.current;
    rerender();
    expect(result.current).toBe(first);
  });
});
